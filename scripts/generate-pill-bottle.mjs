import https from 'https'
import fs from 'fs'
import path from 'path'

const API_KEY = process.env.GEMINI_API_KEY
const MODEL = 'gemini-3.1-flash-image-preview'

// Products to generate pill bottle images for
const PRODUCTS = [
  {
    slug: 'capsulated-glp-orforglipron',
    label: 'Orforglipron\n30 Capsules',
    prompt: `Professional product photo of a single sleek supplement pill bottle with a white screw cap, on a clean dark navy (#1A1A2E) background.
The bottle is amber/translucent with visible orange capsules inside.
The label is clean and modern with a dark navy background and blue (#0057FF) accent elements. The label reads:
- "PROTON PEPTIDES" in small caps at the top
- "Orforglipron" in large bold white text in the center
- "30 Capsules" in smaller text below
No prescription text, no dosage instructions, no Rx markings, no pharmacy info. Clean supplement brand label only.
Dramatic studio lighting with a subtle blue-tinted rim light from the right. Soft shadow beneath the bottle.
Product photography, high detail, 4K, centered composition.
NO vials, NO syringes, NO needles. Pill bottle only.`,
  },
]

async function generateImage(product) {
  const body = JSON.stringify({
    contents: [{ parts: [{ text: product.prompt }] }],
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
  })

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 300000,
    }, res => {
      let data = ''
      res.on('data', d => data += d)
      res.on('end', () => {
        const json = JSON.parse(data)
        const imagePart = json.candidates?.[0]?.content?.parts?.find(p => p.inlineData)
        if (!imagePart) {
          console.error(`No image for ${product.slug}:`, data.slice(0, 500))
          reject(new Error('No image returned'))
          return
        }
        const buf = Buffer.from(imagePart.inlineData.data, 'base64')
        const outPath = path.join(process.cwd(), 'public', 'products', `${product.slug}.png`)
        fs.writeFileSync(outPath, buf)
        console.log(`✓ Saved ${product.slug}.png`)
        resolve()
      })
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out')) })
    req.write(body)
    req.end()
  })
}

async function main() {
  for (const product of PRODUCTS) {
    console.log(`Generating ${product.slug}...`)
    try {
      await generateImage(product)
    } catch (err) {
      console.error(`Failed ${product.slug}:`, err.message)
    }
  }
}

main()
