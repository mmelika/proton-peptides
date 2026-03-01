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
