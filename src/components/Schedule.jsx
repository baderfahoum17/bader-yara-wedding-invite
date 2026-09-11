import { motion } from 'framer-motion'
import { schedule } from '../content.js'
import Card from './Card.jsx'
import Reveal from './Reveal.jsx'
import { Divider } from './Floral.jsx'

function Bloom({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <path d="M12 3c2 3 2 5.5 0 7.5-2-2-2-4.5 0-7.5zM12 21c-2-3-2-5.5 0-7.5 2 2 2 4.5 0 7.5zM3 12c3-2 5.5-2 7.5 0-2 2-4.5 2-7.5 0zM21 12c-3 2-5.5 2-7.5 0 2-2 4.5-2 7.5 0z" />
      <path d="M5.6 5.6c3.5.7 5.3 2.5 5.3 5.3-2.8 0-4.6-1.8-5.3-5.3zM18.4 18.4c-3.5-.7-5.3-2.5-5.3-5.3 2.8 0 4.6 1.8 5.3 5.3zM18.4 5.6c-.7 3.5-2.5 5.3-5.3 5.3 0-2.8 1.8-4.6 5.3-5.3zM5.6 18.4c.7-3.5 2.5-5.3 5.3-5.3 0 2.8-1.8 4.6-5.3 5.3z" />
    </svg>
  )
}

/** Vertical timeline: time on the left, event on the right, dot markers on a central line. */
export default function Schedule() {
  return (
    <Card id="schedule">
      <Reveal className="text-center">
        <p className="font-display text-[11px] uppercase tracking-[0.45em] text-rose-gold">The day</p>
        <h2 className="mt-3 font-script text-4xl text-wine">Schedule of Events</h2>
        <Divider color="#c9a45c" className="my-6" />
      </Reveal>

      <ol className="relative mx-auto max-w-xs">
        {/* Central line */}
        <motion.div
          className="absolute left-1/2 top-3 bottom-3 w-px -translate-x-1/2 bg-gradient-to-b from-gold via-rose-gold to-gold"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ transformOrigin: 'top' }}
          aria-hidden="true"
        />

        {schedule.map((item, i) => (
          <Reveal key={item.time} delay={0.3 + i * 0.25} y={16}>
            <li className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-6">
              <div className="text-right">
                <span className="tabular font-display text-lg text-wine">{item.time}</span>
              </div>
              <div className="relative flex h-8 w-8 items-center justify-center">
                <span className="absolute h-3 w-3 rounded-full border border-gold bg-blush shadow-[0_0_0_4px_rgba(247,228,225,1)]" />
                {i === 0 && <Bloom className="relative h-8 w-8 text-rose-gold" />}
              </div>
              <div className="text-left">
                <span className="font-body text-lg leading-tight text-ink">{item.title}</span>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </Card>
  )
}
