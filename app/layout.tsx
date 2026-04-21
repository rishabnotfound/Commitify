import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Commitify - Shape Your GitHub Contribution Graph',
  description: 'Design and customize your GitHub contribution graph with precision. Click dates, generate backdated commits, and transform your GitHub profile instantly.',
  keywords: ['GitHub', 'contribution graph', 'commits', 'developer tools', 'GitHub profile', 'git history', 'contribution calendar'],
  authors: [{ name: 'Commitify' }],
  creator: 'Commitify',
  publisher: 'Commitify',
  metadataBase: new URL('https://commitify.site'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://commitify.site',
    siteName: 'Commitify',
    title: 'Commitify - Shape Your GitHub Contribution Graph',
    description: 'Design and customize your GitHub contribution graph with precision. Click dates, generate backdated commits, and transform your GitHub profile instantly.',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'Commitify - GitHub Contribution Graph Editor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commitify - Shape Your GitHub Contribution Graph',
    description: 'Design and customize your GitHub contribution graph with precision.',
    images: ['/banner.png'],
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}
