/**
 * Trim excess whitespace/background padding from product vial images
 * so the vial fills more of the frame when displayed with object-contain.
 *
 * Usage: node scripts/trim-product-images.mjs
 */
import sharp from 'sharp'
import { readdir } from 'fs/promises'
import { join, extname, basename } from 'path'

const DIR = new URL('../public/products', import.meta.url).pathname

const files = (await readdir(DIR))
  .filter(f => ['.png', '.jpg', '.jpeg', '.webp'].includes(extname(f).toLowerCase()))
  .filter(f => f !== 'reference-vial.png') // keep reference untouched

console.log(`Trimming ${files.length} images...\n`)

let ok = 0, failed = 0

for (const file of files) {
  const src = join(DIR, file)
  try {
    const img = sharp(src)
    const meta = await img.metadata()

    // trim() removes pixels from edges that are similar to the corner pixels
    // threshold: 0–255 — how much color difference still counts as "background"
    const trimmed = await sharp(src)
      .trim({ threshold: 30 })
      .toBuffer({ resolveWithObject: true })

    // Only save if trim actually removed something meaningful (>5% reduction)
    const origPixels = meta.width * meta.height
    const newPixels  = trimmed.info.width * trimmed.info.height
    const reduction  = (origPixels - newPixels) / origPixels

    if (reduction > 0.02) {
      await sharp(trimmed.data).toFile(src)
      console.log(`✓ ${file.padEnd(45)} ${meta.width}×${meta.height} → ${trimmed.info.width}×${trimmed.info.height}  (-${(reduction*100).toFixed(1)}%)`)
    } else {
      console.log(`– ${file.padEnd(45)} already tight (${(reduction*100).toFixed(1)}% removed), skipped`)
    }
    ok++
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`)
    failed++
  }
}

console.log(`\nDone. ${ok} processed, ${failed} failed.`)
