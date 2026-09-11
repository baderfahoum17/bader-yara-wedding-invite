import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { longDate, weddingDate, weekday } from '../content.js'
import Band, { Title } from './Band.jsx'
import Reveal from './Reveal.jsx'
import { ease } from '../motion.js'

function diff(target) {
  const ms = Math.max(0, target.getTime() - Date.now())
  const s = Math.floor(ms / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: ms === 0,
  }
}

const pad = (n) => String(n).padStart(2, '0')

function Unit({ value, label }) {
  const text = pad(value)
  return (
    <div className="flex flex-col items-start">
      <div className="relative h-[1em] w-full overflow-hidden font-display text-6xl font-light leading-none text-wine md:text-[6.5rem]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className="tabular absolute inset-0 block"
            initial={{ y: '70%', opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: '-70%', opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.55, ease }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-4 font-display text-xs uppercase tracking-[0.3em] text-rose-gold md:text-sm">{label}</span>
    </div>
  )
}

/** Live countdown to the wedding date, ticking every second. */
export default function Countdown() {
  const [t, setT] = useState(() => diff(weddingDate))

  useEffect(() => {
    const id = setInterval(() => setT(diff(weddingDate)), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <Band id="countdown" tone="blush">
      <div className="md:col-span-5">
        <Reveal>
          <Title className="text-wine">
            Until we say <em className="italic">I do</em>
          </Title>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[30ch] font-display text-xl leading-snug text-ink/70 md:text-2xl">
            {weekday}, {longDate}
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="md:col-span-7 md:self-end md:pl-6">
        {t.done ? (
          <p className="font-display text-5xl text-wine md:text-7xl">Today is the day</p>
        ) : (
          <div className="grid grid-cols-4 gap-4 md:gap-8" aria-live="polite">
            <Unit value={t.days} label="Days" />
            <Unit value={t.hours} label="Hours" />
            <Unit value={t.minutes} label="Min" />
            <Unit value={t.seconds} label="Sec" />
          </div>
        )}
      </Reveal>
    </Band>
  )
}
