import { getServiceSupabase } from '@/lib/supabase/server';
import { BookingLineItem, BookingRequestInput, PricingRule } from '@/types';
import { fetchExperienceBySlug, fetchExperiences } from '@/lib/services/experiences';
import { getDateRange, nightsBetween } from '@/lib/utils';

function matchesRule(rule: PricingRule, date: string) {
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  if (!rule.is_active) return false;
  if (rule.rule_type === 'specific_date') return rule.specific_date === date;
  if (rule.rule_type === 'weekday' || rule.rule_type === 'weekend') {
    return typeof rule.weekday === 'number' ? rule.weekday === weekday : weekday === 5 || weekday === 6;
  }
  const start = rule.start_date ?? date;
  const end = rule.end_date ?? date;
  return date >= start && date <= end;
}

function applyAmount(current: number, amount: number, mode: PricingRule['amount_mode']) {
  if (mode === 'replace') return amount;
  if (mode === 'discount') return Math.max(current - amount, 0);
  return current + amount;
}

export async function fetchPricingRules(experienceSlug?: string) {
  const supabase = getServiceSupabase();
  if (!supabase) return [] as PricingRule[];
  let query = supabase.from('pricing_rules').select('*').eq('is_active', true).order('priority', {
    ascending: false
  });
  if (experienceSlug) query = query.eq('experience_slug', experienceSlug);
  const { data } = await query;
  return (data ?? []) as PricingRule[];
}

async function calculateSingleExperienceSubtotal(
  slug: string,
  adults: number,
  children: number,
  dates: string[],
  privateOption: boolean
) {
  const experience = await fetchExperienceBySlug(slug);
  if (!experience) {
    return { subtotal: 0, lineItems: [] as BookingLineItem[], experience: null };
  }
  const rules = await fetchPricingRules(slug);
  const effectiveDates = dates.length ? dates : [new Date().toISOString().slice(0, 10)];
  const lineItems: BookingLineItem[] = [];
  let subtotal = 0;

  for (const date of effectiveDates) {
    let adultUnit = experience.baseAdultPrice;
    let childUnit = experience.baseChildPrice;
    let datePrivate = 0;
    for (const rule of rules.filter((candidate) => matchesRule(candidate, date))) {
      adultUnit = applyAmount(adultUnit, Number(rule.adult_amount ?? 0), rule.amount_mode);
      if (typeof rule.child_amount === 'number') {
        childUnit = applyAmount(childUnit, Number(rule.child_amount ?? 0), rule.amount_mode);
      }
      if (typeof rule.private_surcharge === 'number') {
        datePrivate = applyAmount(datePrivate, Number(rule.private_surcharge), 'surcharge');
      }
    }
    subtotal += adultUnit * adults + childUnit * children;
    if (privateOption) subtotal += experience.privateSurcharge + datePrivate;
  }

  lineItems.push({
    slug,
    name: experience.content.title.en,
    price: subtotal,
    type: 'service',
    quantity: effectiveDates.length
  });

  return { subtotal, lineItems, experience };
}

export async function calculateBookingEstimate(input: Partial<BookingRequestInput>) {
  const adults = Number(input.adults ?? 1);
  const children = Number(input.children ?? 0);
  const primary = input.experience_slug ? await fetchExperienceBySlug(input.experience_slug) : null;
  const dates = primary?.category === 'camp'
    ? getDateRange(input.check_in_date ?? '', input.check_out_date)
    : getDateRange(input.preferred_date ?? input.check_in_date ?? new Date().toISOString().slice(0, 10));
  const primarySubtotal = input.experience_slug
    ? await calculateSingleExperienceSubtotal(
        input.experience_slug,
        adults,
        children,
        dates.length ? dates : [new Date().toISOString().slice(0, 10)],
        Boolean(input.private_option)
      )
    : { subtotal: 0, lineItems: [] as BookingLineItem[], experience: null };

  let subtotal = primarySubtotal.subtotal;
  const breakdown = [...primarySubtotal.lineItems];

  const selectedServices = (input.selected_services ?? []).filter(
    (item) => item.slug !== input.experience_slug && item.type !== 'primary'
  );

  for (const service of selectedServices) {
    const serviceDates = getDateRange(
      input.preferred_date ?? input.check_in_date ?? new Date().toISOString().slice(0, 10)
    );
    const result = await calculateSingleExperienceSubtotal(
      service.slug,
      adults,
      children,
      serviceDates.length ? serviceDates : [new Date().toISOString().slice(0, 10)],
      false
    );
    subtotal += result.subtotal;
    breakdown.push({ ...service, price: result.subtotal });
  }

  const allExperiences = await fetchExperiences({ activeOnly: false });
  const addOnCatalog = new Map(
    allExperiences.flatMap((experience) => experience.addOns).map((addOn) => [addOn.key, addOn])
  );

  for (const addOn of input.add_ons ?? []) {
    const matched = addOnCatalog.get(addOn.slug);
    const quantity = addOn.quantity ?? 1;
    const price = matched ? matched.price * (matched.perGuest ? adults + children : quantity) : addOn.price;
    subtotal += price;
    breakdown.push({ ...addOn, price, type: 'addon' });
  }

  const nights = nightsBetween(input.check_in_date, input.check_out_date);

  return {
    total: Math.round(subtotal),
    nights,
    breakdown,
    currency: 'EUR'
  };
}

export async function savePricingRule(payload: PricingRule) {
  const supabase = getServiceSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('pricing_rules').upsert({
    ...payload,
    currency: payload.currency ?? 'EUR',
    is_active: payload.is_active ?? true,
    priority: payload.priority ?? 100
  });
  if (error) throw error;
}

export async function deletePricingRule(id: string) {
  const supabase = getServiceSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('pricing_rules').delete().eq('id', id);
  if (error) throw error;
}
