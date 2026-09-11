import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { weddingDate } from '../content.js'
import Card from './Card.jsx'
import Reveal from './Reveal.jsx'
import { Divider } from './Floral.jsx'

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
    <div className="flex flex-col items-center">
      <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-gold/50 bg-ivory/70 shadow-inner sm:h-16 sm:w-16">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className="tabular absolute inset-0 flex items-center justify-center font-display text-2xl text-wine sm:text-3xl"
            initial={{ y: '60%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-60%', opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 font-display text-[9px] uppercase tracking-[0.3em] text-rose-gold">{label}</span>
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
    <Card id="countdown">
      <Reveal className="text-center">
        <p className="font-display text-[11px] uppercase tracking-[0.45em] text-rose-gold">Counting down</p>
        <h2 className="mt-3 font-script text-4xl text-wine">Until we say I do</h2>
        <Divider color="#c9a45c" className="my-6" />

        {t.done ? (
          <p className="font-display text-xl text-wine">Today is the day</p>
        ) : (
          <div className="flex items-start justify-center gap-2 sm:gap-3" aria-live="polite">
            <Unit value={t.days} label="Days" />
            <span className="pt-4 font-display text-2xl text-gold">:</span>
            <Unit value={t.hours} label="Hours" />
            <span className="pt-4 font-display text-2xl text-gold">:</span>
            <Unit value={t.minutes} label="Min" />
            <span className="pt-4 font-display text-2xl text-gold">:</span>
            <Unit value={t.seconds} label="Sec" />
          </div>
        )}
      </Reveal>
    </Card>
  )
}
