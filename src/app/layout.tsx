import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/layout/providers';
import { siteConfig } from '@/lib/constants';
import { env } from '@/lib/env';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: siteConfig.name,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: '/en',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[var(--background)] font-[var(--font-body)] text-[var(--foreground)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
