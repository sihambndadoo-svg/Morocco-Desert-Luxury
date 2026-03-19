import { ImageResponse } from 'next/og';

export const size = {
  width: 64,
  height: 64,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fffdf9 0%, #f2dfbf 100%)',
          borderRadius: 16,
        }}
      >
        <svg width="42" height="42" viewBox="0 0 64 64" fill="none">
          <circle cx="42" cy="18" r="7" fill="#EACB8A" />
          <path d="M10 40C18 30 28 27 39 30C45 31 50 34 54 39" stroke="#1d1d1b" strokeWidth="3" strokeLinecap="round" />
          <path d="M8 48C18 41 30 40 42 43C47 44 52 46 56 49" stroke="#b37a2c" strokeWidth="3" strokeLinecap="round" />
          <path d="M20 27L24 22L28 27" stroke="#1d1d1b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 28H29" stroke="#1d1d1b" strokeWidth="3" strokeLinecap="round" />
          <path d="M24 22V35" stroke="#1d1d1b" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size
  );
}
