'use client'
import { useEffect, useState } from 'react'
import { FlaskConical } from 'lucide-react'

const STORAGE_KEY = 'proton_disclaimer_accepted'

export default function DisclaimerModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <FlaskConical className="text-brand-blue" size={28} />
          <h2 className="text-lg font-bold text-brand-dark">Research Use Only</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          All products on this site are intended <strong>strictly for laboratory research purposes</strong>.
          They are not approved for human or veterinary use, consumption, or clinical application.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          By entering, you confirm that you are a qualified researcher aged 18+ and will use these
          products in compliance with all applicable local, state, and federal laws.
        </p>
        <div className="flex gap-3">
          <button
            onClick={accept}
            className="flex-1 bg-brand-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            I Understand & Agree
          </button>
          <a
            href="https://google.com"
            className="flex-1 bg-brand-gray text-brand-dark py-3 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors"
          >
            Exit Site
          </a>
        </div>
      </div>
    </div>
  )
}
