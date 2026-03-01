import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="text-xl font-bold mb-3">
              Proton<span className="text-brand-blue">Peptides</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium research-grade peptides for laboratory use.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-300">Catalog</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/products?category=performance" className="hover:text-white transition-colors">Performance & Recovery</Link></li>
              <li><Link href="/products?category=skin" className="hover:text-white transition-colors">Skin Research</Link></li>
              <li><Link href="/products?category=solutions" className="hover:text-white transition-colors">Solutions</Link></li>
              <li><Link href="/products?category=isolates" className="hover:text-white transition-colors">Freeze Dried Isolates</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-300">Trust</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>3rd Party Tested</li>
              <li>Crypto Payments Only</li>
              <li>Fast US Shipping</li>
              <li>Research Use Only</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-xs text-gray-500 leading-relaxed max-w-3xl">
            <strong className="text-gray-300">Research Use Only.</strong> All products sold by Proton Peptides are intended
            for laboratory research purposes only. Not for human or veterinary use, consumption, or clinical application.
            By purchasing, you confirm you are a qualified researcher and will use products in accordance with applicable laws.
          </p>
          <p className="text-xs text-gray-600 mt-3">
            © {new Date().getFullYear()} Proton Peptides. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
