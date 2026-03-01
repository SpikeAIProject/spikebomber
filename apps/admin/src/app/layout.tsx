import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AdminProviders } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'SPIKE AI Admin', template: '%s | SPIKE AI Admin' },
  description: 'SPIKE AI Administration Panel',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-text-primary antialiased`}>
        <AdminProviders>{children}</AdminProviders>
      </body>
    </html>
  );
}
