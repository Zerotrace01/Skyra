import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SKYRA | Everyday Luxury Under ₹500',
  description: 'Discover premium women\'s accessories at affordable prices. Shop necklaces, bracelets, earrings, and more. Luxury look, affordable pricing.',
  keywords: ['women accessories', 'jewelry', 'necklaces', 'earrings', 'bracelets', 'affordable luxury', 'India'],
  openGraph: {
    title: 'SKYRA | Everyday Luxury Under ₹500',
    description: 'Discover premium women\'s accessories at affordable prices.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'SKYRA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SKYRA | Everyday Luxury Under ₹500',
    description: 'Discover premium women\'s accessories at affordable prices.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
