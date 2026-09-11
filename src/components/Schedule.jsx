import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { longDate, schedule, weekday } from '../content.js'
import Band, { Title } from './Band.jsx'
import Reveal from './Reveal.jsx'
import { Bloom } from './Floral.jsx'
import { ease } from '../motion.js'

const CEREMONY = 1 // index of the 8 PM entry, the moment guests most need to find

/** The day's two moments, set as large times on hairlines that draw in from the left. */
export default function Schedule() {
  const ceremonyRef = useRef(null)
  const [hit, setHit] = useState(0)

  // Bring the ceremony time into view and give it a short wash. On mobile the entries
  // stack, so this is a real scroll; on desktop they sit side by side, so the wash is
  // what makes the tap read. Focus moves with it for screen reader and keyboard users.
  const jumpToCeremony = () => {
    const el = ceremonyRef.current
    if (!el) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.focus({ preventScroll: true })
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
    setHit((n) => n + 1)
  }

  return (
    <Band id="schedule" tone="taupe">
      <div className="md:col-span-4">
        <Reveal>
          <div className="flex items-center gap-2 md:gap-3">
            <Title>The day</Title>
            <motion.button
              type="button"
              onClick={jumpToCeremony}
              aria-label={`Jump to the ceremony time, ${schedule[CEREMONY].time}`}
              className="-my-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-olive transition-colors hover:text-olive-deep focus-visible:rounded-full md:h-12 md:w-12"
              whileHover={{ rotate: 45 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.6, ease }}
            >
              <Bloom className="h-8 w-8 md:h-9 md:w-9" strokeWidth={1} />
            </motion.button>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 font-display text-xl text-olive-deep/80 md:text-2xl">
            {weekday}, {longDate}
          </p>
        </Reveal>
      </div>

      <ol className="grid grid-cols-1 gap-12 md:col-span-8 md:grid-cols-2 md:gap-x-12 md:self-end md:pl-6">
        {schedule.map((item, i) => {
          const isCeremony = i === CEREMONY
          return (
            <li
              key={item.time}
              id={isCeremony ? 'ceremony-time' : undefined}
              ref={isCeremony ? ceremonyRef : undefined}
              tabIndex={isCeremony ? -1 : undefined}
              className="relative pt-7 outline-none"
            >
              {/* On jump: the hairline redraws in full olive and the time warms to olive for a
                  moment. Re-keyed so every tap replays it. Same vocabulary as the draw-in. */}
              {isCeremony && hit > 0 && (
                <span key={hit} aria-hidden="true" className="schedule-hit-rule pointer-events-none absolute inset-x-0 top-0 h-px bg-olive" />
              )}
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-olive/70"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.4, ease, delay: 0.15 + i * 0.15 }}
                style={{ transformOrigin: 'left' }}
              />
              <Reveal delay={0.25 + i * 0.15} y={16} className="relative">
                <span
                  key={isCeremony ? hit : undefined}
                  className={`tabular block font-display text-5xl font-light leading-none text-olive-deep md:text-6xl ${isCeremony && hit > 0 ? 'schedule-hit-time' : ''}`}
                >
                  {item.time}
                </span>
                <span className="mt-4 block max-w-[22ch] font-display text-xl leading-snug text-olive-deep/80 md:text-2xl">
                  {item.title}
                </span>
              </Reveal>
            </li>
          )
        })}
      </ol>
    </Band>
  )
}
