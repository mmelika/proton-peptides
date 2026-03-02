import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DisclaimerModal from '@/components/DisclaimerModal'

const BASE_URL = 'https://www.protonpeptides.shop'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: '%s | Proton Peptides',
    default: 'Proton Peptides — Research Grade Peptides',
  },
  description: 'Premium research-grade peptides for laboratory use. Third-party tested. Crypto payments accepted. Buy BPC-157, GHK-Cu, Retatrutide, GLP-1, and more.',
  openGraph: {
    siteName: 'Proton Peptides',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <CartProvider>
          <DisclaimerModal />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
