import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { couple, dateLabel } from '../content.js'

const ease = [0.22, 1, 0.36, 1]

/**
 * Full-screen envelope intro. Tap the wax seal: the seal cracks, the flap lifts,
 * a light burst washes over, then the envelope exits and hands control back.
 */
export default function Envelope({ onOpened }) {
  const [stage, setStage] = useState('sealed') // sealed -> cracking -> opening -> done

  const open = () => {
    if (stage !== 'sealed') return
    setStage('cracking')
    setTimeout(() => setStage('opening'), 550)
    setTimeout(() => setStage('done'), 1700)
    setTimeout(onOpened, 2100)
  }

  const opening = stage === 'opening' || stage === 'done'

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          key="envelope"
          className="fixed inset-0 z-50 flex items-center justify-center texture-wine px-6"
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.6, ease }}
        >
          {/* Gold-foil page edges */}
          <div className="pointer-events-none absolute inset-3 rounded-2xl border border-gold/50" />
          <div className="pointer-events-none absolute inset-4 rounded-xl border border-gold/25" />

          <motion.p
            className="absolute top-10 font-display text-[11px] uppercase tracking-[0.45em] text-gold-light/90"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: opening ? 0 : 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            You are invited
          </motion.p>

          {/* Envelope body */}
          <motion.button
            type="button"
            onClick={open}
            aria-label="Open the invitation"
            className="relative aspect-[4/3] w-full max-w-sm cursor-pointer outline-none"
            style={{ perspective: 1200 }}
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease }}
          >
            {/* Back panel */}
            <div className="absolute inset-0 rounded-md bg-gradient-to-b from-burgundy to-wine shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
              <div className="absolute inset-0 rounded-md border border-gold/40" />
            </div>

            {/* Letter peeking out once the flap opens */}
            <motion.div
              className="absolute left-[8%] right-[8%] top-[10%] h-[80%] rounded-sm texture-blush shadow-lg"
              initial={{ y: 0 }}
              animate={{ y: opening ? '-38%' : 0 }}
              transition={{ duration: 0.9, ease, delay: 0.25 }}
            >
              <div className="flex h-full flex-col items-center justify-start pt-5 text-center">
                <span className="font-display text-[10px] uppercase tracking-[0.4em] text-rose-gold">Wedding Day</span>
                <span className="mt-1 font-script text-3xl text-ink">
                  {couple.first} &amp; {couple.second}
                </span>
                <span className="font-display text-xs tracking-[0.3em] text-burgundy">{dateLabel}</span>
              </div>
            </motion.div>

            {/* Side and bottom flaps (pocket) */}
            <div
              className="absolute inset-0 rounded-md bg-gradient-to-br from-burgundy via-wine to-wine-deep"
              style={{ clipPath: 'polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)' }}
            >
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <polyline points="0,0 50,55 100,0" fill="none" stroke="rgba(201,164,92,0.6)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>

            {/* Top flap (hinged at the top edge) */}
            <motion.div
              className="absolute inset-x-0 top-0 h-[58%] origin-top"
              style={{ transformStyle: 'preserve-3d', zIndex: opening ? 0 : 20 }}
              animate={{ rotateX: opening ? -175 : 0 }}
              transition={{ duration: 1.1, ease }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-b from-burgundy to-wine"
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', backfaceVisibility: 'hidden' }}
              >
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <polyline points="0,0 50,99 100,0" fill="none" stroke="rgba(201,164,92,0.75)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              {/* Inside of the flap (visible after rotating) */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-wine-deep to-burgundy"
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', transform: 'rotateX(180deg)', backfaceVisibility: 'hidden' }}
              />
            </motion.div>

            {/* Wax seal */}
            <AnimatePresence>
              {stage === 'sealed' || stage === 'cracking' ? (
                <motion.div
                  key="seal"
                  className="absolute left-1/2 top-[55%] z-30 -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={
                    stage === 'cracking'
                      ? { scale: [1, 1.12, 0.9], rotate: [0, -6, 8], opacity: [1, 1, 0] }
                      : { scale: 1, rotate: 0, opacity: 1 }
                  }
                  exit={{ opacity: 0 }}
                  transition={
                    stage === 'cracking'
                      ? { duration: 0.55, times: [0, 0.4, 1], ease: 'easeIn' }
                      : { type: 'spring', stiffness: 220, damping: 16, delay: 0.7 }
                  }
                >
                  <motion.div
                    className="wax-seal flex h-20 w-20 items-center justify-center rounded-full"
                    animate={stage === 'sealed' ? { scale: [1, 1.04, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', delay: 1.6 }}
                  >
                    <span className="font-script text-3xl leading-none text-ivory drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                      {couple.initials}
                    </span>
                  </motion.div>
                  {/* Crack lines */}
                  {stage === 'cracking' && (
                    <svg viewBox="0 0 80 80" className="absolute inset-0 h-20 w-20" aria-hidden="true">
                      <motion.path
                        d="M40 6 L36 30 L46 44 L38 62 L42 76"
                        fill="none"
                        stroke="#2a090b"
                        strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </svg>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.button>

          {/* Tap cue */}
          <motion.p
            className="absolute bottom-12 font-display text-[11px] uppercase tracking-[0.4em] text-gold-light/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: opening ? 0 : [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.4, delay: 1.4 }}
          >
            Tap the seal to open
          </motion.p>

          {/* Light burst */}
          <AnimatePresence>
            {opening && (
              <motion.div
                key="burst"
                className="pointer-events-none absolute left-1/2 top-1/2 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,246,225,0.95) 0%, rgba(243,226,179,0.6) 30%, rgba(201,164,92,0) 70%)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 2.2, 6], opacity: [0, 1, 0.9] }}
                transition={{ duration: 1.3, ease: 'easeOut', delay: 0.35 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
