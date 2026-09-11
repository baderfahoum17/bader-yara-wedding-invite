import { motion } from 'framer-motion'
import { longDate, schedule, weekday } from '../content.js'
import Band, { Title } from './Band.jsx'
import Reveal from './Reveal.jsx'
import { ease } from '../motion.js'

/** The day's two moments, set as large times on hairlines that draw in from the left. */
export default function Schedule() {
  return (
    <Band id="schedule" tone="taupe">
      <div className="md:col-span-4">
        <Reveal>
          <Title>The day</Title>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 font-display text-xl text-olive-deep/80 md:text-2xl">
            {weekday}, {longDate}
          </p>
        </Reveal>
      </div>

      <ol className="grid grid-cols-1 gap-12 md:col-span-8 md:grid-cols-2 md:gap-x-12 md:self-end md:pl-6">
        {schedule.map((item, i) => (
          <li key={item.time} className="relative pt-7">
            <motion.span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-olive/70"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.4, ease, delay: 0.15 + i * 0.15 }}
              style={{ transformOrigin: 'left' }}
            />
            <Reveal delay={0.25 + i * 0.15} y={16}>
              <span className="tabular block font-display text-5xl font-light leading-none text-olive-deep md:text-6xl">
                {item.time}
              </span>
              <span className="mt-4 block max-w-[22ch] font-display text-xl leading-snug text-olive-deep/80 md:text-2xl">
                {item.title}
              </span>
            </Reveal>
          </li>
        ))}
      </ol>
    </Band>
  )
}
