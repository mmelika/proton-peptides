import { Star } from 'lucide-react'
import { Review } from '@/types'

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={14} className={n <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  )
}

export default function ReviewSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-brand-dark">Reviews</h2>
        <div className="flex items-center gap-1">
          <StarRow rating={Math.round(avg)} />
          <span className="text-sm text-gray-500">({reviews.length})</span>
        </div>
      </div>
      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="bg-brand-gray rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-brand-dark">{r.author}</span>
                <StarRow rating={r.rating} />
              </div>
              <span className="text-xs text-gray-400">{r.date}</span>
            </div>
            <p className="text-sm text-gray-600">{r.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
