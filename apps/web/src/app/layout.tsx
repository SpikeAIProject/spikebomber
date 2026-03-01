import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'SPIKE AI - Enterprise AI Platform',
    template: '%s | SPIKE AI',
  },
  description:
    'SPIKE AI is an enterprise-grade AI platform powered by Google Vertex AI and Gemini. Build, deploy, and scale AI applications with ease.',
  keywords: ['AI', 'Gemini', 'Vertex AI', 'enterprise', 'SaaS', 'API'],
  authors: [{ name: 'SPIKE AI Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://spikeai.io',
    siteName: 'SPIKE AI',
    title: 'SPIKE AI - Enterprise AI Platform',
    description: 'Enterprise-grade AI platform powered by Google Vertex AI and Gemini',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SPIKE AI',
    description: 'Enterprise AI Platform powered by Google Vertex AI and Gemini',
  },
  themeColor: '#0A0A0F',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} font-sans bg-background text-text-primary antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
