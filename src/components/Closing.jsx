import { motion } from 'framer-motion'
import { couple, dateLabel, trunks, venue } from '../content.js'
import Band from './Band.jsx'
import Reveal from './Reveal.jsx'
import { ease } from '../motion.js'
import { Divider } from './Floral.jsx'
import trunksPhoto from '../assets/trunks-photo.jpg'

/** Sign-off: a word from Trunks, then the couple's names and the date. */
export default function Closing() {
  return (
    <Band id="closing" tone="wine">
      <Reveal className="md:col-span-4 md:col-start-2" id="cameo">
        <div className="w-44 overflow-hidden rounded-[1.75rem] shadow-[0_40px_70px_-30px_rgba(0,0,0,0.7)] md:w-60">
          <motion.img
            src={trunksPhoto}
            alt={`${trunks.name}, an English Cocker Spaniel, smiling at the camera`}
            className="block aspect-[3/4] w-full object-cover object-[50%_45%]"
            initial={{ scale: 1.12 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.8, ease }}
            loading="lazy"
          />
        </div>
      </Reveal>

      <Reveal delay={0.15} className="md:col-span-6 md:col-start-6 md:self-center">
        <p className="max-w-[26ch] font-display text-3xl italic leading-snug text-ivory md:text-4xl">
          {trunks.caption}
        </p>
        <p className="mt-6 font-display text-lg text-ivory/60">{trunks.name}, guest of honour</p>
      </Reveal>

      <div className="mt-12 md:col-span-12 md:mt-24">
        <Divider color="#c9a45c" className="mb-10" />
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="font-script text-5xl leading-none text-gold-light md:text-6xl">
            {couple.first} &amp; {couple.second}
          </p>
          <p className="font-display text-sm uppercase tracking-[0.35em] text-ivory/60">
            {dateLabel} &middot; {venue.city}
          </p>
        </div>
      </div>
    </Band>
  )
}
