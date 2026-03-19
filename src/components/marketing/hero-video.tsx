'use client';

import { useState } from 'react';
import { SafeImage } from '@/components/marketing/safe-image';
import { MediaAssetRef } from '@/types';

export function HeroVideo({ media }: { media: MediaAssetRef }) {
  const [videoFailed, setVideoFailed] = useState(false);
  if (videoFailed) {
    return (
      <div className="absolute inset-0">
        <SafeImage
          src={media.posterUrl ?? media.fallbackUrl ?? '/fallback-hero.svg'}
          fallbackSrc={media.fallbackUrl ?? '/fallback-hero.svg'}
          alt={media.alt.en}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
    );
  }
  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      poster={media.posterUrl ?? media.fallbackUrl}
      onError={() => setVideoFailed(true)}
    >
      <source src={media.url} type="video/mp4" />
    </video>
  );
}
