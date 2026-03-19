'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { Experience, Locale, PaymentMethod, PaymentSettings } from '@/types';
import { cn, formatCurrency, getLocalizedText } from '@/lib/utils';
import { getEnabledPaymentMethods, getPaymentMethodDescription, getPaymentMethodLabel } from '@/lib/payment-settings';
import { AvailabilityDatePicker } from '@/components/forms/availability-date-picker';

type EstimateResponse = {
  total: number;
  nights: number;
  breakdown: Array<{ slug: string; name: string; price: number; type: string }>;
  currency: 'EUR';
};

type AvailabilityResponse = {
  available: boolean;
  reason?: string | null;
  records?: Array<{ date: string; status: string; display_status?: string; effective_remaining_capacity?: number | null }>;
};

const sessionStorageKey = 'ecl_session_token';

function statusTone(active: boolean) {
  return active
    ? 'border-stone-950 bg-stone-950 text-white shadow-[0_22px_50px_-30px_rgba(37,29,18,0.55)] dark:border-amber-300 dark:bg-amber-300 dark:text-stone-950'
    : 'border-stone-200 bg-white text-stone-900 hover:border-amber-300 hover:bg-amber-50/70 dark:border-white/10 dark:bg-stone-950/80 dark:text-white dark:hover:border-amber-300/60 dark:hover:bg-stone-900';
}

export function BookingForm({
  locale,
  experiences,
  paymentSettings,
  defaultExperienceSlug,
}: {
  locale: Locale;
  experiences: Experience[];
  paymentSettings: PaymentSettings;
  defaultExperienceSlug?: string;
}) {
  const successRef = useRef<HTMLDivElement | null>(null);
  const defaultPaymentMethod = getEnabledPaymentMethods(paymentSettings)[0]?.key ?? 'confirm_first';
  const [submitting, setSubmitting] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ reference: string; total: number } | null>(null);
  const [additionalServiceSlugs, setAdditionalServiceSlugs] = useState<string[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [form, setForm] = useState({
    experience_slug: defaultExperienceSlug ?? experiences[0]?.slug ?? '',
    check_in_date: '',
    check_out_date: '',
    preferred_date: '',
    adults: 2,
    children: 0,
    full_name: '',
    email: '',
    phone: '',
    whatsapp: '',
    country: '',
    preferred_language: locale,
    preferred_contact_method: 'email' as 'email' | 'whatsapp' | 'phone',
    payment_method: defaultPaymentMethod as PaymentMethod,
    special_requests: '',
    private_option: false,
  });

  const guestCount = form.adults + form.children;

  const bookingPrimaryExperiences = useMemo(() => {
    const curated = experiences
      .filter((item) => item.showOnBookingPrimary)
      .sort((a, b) => (a.shortListRank ?? 999) - (b.shortListRank ?? 999) || a.sortOrder - b.sortOrder);
    return curated.length ? curated : experiences;
  }, [experiences]);

  const primaryExperience = useMemo(
    () => bookingPrimaryExperiences.find((item) => item.slug === form.experience_slug) ?? bookingPrimaryExperiences[0] ?? experiences[0],
    [bookingPrimaryExperiences, experiences, form.experience_slug]
  );

  const additionalServices = useMemo(
    () => experiences
      .filter((item) => item.slug !== primaryExperience?.slug && item.showOnBookingExtras)
      .sort((a, b) => (a.shortListRank ?? 999) - (b.shortListRank ?? 999) || a.sortOrder - b.sortOrder),
    [experiences, primaryExperience?.slug]
  );

  const availablePaymentMethods = useMemo(() => getEnabledPaymentMethods(paymentSettings), [paymentSettings]);
  const selectedPaymentConfig = useMemo(
    () => availablePaymentMethods.find((method) => method.key === form.payment_method) ?? availablePaymentMethods[0],
    [availablePaymentMethods, form.payment_method]
  );

  const addOns = primaryExperience?.addOns ?? [];
  const isCamp = primaryExperience?.category === 'camp';
  const isCustom = primaryExperience?.slug === 'custom-luxury-desert-tour';


  useEffect(() => {
    if (!bookingPrimaryExperiences.length) return;
    if (!bookingPrimaryExperiences.some((item) => item.slug === form.experience_slug)) {
      setForm((current) => ({ ...current, experience_slug: bookingPrimaryExperiences[0].slug }));
    }
  }, [bookingPrimaryExperiences, form.experience_slug]);

  useEffect(() => {
    if (!availablePaymentMethods.length) return;
    if (!availablePaymentMethods.some((item) => item.key === form.payment_method)) {
      setForm((current) => ({ ...current, payment_method: availablePaymentMethods[0].key }));
    }
  }, [availablePaymentMethods, form.payment_method]);

  useEffect(() => {
    setSelectedAddOns((current) => current.filter((item) => addOns.some((addOn) => addOn.key === item)));
  }, [addOns]);

  useEffect(() => {
    if (!primaryExperience) return;
    setForm((current) => ({
      ...current,
      private_option: primaryExperience.privateSurcharge > 0 ? current.private_option : false,
    }));
  }, [primaryExperience]);

  useEffect(() => {
    const canEstimate =
      Boolean(primaryExperience?.slug) &&
      (isCamp ? Boolean(form.check_in_date && form.check_out_date) : Boolean(form.preferred_date || isCustom));
    if (!canEstimate || !primaryExperience) {
      setEstimate(null);
      setAvailability(null);
      return;
    }

    const selectedServices = [
      {
        slug: primaryExperience.slug,
        name: getLocalizedText(primaryExperience.content.title, locale),
        price: primaryExperience.startingPrice,
        type: 'primary',
      },
      ...additionalServiceSlugs
        .map((slug) => experiences.find((item) => item.slug === slug))
        .filter((value): value is Experience => Boolean(value))
        .map((experience) => ({
          slug: experience.slug,
          name: getLocalizedText(experience.content.title, locale),
          price: experience.startingPrice,
          type: 'service',
        })),
    ];

    const add_on_items = selectedAddOns.map((key) => {
      const addOn = addOns.find((entry) => entry.key === key)!;
      return {
        slug: addOn.key,
        name: getLocalizedText(addOn.label, locale),
        price: addOn.price,
        quantity: addOn.perGuest ? guestCount : 1,
        type: 'addon',
      };
    });

    const payload = {
      experience_slug: primaryExperience.slug,
      check_in_date: form.check_in_date,
      check_out_date: form.check_out_date,
      preferred_date: form.preferred_date,
      adults: form.adults,
      children: form.children,
      private_option: form.private_option,
      selected_services: selectedServices,
      add_ons: add_on_items,
    };

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setEstimating(true);
      Promise.all([
        fetch('/api/pricing/estimate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        }).then((response) => response.json()),
        fetch(
          `/api/availability?experience=${encodeURIComponent(primaryExperience.slug)}&start_date=${encodeURIComponent(
            isCamp ? form.check_in_date : form.preferred_date
          )}&end_date=${encodeURIComponent(form.check_out_date)}&guest_count=${guestCount}`,
          { signal: controller.signal }
        ).then((response) => response.json()),
      ])
        .then(([estimateData, availabilityData]) => {
          if (!controller.signal.aborted) {
            setEstimate(estimateData);
            setAvailability(availabilityData);
            setErrorMessage(null);
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setAvailability(null);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setEstimating(false);
        });
    }, 350);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [
    addOns,
    additionalServiceSlugs,
    experiences,
    form.adults,
    form.check_in_date,
    form.check_out_date,
    form.children,
    form.preferred_date,
    form.private_option,
    guestCount,
    isCamp,
    isCustom,
    locale,
    primaryExperience,
    selectedAddOns,
  ]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!primaryExperience) return;
    setSubmitting(true);
    setErrorMessage(null);
    setSuccess(null);

    const currentEstimate = estimate;
    const url = new URL(window.location.href);
    const sessionToken = window.localStorage.getItem(sessionStorageKey) ?? undefined;
    const selectedServices = [
      {
        slug: primaryExperience.slug,
        name: getLocalizedText(primaryExperience.content.title, locale),
        price: primaryExperience.startingPrice,
        type: 'primary',
      },
      ...additionalServiceSlugs
        .map((slug) => experiences.find((item) => item.slug === slug))
        .filter((value): value is Experience => Boolean(value))
        .map((experience) => ({
          slug: experience.slug,
          name: getLocalizedText(experience.content.title, locale),
          price: experience.startingPrice,
          type: 'service',
        })),
    ];
    const add_on_items = selectedAddOns.map((key) => {
      const addOn = addOns.find((entry) => entry.key === key)!;
      return {
        slug: addOn.key,
        name: getLocalizedText(addOn.label, locale),
        price: addOn.price,
        quantity: addOn.perGuest ? guestCount : 1,
        type: 'addon',
      };
    });

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          whatsapp: form.whatsapp,
          country: form.country,
          preferred_language: form.preferred_language,
          preferred_contact_method: form.preferred_contact_method,
          experience_slug: primaryExperience.slug,
          experience_name: getLocalizedText(primaryExperience.content.title, locale),
          selected_services: selectedServices,
          check_in_date: form.check_in_date || undefined,
          check_out_date: form.check_out_date || undefined,
          preferred_date: form.preferred_date || undefined,
          adults: form.adults,
          children: form.children,
          guest_count: guestCount,
          add_ons: add_on_items,
          special_requests: form.special_requests,
          estimated_total: currentEstimate?.total ?? 0,
          currency: 'EUR',
          payment_method: form.payment_method,
          payment_status: 'payment_pending',
          booking_status: 'pending',
          source: url.searchParams.get('utm_source') ?? 'direct',
          medium: url.searchParams.get('utm_medium') ?? 'none',
          campaign: url.searchParams.get('utm_campaign') ?? undefined,
          referrer: document.referrer || undefined,
          session_token: sessionToken,
          private_option: form.private_option,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Booking could not be submitted.');
      setSuccess({ reference: data.booking_reference, total: Number(data.estimated_total ?? currentEstimate?.total ?? 0) });
      successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Booking failed.';
      setErrorMessage(message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.38fr_0.82fr]">
      <form onSubmit={onSubmit} className="space-y-8 rounded-[2rem] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,243,235,0.96))] p-6 shadow-[0_24px_60px_-28px_rgba(37,29,18,0.2)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(28,23,18,0.98),rgba(16,13,10,0.96))] md:p-8">
        <div ref={successRef} className="space-y-3">
          {success ? (
            <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100">
              <p className="font-semibold">Booking request received • {success.reference}</p>
              <p className="mt-2 text-sm leading-7">
                Your request has been sent successfully. Estimated total: {formatCurrency(success.total, 'EUR', locale)}.
              </p>
              {selectedPaymentConfig ? (
                <p className="mt-2 text-sm leading-7">
                  Selected payment method: {getPaymentMethodLabel(selectedPaymentConfig.key, locale, selectedPaymentConfig.publicLabel)}.
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <Link href={`/${locale}/booking/thank-you?ref=${success.reference}` as any} className="inline-flex text-sm font-semibold underline underline-offset-4">
                  Open the thank-you page
                </Link>
                {selectedPaymentConfig?.paymentUrl ? (
                  <Link
                    href={selectedPaymentConfig.paymentUrl as any}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-emerald-300 px-4 py-2 text-sm font-semibold"
                  >
                    Continue to payment
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
          {errorMessage ? (
            <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-900 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100">
              {errorMessage}
            </div>
          ) : null}
        </div>

        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">Experience</p>
            <h3 className="mt-2 font-serif text-2xl text-stone-900 dark:text-white">Choose your main experience</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-600 dark:text-stone-200">Choose one core experience from a curated shortlist. The owner dashboard controls pricing, visibility, and featured status.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {bookingPrimaryExperiences.map((experience) => {
              const active = form.experience_slug === experience.slug;

              return (
                <button
                  key={experience.slug}
                  type="button"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      experience_slug: experience.slug,
                      check_in_date: '',
                      check_out_date: '',
                      preferred_date: '',
                    }))
                  }
                  className={cn(
                    'rounded-[2rem] border p-6 text-left transition ecl-surface shadow-[0_18px_48px_-30px_rgba(37,29,18,0.16)] hover:-translate-y-0.5 hover:shadow-[0_24px_56px_-28px_rgba(37,29,18,0.2)]',
                    active && 'ring-2 ring-[var(--ecl-gold)] border-transparent shadow-[0_28px_70px_-34px_rgba(185,133,59,0.35)]'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xl font-semibold leading-tight text-stone-900 dark:text-white">
                        {getLocalizedText(experience.content.title, locale)}
                      </div>
                      <div className="mt-2 text-sm ecl-text-soft">
                        {experience.durationLabel}
                      </div>
                      {experience.adminBadge ? (
                        <span className="mt-3 inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] ecl-status-limited">
                          {experience.adminBadge}
                        </span>
                      ) : null}
                    </div>
                    {active ? (
                      <span className="rounded-full px-3 py-1 text-xs font-bold ecl-status-limited">
                        Selected
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-stone-900 dark:text-white">
                      From {formatCurrency(experience.startingPrice, 'EUR', locale)}
                    </div>
                    {!experience.adminBadge ? (
                      <span className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ecl-status-available">
                        Core
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          {isCamp ? (
            <>
              <AvailabilityDatePicker
                label="Check-in date"
                experienceSlug={primaryExperience?.slug ?? ''}
                locale={locale}
                value={form.check_in_date}
                onChange={(value) => setForm((current) => ({ ...current, check_in_date: value, check_out_date: current.check_out_date && current.check_out_date <= value ? '' : current.check_out_date }))}
                guestCount={guestCount}
              />
              <AvailabilityDatePicker
                label="Check-out date"
                experienceSlug={primaryExperience?.slug ?? ''}
                locale={locale}
                value={form.check_out_date}
                onChange={(value) => setForm((current) => ({ ...current, check_out_date: value }))}
                guestCount={guestCount}
                minDate={form.check_in_date || undefined}
              />
            </>
          ) : (
            <AvailabilityDatePicker
              label="Preferred date"
              experienceSlug={primaryExperience?.slug ?? ''}
              locale={locale}
              value={form.preferred_date}
              onChange={(value) => setForm((current) => ({ ...current, preferred_date: value }))}
              guestCount={guestCount}
            />
          )}
          <div className="grid gap-5 content-start">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-100">
                Adults
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={form.adults}
                  onChange={(event) => setForm((current) => ({ ...current, adults: Number(event.target.value) || 1 }))}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-amber-500 dark:border-white/10 dark:bg-stone-900 dark:text-white"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-100">
                Children
                <input
                  type="number"
                  min={0}
                  max={12}
                  value={form.children}
                  onChange={(event) => setForm((current) => ({ ...current, children: Number(event.target.value) || 0 }))}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-amber-500 dark:border-white/10 dark:bg-stone-900 dark:text-white"
                />
              </label>
            </div>
            {primaryExperience?.privateSurcharge > 0 ? (
              <label className="flex items-center gap-3 rounded-[1.5rem] border border-black/5 bg-white/75 px-4 py-4 text-sm text-stone-700 dark:border-white/10 dark:bg-stone-900/70 dark:text-stone-200">
                <input
                  type="checkbox"
                  checked={form.private_option}
                  onChange={(event) => setForm((current) => ({ ...current, private_option: event.target.checked }))}
                  className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                Add private option ({formatCurrency(primaryExperience.privateSurcharge, 'EUR', locale)})
              </label>
            ) : null}
            <div className="rounded-[1.5rem] border border-black/5 bg-white/75 px-4 py-4 dark:border-white/10 dark:bg-stone-900/70">
              <p className="text-sm font-semibold text-stone-900 dark:text-white">Booking visibility</p>
              <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">Green dates are open, amber dates are nearly full, and red dates are already sold out or blocked. Guests will immediately see the same calendar logic you manage in the dashboard.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="font-serif text-2xl text-stone-900 dark:text-white">Add extra services</h3>
              <p className="mt-1 max-w-2xl text-sm leading-7 text-stone-600 dark:text-stone-200">A compact optional list. Add only the experiences you want to combine with your main booking.</p>
            </div>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-100">
              {additionalServiceSlugs.length ? `${additionalServiceSlugs.length} added` : 'Optional'}
            </span>
          </div>
          <div className="rounded-[1.75rem] border border-black/5 bg-white/80 p-3 shadow-[0_18px_48px_-30px_rgba(37,29,18,0.18)] dark:border-white/10 dark:bg-stone-950/70">
            <div className="max-h-[22rem] space-y-2 overflow-y-auto pr-1">
              {additionalServices.map((experience) => {
                const checked = additionalServiceSlugs.includes(experience.slug);
                return (
                  <button
                    key={experience.slug}
                    type="button"
                    onClick={() =>
                      setAdditionalServiceSlugs((current) =>
                        checked ? current.filter((item) => item !== experience.slug) : [...current, experience.slug]
                      )
                    }
                    className={cn(
                      'grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[1.35rem] border px-4 py-3 text-left transition duration-200',
                      checked
                        ? 'border-amber-400 bg-amber-50 shadow-[0_14px_36px_-30px_rgba(198,148,62,0.55)] dark:border-amber-300 dark:bg-amber-300/10'
                        : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/60 dark:border-white/10 dark:bg-stone-950/80 dark:hover:border-amber-300/30 dark:hover:bg-stone-900'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-flex h-10 w-10 items-center justify-center rounded-full border transition',
                        checked
                          ? 'border-stone-950 bg-stone-950 text-white dark:border-amber-300 dark:bg-amber-300 dark:text-stone-950'
                          : 'border-stone-200 bg-stone-50 text-stone-500 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100'
                      )}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-base font-semibold text-stone-950 dark:text-white">{getLocalizedText(experience.content.title, locale)}</span>
                      <span className="mt-1 block text-sm text-stone-600 dark:text-stone-200">{experience.durationLabel}</span>
                    </span>
                    <span className="text-right">
                      <span className="block text-sm font-semibold text-amber-700 dark:text-amber-300">From {formatCurrency(experience.startingPrice, 'EUR', locale)}</span>
                      <span
                        className={cn(
                          'mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold',
                          checked
                            ? 'bg-stone-950 text-white dark:bg-amber-300 dark:text-stone-950'
                            : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-100'
                        )}
                      >
                        {checked ? 'Added' : 'Optional'}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {addOns.length ? (
          <section className="space-y-4">
            <h3 className="font-serif text-2xl text-stone-900 dark:text-white">Tailored add-ons</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {addOns.map((addOn) => {
                const checked = selectedAddOns.includes(addOn.key);
                return (
                  <button
                    key={addOn.key}
                    type="button"
                    onClick={() =>
                      setSelectedAddOns((current) =>
                        checked ? current.filter((item) => item !== addOn.key) : [...current, addOn.key]
                      )
                    }
                    className={cn(
                      'flex items-start justify-between gap-4 rounded-[1.5rem] border px-4 py-4 text-left transition',
                      checked
                        ? 'border-amber-400 bg-amber-50 dark:border-amber-300 dark:bg-amber-300/10'
                        : 'border-black/5 bg-white/75 dark:border-white/10 dark:bg-stone-900/70'
                    )}
                  >
                    <span>
                      <span className="block font-semibold text-stone-900 dark:text-white">{getLocalizedText(addOn.label, locale)}</span>
                      <span className="mt-1 block text-sm leading-6 text-stone-600 dark:text-stone-300">{getLocalizedText(addOn.description, locale)}</span>
                    </span>
                    <span className="text-right text-sm font-semibold text-amber-700 dark:text-amber-300">{formatCurrency(addOn.price, 'EUR', locale)}{addOn.perGuest ? ' / guest' : ''}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">Guest details</p>
            <h3 className="mt-2 font-serif text-2xl text-stone-900 dark:text-white">Tell us about your booking</h3>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              ['Full name', 'full_name', 'text'],
              ['Email', 'email', 'email'],
              ['Phone', 'phone', 'text'],
              ['WhatsApp', 'whatsapp', 'text'],
              ['Country', 'country', 'text'],
            ].map(([label, field, type]) => (
              <label key={field} className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-100">
                {label}
                <input
                  required={field !== 'whatsapp'}
                  type={type}
                  value={(form as any)[field]}
                  onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-amber-500 dark:border-white/10 dark:bg-stone-900 dark:text-white"
                />
              </label>
            ))}
            <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-100">
              Preferred contact
              <select value={form.preferred_contact_method} onChange={(event) => setForm((current) => ({ ...current, preferred_contact_method: event.target.value as 'email' | 'whatsapp' | 'phone' }))} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-amber-500 dark:border-white/10 dark:bg-stone-900 dark:text-white">
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="phone">Phone</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-100">
              Preferred language
              <select value={form.preferred_language} onChange={(event) => setForm((current) => ({ ...current, preferred_language: event.target.value as Locale }))} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-amber-500 dark:border-white/10 dark:bg-stone-900 dark:text-white">
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="ar">العربية</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-100 md:col-span-2">
              Payment method
              <select value={form.payment_method} onChange={(event) => setForm((current) => ({ ...current, payment_method: event.target.value as PaymentMethod }))} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-amber-500 dark:border-white/10 dark:bg-stone-900 dark:text-white">
                {availablePaymentMethods.map((method) => (
                  <option key={method.key} value={method.key}>
                    {getPaymentMethodLabel(method.key, locale, method.publicLabel)}
                  </option>
                ))}
              </select>
            </label>
            {selectedPaymentConfig ? (
              <div className="rounded-[1.5rem] border border-black/5 bg-stone-50 px-4 py-4 md:col-span-2 dark:border-white/10 dark:bg-stone-900/70">
                <p className="font-semibold text-stone-900 dark:text-white">
                  {getPaymentMethodLabel(selectedPaymentConfig.key, locale, selectedPaymentConfig.publicLabel)}
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">
                  {getPaymentMethodDescription(selectedPaymentConfig.key, locale, selectedPaymentConfig.description)}
                </p>
                {selectedPaymentConfig.accountValue ? (
                  <p className="mt-3 text-sm leading-7 text-stone-700 dark:text-stone-200">
                    <span className="font-semibold">{selectedPaymentConfig.accountLabel || 'Account'}:</span> {selectedPaymentConfig.accountValue}
                  </p>
                ) : null}
                {selectedPaymentConfig.instructions ? (
                  <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
                    {selectedPaymentConfig.instructions}
                  </p>
                ) : null}
                {selectedPaymentConfig.paymentUrl ? (
                  <Link
                    href={selectedPaymentConfig.paymentUrl as any}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-stone-900 dark:border-white/10 dark:text-white"
                  >
                    Open payment link
                  </Link>
                ) : null}
                {paymentSettings.payoutNotice ? (
                  <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
                    {paymentSettings.payoutNotice}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
          <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-100">
            Special requests
            <textarea
              rows={6}
              value={form.special_requests}
              onChange={(event) => setForm((current) => ({ ...current, special_requests: event.target.value }))}
              className="w-full rounded-[1.5rem] border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-amber-500 dark:border-white/10 dark:bg-stone-900 dark:text-white"
              placeholder="Arrival details, dietary needs, honeymoon note, children’s pacing, photography expectations…"
            />
          </label>
        </section>

        <button
          type="submit"
          disabled={submitting || estimating || availability?.available === false}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_22px_45px_-28px_rgba(17,16,13,0.6)] transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-[#f0d7a6] dark:text-stone-950 dark:hover:bg-[#f5dfb5]"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          Submit booking request
        </button>
      </form>

      <aside className="space-y-6">
        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_24px_60px_-28px_rgba(37,29,18,0.2)] dark:border-white/10 dark:bg-stone-950/60 md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">Estimate</p>
          <h3 className="mt-2 font-serif text-2xl text-stone-900 dark:text-white">Live pricing summary</h3>
          <div className="mt-5 space-y-4">
            <div className="rounded-[1.5rem] border border-black/5 bg-stone-50 px-4 py-4 dark:border-white/10 dark:bg-stone-900/70">
              <p className="text-sm text-stone-600 dark:text-stone-300">Selected experience</p>
              <p className="mt-1 font-semibold text-stone-900 dark:text-white">{primaryExperience ? getLocalizedText(primaryExperience.content.title, locale) : '—'}</p>
            </div>
            {availability ? (
              <div className={cn('rounded-[1.5rem] px-4 py-4 text-sm', availability.available ? 'border border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100' : 'border border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100')}>
                {availability.available ? 'Dates currently look available.' : availability.reason ?? 'Selected dates are not available.'}
              </div>
            ) : null}
            <div className="rounded-[1.5rem] border border-black/5 bg-stone-50 px-4 py-4 dark:border-white/10 dark:bg-stone-900/70">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-stone-600 dark:text-stone-300">Estimated total</span>
                {estimating ? <Loader2 className="h-4 w-4 animate-spin text-amber-700 dark:text-amber-300" /> : null}
              </div>
              <p className="mt-2 font-serif text-4xl text-stone-900 dark:text-white">
                {estimate ? formatCurrency(estimate.total, estimate.currency, locale) : '—'}
              </p>
              {estimate?.nights && isCamp ? <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">{estimate.nights} night(s)</p> : null}
            </div>
            {estimate?.breakdown?.length ? (
              <div className="space-y-3 rounded-[1.5rem] border border-black/5 bg-stone-50 p-4 dark:border-white/10 dark:bg-stone-900/70">
                {estimate.breakdown.map((item, index) => (
                  <div key={`${item.slug}-${index}`} className="flex items-start justify-between gap-4 text-sm">
                    <span className="text-stone-600 dark:text-stone-300">{item.name}</span>
                    <span className="font-medium text-stone-900 dark:text-white">{formatCurrency(item.price, 'EUR', locale)}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_24px_60px_-28px_rgba(37,29,18,0.2)] dark:border-white/10 dark:bg-stone-950/60">
          <p className="font-serif text-2xl text-stone-900 dark:text-white">Why guests trust this booking flow</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
            <li>Real on-site booking request saved directly to the business dashboard.</li>
            <li>Calendar colors match the real operational availability you control as owner.</li>
            <li>Reference number generated instantly and shown to the guest after submission.</li>
            <li>Payment can remain flexible until the gateways are fully connected.</li>
          </ul>
          <div className="mt-5 rounded-[1.5rem] border border-black/5 bg-stone-50 p-4 dark:border-white/10 dark:bg-stone-900/70">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900 dark:text-white"><Sparkles className="h-4 w-4 text-amber-700 dark:text-amber-300" /> Availability colours</div>
            <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">Green = available, amber = nearly full, red = sold out or blocked. Guests will never accidentally request dates already full.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
