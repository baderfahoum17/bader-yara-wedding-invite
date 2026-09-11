import { venue, venueLinks } from '../content.js'
import Band, { Arrow, Title } from './Band.jsx'
import Reveal from './Reveal.jsx'

const linkClass =
  'group inline-flex items-center gap-2 font-display text-2xl text-olive underline decoration-taupe underline-offset-[6px] transition-colors duration-300 hover:text-olive-deep hover:decoration-olive-deep'

/** Venue name and address beside a muted embedded map, with navigation links. */
export default function Venue() {
  return (
    <Band id="venue" tone="bone">
      <div className="md:col-span-5">
        <Reveal>
          <Title>The venue</Title>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 md:mt-14">
          <p className="font-display text-3xl leading-tight text-olive-deep md:text-4xl">{venue.name}</p>
          <p className="mt-2 font-display text-xl text-olive-deep/80 md:text-2xl">
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
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-taupe/60 shadow-[0_30px_60px_-24px_rgba(58,64,50,0.35)]">
          <iframe
            title={`Map to ${venue.name}`}
            src={venueLinks.embed}
            className="block h-72 w-full md:h-[460px]"
            style={{ filter: 'saturate(0.5) sepia(0.18) contrast(0.95)' }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Reveal>
    </Band>
  )
}
