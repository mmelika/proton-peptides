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
