import type { Metadata } from 'next'
import { Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Support',
  description: 'Get in touch with Proton Peptides support. We respond within 24 hours on business days.',
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-brand-dark mb-2">Contact Support</h1>
      <p className="text-gray-500 mb-10">Have a question about an order or product? Reach out and we'll get back to you promptly.</p>

      <div className="bg-white border border-brand-border rounded-2xl p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center shrink-0">
            <Mail size={22} className="text-brand-blue" />
          </div>
          <div>
            <h2 className="font-semibold text-brand-dark mb-1">Email Support</h2>
            <p className="text-sm text-gray-500 mb-3">We typically respond within 24 hours on business days.</p>
            <a
              href="mailto:protonpeptide@gmail.com"
              className="text-brand-blue font-medium hover:underline text-sm"
            >
              protonpeptide@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-brand-border mt-8 pt-6 text-xs text-gray-400 space-y-1">
          <p>When contacting support, please include your order ID if applicable.</p>
          <p>All products are for research use only. We cannot provide medical or dosing advice.</p>
        </div>
      </div>
    </div>
  )
}
