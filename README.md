# Morocco Desert Luxury

Morocco Desert Luxury is a multilingual luxury desert tourism website and owner operating dashboard for a real Merzouga-based business. The project is built with Next.js App Router, TypeScript, Tailwind CSS, Supabase, and Resend, and is structured for Vercel deployment.

## What is included

- Public multilingual website in English, French, Spanish, and Arabic
- RTL support for Arabic routes
- Luxury hospitality branding, editorial design system, light and dark mode
- Experience catalog with localized content and pricing
- On-site booking flow with availability and live estimate requests
- Multi-service booking support
- Contact form with Supabase persistence and email notification
- Owner-only admin area at `/admin`
- Admin login, session cookie protection, status updates, notes, exports
- Availability calendar management
- Dynamic pricing rules and base pricing controls
- Testimonials management
- Media asset registry and content block tools
- Basic analytics collection for sessions, page views, and conversions
- Booking confirmation PDF generation
- ICS export for bookings
- SEO metadata, sitemap, robots, JSON-LD, Open Graph support
- Supabase schema and seed files matching the application structure

## Main stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS v4
- Framer Motion
- Supabase PostgreSQL
- Resend
- pdf-lib
- date-fns
- jose
- Zod

## Project structure

```text
src/
  app/
    [locale]/... public pages
    admin/... owner dashboard
    api/... route handlers
  components/
    admin/
    forms/
    layout/
    marketing/
  lib/
    auth/
    content/
    seo/
    services/
    supabase/
    validators/
  types/
supabase/
  schema.sql
  seed.sql
public/
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values.

Important variables:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `BOOKING_FROM_EMAIL`
- `OWNER_NOTIFICATION_EMAIL`
- `BOOKING_REPLY_TO`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `AUTO_CONFIRM_BOOKINGS`

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Optionally run `supabase/seed.sql`.
4. Copy the project URL, anon key, and service role key into `.env.local`.

## Local development

```bash
npm install
npm run dev
```

Open:

- Public site: `http://localhost:3000/en`
- Admin login: `http://localhost:3000/admin/login`

## Admin login

The admin dashboard uses env-based credentials and a signed HTTP-only session cookie.

Set these values in `.env.local`:

```env
ADMIN_USERNAME=owner
ADMIN_PASSWORD=strong-password
ADMIN_SESSION_SECRET=long-random-secret
```

## Booking flow

Public booking requests go through `/api/bookings`.

The flow:

1. Customer selects a primary experience.
2. Customer can add additional services and add-ons.
3. The UI requests live pricing from `/api/pricing/estimate`.
4. The UI checks date availability through `/api/availability`.
5. The booking is saved to `booking_requests`.
6. A booking reference is assigned automatically by Supabase.
7. Status history is written to `booking_status_history`.
8. Customer and owner emails are triggered through Resend when configured.

## Availability and pricing

Availability records are stored in `availability_calendar`.

Pricing rules are stored in `pricing_rules` and can support:

- specific dates
- date ranges
- weekday or weekend adjustments
- seasonal pricing
- promotional pricing
- private surcharges
- adult and child overrides

Base experience pricing is stored in the `experiences` table.

## Analytics

Client-side tracking posts to `/api/analytics/track`.

Stored tables:

- `visitor_sessions`
- `page_events`
- `admin_recent_activity`

Tracked events include:

- page views
- booking conversions
- message conversions
- referrer and source context

## Email workflows

Configured through Resend.

Implemented templates include:

- booking received
- booking confirmed
- booking declined
- booking cancelled
- owner booking notification
- owner contact notification

The sender can start with `onboarding@resend.dev` and later move to a custom domain without changing the service architecture.

## PDF and calendar support

- Booking confirmation PDF: `/api/admin/bookings/[id]/confirmation-pdf`
- ICS calendar file: `/api/bookings/[reference]/ics`

## Deployment on Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the environment variables from `.env.example`.
4. Deploy.

The project is designed for Vercel-compatible Next.js App Router deployment.

## Notes

- `proxy.ts` protects `/admin` routes while leaving `/api` and localized public routes unaffected.
- Public media uses remote image patterns plus local SVG fallbacks.
- The app is structured so the owner can operate bookings, pricing, availability, testimonials, and settings without editing code.

## Recommended production checklist

- Configure a real Supabase project
- Configure Resend and verify sender strategy
- Set strong admin credentials
- Review pricing and availability defaults
- Review experience descriptions and add-on catalog
- Review hero media URLs and fallbacks
- Add your final custom domain in Vercel
- Replace temporary sender email when your domain is ready

