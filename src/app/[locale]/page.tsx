export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import { ArrowRight, CheckCircle2, MessageCircle, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { HeroVideo } from '@/components/marketing/hero-video';
import { SectionHeading } from '@/components/marketing/section-heading';
import { ExperienceCard } from '@/components/marketing/experience-card';
import { GalleryGrid } from '@/components/marketing/gallery-grid';
import { TestimonialCard } from '@/components/marketing/testimonial-card';
import { FAQAccordion } from '@/components/marketing/faq-accordion';
import { Reveal } from '@/components/marketing/reveal';
import { StructuredData } from '@/components/marketing/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';
import { getPublicData, getLocalizedFaqItems } from '@/lib/public-data';
import { getLocalizedText } from '@/lib/utils';
import { resolveLocale } from '@/lib/i18n';
import { heroMedia } from '@/lib/content/experiences';
import { Locale } from '@/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const { copy } = await getPublicData();
  return buildMetadata({
    locale: resolved,
    title: getLocalizedText(copy.homeHero.title, resolved),
    description: getLocalizedText(copy.homeHero.description, resolved),
    path: '',
    image: heroMedia.posterUrl ?? heroMedia.fallbackUrl,
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const { copy, featuredExperiences, experiences, testimonials, mediaAssets } = await getPublicData();
  const faqItems = getLocalizedFaqItems(resolved).slice(0, 5);
  const galleryItems = mediaAssets
    .filter((asset: any) => asset.media_type === 'image')
    .slice(0, 8)
    .map((asset: any) => ({ url: asset.url, fallbackUrl: asset.fallback_url, alt: getLocalizedText(asset.alt, resolved) }));

  const faqJson = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <div className="pb-24">
      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-4 md:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-stone-950 shadow-[0_36px_120px_-50px_rgba(30,22,14,0.45)] dark:border-white/10">
          <HeroVideo media={heroMedia} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
          <div className="relative z-10 grid min-h-[78svh] items-end px-6 py-12 md:px-10 md:py-14 lg:min-h-[84svh] lg:px-14 lg:py-16">
            <div className="max-w-3xl space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.36em] text-amber-300">
                {getLocalizedText(copy.homeHero.eyebrow, resolved)}
              </p>
              <h1 className="font-serif text-5xl leading-[1.02] text-white md:text-7xl">
                {getLocalizedText(copy.homeHero.title, resolved)}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-stone-200 md:text-lg">
                {getLocalizedText(copy.homeHero.description, resolved)}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={`/${resolved}/booking` as any} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-stone-100">
                  {getLocalizedText(copy.homeHero.primaryCta, resolved)}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={`/${resolved}/experiences` as any} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15">
                  {getLocalizedText(copy.homeHero.secondaryCta, resolved)}
                </Link>
              </div>
              <div className="grid gap-3 pt-4 text-sm text-stone-200 md:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">Private luxury camp stays</div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">Merzouga-based coordination</div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">Fast follow-up on real bookings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <Reveal>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: 'Featured experiences', value: String(experiences.length) },
              { label: 'Languages supported', value: '4' },
              { label: 'Luxury booking flows', value: 'On-site' },
              { label: 'Fast response promise', value: 'Hours' },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-[0_18px_50px_-28px_rgba(37,29,18,0.2)] dark:border-white/10 dark:bg-stone-950/60">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700 dark:text-amber-300">{item.label}</p>
                <p className="mt-3 font-serif text-4xl text-stone-900 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Featured experiences"
            title="Premium desert stays, private adventures, and polished Sahara planning"
            description="Each experience is designed for real operational use: pricing, add-ons, availability, and clear guest communication all flow from the same booking system."
            actions={<Link href={`/${resolved}/experiences` as any} className="text-sm font-semibold text-stone-900 underline underline-offset-4 dark:text-white">View all experiences</Link>}
          />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredExperiences.map((experience, index) => (
            <Reveal key={experience.slug} delay={index * 0.05}>
              <ExperienceCard experience={experience} locale={resolved} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_-28px_rgba(37,29,18,0.2)] dark:border-white/10 dark:bg-stone-950/60">
            <SectionHeading
              eyebrow="Why choose us"
              title={getLocalizedText(copy.whyChooseUs.title, resolved)}
              description="Luxury hospitality matters most when the details are handled with care."
            />
            <div className="grid gap-5">
              {copy.whyChooseUs.items.map((item, index) => (
                <div key={index} className="rounded-[1.5rem] border border-black/5 bg-stone-50 p-5 dark:border-white/10 dark:bg-stone-900/60">
                  <h3 className="font-serif text-2xl text-stone-900 dark:text-white">{getLocalizedText(item.title, resolved)}</h3>
                  <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">{getLocalizedText(item.description, resolved)}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="space-y-6 rounded-[2rem] border border-black/5 bg-gradient-to-br from-[#fffef9] to-[#f3e0bd] p-8 shadow-[0_18px_50px_-28px_rgba(37,29,18,0.2)] dark:border-white/10 dark:from-stone-950 dark:to-stone-900">
            <h2 className="font-serif text-3xl text-stone-900 dark:text-white">How booking works</h2>
            <div className="grid gap-4">
              {copy.bookingSteps.map((step, index) => (
                <div key={index} className="rounded-[1.5rem] border border-black/5 bg-white/80 p-5 dark:border-white/10 dark:bg-black/20">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-900 dark:bg-amber-300/10 dark:text-amber-200">{index + 1}</div>
                  <h3 className="mt-4 font-semibold text-stone-900 dark:text-white">{getLocalizedText(step.title, resolved)}</h3>
                  <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">{getLocalizedText(step.description, resolved)}</p>
                </div>
              ))}
            </div>
            <div className="rounded-[1.5rem] border border-black/5 bg-white/85 p-5 dark:border-white/10 dark:bg-black/20">
              <p className="text-sm leading-7 text-stone-700 dark:text-stone-200">{getLocalizedText(copy.responsePromise, resolved)}</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Trust & reassurance"
            title="Real-world clarity for premium travellers"
            description="We reduce operational mistakes with clear arrival instructions, live pricing, flexible service combinations, and direct owner follow-up."
          />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {copy.trustPoints.map((point, index) => (
            <Reveal key={index} delay={index * 0.05}>
              <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-[0_18px_50px_-28px_rgba(37,29,18,0.2)] dark:border-white/10 dark:bg-stone-950/60">
                <ShieldCheck className="h-8 w-8 text-amber-700 dark:text-amber-300" />
                <p className="mt-4 text-base leading-8 text-stone-700 dark:text-stone-200">{getLocalizedText(point, resolved)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Gallery preview"
            title="Cinematic desert atmosphere"
            description={getLocalizedText(copy.galleryIntro, resolved)}
            actions={<Link href={`/${resolved}/gallery` as any} className="text-sm font-semibold text-stone-900 underline underline-offset-4 dark:text-white">Open gallery</Link>}
          />
        </Reveal>
        <Reveal delay={0.05}>
          <GalleryGrid items={galleryItems} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Guest reviews"
            title="Warm, polished, and remembered long after departure"
            description={getLocalizedText(copy.reviewsIntro, resolved)}
            actions={<Link href={`/${resolved}/reviews` as any} className="text-sm font-semibold text-stone-900 underline underline-offset-4 dark:text-white">Read all reviews</Link>}
          />
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.id ?? testimonial.full_name} delay={index * 0.05}>
              <TestimonialCard quote={getLocalizedText(testimonial.quote, resolved)} name={testimonial.full_name} country={testimonial.country} rating={testimonial.rating} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Everything guests usually ask before reserving"
            description={getLocalizedText(copy.faqIntro, resolved)}
            actions={<Link href={`/${resolved}/faq` as any} className="text-sm font-semibold text-stone-900 underline underline-offset-4 dark:text-white">Open the full FAQ</Link>}
          />
        </Reveal>
        <Reveal delay={0.05}>
          <FAQAccordion items={faqItems} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <Reveal>
          <div className="overflow-hidden rounded-[2.25rem] border border-black/5 bg-gradient-to-br from-stone-950 via-stone-900 to-[#2b1f12] p-8 text-white shadow-[0_30px_90px_-40px_rgba(30,22,14,0.45)] md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="space-y-5">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-amber-300">Booking CTA</p>
                <h2 className="font-serif text-4xl leading-tight md:text-5xl">Plan a private Sahara stay with a booking flow built for real guests</h2>
                <p className="max-w-3xl text-base leading-8 text-stone-200">
                  Request one service or combine camp nights, camel rides, transfers, quad touring, and private 4x4 experiences in a single reservation.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-stone-200">
                  <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-300" /> Live price estimate</span>
                  <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-300" /> Admin-controlled availability</span>
                  <span className="inline-flex items-center gap-2"><MessageCircle className="h-4 w-4 text-amber-300" /> Human follow-up</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href={`/${resolved}/booking` as any} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-stone-100">
                  Start booking
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={`/${resolved}/contact` as any} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5">
                  Send a custom request
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <StructuredData data={faqJson} />
    </div>
  );
}
