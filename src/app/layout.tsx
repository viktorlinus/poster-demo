import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from '@/components/GoogleAnalytics';
import MetaPixel from '@/components/MetaPixel';
import Analytics from '@/components/Analytics';
import CookieConsent from '@/components/CookieConsent';
import TranslationErrorBoundary from '@/components/TranslationErrorBoundary';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'PetMemories - Förvandla ditt husdjur till konstposter',
  description: 'Avancerad AI förvandlar dina älskade husdjursfoton till unika, professionella konstposter. Perfect som present eller minnessak.',
  keywords: ['husdjur', 'AI', 'konstposter', 'poster', 'porträtt', 'hund', 'katt', 'akvarell', 'minnessak'],
  authors: [{ name: 'PetMemories' }],
  creator: 'PetMemories',
  publisher: 'PetMemories',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://petmemories.se'),
  openGraph: {
    title: 'PetMemories - Förvandla ditt husdjur till konstposter',
    description: 'Avancerad AI förvandlar dina älskade husdjursfoton till unika, professionella konstposter.',
    images: [
      {
        url: '/logo-pets.png',
        width: 1024,
        height: 1024,
        alt: 'PetMemories - AI husdjursporträtt',
      }
    ],
    url: '/',
    siteName: 'PetMemories',
    type: 'website',
    locale: 'sv_SE',
  },
  twitter: {
    card: 'summary',
    title: 'PetMemories - Förvandla ditt husdjur till konstposter',
    description: 'Avancerad AI förvandlar dina älskade husdjursfoton till unika, professionella konstposter.',
    images: ['/logo-pets.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        url: '/favicon.ico',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <head>
        {/* Enkla lösning: Bara tillåt light mode */}
        <meta name="color-scheme" content="only light" />
        {/* Behåll meta tags för att hjälpa översättare att förstå språk */}
      </head>
      <body className="antialiased font-sans">
        <TranslationErrorBoundary>
          {/* TA BORT translate="no" härifrån - låt text översättas */}
          <GoogleAnalytics />
          <MetaPixel />
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
          {children}
          <CookieConsent />
        </TranslationErrorBoundary>
      </body>
    </html>
  );
}
