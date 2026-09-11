import { venue, venueLinks } from '../content.js'
import Band, { Arrow, Title } from './Band.jsx'
import Reveal from './Reveal.jsx'

const linkClass =
  'group inline-flex items-center gap-2 font-display text-xl text-wine underline decoration-gold/60 underline-offset-[6px] transition-colors duration-300 hover:decoration-wine'

/** Venue name and address beside a muted embedded map, with navigation links. */
export default function Venue() {
  return (
    <Band id="venue" tone="blush">
      <div className="md:col-span-5">
        <Reveal>
          <Title className="text-wine">The venue</Title>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 md:mt-14">
          <p className="font-display text-3xl leading-tight text-wine md:text-4xl">{venue.name}</p>
          <p className="mt-2 font-display text-xl text-ink/70 md:text-2xl">
            {venue.street}, {venue.city}
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <a href={venueLinks.google} target="_blank" rel="noreferrer" className={linkClass}>
              Google Maps
              <Arrow className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
            </a>
            <a href={venueLinks.waze} target="_blank" rel="noreferrer" className={linkClass}>
              Waze
              <Arrow className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="md:col-span-7">
        <div className="overflow-hidden rounded-2xl bg-blush-deep ring-1 ring-gold/40 shadow-[0_30px_60px_-24px_rgba(61,15,18,0.4)]">
          <iframe
            title={`Map to ${venue.name}`}
            src={venueLinks.embed}
            className="block h-72 w-full md:h-[460px]"
            style={{ filter: 'saturate(0.6) contrast(0.95)' }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Reveal>
    </Band>
  )
}
