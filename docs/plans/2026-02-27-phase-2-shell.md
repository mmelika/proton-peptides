# Phase 2: Layout Shell

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Build the persistent site shell — Header, Footer, root layout with CartProvider, and the first-visit DisclaimerModal.

**Prereq:** Phase 1 complete (types, CartContext, Tailwind tokens available).

**Design tokens:** blue `#0057FF`, dark `#1A1A2E`, gray bg `#F8F9FA`. Font: Inter.

---

### Task 1: Header

**Files:**
- Create: `components/Header.tsx`

**Step 1: Create the component**

```tsx
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
```

**Step 2: Verify no TypeScript errors**

```bash
npx tsc --noEmit
```
Expected: no errors.

**Step 3: Commit**

```bash
git add components/Header.tsx
git commit -m "feat: Header with nav and cart badge"
```

---

### Task 2: Footer

**Files:**
- Create: `components/Footer.tsx`

**Step 1: Create the component**

```tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="text-xl font-bold mb-3">
              Proton<span className="text-brand-blue">Peptides</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium research-grade peptides for laboratory use.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-300">Catalog</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/products?category=performance" className="hover:text-white transition-colors">Performance & Recovery</Link></li>
              <li><Link href="/products?category=skin" className="hover:text-white transition-colors">Skin Research</Link></li>
              <li><Link href="/products?category=solutions" className="hover:text-white transition-colors">Solutions</Link></li>
              <li><Link href="/products?category=isolates" className="hover:text-white transition-colors">Freeze Dried Isolates</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-300">Trust</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>3rd Party Tested</li>
              <li>Crypto Payments Only</li>
              <li>Fast US Shipping</li>
              <li>Research Use Only</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-xs text-gray-500 leading-relaxed max-w-3xl">
            <strong className="text-gray-300">Research Use Only.</strong> All products sold by Proton Peptides are intended
            for laboratory research purposes only. Not for human or veterinary use, consumption, or clinical application.
            By purchasing, you confirm you are a qualified researcher and will use products in accordance with applicable laws.
          </p>
          <p className="text-xs text-gray-600 mt-3">
            © {new Date().getFullYear()} Proton Peptides. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

**Step 2: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: Footer with links and research disclaimer"
```

---

### Task 3: Research Disclaimer Modal

**Files:**
- Create: `components/DisclaimerModal.tsx`

**Step 1: Create the component**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { FlaskConical } from 'lucide-react'

const STORAGE_KEY = 'proton_disclaimer_accepted'

export default function DisclaimerModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <FlaskConical className="text-brand-blue" size={28} />
          <h2 className="text-lg font-bold text-brand-dark">Research Use Only</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          All products on this site are intended <strong>strictly for laboratory research purposes</strong>.
          They are not approved for human or veterinary use, consumption, or clinical application.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          By entering, you confirm that you are a qualified researcher aged 18+ and will use these
          products in compliance with all applicable local, state, and federal laws.
        </p>
        <div className="flex gap-3">
          <button
            onClick={accept}
            className="flex-1 bg-brand-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            I Understand & Agree
          </button>
          <a
            href="https://google.com"
            className="flex-1 bg-brand-gray text-brand-dark py-3 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors"
          >
            Exit Site
          </a>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add components/DisclaimerModal.tsx
git commit -m "feat: first-visit research disclaimer modal"
```

---

### Task 4: Root Layout

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Replace app/layout.tsx**

```tsx
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
```

**Step 2: Start dev server and verify**

```bash
npm run dev
```

Navigate to http://localhost:3000. Expected:
- Disclaimer modal appears on first visit
- Header with logo and cart icon renders
- Footer renders at bottom
- No console errors

**Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: root layout with CartProvider, Header, Footer, DisclaimerModal"
```

---

**Phase 2 complete.** Next: run Phase 3 (`2026-02-27-phase-3-pages.md`) in a fresh session.
