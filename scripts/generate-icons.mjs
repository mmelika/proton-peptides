import https from 'https'
import fs from 'fs'
import path from 'path'

const API_KEY = process.env.GEMINI_API_KEY
const MODEL = 'gemini-3.1-flash-image-preview'

const PROMPT = `Design a favicon/browser icon for a brand called "Proton Peptides".
The icon is a perfect square, 512x512 pixels.
Design: a bold, glowing letter "P" in bright electric blue (#0057FF) centered on a deep navy/black background (#0d1117).
The "P" should have a clean sans-serif geometric style — thick strokes, modern, like a high-end tech or pharma brand.
Add a subtle atom ring orbiting around the "P" — a single elliptical arc in a lighter blue (#4d8bff), thin line, at about 45 degrees.
No gradients on the background — flat very dark navy. The "P" itself can have a very subtle inner glow in blue.
No text, no border, no rounded corners on the canvas itself — just the icon mark.
High contrast, looks sharp at small sizes like 16x16 or 32x32.`

const body = JSON.stringify({
  contents: [{ parts: [{ text: PROMPT }] }],
  generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
})

const req = https.request({
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  timeout: 120000,
}, res => {
  let data = ''
  res.on('data', d => data += d)
  res.on('end', () => {
    const json = JSON.parse(data)
    const imagePart = json.candidates?.[0]?.content?.parts?.find(p => p.inlineData)
    if (!imagePart) { console.error('No image returned:', data.slice(0, 500)); process.exit(1) }
    const buf = Buffer.from(imagePart.inlineData.data, 'base64')
    const outDir = path.join(process.cwd(), 'public')
    fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), buf)
    fs.writeFileSync(path.join(outDir, 'favicon.png'), buf)
    console.log('Icons saved to public/')
  })
})
req.on('error', e => { console.error(e); process.exit(1) })
req.on('timeout', () => { req.destroy(); console.error('timeout'); process.exit(1) })
req.write(body)
req.end()
