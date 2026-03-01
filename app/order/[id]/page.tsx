'use client'
import React, { useEffect, useState, useCallback } from 'react'
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
            Your order has been confirmed. You&apos;ll receive a shipping notification via email.
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
