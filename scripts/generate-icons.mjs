import https from 'https'
import fs from 'fs'
import path from 'path'

const API_KEY = process.env.GEMINI_API_KEY
const MODEL = 'gemini-3.1-flash-image-preview'

const PROMPT = `Create a clean, professional square icon for a brand called "Proton Peptides".
The icon should be a stylized capital letter "P" with atom orbital rings around it,
rendered in bright blue (#0057FF) on a very dark navy background (#1A1A2E).
Minimal, modern, suitable as a browser favicon or app icon. Square format, no padding, no border.
No text other than the letter "P".`

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
