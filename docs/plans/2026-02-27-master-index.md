# Proton Peptides — Master Build Index

> **For Claude:** Execute each phase plan in a separate session using `superpowers:executing-plans`. Complete phases in order — each phase depends on the previous.

**Goal:** Full Next.js 14 e-commerce storefront for research peptides with crypto payments via NOWPayments.

**Root:** `/Users/marco/Documents/peptides`

---

## Phase Plans

| Phase | File | Covers | Prereq |
|-------|------|--------|--------|
| 1 | `2026-02-27-phase-1-foundation.md` | Scaffold, Tailwind, types, products.json, CartContext | none |
| 2 | `2026-02-27-phase-2-shell.md` | Header, Footer, root layout, DisclaimerModal | Phase 1 |
| 3 | `2026-02-27-phase-3-pages.md` | Homepage, Products catalog, Product detail page | Phase 2 |
| 4 | `2026-02-27-phase-4-cart-checkout.md` | Cart page, Checkout page | Phase 3 |
| 5 | `2026-02-27-phase-5-api-orders.md` | API routes, orderStore, Order confirmation page, env config | Phase 4 |

---

## Final File Structure

```
/Users/marco/Documents/peptides/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── products/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── order/[id]/page.tsx
│   └── api/
│       ├── create-order/route.ts
│       ├── nowpayments-webhook/route.ts
│       └── order-status/[id]/route.ts
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── DisclaimerModal.tsx
│   ├── ProductCard.tsx
│   ├── TrustBadges.tsx
│   ├── ReviewSection.tsx
│   └── VariantSelector.tsx
├── contexts/
│   └── CartContext.tsx
├── lib/
│   ├── orderStore.ts
│   └── nowpayments.ts
├── data/
│   └── products.json
├── types/
│   └── index.ts
├── __tests__/
│   ├── cartContext.test.tsx
│   └── orderStore.test.ts
├── tailwind.config.ts
├── jest.config.js
├── jest.setup.ts
└── .env.local.example
```

---

## Design Tokens (reference for all phases)

```
Background:  #FFFFFF / #F8F9FA
Text:        #1A1A2E
Accent:      #0057FF
Font:        Inter (Google Fonts)
Style:       Minimal, clinical, premium
```

## Env Vars (reference for Phase 5)

```
NOWPAYMENTS_API_KEY=
NOWPAYMENTS_IPN_SECRET=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```
