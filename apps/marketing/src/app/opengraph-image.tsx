import { ImageResponse } from 'next/og';

export const alt = 'Sylpace: learn your courses and stay on track';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '82px', background: '#f6f8f4', color: '#15231b', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: 28, fontWeight: 700 }}>
        <span style={{ display: 'flex', width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', color: 'white', background: '#18a957' }}>s</span>
        Sylpace
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 58, fontSize: 76, lineHeight: 1.02, letterSpacing: -5, fontWeight: 800 }}>Learn your courses.<span style={{ color: '#08763b' }}>Stay on track.</span></div>
      <div style={{ marginTop: 30, fontSize: 24, color: '#53645a' }}>Courses · lessons · practice · progress</div>
    </div>,
    size,
  );
}
