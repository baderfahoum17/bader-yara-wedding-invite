// Loads the invitation at a 375px mobile viewport, opens the envelope, checks all
// 7 sections, the countdown tick, the map iframe, and the RSVP flow, then saves
// screenshots. Usage: node verification/verify.mjs <url> <outDir>
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const [url = 'http://localhost:4173/bader-yara-wedding-invite/', outDir = 'verification'] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)
await page.screenshot({ path: join(outDir, 'mobile-01-envelope.png') })

const results = {}
results.envelope = await page.getByRole('button', { name: 'Open the invitation' }).isVisible()
await page.getByRole('button', { name: 'Open the invitation' }).click()
await page.waitForTimeout(3500)
results.envelopeGone = (await page.getByRole('button', { name: 'Open the invitation' }).count()) === 0
await page.screenshot({ path: join(outDir, 'mobile-02-names.png') })

// Scroll through so whileInView reveals fire, then verify each section.
const ids = ['names', 'countdown', 'schedule', 'venue', 'cameo', 'rsvp']
for (const id of ids) {
  await page.locator(`#${id}`).scrollIntoViewIfNeeded()
  await page.waitForTimeout(900)
  results[id] = await page.locator(`#${id}`).isVisible()
}

// Countdown ticks
const sec = () => page.locator('#countdown .tabular').nth(3).innerText()
const a = await sec()
await page.waitForTimeout(1500)
results.countdownTicks = a !== (await sec())
results.countdownText = await page.locator('#countdown').innerText()

results.timeline = await page.locator('#schedule li').count()
results.mapIframe = await page.locator('#venue iframe').getAttribute('src')
// The Google embed is cross-origin, so check that its frame actually loaded a document.
await page.locator('#venue').scrollIntoViewIfNeeded()
await page.waitForTimeout(4000)
const mapFrame = page.frames().find((f) => f.url().includes('google.com/maps'))
results.mapLoaded = Boolean(mapFrame) && (await mapFrame.locator('body *').count()) > 0
await page.locator('#venue').screenshot({ path: join(outDir, 'mobile-04-venue.png') })
results.cameoImg = await page.locator('#cameo img').evaluate((i) => i.complete && i.naturalWidth > 0)

// Full page (form still unsubmitted) for the verification artifact.
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(500)
await page.screenshot({ path: join(outDir, 'mobile-screenshot.png'), fullPage: true })

// RSVP: fill and submit, expect static thank-you, no network calls.
const requests = []
page.on('request', (r) => requests.push(r.url()))
await page.locator('#rsvp').scrollIntoViewIfNeeded()
await page.fill('#rsvp-name', 'Test Guest')
await page.getByText('Joyfully accept').click()
await page.fill('#rsvp-guests', '2')
await page.screenshot({ path: join(outDir, 'mobile-03-rsvp.png') })
await page.getByRole('button', { name: 'Send RSVP' }).click()
await page.waitForTimeout(1200)
results.rsvpThanks = await page.getByText("We'll be in touch.").isVisible()
results.rsvpNetworkCalls = requests.filter((u) => !u.includes('google') && !u.includes('gstatic'))

await page.locator('#rsvp').screenshot({ path: join(outDir, 'mobile-05-rsvp-thanks.png') })

results.errors = errors
console.log(JSON.stringify(results, null, 2))
await browser.close()

const required = ['envelope', 'envelopeGone', ...ids, 'countdownTicks', 'rsvpThanks', 'cameoImg', 'mapLoaded']
const failed = required.filter((k) => !results[k])
if (failed.length || results.timeline !== 2 || errors.length) {
  console.error('FAILED:', failed, 'timeline:', results.timeline, 'errors:', errors)
  process.exit(1)
}
console.log('ALL CHECKS PASSED')
