import Link from 'next/link'
import { Product } from '@/types'
import ProductImage from '@/components/ProductImage'

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
      <ProductImage product={product} className="h-64 rounded-t-xl" />

      <div className="px-4 pt-2 pb-4">
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
