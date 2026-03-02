# SEO Optimization Design — Proton Peptides
**Date:** 2026-03-02
**Approach:** Next.js 14 native metadata API, no new dependencies

## Goal
Full SEO coverage: per-page metadata, Open Graph, Twitter cards, JSON-LD product schema, sitemap, robots.txt, and Gemini-generated brand icons.

## Base URL
`https://www.protonpeptides.shop` (from `NEXT_PUBLIC_BASE_URL`)

---

## Files to Create / Modify

### 1. `app/layout.tsx` — Global metadata defaults
- Site-wide `title.template`: `"%s | Proton Peptides"`
- `title.default`: `"Proton Peptides — Research Grade Peptides"`
- `description`: site-level description
- `openGraph` defaults: site_name, locale, type
- `twitter` card defaults: `summary_large_image`
- `icons`: favicon + apple-touch-icon (Gemini-generated)
- `metadataBase`: set to `https://www.protonpeptides.shop`

### 2. `app/page.tsx` — Homepage static metadata
- Title: `"Research Grade Peptides | Proton Peptides"`
- Description: keyword-rich homepage description
- OG image: product hero image

### 3. `app/products/page.tsx` — Products listing static metadata
- Title: `"Browse Research Peptides"`
- Description covering catalog breadth

### 4. `app/products/[slug]/page.tsx` — `generateMetadata()`
- Title: `"{product.name}"`  → renders as `"{name} | Proton Peptides"`
- Description: `product.shortDescription`
- `openGraph.images`: `[/products/{slug}.png]`
- `openGraph.type`: `"website"` (product type needs commerce schema)
- JSON-LD `<script type="application/ld+json">` injected in page body:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "...",
    "description": "...",
    "image": "https://www.protonpeptides.shop/products/{slug}.png",
    "offers": {
      "@type": "Offer",
      "price": "...",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }
  ```

### 5. `app/contact/page.tsx` — Static metadata
- Title: `"Contact Support"`

### 6. `app/sitemap.ts` — Auto-generated sitemap
- Static routes: `/`, `/products`, `/contact`
- Dynamic routes: one entry per product slug
- `lastModified`: current date
- `changeFrequency` and `priority` set per page type

### 7. `app/robots.ts` — Robots file
- Allow all
- Point to sitemap URL

### 8. Icons (Gemini-generated)
- Generate 180×180 PNG via Gemini: stylized "P" or atom mark, brand blue `#0057FF` on dark `#1A1A2E`
- Save as `public/apple-touch-icon.png`
- Resize/derive 32×32 favicon, save as `public/favicon.ico` (PNG-based)
- Reference both in `layout.tsx` icons config

---

## Keywords to Target
- `buy BPC-157`, `GHK-Cu research peptides`, `Retatrutide`, `research peptides crypto payment`
- Each product page targets the compound name + "research peptide" / "buy"

## What's Explicitly Out of Scope
- Structured data for non-product pages
- Blog / content SEO
- Google Search Console setup (manual step post-deploy)
