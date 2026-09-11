import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { couple, longDate, weekday } from '../content.js'
import coverArt from '../assets/trunks-cover.jpg'
import { ease } from '../motion.js'


/**
 * Full-screen cover. The Trunks illustration sits on velvet like a card in hand,
 * closed by a wax seal on its bottom edge. Tap the seal: the seal gives way, the
 * card lifts out of focus, and the invitation underneath takes over.
 *
 * Load sequence is strictly ordered: card, then seal, then words. The only idle
 * motion is a slow ring breathing off the seal.
 */
export default function Cover({ onOpened }) {
  const [stage, setStage] = useState('sealed') // sealed -> opening -> done

  const open = () => {
    if (stage !== 'sealed') return
    setStage('opening')
    setTimeout(() => setStage('done'), 1050)
    setTimeout(onOpened, 1200)
  }

  const opening = stage === 'opening'

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          key="cover"
          className="texture-wine fixed inset-0 z-50 overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          {/* Soft light behind the card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(201,164,92,0.14), transparent 70%)',
            }}
          />

          <div className="mx-auto grid h-full max-w-[1200px] grid-cols-1 content-center justify-items-center gap-y-7 px-5 md:grid-cols-12 md:items-center md:gap-x-10 md:px-12">
            {/* Mobile-only monogram above the card */}
            <motion.p
              className="font-script text-4xl leading-none text-gold-light md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: opening ? 0 : 1 }}
              transition={{ duration: 0.9, ease, delay: opening ? 0 : 1.4 }}
            >
              {couple.first} &amp; {couple.second}
            </motion.p>

            {/* The card */}
            <div className="relative md:col-span-7 md:justify-self-end">
              <motion.figure
                className="cover-card relative m-0 overflow-visible"
                initial={{ opacity: 0, y: 40, scale: 0.98, filter: 'blur(14px)' }}
                animate={
                  opening
                    ? { opacity: 0, y: -24, scale: 1.05, filter: 'blur(18px)' }
                    : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
                }
                transition={{ duration: opening ? 1 : 1.4, ease, delay: opening ? 0.12 : 0.1 }}
              >
                <img
                  src={coverArt}
                  alt="Gold line illustration of Trunks, an English Cocker Spaniel, on a burgundy watercolor wash"
                  className="block h-full w-full rounded-[6px] object-cover shadow-[0_50px_90px_-30px_rgba(0,0,0,0.75)]"
                  draggable="false"
                  fetchPriority="high"
                />
              </motion.figure>

              {/* Wax seal on the bottom edge: the one tap target */}
              <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
                <motion.button
                  type="button"
                  onClick={open}
                  aria-label="Open the invitation"
                  className="relative block cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-4 focus-visible:ring-offset-wine-deep"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={opening ? { opacity: 0, scale: 0.82 } : { opacity: 1, scale: 1 }}
                  transition={{ duration: opening ? 0.35 : 0.8, ease, delay: opening ? 0 : 1.0 }}
                  whileTap={{ scale: 0.94 }}
                >
                  {!opening && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-gold-light/80"
                      initial={{ opacity: 0, scale: 1 }}
                      animate={{ opacity: [0, 0.6, 0], scale: [1, 1.5, 1.7] }}
                      transition={{ duration: 2.6, ease: 'easeOut', delay: 2.4, repeat: Infinity, repeatDelay: 1.2 }}
                    />
                  )}
                  <span className="wax-seal flex h-[88px] w-[88px] items-center justify-center rounded-full md:h-[104px] md:w-[104px]">
                    <span className="font-script pt-1 text-[2rem] leading-none text-ivory drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] md:text-[2.4rem]">
                      {couple.initials}
                    </span>
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Words: mobile gets the cue only; desktop gets the names beside the card */}
            <motion.div
              className="pt-8 text-center md:col-span-5 md:pt-0 md:text-left"
              initial={{ opacity: 0, y: 12 }}
              animate={opening ? { opacity: 0, y: 0 } : { opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: opening ? 0 : 1.5 }}
            >
              <h1 className="hidden font-script text-[5.5rem] leading-[0.95] text-ivory md:block">
                {couple.first}
                <span className="mx-4 font-display text-4xl italic text-gold-light">&amp;</span>
                {couple.second}
              </h1>
              <p className="hidden pt-6 font-display text-2xl text-ivory/85 md:block">
                {weekday}, {longDate}
              </p>
              <p className="font-display text-base uppercase tracking-[0.3em] text-gold-light/85 md:pt-10 md:text-sm">
                Tap the seal to open
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
