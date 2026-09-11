// Loads the invitation at desktop (1440x900) and mobile (390x844), checks the cover
// illustration loads, opens via the seal, walks every section, checks the countdown
// tick and map frame, exercises RSVP validation (empty name) and the happy path, and
// saves screenshots. Usage: node verification/verify.mjs <url> <outDir>
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const [url = 'http://localhost:4173/bader-yara-wedding-invite/', outDir = 'verification'] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })

const devices = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  { name: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
]

const browser = await chromium.launch()
const all = {}
let anyFailed = false

for (const dev of devices) {
  const { name, ...ctx } = dev
  const page = await browser.newPage(ctx)
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  const shot = (file, opts = {}) => page.screenshot({ path: join(outDir, `${name}-${file}.png`), ...opts })

  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3200)
  const r = {}
  r.coverImg = await page.locator('img[alt^="Olive line illustration of Trunks"]').evaluate((i) => i.complete && i.naturalWidth > 0)
  r.seal = await page.getByRole('button', { name: 'Open the invitation' }).isVisible()
  await shot('01-cover')

  await page.getByRole('button', { name: 'Open the invitation' }).click()
  await page.waitForTimeout(520)
  await shot('01b-opening')
  await page.waitForTimeout(2700)
  r.coverGone = (await page.getByRole('button', { name: 'Open the invitation' }).count()) === 0
  await shot('02-names')

  const ids = ['names', 'countdown', 'schedule', 'venue', 'rsvp', 'closing']
  for (const id of ids) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)
    r[id] = await page.locator(`#${id}`).isVisible()
  }

  const sec = () => page.locator('#countdown .tabular').nth(3).innerText()
  const a = await sec()
  await page.waitForTimeout(1500)
  r.countdownTicks = a !== (await sec())
  r.timeline = await page.locator('#schedule li').count()

  await page.locator('#venue').scrollIntoViewIfNeeded()
  await page.waitForTimeout(4500)
  r.mapSrc = await page.locator('#venue iframe').getAttribute('src')
  const mapFrame = page.frames().find((f) => f.url().includes('google.com/maps'))
  r.mapLoaded = Boolean(mapFrame) && (await mapFrame.locator('body *').count()) > 0
  await page.locator('#venue').screenshot({ path: join(outDir, `${name}-03-venue.png`) })
  r.cameoImg = await page.locator('#cameo img').evaluate((i) => i.complete && i.naturalWidth > 0)

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(600)
  await shot('full', { fullPage: true })

  // RSVP validation: empty name must show an inline error and not submit.
  const requests = []
  page.on('request', (q) => requests.push(q.url()))
  await page.locator('#rsvp').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1200)
  await page.getByRole('button', { name: 'Send RSVP' }).click()
  await page.waitForTimeout(700)
  r.rsvpErrorShown = await page.locator('#rsvp-name-error').isVisible()
  r.rsvpInvalidAttr = (await page.locator('#rsvp-name').getAttribute('aria-invalid')) === 'true'
  r.rsvpNotSubmitted = (await page.getByText("We'll be in touch.").count()) === 0
  await page.locator('#rsvp').screenshot({ path: join(outDir, `${name}-04-rsvp-error.png`) })

  // Happy path: name, accept, 2 guests via stepper, submit.
  await page.fill('#rsvp-name', 'Test Guest')
  await page.waitForTimeout(600) // let the error message finish its exit
  r.rsvpErrorCleared = (await page.locator('#rsvp-name-error').count()) === 0
  await page.getByText('Joyfully accept').click()
  await page.getByRole('button', { name: 'More guests' }).click()
  r.rsvpGuests = await page.inputValue('#rsvp-guests')
  await page.getByRole('button', { name: 'Send RSVP' }).click()
  await page.waitForTimeout(1300)
  r.rsvpThanks = await page.getByText("We'll be in touch.").isVisible()
  r.rsvpNetworkCalls = requests.filter((u) => !u.includes('google') && !u.includes('gstatic'))
  await page.locator('#rsvp').screenshot({ path: join(outDir, `${name}-05-rsvp-thanks.png`) })

  r.errors = errors
  all[name] = r

  const required = ['coverImg', 'seal', 'coverGone', ...ids, 'countdownTicks', 'mapLoaded', 'cameoImg', 'rsvpErrorShown', 'rsvpInvalidAttr', 'rsvpNotSubmitted', 'rsvpErrorCleared', 'rsvpThanks']
  const failed = required.filter((k) => !r[k])
  if (failed.length || r.timeline !== 2 || r.rsvpGuests !== '2' || errors.length) {
    anyFailed = true
    console.error(`[${name}] FAILED:`, failed, 'timeline:', r.timeline, 'guests:', r.rsvpGuests, 'errors:', errors)
  }
  await page.close()
}

console.log(JSON.stringify(all, null, 2))
await browser.close()
if (anyFailed) process.exit(1)
console.log('ALL CHECKS PASSED')
