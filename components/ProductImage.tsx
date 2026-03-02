'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { Activity, Sparkles, FlaskConical, Atom } from 'lucide-react'

// ─── Photo detection ─────────────────────────────────────────────────────────
// Drop a photo named [slug].jpg (or .jpeg / .png / .webp) into /public/products/
// and it will automatically become the main product image.
const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

// ─── SVG fallback config ──────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<string, {
  Icon: React.ElementType
  tagline: string
  glow: string
}> = {
  performance: { Icon: Activity,      tagline: 'PERFORMANCE',   glow: '#0057FF' },
  skin:         { Icon: Sparkles,     tagline: 'SKIN RESEARCH', glow: '#818cf8' },
  solutions:    { Icon: FlaskConical, tagline: 'SOLUTION',      glow: '#22d3ee' },
  isolates:     { Icon: Atom,         tagline: 'ISOLATE',       glow: '#0057FF' },
}

const ABBREV: Record<string, string> = {
  'bpc-157':                    'BPC-157',
  'bpc-157-tb-500-blend':       'BPC/TB',
  'tb-500':                     'TB-500',
  'cjc-1295-ipamorelin':        'CJC/IPA',
  'mots-c':                     'MOTS-C',
  'hcg':                        'HCG',
  'tesamorelin':                'TESA',
  'fox04-dri':                  'FOX04',
  'mgf':                        'MGF',
  'ghk-cu':                     'GHK-Cu',
  'melanotan-1':                'MT-I',
  'melanotan-2':                'MT-II',
  'semax':                      'SEMAX',
  'glow-blend':                 'GLOW',
  'l-carnitine':                'L-CARN',
  'shredx-blend':               'SHREDX',
  'nad-5amino1mq':              'NAD+',
  'bacteriostatic-water':       'B.WATER',
  'glp1':                       'GLP-1',
  'glp2-glp-gip':               'GLP-2',
  'glp3-glp-gip-gluc':          'GLP-3 RT',
  'capsulated-glp-orforglipron':'ORFG',
  'nad-plus':                   'NAD+',
  'glp2-starter-bundle':        'BUNDLE',
  'glp3-starter-bundle':        'BUNDLE',
}

interface Props {
  product: Product
  className?: string
}

export default function ProductImage({ product, className = '' }: Props) {
  // Try each extension in order; fall back to SVG when all fail
  const [extIndex, setExtIndex] = useState(0)

  if (extIndex < EXTENSIONS.length) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={`/products/${product.slug}.${EXTENSIONS[extIndex]}`}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
          onError={() => setExtIndex(i => i + 1)}
          unoptimized
        />
      </div>
    )
  }

  // ─── SVG branded fallback ──────────────────────────────────────────────────
  const cfg = CATEGORY_CONFIG[product.category] ?? CATEGORY_CONFIG.performance
  const abbrev = ABBREV[product.slug] ?? product.name.split(' ')[0].toUpperCase().slice(0, 7)
  const Icon = cfg.Icon
  const patternId = `dots-${product.id}`

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: 'linear-gradient(135deg, #080d1a 0%, #0d1526 55%, #1A1A2E 100%)' }}
    >
      {/* Dot grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        <defs>
          <pattern id={patternId} width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="0.9" fill="#ffffff" opacity="0.07" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {/* Glow orb — top right */}
      <div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: '65%', height: '65%',
          top: '-25%', right: '-20%',
          background: cfg.glow, opacity: 0.18,
        }}
      />

      {/* Secondary glow — bottom left */}
      <div
        className="absolute rounded-full blur-2xl pointer-events-none"
        style={{
          width: '40%', height: '40%',
          bottom: '-15%', left: '-10%',
          background: cfg.glow, opacity: 0.08,
        }}
      />

      {/* Center content */}
      <div className="relative flex flex-col items-center justify-center h-full py-5 px-4 text-center">
        <span
          className="font-black text-white leading-none tracking-tighter select-none"
          style={{
            fontSize: 'clamp(1.6rem, 5cqw, 2.4rem)',
            textShadow: `0 0 40px ${cfg.glow}88`,
          }}
        >
          {abbrev}
        </span>

        <div
          className="mt-2.5 mb-2"
          style={{ width: 32, height: 1.5, background: cfg.glow, opacity: 0.8, borderRadius: 99 }}
        />

        <span
          className="text-white font-semibold tracking-[0.18em] uppercase select-none"
          style={{ fontSize: '0.6rem', opacity: 0.45 }}
        >
          {cfg.tagline}
        </span>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 pb-2 pt-1">
        <Icon size={11} className="text-white" style={{ opacity: 0.3 }} />
        <span
          className="text-white font-bold tracking-[0.22em] uppercase select-none"
          style={{ fontSize: '0.5rem', opacity: 0.22, letterSpacing: '0.22em' }}
        >
          Proton Peptides
        </span>
      </div>

      {/* Accent line */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: 2, background: cfg.glow, opacity: 0.55 }}
      />
    </div>
  )
}
