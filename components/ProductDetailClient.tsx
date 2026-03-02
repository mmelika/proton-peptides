'use client'
import { useState } from 'react'
import { ShoppingCart, FlaskConical } from 'lucide-react'
import ProductImage from '@/components/ProductImage'
import CertificateOfAnalysis from '@/components/CertificateOfAnalysis'
import { Product, ProductVariant } from '@/types'
import { useCart } from '@/contexts/CartContext'
import ReviewSection from '@/components/ReviewSection'

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0])
  const [added, setAdded] = useState(false)
  const [activePhoto, setActivePhoto] = useState<'product' | 'coa'>('product')
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
        {/* Gallery */}
        <div>
          {activePhoto === 'product'
            ? <div style={{ clipPath: 'inset(0 0 4% 0 round 1rem)' }}><ProductImage product={product} className="rounded-2xl h-96 w-full" contain /></div>
            : <CertificateOfAnalysis product={product} className="rounded-2xl h-72 w-full border border-brand-border" />
          }
          {/* Thumbnails */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setActivePhoto('product')}
              className={`flex-1 h-24 rounded-lg overflow-hidden border-2 transition-colors ${activePhoto === 'product' ? 'border-brand-blue' : 'border-brand-border hover:border-gray-300'}`}
            >
              <div style={{ clipPath: 'inset(0 0 4% 0)' }}>
                <ProductImage product={product} className="h-24 w-full" contain />
              </div>
            </button>
            <button
              onClick={() => setActivePhoto('coa')}
              className={`flex-1 h-14 rounded-lg overflow-hidden border-2 transition-colors ${activePhoto === 'coa' ? 'border-brand-blue' : 'border-brand-border hover:border-gray-300'}`}
            >
              <div className="h-full w-full bg-white flex items-center justify-center gap-1.5 border-b-2" style={{ borderColor: '#0057FF' }}>
                <span className="text-[10px] font-bold text-brand-blue tracking-wide">CoA</span>
                <span className="text-[8px] text-gray-400 font-medium">Certificate</span>
              </div>
            </button>
          </div>
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
