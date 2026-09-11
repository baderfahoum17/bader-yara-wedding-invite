// Hero olive branches and the Schedule bloom jump. Opens the invitation, screenshots the
// names hero (branch composition), then the Schedule section at rest, clicks the bloom
// beside "The day", and checks the 8 PM entry is centred in the viewport afterwards.
// Usage: node verification/additions.mjs <url> <outDir> [viewports...]
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const [url = 'http://localhost:4173/bader-yara-wedding-invite/', outDir = 'verification', ...only] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })

const devices = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  { name: 'tablet', viewport: { width: 820, height: 1180 }, deviceScaleFactor: 1 },
  { name: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'mobile-short', viewport: { width: 375, height: 667 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
].filter((d) => !only.length || only.includes(d.name))

const browser = await chromium.launch()
const all = {}
let anyFailed = false

const rect = (loc) => loc.evaluate((el) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, right: r.right, bottom: r.bottom } })
const overlaps = (a, b) => a.x < b.right && b.x < a.right && a.y < b.bottom && b.y < a.bottom

for (const dev of devices) {
  const { name, ...ctx } = dev
  const page = await browser.newPage(ctx)
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  const shot = (file, opts = {}) => page.screenshot({ path: join(outDir, `${name}-${file}.png`), ...opts })

  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  await page.getByRole('button', { name: 'Open the invitation' }).click()
  await page.waitForTimeout(3600)
  const r = {}

  // Hero: branch present, and its box must not overlap the names, ampersand, or date block.
  const branch = page.locator('#names svg.branch-hairline')
  r.branchVisible = await branch.isVisible()
  r.branchBox = await rect(branch)
  // Collision test per drawn shape (leaves, stems, olives), so the rotated SVG's large
  // bounding box does not count as a hit; the other sprig is excluded from the text set.
  const shapes = await branch.locator('path, ellipse, circle').evaluateAll((els) => els.map((el) => { const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, right: b.right, bottom: b.bottom } }))
  const textBoxes = await page.locator('#names h1 span, #names p, #names svg:not(.branch-hairline)').evaluateAll((els) => els.map((el) => { const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, right: b.right, bottom: b.bottom, text: (el.textContent || el.tagName).trim().slice(0, 20) } }))
  r.branchCollisions = textBoxes.filter((b) => shapes.some((s) => overlaps(s, b))).map((b) => b.text)
  r.branchShapesOnScreen = shapes.filter((s) => s.right > 0 && s.bottom > 0 && s.x < dev.viewport.width).length + '/' + shapes.length
  await shot('07-hero-branches')

  // Schedule: at rest, then tap the bloom.
  await page.locator('#schedule').scrollIntoViewIfNeeded()
  await page.evaluate(() => { const s = document.querySelector('#schedule'); window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY, behavior: 'auto' }) })
  await page.waitForTimeout(2200)
  await page.locator('#schedule').screenshot({ path: join(outDir, `${name}-08-schedule.png`) })
  await shot('08b-schedule-viewport')

  const bloom = page.getByRole('button', { name: /Jump to the ceremony time/ })
  r.bloomLabel = await bloom.getAttribute('aria-label')
  const bloomBox = await rect(bloom)
  r.bloomBox = { w: Math.round(bloomBox.w), h: Math.round(bloomBox.h) }
  r.scrollBefore = await page.evaluate(() => Math.round(window.scrollY))
  const beforeTarget = await rect(page.locator('#ceremony-time'))
  r.targetTopBefore = Math.round(beforeTarget.y)

  // Keyboard: Tab until the bloom has focus, so :focus-visible really applies.
  await page.evaluate(() => document.activeElement?.blur?.())
  let tabs = 0
  while (tabs++ < 12 && !(await bloom.evaluate((el) => el === document.activeElement))) await page.keyboard.press('Tab')
  r.reachedByTab = await bloom.evaluate((el) => el === document.activeElement)
  r.focusOutline = await bloom.evaluate((el) => el.matches(':focus-visible') + ' | ' + getComputedStyle(el).outlineStyle + ' ' + getComputedStyle(el).outlineWidth + ' ' + getComputedStyle(el).outlineColor + ' r=' + getComputedStyle(el).borderRadius)
  await bloom.scrollIntoViewIfNeeded()
  await page.waitForTimeout(700)
  const fb = await rect(bloom)
  const cx = Math.max(0, fb.x - 40), cy = Math.max(0, fb.y - 40)
  await shot('08c-bloom-focus', { clip: { x: cx, y: cy, width: Math.min(fb.w + 80, dev.viewport.width - cx), height: Math.min(fb.h + 80, dev.viewport.height - cy) } })
  await page.evaluate(() => document.activeElement.blur())
  await page.evaluate(() => { const s = document.querySelector('#schedule'); window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY, behavior: 'auto' }) })
  await page.waitForTimeout(400)
  r.scrollBefore = await page.evaluate(() => Math.round(window.scrollY))

  if (dev.hasTouch) await bloom.tap()
  else await bloom.click()
  await page.waitForTimeout(300)
  await shot('08d-schedule-after-tap-mid')
  await page.waitForTimeout(1100)
  r.scrollAfter = await page.evaluate(() => Math.round(window.scrollY))
  const target = await rect(page.locator('#ceremony-time'))
  const vh = dev.viewport.height
  const centre = target.y + target.h / 2
  r.targetTopAfter = Math.round(target.y)
  r.targetCentredOffset = Math.round(centre - vh / 2)
  r.targetInView = target.y >= 0 && target.bottom <= vh
  r.focusedId = await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName)
  r.hitPresent = (await page.locator('#ceremony-time .schedule-hit-rule').count()) === 1 && (await page.locator('#ceremony-time .schedule-hit-time').count()) === 1
  await shot('08e-schedule-after-tap')

  r.errors = errors
  all[name] = r
  const ok = r.branchVisible && r.branchCollisions.length === 0 && r.bloomBox.w >= 44 && r.bloomBox.h >= 44 && r.reachedByTab && r.focusOutline.startsWith('true | solid') && r.targetInView && Math.abs(r.targetCentredOffset) < 40 && r.hitPresent && r.focusedId === 'ceremony-time' && !errors.length
  if (!ok) { anyFailed = true; console.error(`[${name}] FAILED`, r) }
  await page.close()
}

console.log(JSON.stringify(all, null, 2))
await browser.close()
if (anyFailed) process.exit(1)
console.log('ADDITIONS CHECKS PASSED')
