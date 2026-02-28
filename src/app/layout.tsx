import React from 'react';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Navigation } from '@/components/Navigation';
import '@/globals.css';

export const metadata: Metadata = {
  title: 'ReAlign AI - Bridging Design Assumptions with Site Reality',
  description: 'AI-Driven system for reconciling design assumptions with on-site construction reality',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
