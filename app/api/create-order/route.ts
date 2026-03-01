import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { createInvoice } from '@/lib/nowpayments'
import { createOrder } from '@/lib/orderStore'
import { CartItem, ShippingAddress } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, shippingAddress, items, total } = body as {
      email: string
      shippingAddress: ShippingAddress
      items: CartItem[]
      total: number
    }

    if (!email || !shippingAddress || !items?.length || !total) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const orderId = uuidv4()

    const invoice = await createInvoice({
      price_amount: total,
      price_currency: 'usd',
      order_id: orderId,
      order_description: `Proton Peptides order — ${items.length} item(s)`,
      success_url: `${baseUrl}/order/${orderId}`,
      cancel_url: `${baseUrl}/checkout`,
      ipn_callback_url: `${baseUrl}/api/nowpayments-webhook`,
    })

    const order = createOrder({
      id: orderId,
      invoiceId: invoice.id,
      paymentUrl: invoice.invoice_url,
      items,
      total,
      email,
      shippingAddress,
    })

    // Payment URL has order ID so confirmation page can poll
    const paymentUrl = invoice.invoice_url

    return NextResponse.json({ orderId: order.id, paymentUrl })
  } catch (err: unknown) {
    console.error('[create-order]', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
