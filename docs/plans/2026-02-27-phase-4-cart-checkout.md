# Phase 4: Cart & Checkout

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Build the cart review page and the checkout page that collects shipping info and submits the order.

**Prereq:** Phase 3 complete (CartContext, ProductCard, all public pages working).

---

### Task 1: Cart Page

**Files:**
- Create: `app/cart/page.tsx`

**Step 1: Create app/cart/page.tsx**

```tsx
'use client'
import Link from 'next/link'
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export default function CartPage() {
  const { items, total, itemCount, updateQuantity, removeItem } = useCart()

  if (itemCount === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-brand-dark mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some research compounds to get started.</p>
        <Link href="/products" className="bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Line items */}
        <div className="md:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.variantSku} className="bg-white border border-brand-border rounded-xl p-4 flex gap-4">
              {/* Image placeholder */}
              <div className="w-16 h-16 bg-brand-gray rounded-lg shrink-0 flex items-center justify-center">
                <span className="text-xs font-bold text-brand-blue/40 text-center leading-tight px-1">
                  {item.productName.slice(0, 6)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-brand-dark text-sm truncate">{item.productName}</p>
                <p className="text-xs text-gray-500 mb-2">{item.variantLabel}</p>

                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.variantSku, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-blue hover:text-brand-blue transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.variantSku, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-blue hover:text-brand-blue transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <span className="font-bold text-brand-dark">${(item.price * item.quantity).toFixed(2)}</span>
                <button
                  onClick={() => removeItem(item.variantSku)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="md:col-span-1">
          <div className="bg-brand-gray rounded-xl p-5 sticky top-24">
            <h2 className="font-bold text-brand-dark mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4 text-sm">
              {items.map(item => (
                <div key={item.variantSku} className="flex justify-between text-gray-600">
                  <span className="truncate mr-2">{item.productName} × {item.quantity}</span>
                  <span className="shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-border pt-3 mb-5">
              <div className="flex justify-between font-bold text-brand-dark">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Paid via cryptocurrency</p>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-brand-blue text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Verify cart page works**

Add a product from a detail page, then navigate to /cart. Expected: item shows with quantity controls and total.

**Step 3: Commit**

```bash
git add app/cart/page.tsx
git commit -m "feat: cart page with line items and quantity controls"
```

---

### Task 2: Checkout Page

**Files:**
- Create: `app/checkout/page.tsx`

The checkout page collects email + shipping address, then POSTs to `/api/create-order`. On success it redirects to `/order/[id]`.

**Step 1: Create app/checkout/page.tsx**

```tsx
'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { ShippingAddress } from '@/types'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-brand-dark mb-1">{label}</label>
      {children}
    </div>
  )
}

const inputClass = "w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()

  const [email, setEmail] = useState('')
  const [address, setAddress] = useState<ShippingAddress>({
    name: '', street: '', city: '', state: '', zip: '', country: 'US',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, shippingAddress: address, items, total }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create order')
      }

      const { orderId, paymentUrl } = await res.json()
      clearCart()
      // Redirect to NOWPayments hosted checkout, which returns to /order/[id]
      window.location.href = paymentUrl
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const update = (field: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setAddress(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Contact */}
          <div className="bg-white border border-brand-border rounded-xl p-5">
            <h2 className="font-bold text-brand-dark mb-4">Contact</h2>
            <Field label="Email address">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="researcher@lab.com"
                className={inputClass}
              />
            </Field>
          </div>

          {/* Shipping */}
          <div className="bg-white border border-brand-border rounded-xl p-5">
            <h2 className="font-bold text-brand-dark mb-4">Shipping Address</h2>
            <div className="grid gap-4">
              <Field label="Full name">
                <input type="text" required value={address.name} onChange={update('name')} className={inputClass} />
              </Field>
              <Field label="Street address">
                <input type="text" required value={address.street} onChange={update('street')} className={inputClass} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City">
                  <input type="text" required value={address.city} onChange={update('city')} className={inputClass} />
                </Field>
                <Field label="State">
                  <input type="text" required value={address.state} onChange={update('state')} placeholder="CA" className={inputClass} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="ZIP code">
                  <input type="text" required value={address.zip} onChange={update('zip')} className={inputClass} />
                </Field>
                <Field label="Country">
                  <select value={address.country} onChange={update('country')} className={inputClass}>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </Field>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
          )}
        </div>

        {/* Order summary */}
        <div className="md:col-span-1">
          <div className="bg-brand-gray rounded-xl p-5 sticky top-24">
            <h2 className="font-bold text-brand-dark mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4 text-sm">
              {items.map(item => (
                <div key={item.variantSku} className="flex justify-between text-gray-600">
                  <span className="truncate mr-2">{item.productName} × {item.quantity}</span>
                  <span className="shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-brand-border pt-3 mb-5">
              <div className="flex justify-between font-bold text-brand-dark">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Paid via cryptocurrency</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Lock size={16} />
              {loading ? 'Creating Order...' : 'Pay with Crypto'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              You'll be redirected to a secure crypto payment page
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
```

**Step 2: Verify form renders**

Navigate to /checkout (with items in cart). Expected: form renders with all fields. Submitting will fail (API not built yet) — that's fine.

**Step 3: Commit**

```bash
git add app/checkout/page.tsx
git commit -m "feat: checkout page with shipping form and order submission"
```

---

**Phase 4 complete.** Next: run Phase 5 (`2026-02-27-phase-5-api-orders.md`) in a fresh session.
