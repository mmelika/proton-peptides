import { Order, CartItem, ShippingAddress } from '@/types'
import { v4 as uuidv4 } from 'uuid'

// In-memory store. On Vercel, each Lambda invocation is fresh.
// For production persistence, replace with Vercel KV or Upstash Redis.
const store = new Map<string, Order>()

interface CreateOrderInput {
  id?: string
  invoiceId: string
  paymentUrl: string
  items: CartItem[]
  total: number
  email: string
  shippingAddress: ShippingAddress
}

export function createOrder(input: CreateOrderInput): Order {
  const now = new Date().toISOString()
  const order: Order = {
    id: input.id ?? uuidv4(),
    invoiceId: input.invoiceId,
    paymentUrl: input.paymentUrl,
    status: 'pending',
    items: input.items,
    total: input.total,
    email: input.email,
    shippingAddress: input.shippingAddress,
    createdAt: now,
    updatedAt: now,
  }
  store.set(order.id, order)
  return order
}

export function getOrder(id: string): Order | undefined {
  return store.get(id)
}

export function getOrderByInvoiceId(invoiceId: string): Order | undefined {
  for (const order of store.values()) {
    if (order.invoiceId === invoiceId) return order
  }
  return undefined
}

export function updateOrderStatus(id: string, status: Order['status']): void {
  const order = store.get(id)
  if (order) {
    store.set(id, { ...order, status, updatedAt: new Date().toISOString() })
  }
}
