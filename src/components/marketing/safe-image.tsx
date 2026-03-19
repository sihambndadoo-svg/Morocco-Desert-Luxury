'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface SafeImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  fallbackSrc?: string;
  alt: string;
}

export function SafeImage({ src, fallbackSrc = '/fallback-dunes.svg', alt, ...props }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => setCurrentSrc(fallbackSrc)}
    />
  );
}
