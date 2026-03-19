import { Locale, PaymentMethod, PaymentMethodSetting, PaymentSettings } from '@/types';

export const paymentMethodOrder: PaymentMethod[] = [
  'confirm_first',
  'pay_on_arrival',
  'bank_transfer',
  'paypal_placeholder',
  'stripe_placeholder',
  'cmi_placeholder',
];

const defaultMethodSettings: Record<PaymentMethod, PaymentMethodSetting> = {
  confirm_first: {
    key: 'confirm_first',
    enabled: true,
    publicLabel: '',
    description: '',
    accountLabel: '',
    accountValue: '',
    paymentUrl: '',
    instructions: '',
  },
  pay_on_arrival: {
    key: 'pay_on_arrival',
    enabled: true,
    publicLabel: '',
    description: '',
    accountLabel: '',
    accountValue: '',
    paymentUrl: '',
    instructions: '',
  },
  bank_transfer: {
    key: 'bank_transfer',
    enabled: true,
    publicLabel: '',
    description: '',
    accountLabel: 'IBAN / RIB',
    accountValue: '',
    paymentUrl: '',
    instructions: '',
  },
  paypal_placeholder: {
    key: 'paypal_placeholder',
    enabled: false,
    publicLabel: 'PayPal',
    description: '',
    accountLabel: 'PayPal email',
    accountValue: '',
    paymentUrl: '',
    instructions: '',
  },
  stripe_placeholder: {
    key: 'stripe_placeholder',
    enabled: false,
    publicLabel: 'Card payment',
    description: '',
    accountLabel: 'Account / merchant ID',
    accountValue: '',
    paymentUrl: '',
    instructions: '',
  },
  cmi_placeholder: {
    key: 'cmi_placeholder',
    enabled: false,
    publicLabel: 'CMI / Bank URL',
    description: '',
    accountLabel: 'Merchant / terminal',
    accountValue: '',
    paymentUrl: '',
    instructions: '',
  },
};

export const defaultPaymentSettings: PaymentSettings = {
  onlinePaymentEnabled: false,
  currency: 'EUR',
  payoutNotice: '',
  methods: paymentMethodOrder.map((key) => ({ ...defaultMethodSettings[key] })),
};

function readString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function readBoolean(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback;
}

export function isOnlinePaymentMethod(method: PaymentMethod) {
  return method === 'paypal_placeholder' || method === 'stripe_placeholder' || method === 'cmi_placeholder';
}

export function normalizePaymentSettings(value: unknown): PaymentSettings {
  const raw = typeof value === 'object' && value ? (value as Record<string, unknown>) : {};
  const methodsInput = Array.isArray(raw.methods) ? raw.methods : [];
  const methodsMap = new Map<string, Record<string, unknown>>();

  for (const entry of methodsInput) {
    if (!entry || typeof entry !== 'object') continue;
    const record = entry as Record<string, unknown>;
    const key = record.key;
    if (typeof key === 'string') methodsMap.set(key, record);
  }

  const methods = paymentMethodOrder.map((key) => {
    const fallback = defaultMethodSettings[key];
    const current = methodsMap.get(key) ?? {};
    return {
      key,
      enabled: readBoolean(current.enabled, fallback.enabled),
      publicLabel: readString(current.publicLabel, fallback.publicLabel),
      description: readString(current.description, fallback.description),
      accountLabel: readString(current.accountLabel, fallback.accountLabel),
      accountValue: readString(current.accountValue, fallback.accountValue),
      paymentUrl: readString(current.paymentUrl, fallback.paymentUrl),
      instructions: readString(current.instructions, fallback.instructions),
    } satisfies PaymentMethodSetting;
  });

  return {
    onlinePaymentEnabled: readBoolean(raw.onlinePaymentEnabled, defaultPaymentSettings.onlinePaymentEnabled),
    currency: readString(raw.currency, defaultPaymentSettings.currency),
    payoutNotice: readString(raw.payoutNotice, defaultPaymentSettings.payoutNotice),
    methods,
  } satisfies PaymentSettings;
}

export function getEnabledPaymentMethods(settings?: PaymentSettings) {
  const normalized = normalizePaymentSettings(settings);
  const methods = normalized.methods.filter((method) => method.enabled && (normalized.onlinePaymentEnabled || !isOnlinePaymentMethod(method.key)));
  return methods.length ? methods : [normalizePaymentSettings(defaultPaymentSettings).methods[0]];
}

export function getPaymentMethodLabel(method: PaymentMethod, locale: Locale, override?: string) {
  if (override?.trim()) return override.trim();

  const labels: Record<PaymentMethod, Record<Locale, string>> = {
    confirm_first: {
      en: 'Confirm first',
      fr: 'Confirmer d\'abord',
      es: 'Confirmar primero',
      ar: 'التأكيد أولاً',
    },
    pay_on_arrival: {
      en: 'Pay on arrival',
      fr: 'Paiement à l\'arrivée',
      es: 'Pagar al llegar',
      ar: 'الدفع عند الوصول',
    },
    bank_transfer: {
      en: 'Bank transfer',
      fr: 'Virement bancaire',
      es: 'Transferencia bancaria',
      ar: 'تحويل بنكي',
    },
    paypal_placeholder: {
      en: 'PayPal',
      fr: 'PayPal',
      es: 'PayPal',
      ar: 'باي بال',
    },
    stripe_placeholder: {
      en: 'Card payment',
      fr: 'Paiement par carte',
      es: 'Pago con tarjeta',
      ar: 'الدفع بالبطاقة',
    },
    cmi_placeholder: {
      en: 'CMI / bank payment',
      fr: 'CMI / paiement bancaire',
      es: 'CMI / pago bancario',
      ar: 'CMI / الدفع البنكي',
    },
  };

  return labels[method][locale] ?? labels[method].en;
}

export function getPaymentMethodDescription(method: PaymentMethod, locale: Locale, override?: string) {
  if (override?.trim()) return override.trim();

  const descriptions: Record<PaymentMethod, Record<Locale, string>> = {
    confirm_first: {
      en: 'Submit your booking first and receive payment instructions after owner confirmation.',
      fr: 'Envoyez d\'abord votre réservation puis recevez les instructions de paiement après confirmation du propriétaire.',
      es: 'Envía primero tu reserva y recibe las instrucciones de pago tras la confirmación del propietario.',
      ar: 'أرسل طلب الحجز أولاً ثم ستصلك تعليمات الدفع بعد تأكيد المالك.',
    },
    pay_on_arrival: {
      en: 'Pay in person on arrival when this option is enabled by the owner.',
      fr: 'Payez sur place à l\'arrivée lorsque cette option est activée par le propriétaire.',
      es: 'Paga en persona al llegar cuando el propietario activa esta opción.',
      ar: 'ادفع عند الوصول عندما يفعّل المالك هذا الخيار.',
    },
    bank_transfer: {
      en: 'Transfer funds to the owner account using the details shown below.',
      fr: 'Transférez les fonds vers le compte du propriétaire avec les détails ci-dessous.',
      es: 'Transfiere el importe a la cuenta del propietario usando los datos siguientes.',
      ar: 'حوّل المبلغ إلى حساب المالك باستعمال البيانات المعروضة أدناه.',
    },
    paypal_placeholder: {
      en: 'Pay through the configured PayPal account or external checkout link.',
      fr: 'Payez via le compte PayPal configuré ou un lien de paiement externe.',
      es: 'Paga mediante la cuenta PayPal configurada o un enlace de pago externo.',
      ar: 'ادفع عبر حساب PayPal المربوط أو رابط الدفع الخارجي.',
    },
    stripe_placeholder: {
      en: 'Use the card payment link configured by the owner.',
      fr: 'Utilisez le lien de paiement par carte configuré par le propriétaire.',
      es: 'Usa el enlace de pago con tarjeta configurado por el propietario.',
      ar: 'استخدم رابط الدفع بالبطاقة الذي أعدّه المالك.',
    },
    cmi_placeholder: {
      en: 'Use the configured CMI or bank URL for online payment.',
      fr: 'Utilisez l\'URL CMI ou bancaire configurée pour le paiement en ligne.',
      es: 'Utiliza la URL de CMI o del banco configurada para el pago en línea.',
      ar: 'استخدم رابط CMI أو رابط البنك المخصص للدفع عبر الإنترنت.',
    },
  };

  return descriptions[method][locale] ?? descriptions[method].en;
}
