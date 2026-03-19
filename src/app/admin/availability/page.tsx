import { AdminShell } from '@/components/admin/admin-shell';
import { AdminAvailabilityManager } from '@/components/admin/admin-availability-manager';
import { fetchExperiences } from '@/lib/services/experiences';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminAvailabilityPage() {
  const experiences = await fetchExperiences({ activeOnly: false });

  return (
    <AdminShell
      title="Availability calendar"
      description="Manage each experience month by month, apply ranges that extend into future months, and publish changes instantly to the public booking calendar."
    >
      <AdminAvailabilityManager experiences={experiences} />
    </AdminShell>
  );
}
