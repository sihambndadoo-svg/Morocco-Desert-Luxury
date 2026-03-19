import { PageHero } from '@/components/marketing/page-hero';
import { TestimonialCard } from '@/components/marketing/testimonial-card';
import { buildMetadata } from '@/lib/seo/metadata';
import { fetchTestimonials } from '@/lib/services/testimonials';
import { resolveLocale } from '@/lib/i18n';
import { getLocalizedText } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  return buildMetadata({ locale: resolved, title: 'Guest reviews', description: 'Read selected guest testimonials about luxury camp stays, private touring, and premium Sahara hospitality in Merzouga.', path: 'reviews' });
}

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const testimonials = await fetchTestimonials(false);
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-6">
      <PageHero eyebrow="Reviews" title="Selected guest voices from the desert" description="The testimonials below can be managed in the owner dashboard, featured, hidden, or updated over time for fresh social proof." primary={{ href: `/${resolved}/booking`, label: 'Create your own stay' }} />
      <section className="grid gap-6 pt-16 md:grid-cols-2 xl:grid-cols-3">
        {testimonials.map((testimonial: any) => (
          <TestimonialCard key={testimonial.id ?? testimonial.full_name} quote={getLocalizedText(testimonial.quote, resolved)} name={String(testimonial.full_name ?? '')} country={String(testimonial.country ?? '')} rating={Number(testimonial.rating ?? 5)} />
        ))}
      </section>
    </div>
  );
}
