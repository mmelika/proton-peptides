import { createOrder, getOrder, updateOrderStatus } from '@/lib/orderStore'
import { CartItem, ShippingAddress } from '@/types'

const items: CartItem[] = [{
  productId: 'bpc-157',
  productSlug: 'bpc-157',
  productName: 'BPC-157',
  variantLabel: '10mg',
  variantSku: 'BPC157-10',
  price: 55,
  quantity: 2,
}]

const address: ShippingAddress = {
  name: 'John Doe',
  street: '123 Lab St',
  city: 'Research City',
  state: 'CA',
  zip: '90210',
  country: 'US',
}

describe('orderStore', () => {
  it('creates an order and returns it', () => {
    const order = createOrder({
      invoiceId: 'inv_123',
      paymentUrl: 'https://pay.nowpayments.io/payment/123',
      items,
      total: 110,
      email: 'test@lab.com',
      shippingAddress: address,
    })

    expect(order.id).toBeDefined()
    expect(order.status).toBe('pending')
    expect(order.items).toHaveLength(1)
    expect(order.total).toBe(110)
  })

  it('retrieves an order by id', () => {
    const order = createOrder({
      invoiceId: 'inv_456',
      paymentUrl: 'https://pay.nowpayments.io/payment/456',
      items,
      total: 55,
      email: 'other@lab.com',
      shippingAddress: address,
    })

    const retrieved = getOrder(order.id)
    expect(retrieved).toBeDefined()
    expect(retrieved!.id).toBe(order.id)
  })

  it('returns undefined for unknown id', () => {
    expect(getOrder('nonexistent')).toBeUndefined()
  })

  it('updates order status', () => {
    const order = createOrder({
      invoiceId: 'inv_789',
      paymentUrl: 'https://pay.nowpayments.io/payment/789',
      items,
      total: 55,
      email: 'third@lab.com',
      shippingAddress: address,
    })

    updateOrderStatus(order.id, 'confirmed')
    const updated = getOrder(order.id)
    expect(updated!.status).toBe('confirmed')
  })
})
