/**
 * Ask Gemini to update each vial photo so the liquid inside matches
 * the real reconstituted color of that compound.
 *
 * Usage:
 *   GEMINI_API_KEY=... node scripts/recolor-vial-liquids.mjs
 *   GEMINI_API_KEY=... node scripts/recolor-vial-liquids.mjs ghk-cu   ← single product
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

// ─── Reconstituted liquid colors ──────────────────────────────────────────────
// Research sources: manufacturer specs, published studies, compounding literature
const LIQUID_COLORS = {
  // Copper chelate — deep dark blue in solution
  'ghk-cu':               'deep dark blue liquid, like a dark cobalt blue solution',

  // GLOW contains GHK-Cu as primary component → dark blue tinted
  'glow-blend':           'dark blue liquid, slightly lighter than pure GHK-Cu',

  // NAD+ has a slight golden-yellow tint when reconstituted
  'nad-plus':             'faint golden-yellow clear liquid',
  'nad-5amino1mq':        'faint golden-yellow clear liquid',

  // L-Carnitine solution is water-clear to very faintly yellow
  'l-carnitine':          'crystal clear colorless liquid, water-white',
  'shredx-blend':         'crystal clear colorless liquid, water-white',

  // Melanotan peptides reconstitute clear but can have a very faint pinkish tint
  'melanotan-1':          'crystal clear colorless liquid, water-white',
  'melanotan-2':          'crystal clear colorless liquid, water-white',

  // HCG — clear colorless
  'hcg':                  'crystal clear colorless liquid, water-white',

  // All other lyophilized peptides reconstitute to clear colorless
  'bpc-157':              'crystal clear colorless liquid, water-white',
  'bpc-157-tb-500-blend': 'crystal clear colorless liquid, water-white',
  'tb-500':               'crystal clear colorless liquid, water-white',
  'cjc-1295-ipamorelin':  'crystal clear colorless liquid, water-white',
  'mots-c':               'crystal clear colorless liquid, water-white',
  'tesamorelin':          'crystal clear colorless liquid, water-white',
  'fox04-dri':            'crystal clear colorless liquid, water-white',
  'mgf':                  'crystal clear colorless liquid, water-white',
  'semax':                'crystal clear colorless liquid, water-white',
  'glp1':                 'crystal clear colorless liquid, water-white',
  'glp2-glp-gip':         'crystal clear colorless liquid, water-white',
  'retatrutide':                  'crystal clear colorless liquid, water-white',
  'glp2-starter-bundle':          'crystal clear colorless liquid, water-white',
  'retatrutide-starter-bundle':   'crystal clear colorless liquid, water-white',
  'bacteriostatic-water': 'crystal clear colorless liquid, water-white',
}

// capsulated-glp-orforglipron is capsules — skip
const SKIP = new Set(['capsulated-glp-orforglipron', 'reference-vial'])

// ─── Which slugs to process (CLI arg or all) ──────────────────────────────────
const targets = process.argv[2]
  ? [process.argv[2]]
  : Object.keys(LIQUID_COLORS)

// ─── Main loop ────────────────────────────────────────────────────────────────
for (const slug of targets) {
  if (SKIP.has(slug)) { console.log(`⏭  skip ${slug}`); continue }

  const color = LIQUID_COLORS[slug]
  if (!color) { console.log(`⚠  no color entry for ${slug}, skipping`); continue }

  const src = join(DIR, `${slug}.png`)
  let imageData
  try {
    imageData = (await readFile(src)).toString('base64')
  } catch {
    console.log(`⚠  ${slug}.png not found, skipping`)
    continue
  }

  const prompt =
    `Change only the color of the liquid inside this peptide research vial to: ${color}. ` +
    `Keep everything else exactly the same — background, vial shape, lighting, water droplets, label. ` +
    `The white label on the vial must stay completely white and unaffected. ` +
    `Do not let any liquid color bleed onto, tint, or show through the white label in any way. ` +
    `Only the liquid visible through the clear glass should change color.`

  console.log(`→ ${slug}: ${color}`)

  try {
    const res = await httpsPost(API_URL, JSON.stringify({
      contents: [{ parts: [
        { text: prompt },
        { inlineData: { mimeType: 'image/png', data: imageData } },
      ]}],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
    }))

    if (!res.ok) {
      const err = await res.text()
      console.error(`  ✗ HTTP ${res.status}: ${err.slice(0, 200)}`)
      continue
    }

    const json = await res.json()
    const part = json?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)
    if (!part) {
      console.log(`  ✗ no image in response`)
      console.log('  response:', JSON.stringify(json).slice(0, 300))
      continue
    }

    await writeFile(src, Buffer.from(part.inlineData.data, 'base64'))
    console.log(`  ✓ saved ${slug}.png`)
  } catch (err) {
    console.error(`  ✗ ${err.message}`)
  }

  // Avoid rate limiting
  await new Promise(r => setTimeout(r, 8000))
}

console.log('\nDone.')
