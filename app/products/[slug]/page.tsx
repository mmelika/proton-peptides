import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import products from '@/data/products.json'
import { Product } from '@/types'
import ProductDetailClient from '@/components/ProductDetailClient'

const allProducts = products as Product[]
const BASE_URL = 'https://www.protonpeptides.shop'

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const product = allProducts.find(p => p.slug === params.slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [`${BASE_URL}/products/${product.slug}.png`],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription,
      images: [`${BASE_URL}/products/${product.slug}.png`],
    },
  }
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = allProducts.find(p => p.slug === params.slug)
  if (!product) notFound()

  const price = product.variants[0].salePrice ?? product.variants[0].price

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: `${BASE_URL}/products/${product.slug}.png`,
    offers: {
      '@type': 'Offer',
      price: String(price),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product as Product} />
    </>
  )
}
