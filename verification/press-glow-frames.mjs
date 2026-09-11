// Captures the seal press as it actually renders, using a CDP screencast: every frame
// arrives with the browser's own timestamp, so "140ms after the tap" is honest (a
// page.screenshot() call lands 300-600ms late, and Playwright's video recorder drops
// frames under load). Writes <outDir>/<device>-press-glow-<ms>.png crops around the
// seal for a few offsets, the ~140ms crop as <device>-seal-press-glow.png, and the
// full ~140ms frame as <device>-press-glow.png.
// Usage: node verification/press-glow-frames.mjs <url> <outDir>
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

const [url = 'http://localhost:4173/bader-yara-wedding-invite/', outDir = 'verification/cover'] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })
const devices = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  { name: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
]
const OFFSETS = [60, 100, 140, 200, 260, 340]
const browser = await chromium.launch()

for (const { name, ...ctx } of devices) {
  const context = await browser.newContext(ctx)
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3400)
  const seal = page.getByRole('button', { name: 'Open the invitation' })
  const box = await seal.boundingBox()

  const cdp = await context.newCDPSession(page)
  const frames = []
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    frames.push({ t: metadata.timestamp, data })
    await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {})
  })
  await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1 })
  await page.waitForTimeout(300)

  // Tap time on the browser's clock: the `click` handler runs open() synchronously, so
  // stamp it from inside the page at the moment the event fires.
  await page.evaluate(() => {
    window.__tapAt = null
    document.querySelector('button[aria-label="Open the invitation"]').addEventListener('click', () => { window.__tapAt = Date.now() / 1000 }, { once: true, capture: true })
  })
  if (ctx.hasTouch) await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2)
  else await seal.click()
  const tapAt = await page.evaluate(() => window.__tapAt)
  await page.waitForTimeout(1200)
  await cdp.send('Page.stopScreencast')
  await context.close()

  // Screencast frames are not necessarily at deviceScaleFactor; measure the first frame.
  writeFileSync(join(outDir, `${name}-press-glow.png`), Buffer.from(frames[0].data, 'base64'))
  const probe = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', join(outDir, `${name}-press-glow.png`)]).toString().trim()
  const [fw] = probe.split(',').map(Number)
  const dsf = fw / ctx.viewport.width
  const pad = Math.round(box.width * 1.2)
  const crop = `crop=${Math.round((box.width + pad * 2) * dsf)}:${Math.round((box.height + pad * 2) * dsf)}:${Math.round((box.x - pad) * dsf)}:${Math.round((box.y - pad) * dsf)}`
  const full = join(outDir, `${name}-press-glow.png`)
  const cropTo = (buf, out) => {
    writeFileSync(full, buf)
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', full, '-vf', crop, out])
  }
  const pick = (ms) => {
    const target = tapAt + ms / 1000
    return frames.filter((f) => f.t <= target).at(-1) ?? frames[0]
  }
  const log = { tapAt, frames: frames.length, fps: Math.round(frames.length / ((frames.at(-1).t - frames[0].t) || 1)), picked: {} }
  for (const off of OFFSETS) {
    const f = pick(off)
    log.picked[off] = Math.round((f.t - tapAt) * 1000)
    const buf = Buffer.from(f.data, 'base64')
    cropTo(buf, join(outDir, `${name}-press-glow-${off}ms.png`))
    if (off === 140) cropTo(buf, join(outDir, `${name}-seal-press-glow.png`))
  }
  // Leave the full frame at ~140ms in place.
  writeFileSync(full, Buffer.from(pick(140).data, 'base64'))
  console.log(name, JSON.stringify(log))
}
await browser.close()
