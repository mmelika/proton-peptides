export interface Review {
  id: string
  author: string
  rating: 1 | 2 | 3 | 4 | 5
  date: string
  content: string
}

export interface ProductVariant {
  label: string      // e.g. "10mg", "30mg", "600mg"
  price: number
  salePrice?: number | null
  sku: string
}

export interface Product {
  id: string
  slug: string
  name: string
  category: 'performance' | 'skin' | 'solutions' | 'isolates'
  categoryLabel: string
  shortDescription: string
  description: string
  dosageInfo: string
  variants: ProductVariant[]
  reviews: Review[]
  featured?: boolean
}

export interface CartItem {
  productId: string
  productSlug: string
  productName: string
  variantLabel: string
  variantSku: string
  price: number      // resolved price (salePrice if available, else price)
  quantity: number
}

export interface ShippingAddress {
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
}

export interface Order {
  id: string
  invoiceId: string
  paymentUrl: string
  status: 'pending' | 'waiting' | 'confirming' | 'confirmed' | 'failed' | 'expired'
  items: CartItem[]
  total: number
  email: string
  shippingAddress: ShippingAddress
  createdAt: string
  updatedAt: string
}
