export type Locale = 'en' | 'fr' | 'es' | 'ar';

export type LocalizedString = Record<Locale, string>;

export type ExperienceCategory =
  | 'camp'
  | 'camel'
  | 'quad'
  | 'fourByFour'
  | 'transfer'
  | 'multiDay'
  | 'romantic'
  | 'family'
  | 'photography';

export type AvailabilityStatus =
  | 'available'
  | 'limited'
  | 'fully_booked'
  | 'blocked'
  | 'maintenance'
  | 'private_use';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'declined'
  | 'cancelled'
  | 'completed';

export type PaymentStatus =
  | 'payment_pending'
  | 'deposit_requested'
  | 'deposit_paid'
  | 'fully_paid'
  | 'refunded';

export type PaymentMethod =
  | 'confirm_first'
  | 'pay_on_arrival'
  | 'bank_transfer'
  | 'paypal_placeholder'
  | 'stripe_placeholder'
  | 'cmi_placeholder';

export interface PaymentMethodSetting {
  key: PaymentMethod;
  enabled: boolean;
  publicLabel: string;
  description: string;
  accountLabel: string;
  accountValue: string;
  paymentUrl: string;
  instructions: string;
}

export interface PaymentSettings {
  onlinePaymentEnabled: boolean;
  currency: string;
  payoutNotice: string;
  methods: PaymentMethodSetting[];
}

export interface AddOn {
  key: string;
  label: LocalizedString;
  description: LocalizedString;
  price: number;
  perGuest?: boolean;
  category?: 'dining' | 'transport' | 'romance' | 'adventure' | 'comfort';
}

export interface MediaAssetRef {
  url: string;
  fallbackUrl?: string;
  alt: LocalizedString;
  type: 'image' | 'video';
  source?: string;
  posterUrl?: string;
}

export interface ExperienceContent {
  title: LocalizedString;
  shortDescription: LocalizedString;
  longDescription: LocalizedString;
  idealFor: LocalizedString;
  meetingPoint: LocalizedString;
  included: LocalizedString[];
  exclusions: LocalizedString[];
  highlights: LocalizedString[];
  departureContext?: LocalizedString;
  seoTitle?: LocalizedString;
  seoDescription?: LocalizedString;
}

export interface ExperienceMeta {
  showOnHome?: boolean;
  showOnBookingPrimary?: boolean;
  showOnBookingExtras?: boolean;
  shortListRank?: number;
  adminBadge?: string | null;
  cardLabel?: string | null;
}

export interface Experience {
  slug: string;
  category: ExperienceCategory;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  durationLabel: string;
  durationDays: number;
  startingPrice: number;
  baseAdultPrice: number;
  baseChildPrice: number;
  privateSurcharge: number;
  transferPrice: number;
  capacityDefault: number;
  unitCapacityDefault: number;
  showOnHome?: boolean;
  showOnBookingPrimary?: boolean;
  showOnBookingExtras?: boolean;
  shortListRank?: number;
  adminBadge?: string | null;
  cardLabel?: string | null;
  heroMedia: MediaAssetRef;
  gallery: MediaAssetRef[];
  addOns: AddOn[];
  content: ExperienceContent;
}

export interface BookingLineItem {
  slug: string;
  name: string;
  price: number;
  quantity?: number;
  type: 'primary' | 'service' | 'addon' | 'transfer' | 'private';
}

export interface BookingRequestInput {
  full_name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  country: string;
  preferred_language: Locale;
  preferred_contact_method: 'email' | 'whatsapp' | 'phone';
  experience_slug: string;
  experience_name: string;
  selected_services: BookingLineItem[];
  check_in_date?: string;
  check_out_date?: string;
  preferred_date?: string;
  adults: number;
  children: number;
  guest_count: number;
  add_ons: BookingLineItem[];
  special_requests?: string;
  estimated_total: number;
  currency: 'EUR';
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  source?: string;
  medium?: string;
  campaign?: string;
  referrer?: string;
  owner_notes?: string;
  session_token?: string;
  private_option?: boolean;
}

export interface ContactMessageInput {
  full_name: string;
  email: string;
  phone_or_whatsapp?: string;
  subject: string;
  message: string;
  preferred_language: Locale;
  session_token?: string;
}

export interface PricingRule {
  id?: string;
  experience_slug: string;
  rule_name: string;
  rule_type: 'date_range' | 'specific_date' | 'weekday' | 'seasonal' | 'holiday' | 'promotion' | 'weekend';
  start_date?: string | null;
  end_date?: string | null;
  specific_date?: string | null;
  weekday?: number | null;
  amount_mode: 'replace' | 'surcharge' | 'discount';
  adult_amount: number;
  child_amount?: number | null;
  private_surcharge?: number | null;
  transfer_amount?: number | null;
  currency: 'EUR';
  is_active: boolean;
  priority: number;
  notes?: string | null;
}

export interface AvailabilityRecord {
  id?: string;
  experience_slug: string;
  date: string;
  status: AvailabilityStatus;
  guest_capacity?: number | null;
  remaining_capacity?: number | null;
  unit_capacity?: number | null;
  units_remaining?: number | null;
  waitlist_enabled?: boolean;
  notes?: string | null;
}

export interface AvailabilityCalendarDay extends AvailabilityRecord {
  booked_count: number;
  effective_remaining_capacity?: number | null;
  display_status: AvailabilityStatus;
}

export interface Testimonial {
  id?: string;
  full_name: string;
  country: string;
  experience_slug?: string | null;
  rating: number;
  quote: LocalizedString;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
}

export interface GuideArticle {
  slug: string;
  cover: MediaAssetRef;
  title: LocalizedString;
  summary: LocalizedString;
  content: LocalizedString[];
  readTime: string;
  publishedAt: string;
}

export interface SiteCopy {
  brandName: string;
  tagline: LocalizedString;
  nav: Record<string, LocalizedString>;
  footerNote: LocalizedString;
  responsePromise: LocalizedString;
  trustPoints: LocalizedString[];
  faqIntro: LocalizedString;
  whyChooseUs: {
    title: LocalizedString;
    items: Array<{ title: LocalizedString; description: LocalizedString }>;
  };
  bookingSteps: Array<{ title: LocalizedString; description: LocalizedString }>;
  homeHero: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    description: LocalizedString;
    primaryCta: LocalizedString;
    secondaryCta: LocalizedString;
  };
  contactIntro: LocalizedString;
  policySummary: LocalizedString;
  arrivalIntro: LocalizedString;
  galleryIntro: LocalizedString;
  journalIntro: LocalizedString;
  reviewsIntro: LocalizedString;
}

export interface DashboardOverview {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  estimatedRevenue: number;
  messageCount: number;
  sessionCount: number;
  bookingConversions: number;
  messageConversions: number;
  arrivalsToday: number;
  arrivalsTomorrow: number;
  paymentFollowUps: number;
  transfersScheduled: number;
  topSources: Array<{ source: string; count: number }>;
  recentMessages: Array<Record<string, unknown>>;
  recentBookings: Array<Record<string, unknown>>;
  recentActivity: Array<Record<string, unknown>>;
}
