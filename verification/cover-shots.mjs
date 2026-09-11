// Cover-only screenshots: sealed cover at rest, the press glow ~140ms in, then frames
// through the opening sequence. Also checks the tap interaction itself: mobile uses a
// real touch tap, both viewports confirm the cover is gone afterwards, and a
// prefers-reduced-motion pass confirms opening still works without the expansion.
// Usage: node verification/cover-shots.mjs <url> <outDir>
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const [url = 'http://localhost:4173/bader-yara-wedding-invite/', outDir = 'verification/cover'] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })
const devices = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  { name: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
]
const browser = await chromium.launch()
let anyFailed = false

async function openSeal(page, touch) {
  const seal = page.getByRole('button', { name: 'Open the invitation' })
  if (touch) {
    const box = await seal.boundingBox()
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2)
  } else {
    await seal.click()
  }
}

for (const { name, ...ctx } of devices) {
  const page = await browser.newPage(ctx)
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3400)
  await page.screenshot({ path: join(outDir, `${name}-cover.png`) })
  const sealBox = await page.getByRole('button', { name: 'Open the invitation' }).boundingBox()
  await page.locator('button[aria-label="Open the invitation"]').screenshot({ path: join(outDir, `${name}-seal-rest.png`) })
  const florals = await page.locator('img[src*="cluster"]').evaluateAll((els) =>
    els.map((i) => ({ ok: i.complete && i.naturalWidth > 0, box: i.getBoundingClientRect().toJSON() })),
  )
  const t0 = Date.now()
  await openSeal(page, Boolean(ctx.hasTouch))
  await page.waitForTimeout(140)
  await page.screenshot({ path: join(outDir, `${name}-press-glow.png`) })
  const pad = Math.round(sealBox.width * 1.1)
  await page.screenshot({
    path: join(outDir, `${name}-seal-press-glow.png`),
    clip: { x: sealBox.x - pad, y: sealBox.y - pad, width: sealBox.width + pad * 2, height: sealBox.height + pad * 2 },
  })
  const glowAt = Date.now() - t0
  for (const t of [250, 550, 900]) {
    await page.waitForTimeout(t === 250 ? 110 : t === 550 ? 300 : 350)
    await page.screenshot({ path: join(outDir, `${name}-opening-${t}.png`) })
  }
  await page.waitForTimeout(1500)
  const coverGone = (await page.getByRole('button', { name: 'Open the invitation' }).count()) === 0
  const namesVisible = await page.locator('#names').isVisible()
  console.log(name, JSON.stringify({ glowShotMs: glowAt, coverGone, namesVisible, florals, errors }))
  if (!coverGone || !namesVisible || errors.length) anyFailed = true
  await page.close()

  // Reduced motion: same tap, must still open cleanly.
  const rm = await browser.newPage({ ...ctx, reducedMotion: 'reduce' })
  const rmErrors = []
  rm.on('pageerror', (e) => rmErrors.push(String(e)))
  rm.on('console', (m) => m.type() === 'error' && rmErrors.push(m.text()))
  await rm.goto(url, { waitUntil: 'networkidle' })
  await rm.waitForTimeout(3400)
  await openSeal(rm, Boolean(ctx.hasTouch))
  await rm.waitForTimeout(140)
  await rm.screenshot({ path: join(outDir, `${name}-press-glow-reduced-motion.png`) })
  await rm.waitForTimeout(2500)
  const rmGone = (await rm.getByRole('button', { name: 'Open the invitation' }).count()) === 0
  console.log(`${name} reduced-motion`, JSON.stringify({ coverGone: rmGone, errors: rmErrors }))
  if (!rmGone || rmErrors.length) anyFailed = true
  await rm.close()
}
await browser.close()
if (anyFailed) {
  console.error('COVER CHECKS FAILED')
  process.exit(1)
}
console.log('COVER CHECKS PASSED')
