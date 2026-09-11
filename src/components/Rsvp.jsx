import { useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimate } from 'framer-motion'
import Band, { Title } from './Band.jsx'
import Reveal from './Reveal.jsx'
import { ease } from '../motion.js'

const labelClass = 'mb-3 block font-display text-sm uppercase tracking-[0.3em] text-rose-gold'

const options = [
  { value: 'yes', label: 'Joyfully accept' },
  { value: 'no', label: 'Regretfully decline' },
]

/**
 * RSVP form, phase 1: client-side only. Submitting shows a static thank-you.
 * Nothing is sent or stored anywhere.
 */
export default function Rsvp() {
  const [name, setName] = useState('')
  const [attending, setAttending] = useState('yes')
  const [guests, setGuests] = useState(1)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const nameRef = useRef(null)
  const [scope, animate] = useAnimate()

  const onSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please tell us your name.')
      animate(scope.current, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.45, ease: 'easeOut' })
      nameRef.current?.focus()
      return
    }
    setSubmitted(true)
  }

  const step = (d) => setGuests((g) => Math.min(10, Math.max(1, g + d)))
  const declined = attending === 'no'

  return (
    <Band id="rsvp" tone="blush">
      <div className="md:col-span-5">
        <Reveal>
          <Title className="text-wine">RSVP</Title>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[28ch] text-pretty font-display text-xl leading-snug text-ink/70 md:text-2xl">
            Let us know if you will be joining us.
          </p>
        </Reveal>
      </div>

      <div className="md:col-span-6 md:col-start-7">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="thanks"
              role="status"
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease }}
            >
              <p className="font-display text-4xl leading-tight text-wine md:text-5xl">Thank you, {name.trim()}.</p>
              <p className="mt-4 font-display text-xl text-ink/75 md:text-2xl">We&apos;ll be in touch.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              noValidate
              className="space-y-10"
              exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
              transition={{ duration: 0.5, ease }}
            >
              <Reveal delay={0.15} y={14}>
                <label htmlFor="rsvp-name" className={labelClass}>
                  Your name
                </label>
                <div ref={scope}>
                  <input
                    ref={nameRef}
                    id="rsvp-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Full name"
                    value={name}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={error ? 'rsvp-name-error' : undefined}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (error) setError('')
                    }}
                    className={`w-full border-0 border-b bg-transparent px-0 py-3 font-display text-2xl text-wine outline-none transition-colors duration-300 placeholder:text-ink/35 focus:border-wine focus-visible:outline-none md:text-3xl ${
                      error ? 'border-alert' : 'border-gold/60'
                    }`}
                  />
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.p
                      id="rsvp-name-error"
                      role="alert"
                      className="mt-3 font-display text-lg text-alert"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </Reveal>

              <Reveal delay={0.25} y={14}>
                <span className={labelClass} id="rsvp-attending-label">
                  Will you attend?
                </span>
                <div
                  className="relative grid grid-cols-2 rounded-full border border-gold/50 bg-ivory/60 p-1"
                  role="radiogroup"
                  aria-labelledby="rsvp-attending-label"
                >
                  {options.map((opt) => {
                    const checked = attending === opt.value
                    return (
                      <label
                        key={opt.value}
                        className={`relative flex cursor-pointer items-center justify-center rounded-full px-3 py-3 text-center font-display text-lg transition-colors duration-500 md:text-xl ${
                          checked ? 'text-ivory' : 'text-ink hover:text-wine'
                        }`}
                      >
                        {checked && (
                          <motion.span
                            layoutId="rsvp-thumb"
                            className="absolute inset-0 rounded-full bg-wine shadow-[0_6px_16px_-6px_rgba(42,9,11,0.6)]"
                            transition={{ duration: 0.5, ease }}
                          />
                        )}
                        <input
                          type="radio"
                          name="attending"
                          value={opt.value}
                          checked={checked}
                          onChange={() => setAttending(opt.value)}
                          className="sr-only"
                        />
                        <span className="relative">{opt.label}</span>
                      </label>
                    )
                  })}
                </div>
              </Reveal>

              <Reveal delay={0.35} y={14}>
                <label htmlFor="rsvp-guests" className={labelClass}>
                  Number of guests
                </label>
                <div
                  className={`flex items-center gap-4 transition-opacity duration-500 ${declined ? 'pointer-events-none opacity-40' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    disabled={declined || guests <= 1}
                    aria-label="Fewer guests"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 text-wine transition-colors duration-300 hover:bg-ivory disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" aria-hidden="true">
                      <path d="M4 10h12" />
                    </svg>
                  </button>
                  <input
                    id="rsvp-guests"
                    name="guests"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={10}
                    value={guests}
                    disabled={declined}
                    onChange={(e) => setGuests(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
                    className="tabular w-16 border-0 border-b border-gold/60 bg-transparent py-2 text-center font-display text-2xl text-wine outline-none transition-colors duration-300 focus:border-wine md:text-3xl"
                  />
                  <button
                    type="button"
                    onClick={() => step(1)}
                    disabled={declined || guests >= 10}
                    aria-label="More guests"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 text-wine transition-colors duration-300 hover:bg-ivory disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" aria-hidden="true">
                      <path d="M4 10h12M10 4v12" />
                    </svg>
                  </button>
                </div>
              </Reveal>

              <Reveal delay={0.45} y={14} className="pt-2">
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2, ease }}
                  className="gold-foil w-full rounded-full px-10 py-4 font-display text-sm uppercase tracking-[0.3em] text-wine-deep shadow-[0_14px_30px_-12px_rgba(42,9,11,0.5)] transition-[filter] duration-300 hover:brightness-105 md:w-auto"
                >
                  Send RSVP
                </motion.button>
              </Reveal>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Band>
  )
}
