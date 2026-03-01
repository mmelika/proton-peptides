import { ShieldCheck, Bitcoin, Truck, Headphones } from 'lucide-react'

const badges = [
  { icon: ShieldCheck, label: '3rd Party Tested', sub: 'Independent CoA on every batch' },
  { icon: Bitcoin, label: 'Crypto Payments', sub: 'Secure, private checkout' },
  { icon: Truck, label: 'Fast Shipping', sub: 'US orders ship same day' },
  { icon: Headphones, label: 'Research Support', sub: 'Expert team available' },
]

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map(({ icon: Icon, label, sub }) => (
        <div key={label} className="flex flex-col items-center text-center p-4 bg-brand-gray rounded-xl">
          <Icon className="text-brand-blue mb-2" size={24} />
          <span className="text-sm font-semibold text-brand-dark">{label}</span>
          <span className="text-xs text-gray-500 mt-0.5">{sub}</span>
        </div>
      ))}
    </div>
  )
}
