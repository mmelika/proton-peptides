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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
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
              You&apos;ll be redirected to a secure crypto payment page
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
