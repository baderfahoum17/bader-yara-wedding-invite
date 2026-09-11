import { motion } from 'framer-motion'
import { couple, dateLabel, longDate, weekday } from '../content.js'
import { Sprig } from './Floral.jsx'

const ease = [0.22, 1, 0.36, 1]

function fade(delay) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease, delay },
  }
}

/** Ornate arch frame with date, couple names in script, and a scroll cue. */
export default function NamesReveal({ active }) {
  return (
    <section id="names" className="relative flex min-h-[100dvh] flex-col items-center justify-center px-5 py-16 text-center">
      <div className="relative w-full max-w-sm">
        {/* Arch frame */}
        <svg viewBox="0 0 320 440" className="h-auto w-full" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="archGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a5813c" />
              <stop offset="40%" stopColor="#e6c98a" />
              <stop offset="60%" stopColor="#c9a45c" />
              <stop offset="100%" stopColor="#a5813c" />
            </linearGradient>
          </defs>
          <motion.path
            d="M 20 430 V 160 A 140 140 0 0 1 300 160 V 430"
            stroke="url(#archGold)"
            strokeWidth="1.6"
            initial={{ pathLength: 0 }}
            animate={active ? { pathLength: 1 } : {}}
            transition={{ duration: 1.8, ease }}
          />
          <motion.path
            d="M 34 430 V 165 A 126 126 0 0 1 286 165 V 430"
            stroke="url(#archGold)"
            strokeWidth="0.7"
            strokeDasharray="3 5"
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 0.8 } : {}}
            transition={{ duration: 1.2, delay: 0.8 }}
          />
          <path d="M 20 430 H 300" stroke="url(#archGold)" strokeWidth="1.6" />
        </svg>

        {/* Floral sprigs framing the arch */}
        <Sprig color="#d49aa3" className="absolute -left-2 top-[34%] h-10 w-28 -rotate-[70deg]" />
        <Sprig color="#d49aa3" className="absolute -right-2 top-[34%] h-10 w-28 rotate-[70deg] -scale-x-100" />
        <Sprig color="#c9a45c" className="absolute left-5 bottom-3 h-7 w-20 -rotate-12" />
        <Sprig color="#c9a45c" className="absolute right-5 bottom-3 h-7 w-20 rotate-12 -scale-x-100" />

        {/* Text inside the arch */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-10 pt-6">
          <motion.p {...fade(0.4)} className="font-display text-[11px] uppercase tracking-[0.45em] text-gold-light">
            Wedding Day
          </motion.p>
          <motion.p {...fade(0.55)} className="mt-2 font-display text-sm tracking-[0.3em] text-ivory/90">
            {dateLabel}
          </motion.p>

          <motion.div {...fade(0.8)} className="my-6 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />

          <motion.h1 {...fade(0.95)} className="font-script leading-[1.1] text-ivory">
            <span className="block text-6xl sm:text-7xl">{couple.first}</span>
            <span className="my-1 block font-display text-2xl italic text-gold-light">&amp;</span>
            <span className="block text-6xl sm:text-7xl">{couple.second}</span>
          </motion.h1>

          <motion.div {...fade(1.2)} className="my-6 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />

          <motion.p {...fade(1.35)} className="font-body text-base italic text-ivory/80">
            {weekday}, {longDate}
          </motion.p>
          <motion.p {...fade(1.5)} className="mt-3 font-body text-sm text-ivory/70">
            Together with their families, invite you to celebrate their marriage
          </motion.p>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#countdown"
        className="mt-10 flex flex-col items-center gap-2 font-display text-[10px] uppercase tracking-[0.4em] text-gold-light/80"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 2, duration: 1 }}
      >
        Scroll down
        <motion.span
          className="block h-8 w-px bg-gradient-to-b from-gold to-transparent"
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.a>
    </section>
  )
}
