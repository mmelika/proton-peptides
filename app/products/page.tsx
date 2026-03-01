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
