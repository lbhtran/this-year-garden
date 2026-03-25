import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import '../src/index.css';
import { ClerkAuthBridge } from '../src/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'My Garden Plan',
  description: 'First Season 2026 · Planters · Raised Beds · Pots · Trees',
  icons: { icon: '/favicon.svg' },
};

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {clerkEnabled ? (
          <ClerkProvider>
            <ClerkAuthBridge>
              {children}
            </ClerkAuthBridge>
          </ClerkProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
