import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DisclaimerModal from '@/components/DisclaimerModal'

export const metadata: Metadata = {
  title: 'Proton Peptides — Research Grade Peptides',
  description: 'Premium research-grade peptides for laboratory use. Third-party tested. Crypto payments accepted.',
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
