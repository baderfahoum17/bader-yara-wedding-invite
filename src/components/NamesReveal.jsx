import { motion } from 'framer-motion'
import { couple, longDate, venue, weekday } from '../content.js'
import { Sprig } from './Floral.jsx'
import { ease, settle } from '../motion.js'

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
 * The whole canvas settles in from a slight enlargement as the cover lifts away,
 * then the lines rise one after another.
 */
export default function NamesReveal({ active }) {
  return (
    <section id="names" className="surface-bone relative flex min-h-[100dvh] items-center overflow-hidden text-olive-deep">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 30% 20%, rgba(182,154,132,0.28), transparent 70%)' }}
      />

      <motion.div
        className="relative mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-y-14 px-6 pb-28 pt-24 md:grid-cols-12 md:items-end md:gap-x-10 md:px-12 md:pb-32"
        initial={{ scale: 1.06, opacity: 0 }}
        animate={active ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.3, ease: settle }}
        style={{ transformOrigin: '50% 40%' }}
      >
        <div className="md:col-span-8">
          <motion.div {...rise(active, 0.35)}>
            <Sprig color="#6f7452" className="mb-8 h-9 w-28" />
          </motion.div>

          <h1 className="font-script leading-[0.9] text-olive-deep">
            <motion.span {...rise(active, 0.5)} className="block text-[5rem] md:text-[8rem]">
              {couple.first}
            </motion.span>
            <motion.span
              {...rise(active, 0.65)}
              className="my-1 block font-display text-3xl italic text-olive md:my-2 md:pl-24 md:text-5xl"
            >
              &amp;
            </motion.span>
            <motion.span {...rise(active, 0.8)} className="block text-[5rem] md:pl-40 md:text-[8rem]">
              {couple.second}
            </motion.span>
          </h1>
        </div>

        <motion.div
          {...rise(active, 1.15)}
          className="border-t border-taupe/70 pt-8 md:col-span-4 md:border-l md:border-t-0 md:pb-4 md:pl-10 md:pt-0"
        >
          <p className="font-display text-2xl leading-tight text-olive-deep md:text-3xl">{weekday}</p>
          <p className="font-display text-2xl leading-tight text-olive-deep md:text-3xl">{longDate}</p>
          <div className="rule-taupe my-7 h-px w-16" />
          <p className="max-w-[28ch] font-display text-xl leading-snug text-olive-deep/80">
            Together with their families, invite you to celebrate their marriage.
          </p>
          <p className="mt-5 font-display text-lg text-olive-deep/80">
            {venue.name}, {venue.city}
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll cue: the one idle motion on this screen */}
      <motion.a
        href="#countdown"
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 font-display text-xs uppercase tracking-[0.35em] text-olive-deep/80"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 2.4, duration: 1.2, ease }}
      >
        Scroll
        <motion.span
          className="block h-10 w-px bg-gradient-to-b from-olive to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 0.9, 0.3] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 2.6 }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.a>
    </section>
  )
}
