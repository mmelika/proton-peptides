/**
 * Extend each vial photo's WIDTH by mirroring the edge pixels outward
 * so it fills the product card (h-72) without white side-bars.
 *
 * Target ratio: 1.26:1  — matches the widest card layout (lg 3-col desktop).
 * Height is NEVER changed. Only left/right pixels are added.
 *
 * Usage:
 *   node scripts/extend-vial-backgrounds.mjs           ← all images
 *   node scripts/extend-vial-backgrounds.mjs bpc-157   ← single image
 *   node scripts/extend-vial-backgrounds.mjs bpc-157 --force  ← re-extend even if already wide
 */
import { readdir, rename } from 'fs/promises'
import { join, extname, basename } from 'path'
import sharp from 'sharp'

const DIR        = new URL('../public/products', import.meta.url).pathname
const TARGET_RATIO = 1.26   // lg 3-col desktop card aspect ratio (≈362×288)
const SKIP       = new Set(['capsulated-glp-orforglipron', 'reference-vial'])

const slugArg  = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : null
const forceArg = process.argv.includes('--force')

let files
if (slugArg) {
  const all = await readdir(DIR)
  files = all.filter(f => f.startsWith(slugArg + '.'))
} else {
  const all = await readdir(DIR)
  files = all.filter(f => ['.png', '.jpg', '.jpeg', '.webp'].includes(extname(f).toLowerCase()))
}

console.log(`Extending ${files.length} image(s) to ${TARGET_RATIO}:1 aspect ratio (width only)...\n`)

let ok = 0, skipped = 0, failed = 0

for (const file of files) {
  const slug = basename(file, extname(file))
  if (SKIP.has(slug)) { console.log(`⏭  skip ${slug}`); skipped++; continue }

  const src = join(DIR, file)
  try {
    const meta = await sharp(src).metadata()
    const currentRatio = meta.width / meta.height

    if (!forceArg && currentRatio >= TARGET_RATIO - 0.02) {
      console.log(`– ${slug.padEnd(42)} already ${currentRatio.toFixed(3)} ≥ ${TARGET_RATIO}, skipping`)
      skipped++
      continue
    }

    const targetWidth  = Math.round(meta.height * TARGET_RATIO)
    const addEachSide  = Math.round((targetWidth - meta.width) / 2)
    const tmp          = src + '.tmp.png'

    // Extend width only — height stays exactly the same
    // Write to temp file first (sharp can't read+write same path)
    await sharp(src)
      .extend({
        left:  addEachSide,
        right: addEachSide,
        extendWith: 'mirror',  // mirrors edge pixels for seamless backgrounds
      })
      .toFile(tmp)

    await rename(tmp, src)

    console.log(`✓ ${slug.padEnd(42)} ${meta.width}×${meta.height} → ${meta.width + addEachSide * 2}×${meta.height}  (+${addEachSide}px each side)`)
    ok++
  } catch (err) {
    console.error(`✗ ${slug}: ${err.message}`)
    failed++
  }
}

console.log(`\nDone. ${ok} extended, ${skipped} skipped, ${failed} failed.`)
