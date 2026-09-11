// Cover-only screenshots: sealed cover, then frames through the opening sequence.
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
for (const { name, ...ctx } of devices) {
  const page = await browser.newPage(ctx)
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3400)
  await page.screenshot({ path: join(outDir, `${name}-cover.png`) })
  const florals = await page.locator('img[src*="cluster"]').evaluateAll((els) =>
    els.map((i) => ({ ok: i.complete && i.naturalWidth > 0, box: i.getBoundingClientRect().toJSON() })),
  )
  await page.getByRole('button', { name: 'Open the invitation' }).click()
  for (const t of [250, 550, 900]) {
    await page.waitForTimeout(t === 250 ? 250 : t === 550 ? 300 : 350)
    await page.screenshot({ path: join(outDir, `${name}-opening-${t}.png`) })
  }
  console.log(name, JSON.stringify({ florals, errors }))
  await page.close()
}
await browser.close()
