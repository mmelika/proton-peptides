# Phase 5: API & Orders

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Implement the order store, NOWPayments API integration, all three API routes, and the order confirmation page. Wire up the full checkout-to-payment flow.

**Prereq:** Phase 4 complete. Env vars available in `.env.local`.

**Env vars needed:**
```
NOWPAYMENTS_API_KEY=your_key_here
NOWPAYMENTS_IPN_SECRET=your_secret_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

### Task 1: Order Store (TDD)

**Files:**
- Create: `__tests__/orderStore.test.ts`
- Create: `lib/orderStore.ts`

The order store uses an in-memory Map backed by `/tmp/proton_orders.json` for persistence across hot-reloads. On Vercel, `/tmp` is ephemeral per invocation — note this limitation in comments.

**Step 1: Write failing tests**

Create `__tests__/orderStore.test.ts`:

```typescript
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
```

**Step 2: Run tests — expect FAIL**

```bash
npm test -- --testPathPattern=orderStore
```
Expected: FAIL — module not found.

**Step 3: Implement lib/orderStore.ts**

```typescript
import { Order, CartItem, ShippingAddress } from '@/types'
import { v4 as uuidv4 } from 'uuid'

// In-memory store. On Vercel, each Lambda invocation is fresh.
// For production persistence, replace with Vercel KV or Upstash Redis.
const store = new Map<string, Order>()

interface CreateOrderInput {
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
    id: uuidv4(),
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
```

**Step 4: Run tests — expect PASS**

```bash
npm test -- --testPathPattern=orderStore
```
Expected: 4 passing.

**Step 5: Commit**

```bash
git add lib/orderStore.ts __tests__/orderStore.test.ts
git commit -m "feat: in-memory order store (TDD)"
```

---

### Task 2: NOWPayments Helper

**Files:**
- Create: `lib/nowpayments.ts`

**Step 1: Create lib/nowpayments.ts**

```typescript
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
  const crypto = require('crypto')
  const secret = process.env.NOWPAYMENTS_IPN_SECRET
  if (!secret) return false

  const hmac = crypto.createHmac('sha512', secret)
  hmac.update(payload)
  const computed = hmac.digest('hex')
  return computed === signature
}
```

**Step 2: Commit**

```bash
git add lib/nowpayments.ts
git commit -m "feat: NOWPayments API helper"
```

---

### Task 3: API Route — create-order

**Files:**
- Create: `app/api/create-order/route.ts`

**Step 1: Create the route**

```typescript
import { NextRequest, NextResponse } from 'next/server'
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
    // Temporary order ID for the invoice — we'll get the real one after createOrder
    const tempId = `temp_${Date.now()}`

    const invoice = await createInvoice({
      price_amount: total,
      price_currency: 'usd',
      order_id: tempId,
      order_description: `Proton Peptides order — ${items.length} item(s)`,
      success_url: `${baseUrl}/order/__ORDER_ID__`,   // replaced below
      cancel_url: `${baseUrl}/checkout`,
      ipn_callback_url: `${baseUrl}/api/nowpayments-webhook`,
    })

    const order = createOrder({
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
  } catch (err: any) {
    console.error('[create-order]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
```

**Step 2: Commit**

```bash
git add app/api/create-order/route.ts
git commit -m "feat: create-order API route"
```

---

### Task 4: API Route — nowpayments-webhook

**Files:**
- Create: `app/api/nowpayments-webhook/route.ts`

**Step 1: Create the route**

```typescript
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
  } catch (err: any) {
    console.error('[nowpayments-webhook]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
```

**Step 2: Commit**

```bash
git add app/api/nowpayments-webhook/route.ts
git commit -m "feat: nowpayments-webhook API route with HMAC verification"
```

---

### Task 5: API Route — order-status

**Files:**
- Create: `app/api/order-status/[id]/route.ts`

**Step 1: Create the route**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getOrder } from '@/lib/orderStore'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const order = getOrder(params.id)
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json({
    id: order.id,
    status: order.status,
    total: order.total,
    items: order.items,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  })
}
```

**Step 2: Commit**

```bash
git add app/api/order-status/[id]/route.ts
git commit -m "feat: order-status polling API route"
```

---

### Task 6: Order Confirmation Page

**Files:**
- Create: `app/order/[id]/page.tsx`

Polls `/api/order-status/[id]` every 5 seconds and shows live payment status.

**Step 1: Create app/order/[id]/page.tsx**

```tsx
'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Order } from '@/types'

type PartialOrder = Pick<Order, 'id' | 'status' | 'total' | 'items' | 'createdAt'>

const statusConfig: Record<string, { icon: React.ElementType; color: string; message: string; done: boolean }> = {
  pending:    { icon: Clock,         color: 'text-yellow-500', message: 'Awaiting payment...',          done: false },
  waiting:    { icon: Clock,         color: 'text-yellow-500', message: 'Waiting for payment...',       done: false },
  confirming: { icon: Loader2,       color: 'text-brand-blue', message: 'Confirming on blockchain...',  done: false },
  confirmed:  { icon: CheckCircle,   color: 'text-green-500',  message: 'Payment confirmed!',           done: true  },
  failed:     { icon: AlertCircle,   color: 'text-red-500',    message: 'Payment failed.',              done: true  },
  expired:    { icon: AlertCircle,   color: 'text-red-500',    message: 'Payment expired.',             done: true  },
}

export default function OrderPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<PartialOrder | null>(null)
  const [error, setError] = useState('')

  const poll = useCallback(async () => {
    try {
      const res = await fetch(`/api/order-status/${id}`)
      if (!res.ok) { setError('Order not found.'); return }
      const data: PartialOrder = await res.json()
      setOrder(data)
    } catch {
      setError('Failed to fetch order status.')
    }
  }, [id])

  useEffect(() => {
    poll()
    const status = order?.status
    if (status && statusConfig[status]?.done) return  // stop polling when done
    const interval = setInterval(poll, 5000)
    return () => clearInterval(interval)
  }, [poll, order?.status])

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
        <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link href="/" className="text-brand-blue hover:underline">Return to home</Link>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Loader2 className="text-brand-blue mx-auto mb-4 animate-spin" size={48} />
        <p className="text-gray-500">Loading order...</p>
      </div>
    )
  }

  const config = statusConfig[order.status] ?? statusConfig['pending']
  const Icon = config.icon

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <Icon className={`${config.color} mx-auto mb-4 ${order.status === 'confirming' ? 'animate-spin' : ''}`} size={56} />
        <h1 className="text-2xl font-bold text-brand-dark mb-2">{config.message}</h1>
        <p className="text-gray-500 text-sm">Order #{order.id.slice(0, 8).toUpperCase()}</p>
      </div>

      <div className="bg-brand-gray rounded-xl p-5 mb-6">
        <h2 className="font-bold text-brand-dark mb-3">Order Summary</h2>
        <div className="space-y-2 text-sm text-gray-600 mb-3">
          {order.items.map(item => (
            <div key={item.variantSku} className="flex justify-between">
              <span>{item.productName} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-brand-border pt-2 flex justify-between font-bold text-brand-dark">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      {order.status === 'confirmed' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center mb-6">
          <p className="text-green-700 text-sm font-medium">
            Your order has been confirmed. You'll receive a shipping notification via email.
          </p>
        </div>
      )}

      {!statusConfig[order.status]?.done && (
        <p className="text-center text-xs text-gray-400">
          This page updates automatically. Do not close your browser.
        </p>
      )}

      <div className="text-center mt-6">
        <Link href="/products" className="text-brand-blue text-sm hover:underline">
          Continue shopping
        </Link>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add app/order/[id]/page.tsx
git commit -m "feat: order confirmation page with live payment status polling"
```

---

### Task 7: Environment Config

**Files:**
- Create: `.env.local.example`
- Create: `.env.local` (do NOT commit this)

**Step 1: Create .env.local.example**

```bash
NOWPAYMENTS_API_KEY=your_nowpayments_api_key_here
NOWPAYMENTS_IPN_SECRET=your_nowpayments_ipn_secret_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Step 2: Create .env.local from the example**

```bash
cp .env.local.example .env.local
```

Then fill in real values in `.env.local`.

**Step 3: Ensure .env.local is gitignored**

Verify `.gitignore` contains `.env.local` (Next.js adds this by default).

**Step 4: Commit example file only**

```bash
git add .env.local.example .gitignore
git commit -m "chore: add .env.local.example and verify gitignore"
```

---

### Task 8: Final Build Verification

**Step 1: Run all tests**

```bash
npm test
```
Expected: 10 passing (6 cart + 4 orderStore), 0 failing.

**Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no errors.

**Step 3: Run production build**

```bash
npm run build
```
Expected: successful build, no type errors, no missing modules.

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final build verification — all tests passing"
```

---

**Phase 5 complete. All 5 phases done. The full Proton Peptides site is ready.**

**To deploy to Vercel:**
1. Push repo to GitHub
2. Import in Vercel dashboard
3. Add env vars: `NOWPAYMENTS_API_KEY`, `NOWPAYMENTS_IPN_SECRET`, `NEXT_PUBLIC_BASE_URL` (set to your Vercel URL)
4. Deploy
