import { z } from 'zod';

const localizedPaymentMethod = z.enum([
  'confirm_first',
  'pay_on_arrival',
  'bank_transfer',
  'paypal_placeholder',
  'stripe_placeholder',
  'cmi_placeholder'
]);

export const bookingLineItemSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive().optional(),
  type: z.enum(['primary', 'service', 'addon', 'transfer', 'private'])
});

export const bookingSchema = z.object({
  full_name: z.string().min(2).max(120),
  email: z.email(),
  phone: z.string().min(4).max(50),
  whatsapp: z.string().max(50).optional().or(z.literal('')),
  country: z.string().min(2).max(80),
  preferred_language: z.enum(['en', 'fr', 'es', 'ar']),
  preferred_contact_method: z.enum(['email', 'whatsapp', 'phone']),
  experience_slug: z.string().min(1),
  experience_name: z.string().min(1),
  selected_services: z.array(bookingLineItemSchema).min(1),
  check_in_date: z.string().optional(),
  check_out_date: z.string().optional(),
  preferred_date: z.string().optional(),
  adults: z.coerce.number().int().min(1).max(30),
  children: z.coerce.number().int().min(0).max(20),
  guest_count: z.coerce.number().int().min(1).max(40),
  add_ons: z.array(bookingLineItemSchema).default([]),
  special_requests: z.string().max(3000).optional(),
  estimated_total: z.coerce.number().nonnegative(),
  currency: z.literal('EUR').default('EUR'),
  payment_method: localizedPaymentMethod,
  payment_status: z.enum([
    'payment_pending',
    'deposit_requested',
    'deposit_paid',
    'fully_paid',
    'refunded'
  ]),
  booking_status: z.enum(['pending', 'confirmed', 'declined', 'cancelled', 'completed']),
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
  referrer: z.string().optional(),
  owner_notes: z.string().optional(),
  session_token: z.string().optional(),
  private_option: z.boolean().optional()
});

export const contactSchema = z.object({
  full_name: z.string().min(2).max(120),
  email: z.email(),
  phone_or_whatsapp: z.string().max(50).optional(),
  subject: z.string().min(3).max(160),
  message: z.string().min(10).max(3000),
  preferred_language: z.enum(['en', 'fr', 'es', 'ar']),
  session_token: z.string().optional()
});
