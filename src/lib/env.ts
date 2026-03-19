import { z } from 'zod';

const optionalString = z.string().optional().or(z.literal(''));

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optionalString.default('https://www.ergchebbiluxury.com'),
  NEXT_PUBLIC_SUPABASE_URL: optionalString.default(''),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString.default(''),
  SUPABASE_SERVICE_ROLE_KEY: optionalString.default(''),
  RESEND_API_KEY: optionalString.default(''),
  BOOKING_FROM_EMAIL: optionalString.default('onboarding@resend.dev'),
  OWNER_NOTIFICATION_EMAIL: optionalString.default('soufianechahid80@gmail.com'),
  BOOKING_REPLY_TO: optionalString.default('soufianechahid80@gmail.com'),
  ADMIN_USERNAME: optionalString.default('owner'),
  ADMIN_PASSWORD: optionalString.default('change-this-immediately'),
  ADMIN_SESSION_SECRET: optionalString.default('replace-this-secret'),
  AUTO_CONFIRM_BOOKINGS: optionalString.default('false'),
  STRIPE_PUBLIC_KEY: optionalString.default(''),
  STRIPE_SECRET_KEY: optionalString.default(''),
  PAYPAL_CLIENT_ID: optionalString.default(''),
  PAYPAL_SECRET: optionalString.default(''),
  BANK_TRANSFER_LABEL: optionalString.default('Morocco bank transfer'),
  CMI_PLACEHOLDER_LABEL: optionalString.default('CMI Morocco payment link'),
  GOOGLE_CALENDAR_ID: optionalString.default(''),
  GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL: optionalString.default(''),
  GOOGLE_CALENDAR_PRIVATE_KEY: optionalString.default('')
});

export const env = envSchema.parse(process.env);

export const hasSupabaseCredentials = Boolean(
  env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
);

export const autoConfirmBookings = env.AUTO_CONFIRM_BOOKINGS === 'true';
