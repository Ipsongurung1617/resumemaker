import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import SessionWrapper from '@/components/providers/SessionWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ATSResumeBuilder — Free Resume Maker Online | AI Resume Builder',
  description:
    'ATSResumeBuilder is the best free resume maker online. Build ATS-friendly resumes with our AI resume builder in minutes. Try our online resume maker free — no credit card required.',
  keywords:
    'free resume maker online, online resume maker free, free resume, AI resume builder, resume maker online, free resume maker, resume builder free, ATS friendly resume, resume maker free online, free online resume maker, how to make resume for first job, resume format for freshers',
  metadataBase: new URL('https://atsresumebuilder.vercel.app'),
  alternates: {
    canonical: 'https://atsresumebuilder.vercel.app',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'ATSResumeBuilder — Free AI Resume Builder',
    description:
      'Build ATS-optimized resumes in minutes with AI. Free resume maker online — no credit card required.',
    url: 'https://atsresumebuilder.vercel.app',
    siteName: 'ATSResumeBuilder',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATSResumeBuilder — Free AI Resume Builder',
    description: 'Build ATS-optimized resumes in minutes with AI. Free to start.',
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
  name: 'ATSResumeBuilder',
  url: 'https://atsresumebuilder.vercel.app',
  description: 'AI-powered free resume maker online. Build ATS-friendly resumes in minutes.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: [
    { '@type': 'Offer', name: 'Free Plan', price: '0', priceCurrency: 'USD' },
    { '@type': 'Offer', name: 'Pro Plan', price: '9', priceCurrency: 'USD', billingDuration: 'P1M' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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
                background: '#1A1A16',
                color: '#FDFCF9',
                fontWeight: 500,
                fontSize: '14px',
                boxShadow: '0 4px 16px rgba(26,26,22,0.18)',
              },
              success: {
                iconTheme: { primary: '#2F5D3A', secondary: '#FDFCF9' },
              },
              error: {
                iconTheme: { primary: '#C0392B', secondary: '#FDFCF9' },
              },
            }}
          />
        </SessionWrapper>
      </body>
    </html>
  );
}
