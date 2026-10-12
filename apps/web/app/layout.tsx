import type { ReactNode } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'MediAlert Network (demo)',
  description: 'Hospital capacity and ambulance routing demo. Not for medical use.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0F172A', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
        <nav style={{ display: 'flex', gap: 20, padding: '14px 24px', background: '#020617', fontSize: 14 }}>
          <Link href="/" style={{ color: '#E2E8F0' }}>Dispatch dashboard</Link>
          <Link href="/ambulance" style={{ color: '#E2E8F0' }}>Ambulance app</Link>
          <span style={{ marginLeft: 'auto', color: '#F59E0B' }}>DEMO with fictional data. Not medical advice.</span>
        </nav>
        {children}
      </body>
    </html>
  );
}
