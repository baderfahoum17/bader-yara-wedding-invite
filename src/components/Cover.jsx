import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { couple, longDate, weekday } from '../content.js'
import coverArt from '../assets/trunks-cover.jpg'
import { ease } from '../motion.js'
import Monogram from './Monogram.jsx'
import CoverFlorals from './CoverFlorals.jsx'

const shadowRest = '0 50px 90px -30px rgba(58,64,50,0.45)'
const shadowLift = '0 80px 130px -30px rgba(58,64,50,0.5)'
const shadowGone = '0 20px 40px -20px rgba(58,64,50,0)'

/**
 * Full-screen cover. The Trunks illustration sits on taupe linen like a card in hand,
 * closed by a flat olive monogram seal on its bottom edge.
 *
 * Load sequence is strictly ordered: card, florals, seal, then words. Idle motion is a
 * slow ring breathing off the seal and the florals swaying (CoverFlorals, CSS-driven).
 *
 * Opening sequence, one timeline from the tap:
 *   0.00s  light blooms from the seal: a soft radial glow and a crisp ring expand
 *          outward while the seal itself brightens, lifts a touch, then fades
 *   0.15s  card lifts toward the viewer (scale up, shadow deepens) ...
 *   0.50s  ... then recedes: shrinks, drops, blurs out
 *   0.15s  florals part outward and fade as the card lifts (CoverFlorals)
 *   0.15s  cover words drift out; the mobile monogram rises faster than the card (parallax)
 *   1.05s  the linen backdrop fades; underneath, the names canvas settles in with a
 *          slight overshoot (NamesReveal, keyed on `active`), and the names rise after it.
 */
export default function Cover({ onOpened }) {
  const [stage, setStage] = useState('sealed') // sealed -> opening -> done
  const reduceMotion = useReducedMotion()

  const open = () => {
    if (stage !== 'sealed') return
    setStage('opening')
    setTimeout(onOpened, 1050)
    setTimeout(() => setStage('done'), 1050)
  }

  const opening = stage === 'opening'

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          key="cover"
          className="surface-taupe fixed inset-0 z-50 overflow-hidden text-olive-deep"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          {/* Soft light behind the card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(255,255,255,0.55), transparent 70%)' }}
          />

          <div className="mx-auto grid h-full max-w-[1200px] grid-cols-1 content-center justify-items-center gap-y-7 px-5 md:grid-cols-12 md:items-center md:gap-x-10 md:px-12">
            {/* Mobile-only monogram above the card */}
            <motion.div
              className="text-olive-deep md:hidden"
              initial={{ opacity: 0, y: 0 }}
              animate={opening ? { opacity: 0, y: -34 } : { opacity: 1, y: 0 }}
              transition={{ duration: opening ? 0.7 : 0.9, ease, delay: opening ? 0.1 : 1.4 }}
            >
              <Monogram className="h-[4.25rem] w-auto" title={`${couple.first} & ${couple.second}`} />
            </motion.div>

            {/* The card, framed by florals behind (z-0) and in front of (z-20) its edge */}
            <div className="relative md:col-span-7 md:justify-self-end">
              <CoverFlorals layer="behind" opening={opening} />
              <motion.figure
                className="cover-card relative z-10 m-0 overflow-visible rounded-[6px]"
                initial={{ opacity: 0, y: 40, scale: 0.98, filter: 'blur(14px)', boxShadow: shadowGone }}
                animate={
                  opening
                    ? {
                        scale: [1, 1.045, 0.9],
                        y: [0, -14, 48],
                        opacity: [1, 1, 0],
                        filter: ['blur(0px)', 'blur(0px)', 'blur(16px)'],
                        boxShadow: [shadowRest, shadowLift, shadowGone],
                      }
                    : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', boxShadow: shadowRest }
                }
                transition={
                  opening
                    ? { duration: 1.0, delay: 0.15, times: [0, 0.34, 1], ease: [0.22, 1, 0.36, 1] }
                    : { duration: 1.4, ease, delay: 0.1 }
                }
              >
                <img
                  src={coverArt}
                  alt="Olive line illustration of Trunks, an English Cocker Spaniel, on a bone and taupe watercolor wash"
                  className="block h-full w-full rounded-[6px] object-cover"
                  draggable="false"
                  fetchPriority="high"
                />
              </motion.figure>
              <CoverFlorals layer="front" opening={opening} />

              {/* Flat olive seal on the bottom edge: the one tap target */}
              <div className="absolute left-1/2 top-full z-30 -translate-x-1/2 -translate-y-1/2">
                <motion.button
                  type="button"
                  onClick={open}
                  aria-label="Open the invitation"
                  className="group relative block cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-4 focus-visible:ring-offset-bone-deep"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={
                    opening
                      ? reduceMotion
                        ? { opacity: 0, scale: 1 }
                        : { opacity: 0, scale: [1, 1.06, 0.94] }
                      : { opacity: 1, scale: 1 }
                  }
                  transition={
                    opening
                      ? {
                          // Seal stays solid while the light blooms (first 150ms), then fades
                          // out over the next 350ms as the card lifts.
                          opacity: { duration: 0.35, delay: 0.15, ease: 'easeOut' },
                          scale: { duration: 0.5, times: [0, 0.3, 1], ease: [0.22, 1, 0.36, 1] },
                        }
                      : { duration: 0.8, ease, delay: 1.0 }
                  }
                  whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                >
                  {/* Idle cue: a thin ring breathes outward every few seconds */}
                  {!opening && !reduceMotion && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-olive/60"
                      initial={{ opacity: 0, scale: 1 }}
                      animate={{ opacity: [0, 0.5, 0], scale: [1, 1.45, 1.65] }}
                      transition={{ duration: 2.6, ease: 'easeOut', delay: 2.4, repeat: Infinity, repeatDelay: 1.2 }}
                    />
                  )}

                  {/* Press light: a soft bloom and a crisp ring expand out from the seal.
                      Reduced motion: the bloom fades in and out in place, no expansion. */}
                  {opening && (
                    <>
                      <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-[35%] rounded-full"
                        style={{
                          background:
                            'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(243,239,230,0.55) 38%, rgba(243,239,230,0) 68%)',
                        }}
                        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.55 }}
                        animate={
                          reduceMotion
                            ? { opacity: [0, 0.9, 0], scale: 1 }
                            : { opacity: [0, 1, 0], scale: [0.55, 1.5, 2.4] }
                        }
                        transition={{ duration: 0.6, times: [0, 0.25, 1], ease: 'easeOut' }}
                      />
                      {!reduceMotion && (
                        <motion.span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-full border-2 border-bone"
                          initial={{ opacity: 0.9, scale: 1 }}
                          animate={{ opacity: 0, scale: 2.1 }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      )}
                    </>
                  )}

                  {/* The seal: flat olive disc, monogram in bone. Hover darkens a step;
                      the press flash (seal-flash, CSS) lifts it a shade lighter and back. */}
                  <span
                    className={`relative z-10 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-olive text-bone transition-colors duration-300 group-hover:bg-olive-deep md:h-[104px] md:w-[104px] ${opening ? 'seal-flash' : ''}`}
                  >
                    <Monogram className="h-[50px] w-auto md:h-[58px]" />
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Words: mobile gets the cue only; desktop gets the names beside the card */}
            <motion.div
              className="pt-8 text-center md:col-span-5 md:pt-0 md:text-left"
              initial={{ opacity: 0, y: 12 }}
              animate={opening ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
              transition={{ duration: opening ? 0.5 : 1, ease, delay: opening ? 0.15 : 1.5 }}
            >
              <h1 className="hidden font-script text-[5.5rem] leading-[0.95] text-olive-deep md:block">
                {couple.first}
                <span className="mx-4 font-display text-4xl italic text-olive">&amp;</span>
                {couple.second}
              </h1>
              <p className="hidden pt-6 font-display text-2xl text-olive-deep/80 md:block">
                {weekday}, {longDate}
              </p>
              <p className="font-display text-base uppercase tracking-[0.3em] text-olive-deep/80 md:pt-10 md:text-sm">
                Tap the seal to open
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
