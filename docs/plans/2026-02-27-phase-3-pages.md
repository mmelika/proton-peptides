# Phase 3: Public Pages

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Build the three public-facing pages: Homepage, Products catalog with category filter, and Product detail page.

**Prereq:** Phase 2 complete (shell, layout, CartContext available).

---

### Task 1: ProductCard Component

**Files:**
- Create: `components/ProductCard.tsx`

**Step 1: Create the component**

```tsx
import Link from 'next/link'
import { Product } from '@/types'

interface Props {
  product: Product
}

function resolvedPrice(product: Product) {
  const v = product.variants[0]
  return v.salePrice ?? v.price
}

function originalPrice(product: Product) {
  return product.variants[0].price
}

function hasDiscount(product: Product) {
  return !!product.variants[0].salePrice
}

export default function ProductCard({ product }: Props) {
  const price = resolvedPrice(product)
  const original = originalPrice(product)
  const onSale = hasDiscount(product)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-xl border border-brand-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image placeholder */}
      <div className="h-44 bg-brand-gray rounded-t-xl flex items-center justify-center">
        <span className="text-2xl font-bold text-brand-blue/30 text-center px-4">
          {product.name}
        </span>
      </div>

      <div className="p-4">
        {/* Category badge */}
        <span className="inline-block text-xs font-medium text-brand-blue bg-blue-50 px-2 py-0.5 rounded-full mb-2">
          {product.categoryLabel}
        </span>

        <h3 className="font-semibold text-brand-dark group-hover:text-brand-blue transition-colors text-sm leading-snug mb-1">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          {product.shortDescription}
        </p>

        <div className="flex items-center gap-2">
          <span className="font-bold text-brand-dark">${price}</span>
          {onSale && (
            <span className="text-xs text-gray-400 line-through">${original}</span>
          )}
          {onSale && (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Sale</span>
          )}
        </div>

        {product.variants.length > 1 && (
          <p className="text-xs text-gray-400 mt-1">{product.variants.length} sizes available</p>
        )}
      </div>
    </Link>
  )
}
```

**Step 2: Commit**

```bash
git add components/ProductCard.tsx
git commit -m "feat: ProductCard component"
```

---

### Task 2: TrustBadges Component

**Files:**
- Create: `components/TrustBadges.tsx`

**Step 1: Create the component**

```tsx
import { ShieldCheck, Bitcoin, Truck, Headphones } from 'lucide-react'

const badges = [
  { icon: ShieldCheck, label: '3rd Party Tested', sub: 'Independent CoA on every batch' },
  { icon: Bitcoin, label: 'Crypto Payments', sub: 'Secure, private checkout' },
  { icon: Truck, label: 'Fast Shipping', sub: 'US orders ship same day' },
  { icon: Headphones, label: 'Research Support', sub: 'Expert team available' },
]

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map(({ icon: Icon, label, sub }) => (
        <div key={label} className="flex flex-col items-center text-center p-4 bg-brand-gray rounded-xl">
          <Icon className="text-brand-blue mb-2" size={24} />
          <span className="text-sm font-semibold text-brand-dark">{label}</span>
          <span className="text-xs text-gray-500 mt-0.5">{sub}</span>
        </div>
      ))}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add components/TrustBadges.tsx
git commit -m "feat: TrustBadges component"
```

---

### Task 3: Homepage

**Files:**
- Modify: `app/page.tsx`

The homepage has: hero section, trust badges, featured products, category nav cards.

**Step 1: Load products and replace app/page.tsx**

```tsx
import Link from 'next/link'
import { ArrowRight, FlaskConical } from 'lucide-react'
import products from '@/data/products.json'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import TrustBadges from '@/components/TrustBadges'

const allProducts = products as Product[]
const featured = allProducts.filter(p => p.featured)

const categories = [
  { key: 'performance', label: 'Performance & Recovery', desc: 'BPC-157, TB-500, GLP peptides, and more' },
  { key: 'isolates', label: 'GLP Peptides', desc: 'GLP1, GLP2, GLP3 — freeze-dried isolates' },
  { key: 'skin', label: 'Skin Research', desc: 'GHK-Cu, Melanotan, GLOW Blend' },
  { key: 'solutions', label: 'Solutions', desc: 'L-Carnitine, Bacteriostatic Water, ShredX' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-sm px-4 py-1.5 rounded-full mb-6">
            <FlaskConical size={14} />
            <span>For Research Purposes Only</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Research-Grade<br />
            <span className="text-brand-blue">Peptides</span> Delivered.
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            Third-party tested, lab-certified compounds for qualified researchers.
            Crypto-only. Ships same day.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/products"
              className="bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              Browse Catalog <ArrowRight size={16} />
            </Link>
            <Link
              href="/products?category=isolates"
              className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
            >
              GLP Peptides
            </Link>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <TrustBadges />
      </section>

      {/* Featured products */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-brand-dark">Featured Products</h2>
          <Link href="/products" className="text-brand-blue text-sm font-medium hover:underline inline-flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Category nav */}
      <section className="bg-brand-gray py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-dark mb-6">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.key}
                href={`/products?category=${cat.key}`}
                className="bg-white rounded-xl p-5 border border-brand-border hover:border-brand-blue hover:shadow-md transition-all group"
              >
                <h3 className="font-semibold text-brand-dark group-hover:text-brand-blue transition-colors mb-1">
                  {cat.label}
                </h3>
                <p className="text-xs text-gray-500">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

**Step 2: Verify page renders**

Open http://localhost:3000. Expected: hero, trust badges, featured products, category cards.

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: homepage with hero, trust badges, featured products, and category nav"
```

---

### Task 4: Products Catalog Page

**Files:**
- Create: `app/products/page.tsx`

Category filter is driven by the `?category=` query param. Filtering is client-side.

**Step 1: Create app/products/page.tsx**

```tsx
'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import products from '@/data/products.json'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

const allProducts = products as Product[]

const categoryFilters = [
  { key: '', label: 'All Products' },
  { key: 'performance', label: 'Performance & Recovery' },
  { key: 'isolates', label: 'GLP Peptides' },
  { key: 'skin', label: 'Skin Research' },
  { key: 'solutions', label: 'Solutions' },
]

function ProductsGrid() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || ''
  const filtered = category
    ? allProducts.filter(p => p.category === category)
    : allProducts

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Research Compounds</h1>

      <div className="flex gap-3 flex-wrap mb-8">
        {categoryFilters.map(f => (
          <Link
            key={f.key}
            href={f.key ? `/products?category=${f.key}` : '/products'}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              category === f.key
                ? 'bg-brand-blue text-white border-brand-blue'
                : 'bg-white text-brand-dark border-brand-border hover:border-brand-blue hover:text-brand-blue'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No products in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <ProductsGrid />
    </Suspense>
  )
}
```

**Step 2: Verify catalog works**

Navigate to http://localhost:3000/products and http://localhost:3000/products?category=isolates. Expected: grid filters correctly.

**Step 3: Commit**

```bash
git add app/products/page.tsx
git commit -m "feat: products catalog page with category filter"
```

---

### Task 5: Product Detail Page

**Files:**
- Create: `components/ReviewSection.tsx`
- Create: `app/products/[slug]/page.tsx`

**Step 1: Create components/ReviewSection.tsx**

```tsx
import { Star } from 'lucide-react'
import { Review } from '@/types'

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={14} className={n <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  )
}

export default function ReviewSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-brand-dark">Reviews</h2>
        <div className="flex items-center gap-1">
          <StarRow rating={Math.round(avg)} />
          <span className="text-sm text-gray-500">({reviews.length})</span>
        </div>
      </div>
      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="bg-brand-gray rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-brand-dark">{r.author}</span>
                <StarRow rating={r.rating} />
              </div>
              <span className="text-xs text-gray-400">{r.date}</span>
            </div>
            <p className="text-sm text-gray-600">{r.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Create app/products/[slug]/page.tsx**

```tsx
'use client'
import { notFound } from 'next/navigation'
import { useState } from 'react'
import { ShoppingCart, FlaskConical } from 'lucide-react'
import products from '@/data/products.json'
import { Product, ProductVariant } from '@/types'
import { useCart } from '@/contexts/CartContext'
import ReviewSection from '@/components/ReviewSection'

const allProducts = products as Product[]

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = allProducts.find(p => p.slug === params.slug)
  if (!product) notFound()

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0])
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const price = selectedVariant.salePrice ?? selectedVariant.price
  const onSale = !!selectedVariant.salePrice

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      variantLabel: selectedVariant.label,
      variantSku: selectedVariant.sku,
      price,
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Image placeholder */}
        <div className="bg-brand-gray rounded-2xl h-72 flex items-center justify-center">
          <span className="text-3xl font-bold text-brand-blue/30 text-center px-6">{product.name}</span>
        </div>

        {/* Info */}
        <div>
          <span className="inline-block text-xs font-medium text-brand-blue bg-blue-50 px-2 py-0.5 rounded-full mb-3">
            {product.categoryLabel}
          </span>
          <h1 className="text-2xl font-bold text-brand-dark mb-2">{product.name}</h1>
          <p className="text-gray-600 text-sm mb-4">{product.shortDescription}</p>

          {/* Price */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl font-bold text-brand-dark">${price}</span>
            {onSale && <span className="text-lg text-gray-400 line-through">${selectedVariant.price}</span>}
            {onSale && <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">On Sale</span>}
          </div>

          {/* Variant selector */}
          {product.variants.length > 1 && (
            <div className="mb-5">
              <p className="text-sm font-medium text-brand-dark mb-2">Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map(v => (
                  <button
                    key={v.sku}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedVariant.sku === v.sku
                        ? 'bg-brand-blue text-white border-brand-blue'
                        : 'bg-white text-brand-dark border-brand-border hover:border-brand-blue'
                    }`}
                  >
                    {v.label} — ${v.salePrice ?? v.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-brand-blue text-white hover:bg-blue-700'
            }`}
          >
            <ShoppingCart size={18} />
            {added ? 'Added to Cart!' : 'Add to Cart'}
          </button>

          {/* Research notice */}
          <div className="mt-4 flex items-start gap-2 p-3 bg-brand-gray rounded-lg">
            <FlaskConical size={16} className="text-brand-blue mt-0.5 shrink-0" />
            <p className="text-xs text-gray-500">{product.dosageInfo}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-brand-dark mb-3">About This Compound</h2>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      <ReviewSection reviews={product.reviews} />
    </div>
  )
}
```

**Step 3: Verify product detail page**

Navigate to http://localhost:3000/products/bpc-157. Expected: product info, variant selector (if applicable), add to cart button, reviews.

**Step 4: Commit**

```bash
git add components/ReviewSection.tsx app/products/[slug]/page.tsx
git commit -m "feat: product detail page with variant selector, add-to-cart, and reviews"
```

---

**Phase 3 complete.** Next: run Phase 4 (`2026-02-27-phase-4-cart-checkout.md`) in a fresh session.
