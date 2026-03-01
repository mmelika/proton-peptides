import { createHmac } from 'crypto'

const BASE_URL = 'https://api.nowpayments.io/v1'

interface CreateInvoiceParams {
  price_amount: number
  price_currency: 'usd'
  order_id: string
  order_description: string
  success_url: string
  cancel_url: string
  ipn_callback_url: string
}

interface InvoiceResponse {
  id: string
  invoice_url: string
  order_id: string
}

export async function createInvoice(params: CreateInvoiceParams): Promise<InvoiceResponse> {
  const apiKey = process.env.NOWPAYMENTS_API_KEY
  if (!apiKey) throw new Error('NOWPAYMENTS_API_KEY is not set')

  const res = await fetch(`${BASE_URL}/invoice`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`NOWPayments error: ${res.status} — ${text}`)
  }

  return res.json()
}

export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET
  if (!secret) return false

  const hmac = createHmac('sha512', secret)
  hmac.update(payload)
  const computed = hmac.digest('hex')
  return computed === signature
}
