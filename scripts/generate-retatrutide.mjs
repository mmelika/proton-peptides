/**
 * Generate a new Retatrutide vial photo matching the style of existing product photos.
 * Uses bpc-157.png as the style reference.
 *
 * Usage:
 *   GEMINI_API_KEY=... node scripts/generate-retatrutide.mjs
 */
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import https from 'https'

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

const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) { console.error('GEMINI_API_KEY not set'); process.exit(1) }

const MODEL   = 'gemini-3.1-flash-image-preview'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`
const DIR     = new URL('../public/products', import.meta.url).pathname

const refPath = join(DIR, 'bpc-157.png')
const outPath = join(DIR, 'retatrutide.png')

console.log('Reading bpc-157.png as style reference...')
const refData = (await readFile(refPath)).toString('base64')

const prompt =
  `Using this peptide vial photo as a style reference, create a new product photo with IDENTICAL style: ` +
  `same waterfall + mossy rocks + ferns background, same water droplets on the glass, same vial shape and lighting. ` +
  `The label on the vial must read exactly: ` +
  `"ProtonPeptides" (top, small text), "Retatrutide" (large, bold, center), "10MG" (below product name), ` +
  `"Purity ≥ 99%" (small badge), "Research Use Only" (small text). ` +
  `White rectangular label, blue branding colors, crystal clear liquid inside. Portrait orientation.`

console.log('Generating Retatrutide photo via Gemini...')
const res = await httpsPost(API_URL, JSON.stringify({
  contents: [{ parts: [
    { text: prompt },
    { inlineData: { mimeType: 'image/png', data: refData } },
  ]}],
  generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
}))

if (!res.ok) { console.error(`HTTP ${res.status}: ${res.text().slice(0, 400)}`); process.exit(1) }

const json = res.json()
const part = json?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)
if (!part) { console.log('No image in response:', JSON.stringify(json).slice(0, 400)); process.exit(1) }

await writeFile(outPath, Buffer.from(part.inlineData.data, 'base64'))
console.log(`✓ saved retatrutide.png`)
