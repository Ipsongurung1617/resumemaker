import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import SessionWrapper from '@/components/providers/SessionWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ResuMind AI — Free Resume Maker Online | AI Resume Builder',
  description:
    'ResuMind AI is the best free resume maker online. Build ATS-friendly resumes with our AI resume builder in minutes. Try our online resume maker free — no credit card required.',
  keywords:
    'free resume maker online, online resume maker free, free resume, AI resume builder, resume maker online, free resume maker, resume builder free, ATS friendly resume, resume maker free online, free online resume maker, how to make resume for first job, resume format for freshers',
  metadataBase: new URL('https://resumindai.com'),
  alternates: {
    canonical: 'https://resumindai.com',
  },
  openGraph: {
    title: 'ResuMind AI — Free AI Resume Builder',
    description:
      'Build ATS-optimized resumes in minutes with AI. Free resume maker online — no credit card required.',
    url: 'https://resumindai.com',
    siteName: 'ResuMind AI',
    images: [
      {
        url: 'https://resumindai.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ResuMind AI — Free Online Resume Maker',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResuMind AI — Free AI Resume Builder',
    description:
      'Build ATS-optimized resumes in minutes with AI. Free to start.',
    images: ['https://resumindai.com/og-image.png'],
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
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ResuMind AI',
  url: 'https://resumindai.com',
  description:
    'AI-powered free resume maker online. Build ATS-friendly resumes in minutes.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: [
    {
      '@type': 'Offer',
      name: 'Free Plan',
      price: '0',
      priceCurrency: 'USD',
    },
    {
      '@type': 'Offer',
      name: 'Pro Plan',
      price: '9',
      priceCurrency: 'USD',
      billingDuration: 'P1M',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <SessionWrapper>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                background: '#0F172A',
                color: '#F8FAFC',
                fontWeight: 500,
              },
              success: {
                iconTheme: { primary: '#2563EB', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#fff' },
              },
            }}
          />
        </SessionWrapper>
      </body>
    </html>
  );
}
