import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Card from './Card.jsx'
import Reveal from './Reveal.jsx'
import { Divider } from './Floral.jsx'

const inputClass =
  'w-full rounded-xl border border-gold/50 bg-ivory/80 px-4 py-3 font-body text-lg text-ink placeholder:text-ink/40 outline-none transition focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/30'

const labelClass = 'mb-2 block font-display text-[11px] uppercase tracking-[0.3em] text-rose-gold'

/**
 * RSVP form, phase 1: client-side only. Submitting shows a static thank-you.
 * Nothing is sent or stored anywhere.
 */
export default function Rsvp() {
  const [name, setName] = useState('')
  const [attending, setAttending] = useState('yes')
  const [guests, setGuests] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitted(true)
  }

  return (
    <Card id="rsvp">
      <Reveal className="text-center">
        <p className="font-display text-[11px] uppercase tracking-[0.45em] text-rose-gold">Kindly reply</p>
        <h2 className="mt-3 font-script text-4xl text-wine">RSVP</h2>
        <Divider color="#c9a45c" className="my-6" />
      </Reveal>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="thanks"
            className="py-6 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            role="status"
          >
            <p className="font-script text-4xl text-wine">Thank you</p>
            <p className="mt-3 font-body text-lg text-ink/85">We&apos;ll be in touch.</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
          >
            <Reveal delay={0.1} y={12}>
              <label htmlFor="rsvp-name" className={labelClass}>
                Your name
              </label>
              <input
                id="rsvp-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </Reveal>

            <Reveal delay={0.2} y={12}>
              <span className={labelClass}>Will you attend?</span>
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Will you attend?">
                {[
                  { value: 'yes', label: 'Joyfully accept' },
                  { value: 'no', label: 'Regretfully decline' },
                ].map((opt) => {
                  const checked = attending === opt.value
                  return (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-center font-body text-base transition ${
                        checked
                          ? 'border-rose-gold bg-rose-gold text-ivory shadow-md'
                          : 'border-gold/50 bg-ivory/80 text-ink hover:border-rose-gold/70'
                      }`}
                    >
                      <input
                        type="radio"
                        name="attending"
                        value={opt.value}
                        checked={checked}
                        onChange={() => setAttending(opt.value)}
                        className="sr-only"
                      />
                      {opt.label}
                    </label>
                  )
                })}
              </div>
            </Reveal>

            <Reveal delay={0.3} y={12}>
              <label htmlFor="rsvp-guests" className={labelClass}>
                Number of guests
              </label>
              <input
                id="rsvp-guests"
                name="guests"
                type="number"
                inputMode="numeric"
                min={1}
                max={10}
                value={guests}
                disabled={attending === 'no'}
                onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))}
                className={`${inputClass} disabled:opacity-50`}
              />
            </Reveal>

            <Reveal delay={0.4} y={12}>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                className="gold-foil w-full rounded-full px-6 py-4 font-display text-xs uppercase tracking-[0.35em] text-wine-deep shadow-lg transition hover:brightness-105"
              >
                Send RSVP
              </motion.button>
            </Reveal>
          </motion.form>
        )}
      </AnimatePresence>
    </Card>
  )
}
