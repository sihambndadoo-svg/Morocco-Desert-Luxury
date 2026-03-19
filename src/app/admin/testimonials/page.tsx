import { AdminShell } from '@/components/admin/admin-shell';
import { TestimonialsManager } from '@/components/admin/testimonials-manager';
import { fetchExperiences } from '@/lib/services/experiences';
import { fetchTestimonials } from '@/lib/services/testimonials';

export default async function AdminTestimonialsPage() {
  const [testimonials, experiences] = await Promise.all([
    fetchTestimonials(false, true),
    fetchExperiences({ activeOnly: false }),
  ]);

  return (
    <AdminShell title="Reviews" description="Create, update, hide, feature, or delete guest reviews directly from the owner dashboard.">
      <TestimonialsManager initialTestimonials={testimonials} experiences={experiences} />
    </AdminShell>
  );
}
