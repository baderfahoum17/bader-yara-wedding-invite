import { motion } from 'framer-motion'
import { couple, longDate, venue, weekday } from '../content.js'
import { Sprig } from './Floral.jsx'
import { ease } from '../motion.js'

function rise(active, delay) {
  return {
    initial: { opacity: 0, y: 28, filter: 'blur(10px)' },
    animate: active ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {},
    transition: { duration: 1.3, ease, delay },
  }
}

/**
 * Opening spread: the names, set large in the script face, with the date and
 * invitation line beside them. Left-aligned and asymmetric on desktop; stacked on mobile.
 */
export default function NamesReveal({ active }) {
  return (
    <section id="names" className="texture-wine relative flex min-h-[100dvh] items-center text-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 30% 20%, rgba(201,164,92,0.16), transparent 70%)' }}
      />

      <div className="relative mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-y-14 px-6 pb-28 pt-24 md:grid-cols-12 md:items-end md:gap-x-10 md:px-12 md:pb-32">
        <div className="md:col-span-8">
          <motion.div {...rise(active, 0.1)}>
            <Sprig color="#d49aa3" className="mb-8 h-9 w-28" />
          </motion.div>

          <h1 className="font-script leading-[0.9] text-ivory">
            <motion.span {...rise(active, 0.25)} className="block text-[5rem] md:text-[8rem]">
              {couple.first}
            </motion.span>
            <motion.span
              {...rise(active, 0.4)}
              className="my-1 block font-display text-3xl italic text-gold-light md:my-2 md:pl-24 md:text-5xl"
            >
              &amp;
            </motion.span>
            <motion.span {...rise(active, 0.55)} className="block text-[5rem] md:pl-40 md:text-[8rem]">
              {couple.second}
            </motion.span>
          </h1>
        </div>

        <motion.div
          {...rise(active, 0.9)}
          className="border-t border-gold/30 pt-8 md:col-span-4 md:border-l md:border-t-0 md:pb-4 md:pl-10 md:pt-0"
        >
          <p className="font-display text-2xl leading-tight text-ivory md:text-3xl">{weekday}</p>
          <p className="font-display text-2xl leading-tight text-ivory md:text-3xl">{longDate}</p>
          <div className="rule-gold my-7 h-px w-16" />
          <p className="max-w-[28ch] font-display text-xl leading-snug text-ivory/80">
            Together with their families, invite you to celebrate their marriage.
          </p>
          <p className="mt-5 font-display text-lg text-ivory/60">
            {venue.name}, {venue.city}
          </p>
        </motion.div>
      </div>

      {/* Scroll cue: the one idle motion on this screen */}
      <motion.a
        href="#countdown"
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 font-display text-xs uppercase tracking-[0.35em] text-gold-light/70"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 2.2, duration: 1.2, ease }}
      >
        Scroll
        <motion.span
          className="block h-10 w-px bg-gradient-to-b from-gold to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 0.9, 0.3] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 2.4 }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.a>
    </section>
  )
}
