import { SafeImage } from '@/components/marketing/safe-image';

export function GalleryGrid({
  items,
}: {
  items: Array<{ url: string; fallbackUrl?: string; alt: string }>;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((item, index) => (
        <div key={`${item.url}-${index}`} className={`relative overflow-hidden rounded-[1.5rem] ${index % 5 === 0 ? 'md:col-span-2' : ''}`}>
          <div className="relative aspect-[4/5]">
            <SafeImage
              src={item.url}
              fallbackSrc={item.fallbackUrl}
              alt={item.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
