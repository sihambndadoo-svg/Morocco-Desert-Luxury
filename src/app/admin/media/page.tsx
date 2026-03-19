export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { AdminShell } from '@/components/admin/admin-shell';
import { SimpleAdminForm } from '@/components/admin/simple-admin-form';
import { fetchMediaAssets } from '@/lib/services/media';

export default async function AdminMediaPage() {
  const media = await fetchMediaAssets();
  return (
    <AdminShell
      title="Media library"
      description="Use this page for homepage or section media. Experience card images can also be updated directly from Pricing for faster day-to-day work."
    >
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SimpleAdminForm
          endpoint="/api/admin/media"
          title="Upsert page media"
          description="Store a page-specific image or video with a fallback URL and localized alt text."
          defaultJson={JSON.stringify(
            {
              key: 'home-hero-video',
              media_type: 'video',
              url: 'https://videos.pexels.com/video-files/2055056/2055056-hd_1920_802_25fps.mp4',
              fallback_url: '/fallback-hero.svg',
              page_key: 'home',
              category: 'hero',
              alt: {
                en: 'Desert hero video',
                fr: 'Vidéo hero du désert',
                es: 'Video hero del desierto',
                ar: 'فيديو رئيسي للصحراء',
              },
              is_active: true,
              sort_order: 1,
            },
            null,
            2,
          )}
        />
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-[#15110d]">
          <h2 className="font-serif text-2xl text-stone-950 dark:text-white">Current media records</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {media.map((item: any) => (
              <div
                key={item.key}
                className="overflow-hidden rounded-[1.35rem] border border-black/5 bg-stone-50 text-sm dark:border-white/10 dark:bg-[#120f0c]"
              >
                <div className="aspect-[16/9] bg-stone-200 dark:bg-stone-900">
                  {item.media_type === 'video' ? (
                    <video src={item.url} className="h-full w-full object-cover" muted playsInline />
                  ) : (
                    <img src={item.url} alt={item.key} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="space-y-2 p-4">
                  <div className="font-semibold text-stone-900 dark:text-white">{item.key}</div>
                  <div className="text-stone-500 dark:text-stone-300">
                    {item.media_type} · {item.page_key} · active {String(item.is_active)}
                  </div>
                  <div className="break-all text-stone-600 dark:text-stone-300">{item.url}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
