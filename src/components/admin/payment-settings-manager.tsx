'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { PaymentMethod, PaymentMethodSetting, PaymentSettings } from '@/types';
import {
  getPaymentMethodDescription,
  getPaymentMethodLabel,
  isOnlinePaymentMethod,
  normalizePaymentSettings,
  paymentMethodOrder,
} from '@/lib/payment-settings';
import { cn } from '@/lib/utils';

export function PaymentSettingsManager({ initialSettings }: { initialSettings: PaymentSettings }) {
  const [settings, setSettings] = useState<PaymentSettings>(normalizePaymentSettings(initialSettings));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function updateMethod<K extends keyof PaymentMethodSetting>(key: PaymentMethod, field: K, value: PaymentMethodSetting[K]) {
    setSettings((current) => ({
      ...current,
      methods: current.methods.map((method) =>
        method.key === key ? { ...method, [field]: value } : method
      ),
    }));
  }

  async function onSave() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'paymentSettings',
          value: settings,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not save payment settings.');
      setMessage('Payment settings saved successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save payment settings.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4 rounded-[1.75rem] border border-black/5 bg-white p-6">
        <div>
          <h2 className="font-serif text-2xl text-stone-900">Payment control center</h2>
          <p className="mt-2 text-sm leading-7 text-stone-600">
            Enable or disable each payment method, store the receiving account details, and attach an external payment URL for online checkout.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-900">
          This dashboard stores receiving accounts and external payment links. Direct in-site card processing still needs a real gateway integration and merchant credentials.
        </div>

        <label className="flex items-center gap-3 rounded-[1.5rem] border border-black/5 bg-stone-50 px-4 py-4 text-sm font-medium text-stone-800">
          <input
            type="checkbox"
            checked={settings.onlinePaymentEnabled}
            onChange={(event) => setSettings((current) => ({ ...current, onlinePaymentEnabled: event.target.checked }))}
            className="h-4 w-4 rounded border-stone-300 text-amber-600"
          />
          Enable online payment methods (PayPal, card, CMI / bank URL)
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-800">
          Currency shown on booking page
          <input
            value={settings.currency}
            onChange={(event) => setSettings((current) => ({ ...current, currency: event.target.value }))}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-800">
          General payout / payment notice
          <textarea
            rows={6}
            value={settings.payoutNotice}
            onChange={(event) => setSettings((current) => ({ ...current, payoutNotice: event.target.value }))}
            className="w-full rounded-[1.5rem] border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none"
            placeholder="Example: For online payment, use only the official links configured below. For bank transfer, send the payment proof by WhatsApp."
          />
        </label>

        {message ? <p className="text-sm text-stone-600">{message}</p> : null}

        <button
          type="button"
          onClick={onSave}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save payment settings
        </button>
      </div>

      <div className="grid gap-4">
        {paymentMethodOrder.map((key) => {
          const method = settings.methods.find((entry) => entry.key === key);
          if (!method) return null;
          const online = isOnlinePaymentMethod(key);
          return (
            <article
              key={key}
              className={cn(
                'rounded-[1.75rem] border p-5 transition',
                method.enabled ? 'border-black/5 bg-white' : 'border-black/5 bg-stone-50/90'
              )}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-2xl text-stone-900">{getPaymentMethodLabel(key, 'en', method.publicLabel)}</h3>
                    <span className={cn(
                      'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]',
                      online ? 'bg-sky-100 text-sky-800' : 'bg-stone-200 text-stone-700'
                    )}>
                      {online ? 'Online' : 'Offline'}
                    </span>
                    <span className={cn(
                      'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]',
                      method.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'
                    )}>
                      {method.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-stone-600">
                    {getPaymentMethodDescription(key, 'en', method.description)}
                  </p>
                  {online && !settings.onlinePaymentEnabled ? (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                      Global online payment toggle is currently off.
                    </p>
                  ) : null}
                </div>
                <label className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={method.enabled}
                    onChange={(event) => updateMethod(key, 'enabled', event.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-amber-600"
                  />
                  Enable method
                </label>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-stone-800">
                  Public label override
                  <input
                    value={method.publicLabel}
                    onChange={(event) => updateMethod(key, 'publicLabel', event.target.value)}
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none"
                    placeholder={getPaymentMethodLabel(key, 'en')}
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-stone-800">
                  Account label
                  <input
                    value={method.accountLabel}
                    onChange={(event) => updateMethod(key, 'accountLabel', event.target.value)}
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none"
                    placeholder="IBAN, PayPal email, merchant id..."
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-stone-800 md:col-span-2">
                  Description shown to guests
                  <textarea
                    rows={3}
                    value={method.description}
                    onChange={(event) => updateMethod(key, 'description', event.target.value)}
                    className="w-full rounded-[1.5rem] border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none"
                    placeholder={getPaymentMethodDescription(key, 'en')}
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-stone-800">
                  Receiving account / identifier
                  <input
                    value={method.accountValue}
                    onChange={(event) => updateMethod(key, 'accountValue', event.target.value)}
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none"
                    placeholder="IBAN, PayPal email, merchant code, account number..."
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-stone-800">
                  External payment URL
                  <input
                    value={method.paymentUrl}
                    onChange={(event) => updateMethod(key, 'paymentUrl', event.target.value)}
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none"
                    placeholder="https://..."
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-stone-800 md:col-span-2">
                  Owner instructions / internal note
                  <textarea
                    rows={4}
                    value={method.instructions}
                    onChange={(event) => updateMethod(key, 'instructions', event.target.value)}
                    className="w-full rounded-[1.5rem] border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none"
                    placeholder="Example: Verify transfer proof manually before confirming the booking."
                  />
                </label>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
