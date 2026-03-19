import Link from 'next/link';
import { ReactNode } from 'react';
import { Activity, CalendarDays, Camera, CreditCard, FileText, LayoutDashboard, Mail, Package2, Settings2, Star, WalletCards } from 'lucide-react';
import { Logo } from '@/components/layout/logo';

const items = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: Package2 },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/analytics', label: 'Analytics', icon: Activity },
  { href: '/admin/availability', label: 'Availability', icon: CalendarDays },
  { href: '/admin/pricing', label: 'Pricing', icon: WalletCards },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/testimonials', label: 'Reviews', icon: Star },
  { href: '/admin/media', label: 'Media', icon: Camera },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings2 },
];

export function AdminShell({ children, title, description }: { children: ReactNode; title: string; description?: string }) {
  return (
    <div className="min-h-screen bg-[#f7f2ea] text-stone-900 dark:bg-[#0d0a08] dark:text-white">
      <div className="mx-auto grid min-h-screen max-w-[1700px] lg:grid-cols-[300px_1fr]">
        <aside className="border-r border-black/5 bg-white/85 p-6 backdrop-blur dark:border-white/10 dark:bg-[#14100c]/92">
          <div className="sticky top-6 flex max-h-[calc(100vh-3rem)] flex-col gap-6 overflow-y-auto pr-1">
            <Logo href={'/admin' as any} />
            <div className="rounded-[1.5rem] border border-black/5 bg-stone-50/80 p-4 dark:border-white/10 dark:bg-[#1a1511]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700 dark:text-amber-300">Control center</p>
              <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">
                Pricing, availability, messages, visuals, and public visibility all stay in one place.
              </p>
            </div>
            <div className="grid gap-2">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href as any}
                    className="inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:text-stone-100 dark:hover:bg-white/5"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <form action="/api/admin/logout" method="post" className="pt-2">
              <button className="w-full rounded-full border border-black/10 px-4 py-3 text-sm font-semibold transition hover:border-black/30 dark:border-white/10 dark:hover:border-white/30">
                Log out
              </button>
            </form>
          </div>
        </aside>
        <main className="space-y-8 px-4 py-8 md:px-8 lg:px-10">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700 dark:text-amber-300">Owner dashboard</p>
            <h1 className="font-serif text-4xl leading-tight text-stone-950 dark:text-white">{title}</h1>
            {description ? <p className="max-w-3xl text-sm leading-7 text-stone-600 dark:text-stone-300">{description}</p> : null}
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
