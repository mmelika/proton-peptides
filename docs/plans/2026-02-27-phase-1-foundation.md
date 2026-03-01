# Phase 1: Foundation

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Scaffold the Next.js 14 app, configure Tailwind with brand tokens, define all TypeScript types, seed product data, and implement CartContext with tests.

**Architecture:** Next.js 14 App Router at `/Users/marco/Documents/peptides`. No DB — products from flat JSON. Cart state in React Context + localStorage.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Jest, React Testing Library.

---

### Task 1: Scaffold Next.js App

**Files:**
- Creates everything under `/Users/marco/Documents/peptides`

**Step 1: Run scaffold command**

```bash
cd /Users/marco/Documents/peptides
npx create-next-app@14 . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --no-eslint
```

Answer prompts: accept defaults.

**Step 2: Install additional dependencies**

```bash
npm install lucide-react uuid
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/uuid
```

**Step 3: Verify dev server starts**

```bash
npm run dev
```
Expected: server on http://localhost:3000, no errors.

**Step 4: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js 14 app"
```

---

### Task 2: Tailwind Config & Global Styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

**Step 1: Replace tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0057FF',
          dark: '#1A1A2E',
          gray: '#F8F9FA',
          border: '#E5E7EB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

**Step 2: Replace app/globals.css**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-sans text-brand-dark bg-white antialiased;
  }
}
```

**Step 3: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "chore: configure Tailwind with brand tokens and Inter font"
```

---

### Task 3: TypeScript Types

**Files:**
- Create: `types/index.ts`

**Step 1: Create types/index.ts**

```typescript
export interface Review {
  id: string
  author: string
  rating: 1 | 2 | 3 | 4 | 5
  date: string
  content: string
}

export interface ProductVariant {
  label: string      // e.g. "10mg", "30mg", "600mg"
  price: number
  salePrice?: number
  sku: string
}

export interface Product {
  id: string
  slug: string
  name: string
  category: 'performance' | 'skin' | 'solutions' | 'isolates'
  categoryLabel: string
  shortDescription: string
  description: string
  dosageInfo: string
  variants: ProductVariant[]
  reviews: Review[]
  featured?: boolean
}

export interface CartItem {
  productId: string
  productSlug: string
  productName: string
  variantLabel: string
  variantSku: string
  price: number      // resolved price (salePrice if available, else price)
  quantity: number
}

export interface ShippingAddress {
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
}

export interface Order {
  id: string
  invoiceId: string
  paymentUrl: string
  status: 'pending' | 'waiting' | 'confirming' | 'confirmed' | 'failed' | 'expired'
  items: CartItem[]
  total: number
  email: string
  shippingAddress: ShippingAddress
  createdAt: string
  updatedAt: string
}
```

**Step 2: Commit**

```bash
git add types/index.ts
git commit -m "chore: add TypeScript types"
```

---

### Task 4: Jest Setup

**Files:**
- Create: `jest.config.js`
- Create: `jest.setup.ts`

**Step 1: Create jest.config.js**

```javascript
const nextJest = require('next/jest')
const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}
module.exports = createJestConfig(customJestConfig)
```

Note: the key is `setupFilesAfterFramework` — correct spelling is `setupFilesAfterFramework`. Actually use: `setupFilesAfterFramework: ['<rootDir>/jest.setup.ts']`.

**Step 1 correction — Create jest.config.js:**

```javascript
const nextJest = require('next/jest')
const createJestConfig = nextJest({ dir: './' })

module.exports = createJestConfig({
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
})
```

**Step 2: Create jest.setup.ts**

```typescript
import '@testing-library/jest-dom'
```

**Step 3: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "jest",
"test:watch": "jest --watch"
```

**Step 4: Commit**

```bash
git add jest.config.js jest.setup.ts package.json
git commit -m "chore: configure Jest with React Testing Library"
```

---

### Task 5: Product Data

**Files:**
- Create: `data/products.json`

**Step 1: Create data/products.json**

The file exports a `Product[]` array. Follow this exact schema for all 25 products. Full data below:

```json
[
  {
    "id": "bpc-157",
    "slug": "bpc-157",
    "name": "BPC-157",
    "category": "performance",
    "categoryLabel": "Performance & Recovery",
    "shortDescription": "Pentadecapeptide derived from gastric juice protein, studied for tissue repair.",
    "description": "BPC-157 (Body Protection Compound 157) is a synthetic 15-amino acid peptide studied in laboratory models for its potential role in angiogenesis, wound healing, and inflammatory response modulation. Research has examined effects on growth factor signaling pathways and gastrointestinal mucosal protection.",
    "dosageInfo": "Supplied as 10mg lyophilized powder. Reconstitute with bacteriostatic water. Store at -20°C.",
    "featured": true,
    "variants": [
      { "label": "10mg", "price": 55, "sku": "BPC157-10" }
    ],
    "reviews": [
      { "id": "r1", "author": "Michael T.", "rating": 5, "date": "2025-11-15", "content": "Third order from Proton. Lyophilized powder looks clean, ships fast with cold packs. Lab-verified purity. Will keep ordering." },
      { "id": "r2", "author": "Sarah K.", "rating": 5, "date": "2025-10-28", "content": "Ordered for tissue repair research. Arrived in 3 days, well-packaged with CoA included. Reconstitutes cleanly." },
      { "id": "r3", "author": "James R.", "rating": 4, "date": "2025-10-10", "content": "Good quality peptide. Packaging could be slightly better but the product itself is excellent. Will reorder." },
      { "id": "r4", "author": "Dr. A. Patel", "rating": 5, "date": "2025-09-22", "content": "Using for wound healing research. Consistently pure product across three orders. Shipping is reliable." },
      { "id": "r5", "author": "Cody W.", "rating": 5, "date": "2025-09-05", "content": "Best source for BPC-157. Fast shipping, CoA included, clean lyophilized powder. Have reordered 4 times." },
      { "id": "r6", "author": "Lisa M.", "rating": 4, "date": "2025-08-18", "content": "Solid product for GI motility research. Lab testing showed 98.7% purity. Prompt delivery." },
      { "id": "r7", "author": "Ryan O.", "rating": 5, "date": "2025-08-01", "content": "Top quality, fast shipping, crypto payment was seamless. No complaints." },
      { "id": "r8", "author": "Tom H.", "rating": 5, "date": "2025-07-02", "content": "Proton Peptides is my go-to for BPC-157. Great pricing, fast delivery, consistent purity." }
    ]
  },
  {
    "id": "bpc-tb-blend",
    "slug": "bpc-157-tb-500-blend",
    "name": "BPC-157 & TB-500 Blend",
    "category": "performance",
    "categoryLabel": "Performance & Recovery",
    "shortDescription": "Dual-compound blend of BPC-157 and TB-500 for synergistic tissue research.",
    "description": "Combines 10mg BPC-157 and 10mg TB-500 (Thymosin Beta-4 synthetic fragment) in a single lyophilized preparation. Both compounds have been studied for tissue repair, angiogenesis, and inflammatory modulation. Designed for researchers studying combined peptide signaling effects.",
    "dosageInfo": "Supplied as 20mg total lyophilized blend (10mg BPC-157 + 10mg TB-500). Store at -20°C.",
    "featured": false,
    "variants": [
      { "label": "10mg/10mg", "price": 85, "salePrice": null, "sku": "BPCTB-BLEND" }
    ],
    "reviews": [
      { "id": "r1", "author": "Daniel F.", "rating": 5, "date": "2025-10-05", "content": "Ordered for a comparative healing study. Both compounds arrived well-preserved. Excellent value vs buying separately." },
      { "id": "r2", "author": "Emma S.", "rating": 4, "date": "2025-09-12", "content": "Good blend, arrived quickly. Would appreciate slightly larger vial for the price but quality is there." },
      { "id": "r3", "author": "Kevin L.", "rating": 5, "date": "2025-08-30", "content": "Clean powder, great packaging, fast shipping. Running a tissue repair study and this is perfect." }
    ]
  },
  {
    "id": "tb-500",
    "slug": "tb-500",
    "name": "TB-500",
    "category": "performance",
    "categoryLabel": "Performance & Recovery",
    "shortDescription": "Synthetic analog of Thymosin Beta-4, studied for wound healing and angiogenesis.",
    "description": "TB-500 is a synthetic analog of the naturally occurring 43-amino acid protein Thymosin Beta-4. Research studies have investigated its role in actin regulation, cell migration, angiogenesis, and anti-inflammatory pathways in laboratory models.",
    "dosageInfo": "Supplied as 10mg lyophilized powder. Store at -20°C.",
    "featured": false,
    "variants": [
      { "label": "10mg", "price": 55, "sku": "TB500-10" }
    ],
    "reviews": [
      { "id": "r1", "author": "Marcus W.", "rating": 5, "date": "2025-11-01", "content": "Great purity, ships fast. Using for actin polymerization research. Will reorder." },
      { "id": "r2", "author": "Priya N.", "rating": 4, "date": "2025-10-14", "content": "Second order, consistent quality. Packaging is professional and includes CoA." },
      { "id": "r3", "author": "Jake B.", "rating": 5, "date": "2025-09-20", "content": "Clean lyophilized powder, reconstitutes easily. Reliable source." }
    ]
  },
  {
    "id": "cjc-ipamorelin",
    "slug": "cjc-1295-ipamorelin",
    "name": "CJC-1295 & Ipamorelin",
    "category": "performance",
    "categoryLabel": "Performance & Recovery",
    "shortDescription": "GHRH analog and ghrelin mimetic blend for GH axis research.",
    "description": "Combines CJC-1295 (GHRH analog with DAC technology) and Ipamorelin (selective GH secretagogue receptor agonist). Research models have studied this combination for synergistic effects on growth hormone pulse amplitude and frequency without significant cortisol or prolactin elevation.",
    "dosageInfo": "Supplied as 10mg total (5mg CJC-1295 + 5mg Ipamorelin) lyophilized powder. Store at -20°C.",
    "featured": true,
    "variants": [
      { "label": "5mg/5mg", "price": 65, "salePrice": 70, "sku": "CJCIPA-BLEND" }
    ],
    "reviews": [
      { "id": "r1", "author": "Aaron M.", "rating": 5, "date": "2025-11-10", "content": "Using for GH secretion research. Excellent purity, arrived with independent CoA. Fast shipping." },
      { "id": "r2", "author": "Jennifer H.", "rating": 5, "date": "2025-10-22", "content": "Fourth order from Proton for this blend. Consistent quality every time, great price." },
      { "id": "r3", "author": "Chris P.", "rating": 4, "date": "2025-09-30", "content": "Good product, ships well packaged. I appreciate the research references on the product page." },
      { "id": "r4", "author": "Natalie R.", "rating": 5, "date": "2025-09-08", "content": "Clean powder, excellent value for the combination. Will continue ordering for my lab." }
    ]
  },
  {
    "id": "mots-c",
    "slug": "mots-c",
    "name": "MOTS-C",
    "category": "performance",
    "categoryLabel": "Performance & Recovery",
    "shortDescription": "Mitochondrial-derived peptide studied for metabolic regulation and insulin sensitivity.",
    "description": "MOTS-C is a 16-amino acid peptide encoded within the 12S rRNA gene of the mitochondrial genome. Research has examined its potential role in regulating metabolic homeostasis, insulin sensitivity, and cellular stress response. Studies suggest it may act as a systemic hormonal signal from mitochondria.",
    "dosageInfo": "Available in 10mg and 30mg lyophilized powder preparations. Store at -20°C.",
    "featured": false,
    "variants": [
      { "label": "10mg", "price": 45, "sku": "MOTSC-10" },
      { "label": "30mg", "price": 130, "sku": "MOTSC-30" }
    ],
    "reviews": [
      { "id": "r1", "author": "Grace L.", "rating": 5, "date": "2025-10-18", "content": "Ordered the 30mg for a metabolic study. Excellent purity, great packaging, fast delivery." },
      { "id": "r2", "author": "Ben T.", "rating": 4, "date": "2025-09-25", "content": "Good quality. The 10mg is well-priced for the research quantity needed." }
    ]
  },
  {
    "id": "hcg",
    "slug": "hcg",
    "name": "HCG",
    "category": "performance",
    "categoryLabel": "Performance & Recovery",
    "shortDescription": "Human Chorionic Gonadotropin for endocrine and reproductive research.",
    "description": "Human Chorionic Gonadotropin (HCG) is a glycoprotein hormone sharing the alpha subunit with LH, FSH, and TSH. Research applications include studying LH receptor activation, testicular steroidogenesis, and gonadal function in laboratory models.",
    "dosageInfo": "Supplied as 5000 IU lyophilized powder. Reconstitute with bacteriostatic water. Store at 2–8°C after reconstitution.",
    "featured": false,
    "variants": [
      { "label": "5000 IU", "price": 65, "salePrice": 75, "sku": "HCG-5000" }
    ],
    "reviews": [
      { "id": "r1", "author": "David C.", "rating": 5, "date": "2025-10-30", "content": "Clean product, arrived cold-packed with CoA. Exactly what I needed for my research." },
      { "id": "r2", "author": "Rachel S.", "rating": 4, "date": "2025-09-15", "content": "Good quality HCG. Reconstitutes well, ships fast. Reliable source." }
    ]
  },
  {
    "id": "tesamorelin",
    "slug": "tesamorelin",
    "name": "Tesamorelin",
    "category": "performance",
    "categoryLabel": "Performance & Recovery",
    "shortDescription": "Synthetic GHRH analog studied for GH axis and metabolic research.",
    "description": "Tesamorelin is a synthetic analog of human GHRH consisting of the full 44-amino acid sequence with a trans-3-hexenoic acid group for stability. Research has examined effects on GH and IGF-1 levels and visceral adiposity in laboratory models.",
    "dosageInfo": "Supplied as 10mg lyophilized powder. Store at -20°C.",
    "featured": false,
    "variants": [
      { "label": "10mg", "price": 80, "sku": "TESA-10" }
    ],
    "reviews": [
      { "id": "r1", "author": "Mark A.", "rating": 5, "date": "2025-10-05", "content": "Excellent purity, clean white powder. Fast shipping and secure packaging." },
      { "id": "r2", "author": "Claire B.", "rating": 4, "date": "2025-08-22", "content": "Solid product for GHRH research. Would order again." }
    ]
  },
  {
    "id": "fox04-dri",
    "slug": "fox04-dri",
    "name": "FOX04-DRI",
    "category": "performance",
    "categoryLabel": "Performance & Recovery",
    "shortDescription": "D-amino acid peptide targeting FOXO4-p53 interaction for senolytic research.",
    "description": "FOX04-DRI is a D-amino acid retro-inverso peptide designed to interfere with the FOXO4-p53 interaction in senescent cells. Published research has explored its potential to selectively induce apoptosis in senescent cells while sparing healthy proliferating cells — a key area of senolytic research.",
    "dosageInfo": "Supplied as 10mg lyophilized powder. Store at -20°C.",
    "featured": false,
    "variants": [
      { "label": "10mg", "price": 110, "salePrice": 175, "sku": "FOX04-10" }
    ],
    "reviews": [
      { "id": "r1", "author": "Dr. L. Thompson", "rating": 5, "date": "2025-11-02", "content": "Highest purity FOX04-DRI I've sourced. Crucial compound for our aging biology lab." },
      { "id": "r2", "author": "Stefan K.", "rating": 5, "date": "2025-09-18", "content": "Well packaged, fast delivery. This is a niche peptide and Proton stocks it reliably." }
    ]
  },
  {
    "id": "mgf",
    "slug": "mgf",
    "name": "MGF",
    "category": "performance",
    "categoryLabel": "Performance & Recovery",
    "shortDescription": "Mechano Growth Factor IGF-1 splice variant for muscle and tissue research.",
    "description": "Mechano Growth Factor (MGF) is a splice variant of IGF-1 produced in response to mechanical stimulus or damage. The Ec peptide domain is studied for its potential role in activating muscle satellite cells and regulating local tissue repair — distinct from systemic IGF-1 in receptor binding.",
    "dosageInfo": "Supplied as 2mg lyophilized powder. Highly temperature-sensitive — keep frozen until use. Store at -20°C.",
    "featured": false,
    "variants": [
      { "label": "2mg", "price": 30, "sku": "MGF-2" }
    ],
    "reviews": [
      { "id": "r1", "author": "Paul G.", "rating": 5, "date": "2025-09-10", "content": "Good purity, arrived frozen as expected. Excellent price for MGF." },
      { "id": "r2", "author": "Anna V.", "rating": 4, "date": "2025-07-28", "content": "Reliable source for MGF. Ships with cold packs, arrives in good condition." }
    ]
  },
  {
    "id": "ghk-cu",
    "slug": "ghk-cu",
    "name": "GHK-Cu",
    "category": "skin",
    "categoryLabel": "Skin Research",
    "shortDescription": "Copper peptide triplex studied for skin biology, wound healing, and collagen research.",
    "description": "GHK-Cu is a naturally occurring copper complex of the tripeptide glycyl-L-histidyl-L-lysine. Research has examined potential roles in wound healing, collagen synthesis, matrix metalloproteinase activity, and antioxidant gene expression in skin biology models.",
    "dosageInfo": "Supplied as 100mg lyophilized copper peptide powder. Store at -20°C.",
    "featured": true,
    "variants": [
      { "label": "100mg", "price": 45, "sku": "GHKCU-100" }
    ],
    "reviews": [
      { "id": "r1", "author": "Sophie M.", "rating": 5, "date": "2025-11-08", "content": "Clean blue powder, high purity. Using for collagen synthesis research. Excellent quality." },
      { "id": "r2", "author": "Oliver T.", "rating": 5, "date": "2025-10-14", "content": "Best value GHK-Cu I've found. Ships fast, arrives with CoA. Will reorder." },
      { "id": "r3", "author": "Fiona D.", "rating": 4, "date": "2025-09-01", "content": "Good product, consistent quality across two orders." }
    ]
  },
  {
    "id": "melanotan-1",
    "slug": "melanotan-1",
    "name": "Melanotan 1",
    "category": "skin",
    "categoryLabel": "Skin Research",
    "shortDescription": "Linear alpha-MSH analog with high MC1R selectivity for pigmentation research.",
    "description": "Melanotan I (afamelanotide) is a linear analogue of alpha-melanocyte-stimulating hormone (α-MSH) with high selectivity for the MC1R receptor. Research applications include studying melanocortin receptor signaling, skin pigmentation pathways, and photoprotection mechanisms.",
    "dosageInfo": "Supplied as 10mg lyophilized powder. Store at -20°C.",
    "featured": false,
    "variants": [
      { "label": "10mg", "price": 40, "salePrice": 45, "sku": "MT1-10" }
    ],
    "reviews": [
      { "id": "r1", "author": "Lena B.", "rating": 5, "date": "2025-10-25", "content": "High purity MT1, arrived with third-party CoA. Fast shipping." },
      { "id": "r2", "author": "Sam R.", "rating": 4, "date": "2025-09-12", "content": "Good quality, well-packaged. Reconstitutes cleanly." }
    ]
  },
  {
    "id": "melanotan-2",
    "slug": "melanotan-2",
    "name": "Melanotan 2",
    "category": "skin",
    "categoryLabel": "Skin Research",
    "shortDescription": "Cyclic alpha-MSH analog with broad melanocortin receptor affinity for research.",
    "description": "Melanotan II is a cyclic lactam analog of alpha-MSH with non-selective affinity for MC1R, MC3R, MC4R, and MC5R. Research has investigated effects on pigmentation, energy homeostasis, and melanocortin receptor pharmacology in laboratory models.",
    "dosageInfo": "Supplied as 10mg lyophilized powder. Store at -20°C.",
    "featured": false,
    "variants": [
      { "label": "10mg", "price": 40, "salePrice": 45, "sku": "MT2-10" }
    ],
    "reviews": [
      { "id": "r1", "author": "Carlos A.", "rating": 5, "date": "2025-11-03", "content": "Good purity, arrived well packaged. Reliable source for MT2 research." },
      { "id": "r2", "author": "Heidi W.", "rating": 4, "date": "2025-09-28", "content": "Solid product. Consistent quality, ships promptly." }
    ]
  },
  {
    "id": "semax",
    "slug": "semax",
    "name": "Semax",
    "category": "skin",
    "categoryLabel": "Skin Research",
    "shortDescription": "ACTH-derived heptapeptide studied for neuroprotection and cognitive research.",
    "description": "Semax is a synthetic heptapeptide derived from the N-terminal fragment of ACTH. Originally developed for cerebrovascular disorder research, it has been studied for potential effects on BDNF expression, dopaminergic neurotransmission, and neuroprotection in cell and animal models.",
    "dosageInfo": "Supplied as 10mg lyophilized powder. Store at -20°C.",
    "featured": false,
    "variants": [
      { "label": "10mg", "price": 35, "salePrice": 45, "sku": "SEMAX-10" }
    ],
    "reviews": [
      { "id": "r1", "author": "Ivan P.", "rating": 5, "date": "2025-10-20", "content": "Excellent purity, fast shipping. Using for BDNF expression research." },
      { "id": "r2", "author": "Nina K.", "rating": 4, "date": "2025-08-15", "content": "Good product, arrives well-packaged. Will reorder for our next study." }
    ]
  },
  {
    "id": "glow-blend",
    "slug": "glow-blend",
    "name": "GLOW Blend",
    "category": "skin",
    "categoryLabel": "Skin Research",
    "shortDescription": "Proprietary blend of GHK-Cu, Melanotan I, and supportive peptides for skin research.",
    "description": "The GLOW Blend is a proprietary lyophilized preparation combining GHK-Cu (copper peptide), Melanotan I, and complementary skin research peptides. Formulated for researchers studying combined melanocortin and copper peptide signaling in skin biology.",
    "dosageInfo": "Supplied as 70mg total lyophilized blend. Store at -20°C.",
    "featured": true,
    "variants": [
      { "label": "70mg", "price": 130, "salePrice": 140, "sku": "GLOW-70" }
    ],
    "reviews": [
      { "id": "r1", "author": "Isabelle F.", "rating": 5, "date": "2025-11-12", "content": "Amazing blend for skin research. Great value compared to buying components separately." },
      { "id": "r2", "author": "Tom R.", "rating": 5, "date": "2025-10-05", "content": "Top-notch purity, ships with individual CoAs for each component. Very impressed." },
      { "id": "r3", "author": "Yuki T.", "rating": 4, "date": "2025-09-18", "content": "Good blend, ships fast. Second order for our skin biology lab." }
    ]
  },
  {
    "id": "l-carnitine",
    "slug": "l-carnitine",
    "name": "L-Carnitine",
    "category": "solutions",
    "categoryLabel": "Solution Preparations",
    "shortDescription": "Amino acid derivative in sterile solution for mitochondrial and metabolic research.",
    "description": "L-Carnitine is an amino acid derivative essential for mitochondrial fatty acid oxidation, facilitating transport of long-chain fatty acyl groups across the inner mitochondrial membrane. Research applications include lipid metabolism, mitochondrial function, and insulin sensitivity studies.",
    "dosageInfo": "Available in 600mg/mL, 2000mg/mL, and 4000mg/mL sterile solutions. Refrigerate upon receipt.",
    "featured": false,
    "variants": [
      { "label": "600mg", "price": 25, "sku": "LCARN-600" },
      { "label": "2000mg", "price": 75, "sku": "LCARN-2000" },
      { "label": "4000mg", "price": 115, "sku": "LCARN-4000" }
    ],
    "reviews": [
      { "id": "r1", "author": "Derek M.", "rating": 5, "date": "2025-10-28", "content": "Good sterile solution, arrived sealed and refrigerated. Exactly as described." },
      { "id": "r2", "author": "Tina G.", "rating": 4, "date": "2025-09-05", "content": "Good quality, the 2000mg vial is great value for extended research." }
    ]
  },
  {
    "id": "shredx-blend",
    "slug": "shredx-blend",
    "name": "ShredX Blend",
    "category": "solutions",
    "categoryLabel": "Solution Preparations",
    "shortDescription": "Proprietary lipolytic peptide blend in sterile solution for adipocyte research.",
    "description": "ShredX is a proprietary sterile solution combining L-Carnitine, 5-Amino-1MQ, and additional metabolic research agents. Formulated for researchers studying adipocyte biology, lipid mobilization, and metabolic pathway modulation.",
    "dosageInfo": "Supplied as 10mL sterile solution. Store at 2–8°C.",
    "featured": false,
    "variants": [
      { "label": "10ml", "price": 60, "salePrice": 65, "sku": "SHREDX-10" }
    ],
    "reviews": [
      { "id": "r1", "author": "Brad L.", "rating": 5, "date": "2025-11-05", "content": "Well-formulated blend, ships cold. Using for lipid mobilization research." },
      { "id": "r2", "author": "Cassie N.", "rating": 4, "date": "2025-09-22", "content": "Solid product. Arrived sealed with lot number. Good value." }
    ]
  },
  {
    "id": "nad-5amino1mq",
    "slug": "nad-5amino1mq",
    "name": "NAD+ & High Dose 5-Amino-1MQ",
    "category": "solutions",
    "categoryLabel": "Solution Preparations",
    "shortDescription": "NAD+ coenzyme and NNMT inhibitor combination for cellular energy and aging research.",
    "description": "Combines Nicotinamide Adenine Dinucleotide (NAD+) with 5-Amino-1-methylquinolinium (5-Amino-1MQ), a selective NNMT inhibitor. Research has studied 5-Amino-1MQ for elevating cellular NAD+ by inhibiting nicotinamide N-methyltransferase. Combined preparation supports research into sirtuins, PARP, and aging biology.",
    "dosageInfo": "Supplied as combined lyophilized/solution preparation. Refrigerate upon receipt.",
    "featured": false,
    "variants": [
      { "label": "Standard", "price": 165, "salePrice": 220, "sku": "NAD5A-STD" }
    ],
    "reviews": [
      { "id": "r1", "author": "Prof. A. Chen", "rating": 5, "date": "2025-10-15", "content": "Excellent for NAD+ biology research. High purity, arrived well-packaged." },
      { "id": "r2", "author": "Mike D.", "rating": 5, "date": "2025-09-02", "content": "Best combination product available. Fast shipping and great customer support." }
    ]
  },
  {
    "id": "bacteriostatic-water",
    "slug": "bacteriostatic-water",
    "name": "Bacteriostatic Water",
    "category": "solutions",
    "categoryLabel": "Solution Preparations",
    "shortDescription": "Sterile water with 0.9% benzyl alcohol for peptide reconstitution.",
    "description": "Bacteriostatic Water (BW) is sterile water preserved with 0.9% benzyl alcohol for multi-dose reconstitution of lyophilized research compounds. The benzyl alcohol inhibits bacterial growth, allowing extended use of reconstituted preparations. Standard lab supply.",
    "dosageInfo": "30mL multi-dose vial. Store at room temperature. Use within 28 days of opening.",
    "featured": false,
    "variants": [
      { "label": "30ml", "price": 15, "sku": "BW-30" }
    ],
    "reviews": [
      { "id": "r1", "author": "Laura T.", "rating": 5, "date": "2025-10-10", "content": "Always order with my peptides. Great price, arrives sealed." },
      { "id": "r2", "author": "Greg P.", "rating": 5, "date": "2025-08-20", "content": "Essential supply item. Ships fast, good price." }
    ]
  },
  {
    "id": "glp1",
    "slug": "glp1",
    "name": "GLP1",
    "category": "isolates",
    "categoryLabel": "Freeze Dried Isolates",
    "shortDescription": "GLP-1 receptor agonist analog for incretin and appetite regulation research.",
    "description": "GLP-1 (Glucagon-Like Peptide-1) agonist isolate for research into incretin hormone signaling, insulin secretion, glucagon suppression, and satiety pathways. High-purity lyophilized isolate for laboratory reconstitution and research use.",
    "dosageInfo": "Available in 10mg and 30mg lyophilized preparations. Store at -20°C.",
    "featured": true,
    "variants": [
      { "label": "10mg", "price": 80, "sku": "GLP1-10" },
      { "label": "30mg", "price": 140, "sku": "GLP1-30" }
    ],
    "reviews": [
      { "id": "r1", "author": "Jessica L.", "rating": 5, "date": "2025-11-14", "content": "Excellent purity, arrived with mass spec CoA. Fast shipping. My go-to source." },
      { "id": "r2", "author": "Robert M.", "rating": 5, "date": "2025-10-30", "content": "Third order of GLP1. Consistent quality every time. Proton is reliable." },
      { "id": "r3", "author": "Amy C.", "rating": 5, "date": "2025-10-12", "content": "Clean powder, reconstitutes well. Shipping was fast and cold-packaged." },
      { "id": "r4", "author": "Nathan W.", "rating": 4, "date": "2025-09-25", "content": "Good quality, great price on the 30mg. Will continue ordering." }
    ]
  },
  {
    "id": "glp2",
    "slug": "glp2-glp-gip",
    "name": "GLP2 GLP/GIP",
    "category": "isolates",
    "categoryLabel": "Freeze Dried Isolates",
    "shortDescription": "Dual GLP-1/GIP receptor agonist for synergistic incretin signaling research.",
    "description": "Dual incretin agonist targeting both GLP-1 and GIP (Glucose-Dependent Insulinotropic Polypeptide) receptors. Research has investigated dual agonism for synergistic effects on insulin secretion, glucose homeostasis, lipid metabolism, and body weight regulation in laboratory models.",
    "dosageInfo": "Available in 10mg, 20mg, and 40mg lyophilized preparations. Store at -20°C.",
    "featured": true,
    "variants": [
      { "label": "10mg", "price": 85, "sku": "GLP2-10" },
      { "label": "20mg", "price": 125, "sku": "GLP2-20" },
      { "label": "40mg", "price": 160, "sku": "GLP2-40" }
    ],
    "reviews": [
      { "id": "r1", "author": "Patricia H.", "rating": 5, "date": "2025-11-18", "content": "Best dual agonist available at this price point. Mass spec CoA included, ships cold." },
      { "id": "r2", "author": "Kevin J.", "rating": 5, "date": "2025-11-05", "content": "Fourth order. Proton's GLP2 is consistently pure and ships incredibly fast." },
      { "id": "r3", "author": "Melissa T.", "rating": 5, "date": "2025-10-18", "content": "Ordered the 40mg for extended research. Excellent value at this quantity." },
      { "id": "r4", "author": "Brian S.", "rating": 4, "date": "2025-10-01", "content": "Good product, solid purity. Minor note: ice pack had partially melted but peptide was still well-preserved." },
      { "id": "r5", "author": "Erin W.", "rating": 5, "date": "2025-09-14", "content": "Reliable source, good pricing, fast shipping. The 20mg is perfect for my study timeline." }
    ]
  },
  {
    "id": "glp3",
    "slug": "glp3-glp-gip-gluc",
    "name": "GLP3 GLP/GIP/GLUC",
    "category": "isolates",
    "categoryLabel": "Freeze Dried Isolates",
    "shortDescription": "Triple receptor agonist targeting GLP-1, GIP, and glucagon pathways simultaneously.",
    "description": "GLP3 is a triagonist targeting GLP-1, GIP, and glucagon receptors. Published preclinical research has examined synergistic effects on metabolic rate, energy expenditure, glucose regulation, and lipid homeostasis. One of the most advanced compounds in metabolic research.",
    "dosageInfo": "Available in 10mg and 20mg lyophilized preparations. Store at -20°C.",
    "featured": true,
    "variants": [
      { "label": "10mg", "price": 95, "sku": "GLP3-10" },
      { "label": "20mg", "price": 140, "sku": "GLP3-20" }
    ],
    "reviews": [
      { "id": "r1", "author": "Dr. M. Williams", "rating": 5, "date": "2025-11-20", "content": "Exceptional purity on the GLP3. Mass spec confirms >99%. Proton is the best source I've found." },
      { "id": "r2", "author": "Lucas F.", "rating": 5, "date": "2025-11-08", "content": "Third order of GLP3/GIP/GLUC. Consistent quality, ships with dry ice." },
      { "id": "r3", "author": "Hannah G.", "rating": 5, "date": "2025-10-22", "content": "Best triple agonist on the market. CoA attached, fast shipping, great packaging." },
      { "id": "r4", "author": "Omar S.", "rating": 5, "date": "2025-10-10", "content": "Using for metabolic rate research. Excellent product, will be a repeat customer." },
      { "id": "r5", "author": "Steph K.", "rating": 4, "date": "2025-09-28", "content": "Good quality, reasonable price. CoA shows 98.4% purity which is solid." },
      { "id": "r6", "author": "Victor P.", "rating": 5, "date": "2025-09-15", "content": "My entire lab orders from Proton now. The GLP3 in particular is hard to source this pure elsewhere." }
    ]
  },
  {
    "id": "capsulated-glp",
    "slug": "capsulated-glp-orforglipron",
    "name": "Capsulated GLP Orforglipron",
    "category": "isolates",
    "categoryLabel": "Freeze Dried Isolates",
    "shortDescription": "Oral non-peptidic GLP-1 receptor agonist for bioavailability and receptor research.",
    "description": "Orforglipron is an oral, non-peptidic, small-molecule GLP-1 receptor agonist designed for oral bioavailability. Research applications include comparing oral vs injectable GLP-1 pharmacodynamics and studying non-peptide approaches to incretin receptor agonism.",
    "dosageInfo": "Supplied as research capsules. Store at room temperature, away from light and moisture.",
    "featured": false,
    "variants": [
      { "label": "Capsules", "price": 125, "sku": "CGLP-CAPS" }
    ],
    "reviews": [
      { "id": "r1", "author": "Rachel P.", "rating": 5, "date": "2025-11-01", "content": "Novel compound, hard to source. Proton has it at a fair price with CoA." },
      { "id": "r2", "author": "Alex D.", "rating": 4, "date": "2025-09-20", "content": "Good quality oral formulation. Packaging is professional." }
    ]
  },
  {
    "id": "nad-plus",
    "slug": "nad-plus",
    "name": "NAD+",
    "category": "isolates",
    "categoryLabel": "Freeze Dried Isolates",
    "shortDescription": "High-purity Nicotinamide Adenine Dinucleotide for cellular energy and aging research.",
    "description": "NAD+ is a coenzyme central to cellular metabolism, serving as an electron carrier and substrate for sirtuins, PARPs, and other NAD+-dependent enzymes. Research into NAD+ has examined mitochondrial function, DNA repair, cellular aging, and metabolic regulation.",
    "dosageInfo": "Available in 100mg and 250mg lyophilized preparations. Store at -20°C, protect from light.",
    "featured": false,
    "variants": [
      { "label": "100mg", "price": 45, "sku": "NAD-100" },
      { "label": "250mg", "price": 80, "sku": "NAD-250" }
    ],
    "reviews": [
      { "id": "r1", "author": "Prof. S. Lee", "rating": 5, "date": "2025-11-10", "content": "Excellent purity NAD+. Using for sirtuin activation research. Will continue ordering." },
      { "id": "r2", "author": "Diane W.", "rating": 5, "date": "2025-10-05", "content": "Good packaging, light-protected vial, ships fast. The 250mg is great value." },
      { "id": "r3", "author": "Tony M.", "rating": 4, "date": "2025-09-01", "content": "Solid product. Confirmed purity by HPLC. Good price for the 100mg size." }
    ]
  },
  {
    "id": "glp2-starter-bundle",
    "slug": "glp2-starter-bundle",
    "name": "GLP2 Starter Bundle",
    "category": "isolates",
    "categoryLabel": "Freeze Dried Isolates",
    "shortDescription": "GLP2 dual agonist (10mg) bundled with bacteriostatic water for a complete research starter kit.",
    "description": "The GLP2 Starter Bundle includes 10mg GLP/GIP dual agonist with bacteriostatic water and research support materials — everything needed to begin dual incretin receptor research. Ideal for researchers entering the GLP-1/GIP field.",
    "dosageInfo": "Bundle includes 10mg GLP2 lyophilized isolate and 10mL bacteriostatic water. Store per individual component instructions.",
    "featured": false,
    "variants": [
      { "label": "Bundle", "price": 100, "salePrice": 110, "sku": "GLP2-BUNDLE" }
    ],
    "reviews": [
      { "id": "r1", "author": "Chris V.", "rating": 5, "date": "2025-10-28", "content": "Perfect starter bundle. Everything needed in one order, great price." },
      { "id": "r2", "author": "Sara N.", "rating": 4, "date": "2025-09-15", "content": "Convenient bundle, shipped together properly cold-packed. Solid value." }
    ]
  },
  {
    "id": "glp3-starter-bundle",
    "slug": "glp3-starter-bundle",
    "name": "GLP3 Starter Bundle",
    "category": "isolates",
    "categoryLabel": "Freeze Dried Isolates",
    "shortDescription": "GLP3 triple agonist (10mg) bundled with bacteriostatic water for complete research setup.",
    "description": "The GLP3 Starter Bundle includes 10mg GLP/GIP/Glucagon triple receptor agonist with bacteriostatic water, providing a complete starting package for triple incretin pathway research — the most comprehensive incretin research bundle available.",
    "dosageInfo": "Bundle includes 10mg GLP3 lyophilized isolate and 10mL bacteriostatic water. Store per individual component instructions.",
    "featured": false,
    "variants": [
      { "label": "Bundle", "price": 120, "salePrice": 135, "sku": "GLP3-BUNDLE" }
    ],
    "reviews": [
      { "id": "r1", "author": "James K.", "rating": 5, "date": "2025-11-05", "content": "Great bundle for starting triple agonist research. Good price, ships fast." },
      { "id": "r2", "author": "Monica R.", "rating": 5, "date": "2025-10-12", "content": "Excellent value. Having bacteriostatic water included is very convenient." }
    ]
  }
]
```

**Step 2: Commit**

```bash
git add data/products.json
git commit -m "chore: seed product catalog data"
```

---

### Task 6: Cart Context (TDD)

**Files:**
- Create: `__tests__/cartContext.test.tsx`
- Create: `contexts/CartContext.tsx`

**Step 1: Write failing tests**

Create `__tests__/cartContext.test.tsx`:

```typescript
import { render, act, screen } from '@testing-library/react'
import { CartProvider, useCart } from '@/contexts/CartContext'
import { CartItem } from '@/types'

const testItem: CartItem = {
  productId: 'bpc-157',
  productSlug: 'bpc-157',
  productName: 'BPC-157',
  variantLabel: '10mg',
  variantSku: 'BPC157-10',
  price: 55,
  quantity: 1,
}

function TestConsumer() {
  const { items, total, itemCount, addItem, removeItem, updateQuantity, clearCart } = useCart()
  return (
    <div>
      <span data-testid="count">{itemCount}</span>
      <span data-testid="total">{total}</span>
      <button onClick={() => addItem(testItem)}>add</button>
      <button onClick={() => removeItem('BPC157-10')}>remove</button>
      <button onClick={() => updateQuantity('BPC157-10', 3)}>update</button>
      <button onClick={() => clearCart()}>clear</button>
    </div>
  )
}

describe('CartContext', () => {
  beforeEach(() => localStorage.clear())

  it('starts empty', () => {
    render(<CartProvider><TestConsumer /></CartProvider>)
    expect(screen.getByTestId('count').textContent).toBe('0')
    expect(screen.getByTestId('total').textContent).toBe('0')
  })

  it('adds an item', () => {
    render(<CartProvider><TestConsumer /></CartProvider>)
    act(() => { screen.getByText('add').click() })
    expect(screen.getByTestId('count').textContent).toBe('1')
    expect(screen.getByTestId('total').textContent).toBe('55')
  })

  it('increments quantity on duplicate add', () => {
    render(<CartProvider><TestConsumer /></CartProvider>)
    act(() => { screen.getByText('add').click() })
    act(() => { screen.getByText('add').click() })
    expect(screen.getByTestId('count').textContent).toBe('2')
    expect(screen.getByTestId('total').textContent).toBe('110')
  })

  it('removes an item', () => {
    render(<CartProvider><TestConsumer /></CartProvider>)
    act(() => { screen.getByText('add').click() })
    act(() => { screen.getByText('remove').click() })
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('updates quantity', () => {
    render(<CartProvider><TestConsumer /></CartProvider>)
    act(() => { screen.getByText('add').click() })
    act(() => { screen.getByText('update').click() })
    expect(screen.getByTestId('count').textContent).toBe('3')
    expect(screen.getByTestId('total').textContent).toBe('165')
  })

  it('clears cart', () => {
    render(<CartProvider><TestConsumer /></CartProvider>)
    act(() => { screen.getByText('add').click() })
    act(() => { screen.getByText('clear').click() })
    expect(screen.getByTestId('count').textContent).toBe('0')
  })
})
```

**Step 2: Run tests — expect FAIL**

```bash
npm test -- --testPathPattern=cartContext
```
Expected: FAIL — module not found.

**Step 3: Implement CartContext**

Create `contexts/CartContext.tsx`:

```typescript
'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { CartItem } from '@/types'

interface CartContextValue {
  items: CartItem[]
  total: number
  itemCount: number
  addItem: (item: CartItem) => void
  removeItem: (sku: string) => void
  updateQuantity: (sku: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'proton_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.variantSku === item.variantSku)
      if (existing) {
        return prev.map(i =>
          i.variantSku === item.variantSku
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })
  }

  const removeItem = (sku: string) => {
    setItems(prev => prev.filter(i => i.variantSku !== sku))
  }

  const updateQuantity = (sku: string, quantity: number) => {
    if (quantity <= 0) { removeItem(sku); return }
    setItems(prev =>
      prev.map(i => i.variantSku === sku ? { ...i, quantity } : i)
    )
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, total, itemCount, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
```

**Step 4: Run tests — expect PASS**

```bash
npm test -- --testPathPattern=cartContext
```
Expected: 6 passing.

**Step 5: Commit**

```bash
git add contexts/CartContext.tsx __tests__/cartContext.test.tsx
git commit -m "feat: CartContext with localStorage persistence (TDD)"
```

---

**Phase 1 complete.** Next: run Phase 2 (`2026-02-27-phase-2-shell.md`) in a fresh session.
