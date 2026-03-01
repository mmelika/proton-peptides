import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/nowpayments'
import { getOrderByInvoiceId, updateOrderStatus } from '@/lib/orderStore'
import { Order } from '@/types'

// NOWPayments payment_status → our Order status mapping
const statusMap: Record<string, Order['status']> = {
  waiting: 'waiting',
  confirming: 'confirming',
  confirmed: 'confirmed',
  sending: 'confirmed',
  finished: 'confirmed',
  failed: 'failed',
  expired: 'expired',
  refunded: 'failed',
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-nowpayments-sig') || ''

    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)
    const { invoice_id, payment_status } = payload

    const order = getOrderByInvoiceId(String(invoice_id))
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const newStatus = statusMap[payment_status] ?? 'waiting'
    updateOrderStatus(order.id, newStatus)

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error('[nowpayments-webhook]', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
