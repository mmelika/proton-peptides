# Product Ad Generator — Design Doc
**Date:** 2026-03-01
**Status:** Approved

## Overview
Per-product 1080×1920 PNG advertisements for TikTok/Instagram Reels, served via Next.js `ImageResponse` API routes. Inspired by photorealistic vial-centric peptide brand ads (amino.clubs style) — premium glass vial front-and-center with atmospheric dark background and Proton Peptides branding.

## Architecture

### API Route
`GET /api/ads/[slug].png` → returns `ImageResponse` (1080×1920 PNG)

- Uses `next/og` (`ImageResponse` from `next/server`)
- Reads product data from `products.json` by slug
- Returns 404 for unknown slugs
- No auth required (public assets)

### Ad Page
`/ads` → lists all 25 products with name, category, and "Download PNG" link per product

### Components (internal to route, not React components)
The ad layout is defined as JSX inside the API route file.

## Visual Design (1080×1920)

### Background
- Deep navy radial gradient: `#020510` center → `#0d1526` edges
- Subtle warm orange/gold glow bloom behind vial center (opacity 0.25)
- Blue atmospheric glow (brand blue `#0057FF`, opacity 0.15) overlapping
- Dot grid pattern (22px spacing, 1px white dots, 6% opacity)

### Vial (SVG, ~520px wide × ~720px tall, centered at 60% from top)
- **Glass body**: rounded rectangle, semi-transparent white (rgba 255,255,255,0.08), border rgba(255,255,255,0.25), box-shadow glow
- **Left/right edge highlights**: thin white vertical strips for glass refraction
- **Aluminum crimp cap**: silver/grey rounded top (~140px wide, ~100px tall)
- **White label** (centered on body):
  - `PROTON PEPTIDES` — small caps, brand blue, 18px
  - Product name (abbreviation, e.g. "GLP-3") — bold, 72px, dark navy
  - Compound full name — 22px grey
  - Dosage — e.g. "10MG LYOPHILIZED" — 18px grey
  - `Purity ≥ 99%` pill badge — white text on brand blue background
  - `Research Use Only` — 14px grey
  - Thin blue accent line at label bottom

### Text overlay
- **Top**: `PROTON PEPTIDES` wordmark — white, letter-spaced, 28px
- **Below vial**: product full name — white bold, ~72px
- **Sub**: short tagline (from `shortDescription`, truncated to ~60 chars)
- **Bottom strip**: `3rd Party Tested  •  Ships Same Day  •  protonpeptides.com`
- **Footer**: `For Research Use Only — Not for human consumption` — grey, 18px

### Brand tokens
- Background: `#020510` / `#0d1526`
- Primary blue: `#0057FF`
- White: `#FFFFFF`
- Font: Inter (loaded via Google Fonts in ImageResponse)

## Implementation Plan
1. Install `@vercel/og` (if not already included via `next/og`)
2. Create `app/api/ads/[slug]/route.tsx` — ImageResponse with vial JSX
3. Create `app/ads/page.tsx` — product grid with download links
4. Test with GLP-3 first (`/api/ads/glp3-glp-gip-gluc.png`)
5. Verify all 25 slugs render cleanly

## First Ad: GLP-3
- Product: `GLP3 GLP/GIP/GLUC`
- Abbreviation: `GLP-3`
- Category: Freeze Dried Isolates
- Tagline: "Triple receptor agonist targeting GLP-1, GIP, and glucagon pathways simultaneously."
- Category color: `#0057FF` (isolates)
