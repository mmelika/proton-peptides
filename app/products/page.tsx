import type { Metadata } from 'next'
import { Suspense } from 'react'
import ProductsGrid from '@/components/ProductsGrid'

export const metadata: Metadata = {
  title: 'Browse Research Peptides',
  description: 'Shop our full catalog of research-grade peptides: BPC-157, GHK-Cu, Retatrutide, CJC-1295, GLP-1, and more. Third-party tested. Crypto payments accepted.',
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <ProductsGrid />
    </Suspense>
  )
}
