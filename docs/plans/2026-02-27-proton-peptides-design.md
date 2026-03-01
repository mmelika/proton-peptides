# Proton Peptides — Design Document
**Date:** 2026-02-27

## Overview
Full e-commerce storefront for research/lab-grade peptides. Crypto-only payments via NOWPayments. Clean, clinical visual design. Brand name: **Proton Peptides**.

---

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **State:** React Context + localStorage (cart)
- **Payments:** NOWPayments API (via Next.js API routes)
- **Products:** `/data/products.json` (flat file, no DB to start)
- **Deployment:** Vercel (free tier)

---

## Visual Design System
- **Background:** White `#FFFFFF` / Light gray `#F8F9FA`
- **Text:** Charcoal `#1A1A2E`
- **Accent:** Electric blue `#0057FF`
- **Font:** Inter (Google Fonts)
- **Style:** Minimal whitespace, clean cards, subtle shadows, trust badges
- **Tone:** Clinical/pharmaceutical, premium, trustworthy

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage: hero, featured products, trust badges, category nav |
| `/products` | Full catalog with category filter sidebar |
| `/products/[slug]` | Product detail: description, dosage info, reviews, add to cart |
| `/cart` | Cart review with quantity controls |
| `/checkout` | Email + shipping address → trigger NOWPayments invoice |
| `/order/[id]` | Order confirmation + payment status polling |

---

## Product Categories
1. Performance & Recovery Research Compounds
2. Skin Research Compounds
3. Solution Preparations
4. Freeze Dried Isolates

---

## Product Catalog (Seed Data)
Realistic product list modeled after industry standard research peptides:

**Performance & Recovery Research Compounds:**
- BPC-157 (10mg) — $55
- BPC-157 & TB-500 Blend (10mg/10mg) — $85 (sale from $95)
- TB-500 (10mg) — $55
- CJC-1295 & Ipamorelin (5mg/5mg) — $65 (sale from $70)
- MOTS-C (10mg / 30mg) — $45 / $130
- HCG (5000 IU) — $65 (sale from $75)
- Tesamorelin (10mg) — $80
- FOX04-DRI (10mg) — $110 (sale from $175)
- MGF (2mg) — $30

**Skin Research Compounds:**
- GHK-Cu (100mg) — $45
- Melanotan 1 (10mg) — $40 (sale from $45)
- Melanotan 2 (10mg) — $40 (sale from $45)
- Semax (10mg) — $35 (sale from $45)
- GLOW Blend (70mg) — $130 (sale from $140)

**Solution Preparations:**
- L-Carnitine (600mg / 2000mg / 4000mg) — $25 / $75 / $115
- ShredX Blend (10ml) — $60 (sale from $65)
- NAD+ & High Dose 5-Amino-1MQ — $165 (sale from $220)
- Bacteriostatic Water (30ml) — $15

**Freeze Dried Isolates:**
- GLP1 (10mg / 30mg) — $80 / $140
- GLP2 GLP/GIP (10mg / 20mg / 40mg) — $85 / $125 / $160
- GLP3 GLP/GIP/GLUC (10mg / 20mg) — $95 / $140
- Capsulated GLP Orforglipron — $125
- NAD+ (100mg / 250mg) — $45 / $80
- GLP2 Starter Bundle — $100 (sale from $110)
- GLP3 Starter Bundle — $120 (sale from $135)

---

## Reviews Strategy
- **Most products:** 4–5 reviews, mix of 4★ and 5★ with one occasional 3★
- **Obscure/niche products:** 1–2 reviews
- **Popular products** (BPC-157, GLP3, NAD+, CJC/Ipamorelin): 8–12 reviews
- **Tone:** Believable — specific but not over-the-top, occasional minor typo, real first names
- **Content examples:** mentions of research use, shipping speed, purity, reordering

---

## Checkout Flow
1. Customer adds items to cart
2. Clicks **Checkout** → enters email + shipping address
3. POST `/api/create-order` → calls NOWPayments API → returns payment URL
4. Customer redirected to NOWPayments hosted payment page
5. Customer selects coin, pays
6. NOWPayments webhook → POST `/api/nowpayments-webhook` → updates order status in memory/file
7. Customer redirected to `/order/[id]` → polls `/api/order-status/[id]` for confirmation

---

## API Routes
| Route | Purpose |
|-------|---------|
| `POST /api/create-order` | Creates NOWPayments invoice, stores order |
| `POST /api/nowpayments-webhook` | Receives payment status updates |
| `GET /api/order-status/[id]` | Returns current order status |

---

## Trust & Compliance
- "For Research Purposes Only" disclaimer in footer and product pages
- Trust badges: 3rd Party Tested, Crypto Payments, Fast Shipping, Customer Support
- Research disclaimer modal on first visit
