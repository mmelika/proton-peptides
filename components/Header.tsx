'use client'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export default function Header() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-brand-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-brand-dark tracking-tight">
          Proton<span className="text-brand-blue">Peptides</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-brand-dark">
          <Link href="/products" className="hover:text-brand-blue transition-colors">Products</Link>
          <Link href="/products?category=performance" className="hover:text-brand-blue transition-colors">Performance</Link>
          <Link href="/products?category=isolates" className="hover:text-brand-blue transition-colors">GLP Peptides</Link>
          <Link href="/products?category=skin" className="hover:text-brand-blue transition-colors">Skin</Link>
        </nav>

        <Link href="/cart" className="relative p-2 hover:text-brand-blue transition-colors">
          <ShoppingCart size={22} />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-blue text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
