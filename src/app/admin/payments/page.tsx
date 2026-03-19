import { AdminShell } from '@/components/admin/admin-shell';
import { PaymentSettingsManager } from '@/components/admin/payment-settings-manager';
import { getPaymentSettings } from '@/lib/services/content';

export default async function AdminPaymentsPage() {
  const paymentSettings = await getPaymentSettings();

  return (
    <AdminShell
      title="Payments"
      description="Control which payment methods appear on the website and store the accounts or URLs where customer payments should be sent."
    >
      <PaymentSettingsManager initialSettings={paymentSettings} />
    </AdminShell>
  );
}
