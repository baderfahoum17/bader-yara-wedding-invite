import { venue, venueLinks } from '../content.js'
import Card from './Card.jsx'
import Reveal from './Reveal.jsx'
import { Divider } from './Floral.jsx'

function Pin({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  )
}

/** Venue name and address with an embedded Google Map plus navigation links. */
export default function Venue() {
  return (
    <Card id="venue">
      <Reveal className="text-center">
        <p className="font-display text-[11px] uppercase tracking-[0.45em] text-rose-gold">Where</p>
        <h2 className="mt-3 font-script text-4xl text-wine">The Venue</h2>
        <Divider color="#c9a45c" className="my-6" />

        <Pin className="mx-auto h-8 w-8 text-rose-gold" />
        <p className="mt-2 font-display text-xl text-wine">{venue.name}</p>
        <p className="font-body text-lg text-ink/80">
          {venue.street}, {venue.city}
        </p>
      </Reveal>

      <Reveal delay={0.2} className="mt-6">
        <div className="overflow-hidden rounded-2xl border border-gold/50 shadow-md">
          <iframe
            title={`Map to ${venue.name}`}
            src={venueLinks.embed}
            className="block h-64 w-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Reveal>

      <Reveal delay={0.3} className="mt-5 flex justify-center gap-3">
        <a
          href={venueLinks.google}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-gold/60 bg-ivory/60 px-4 py-2 font-display text-[11px] uppercase tracking-[0.25em] text-wine transition hover:bg-ivory"
        >
          Google Maps
        </a>
        <a
          href={venueLinks.waze}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-gold/60 bg-ivory/60 px-4 py-2 font-display text-[11px] uppercase tracking-[0.25em] text-wine transition hover:bg-ivory"
        >
          Waze
        </a>
      </Reveal>
    </Card>
  )
}
