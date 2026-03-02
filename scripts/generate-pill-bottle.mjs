/**
 * Generate a pill bottle product image for Orforglipron by using
 * an existing vial image as a style reference and asking Gemini
 * to replace the vial with a pill bottle/capsule container.
 *
 * Usage:
 *   GEMINI_API_KEY=... node scripts/generate-pill-bottle.mjs
 */
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import https from 'https'

const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) { console.error('GEMINI_API_KEY not set'); process.exit(1) }

const MODEL   = 'gemini-3.1-flash-image-preview'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`
const DIR     = new URL('../public/products', import.meta.url).pathname

function httpsPost(url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const bodyBuf = Buffer.from(body)
    const req = https.request({
      hostname: u.hostname, path: u.pathname + u.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': bodyBuf.length },
      timeout: 300_000,
    }, (res) => {
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString()
        resolve({ ok: res.statusCode < 400, status: res.statusCode,
                  json: () => JSON.parse(text), text: () => text })
      })
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')) })
    req.write(bodyBuf)
    req.end()
  })
}

// Use bpc-157 as the style reference (clear vial, good lighting)
const referenceSlug = 'bpc-157'
const outputSlug    = 'capsulated-glp-orforglipron'

const referenceImage = (await readFile(join(DIR, `${referenceSlug}.png`))).toString('base64')

const prompt =
  `Keep the exact same background, studio lighting, shadow, and overall product photography style as this image. ` +
  `Instead of a glass vial, replace it with a supplement pill bottle (amber/brown translucent plastic, white screw cap) ` +
  `filled with orange capsules visible inside. ` +
  `The label on the bottle should read "PROTON PEPTIDES" in small text at the top and "Orforglipron" in large bold text below it, with "30 Capsules" smaller underneath. ` +
  `The label style should match the brand look of the original — dark navy label with blue accent. ` +
  `No prescription text, no dosage instructions, no Rx markings.`

console.log(`→ Generating ${outputSlug} using ${referenceSlug} as style reference...`)

const res = await httpsPost(API_URL, JSON.stringify({
  contents: [{ parts: [
    { text: prompt },
    { inlineData: { mimeType: 'image/png', data: referenceImage } },
  ]}],
  generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
}))

if (!res.ok) {
  console.error(`HTTP ${res.status}:`, (await res.text()).slice(0, 300))
  process.exit(1)
}

const json = res.json()
const part = json?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)
if (!part) {
  console.error('No image in response:', JSON.stringify(json).slice(0, 300))
  process.exit(1)
}

await writeFile(join(DIR, `${outputSlug}.png`), Buffer.from(part.inlineData.data, 'base64'))
console.log(`✓ Saved ${outputSlug}.png`)
