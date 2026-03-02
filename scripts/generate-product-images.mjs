/**
 * Batch product image generator using Gemini API
 * Usage: node scripts/generate-product-images.mjs
 *
 * Reads reference-vial.png, asks Gemini to swap the label text for each product,
 * saves results to public/products/[slug].png
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUTPUT_DIR = path.join(ROOT, 'public/products')
const REFERENCE_IMAGE = path.join(OUTPUT_DIR, 'reference-vial.png')
const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) { console.error('Set GEMINI_API_KEY env var'); process.exit(1) }
const MODEL = 'gemini-3-pro-image-preview'

// Products to generate — slug, label shown on vial, dosage shown on vial
const PRODUCTS = [
  { slug: 'bpc-157',                    name: 'BPC-157',       mg: '10MG'      },
  { slug: 'bpc-157-tb-500-blend',       name: 'BPC/TB',        mg: '10MG/10MG' },
  { slug: 'tb-500',                     name: 'TB-500',        mg: '10MG'      },
  { slug: 'cjc-1295-ipamorelin',        name: 'CJC/IPA',       mg: '5MG/5MG'   },
  { slug: 'mots-c',                     name: 'MOTS-C',        mg: '10MG'      },
  { slug: 'hcg',                        name: 'HCG',           mg: '5000 IU'   },
  { slug: 'tesamorelin',                name: 'TESA',          mg: '10MG'      },
  { slug: 'fox04-dri',                  name: 'FOX04-DRI',     mg: '10MG'      },
  { slug: 'mgf',                        name: 'MGF',           mg: '2MG'       },
  // ghk-cu → already saved as reference-vial.png copy
  { slug: 'melanotan-1',               name: 'MT-I',           mg: '10MG'      },
  { slug: 'melanotan-2',               name: 'MT-II',          mg: '10MG'      },
  { slug: 'semax',                      name: 'SEMAX',         mg: '10MG'      },
  { slug: 'glow-blend',                 name: 'GLOW Blend',    mg: '70MG'      },
  { slug: 'l-carnitine',               name: 'L-Carnitine',   mg: '600MG'     },
  { slug: 'shredx-blend',              name: 'ShredX',        mg: '10ML'      },
  { slug: 'nad-5amino1mq',             name: 'NAD+ / 5-AMQ',  mg: 'Std Dose'  },
  { slug: 'bacteriostatic-water',      name: 'B.Water',       mg: '30ML'      },
  { slug: 'glp1',                       name: 'GLP-1',         mg: '10MG'      },
  { slug: 'glp2-glp-gip',             name: 'GLP-2',         mg: '10MG'      },
  // retatrutide → already done
  { slug: 'capsulated-glp-orforglipron', name: 'ORFG',        mg: 'Oral Caps' },
  { slug: 'nad-plus',                  name: 'NAD+',          mg: '100MG'     },
  { slug: 'glp2-starter-bundle',       name: 'GLP-2 Bundle',  mg: '10MG'      },
  { slug: 'retatrutide-starter-bundle', name: 'Retatrutide Bundle', mg: '10MG' },
]

// How long to wait between requests (ms) to avoid rate-limit
const DELAY_MS = 8000

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function generateImage(slug, name, mg, referenceBase64) {
  const outputPath = path.join(OUTPUT_DIR, `${slug}.png`)

  // Skip if already generated
  if (fs.existsSync(outputPath)) {
    console.log(`⏭  ${slug} — already exists, skipping`)
    return true
  }

  const prompt = `Change the text GHK-Cu to ${name} and change 100MG to ${mg}`

  const body = {
    contents: [{
      parts: [
        { text: prompt },
        { inlineData: { mimeType: 'image/png', data: referenceBase64 } }
      ]
    }],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE']
    }
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
  )

  if (!res.ok) {
    const text = await res.text()
    console.error(`❌ ${slug} HTTP ${res.status}: ${text.slice(0, 300)}`)
    return false
  }

  const data = await res.json()

  // Find the image part in the response
  const parts = data?.candidates?.[0]?.content?.parts ?? []
  const imgPart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'))

  if (!imgPart) {
    const textPart = parts.find(p => p.text)
    console.error(`❌ ${slug} — no image in response. Text: ${textPart?.text?.slice(0, 200) ?? JSON.stringify(data).slice(0, 200)}`)
    return false
  }

  const imageBuffer = Buffer.from(imgPart.inlineData.data, 'base64')
  fs.writeFileSync(outputPath, imageBuffer)
  console.log(`✅ ${slug} → ${outputPath}`)
  return true
}

async function main() {
  console.log('🚀 Proton Peptides — batch image generator')
  console.log(`   Reference: ${REFERENCE_IMAGE}`)
  console.log(`   Output:    ${OUTPUT_DIR}`)
  console.log(`   Products:  ${PRODUCTS.length}\n`)

  if (!fs.existsSync(REFERENCE_IMAGE)) {
    console.error('❌ Reference image not found:', REFERENCE_IMAGE)
    process.exit(1)
  }

  const referenceBase64 = fs.readFileSync(REFERENCE_IMAGE).toString('base64')

  let success = 0
  let failed = 0

  for (let i = 0; i < PRODUCTS.length; i++) {
    const { slug, name, mg } = PRODUCTS[i]
    console.log(`[${i + 1}/${PRODUCTS.length}] Generating ${name} (${mg}) → ${slug}.png ...`)

    const ok = await generateImage(slug, name, mg, referenceBase64)
    if (ok) success++
    else failed++

    // Delay between requests (skip after last one)
    if (i < PRODUCTS.length - 1) {
      console.log(`   ⏳ Waiting ${DELAY_MS / 1000}s before next request...\n`)
      await sleep(DELAY_MS)
    }
  }

  console.log(`\n🎉 Done! ${success} generated, ${failed} failed.`)
  if (failed > 0) {
    console.log('Re-run the script to retry failed items (existing files are skipped).')
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
