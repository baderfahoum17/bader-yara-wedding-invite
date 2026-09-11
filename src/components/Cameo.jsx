import { motion } from 'framer-motion'
import Card from './Card.jsx'
import Reveal from './Reveal.jsx'
import { Divider, Sprig } from './Floral.jsx'

/**
 * Photo cameo section. Takes a single hero image so the photo can be swapped
 * without touching layout.
 */
export default function Cameo({ src, alt, name, caption }) {
  return (
    <Card id="cameo">
      <Reveal className="text-center">
        <p className="font-display text-[11px] uppercase tracking-[0.45em] text-rose-gold">Guest of honour</p>
        <h2 className="mt-3 font-script text-4xl text-wine">{name}</h2>
        <Divider color="#c9a45c" className="my-6" />
      </Reveal>

      <Reveal delay={0.15}>
        <div className="relative mx-auto w-[78%] max-w-[260px]">
          {/* Arch-shaped gold frame */}
          <div className="gold-foil rounded-t-full rounded-b-2xl p-[3px] shadow-[0_18px_40px_rgba(61,15,18,0.35)]">
            <div className="overflow-hidden rounded-t-full rounded-b-[14px] bg-wine">
              <motion.img
                src={src}
                alt={alt}
                className="block aspect-[3/4] w-full object-cover object-[50%_45%]"
                initial={{ scale: 1.12 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                loading="lazy"
              />
            </div>
          </div>
          <Sprig color="#b76e79" className="absolute -left-10 top-1/2 h-8 w-24 -rotate-[75deg]" />
          <Sprig color="#b76e79" className="absolute -right-10 top-1/2 h-8 w-24 rotate-[75deg] -scale-x-100" />
        </div>
      </Reveal>

      <Reveal delay={0.3} className="mt-8 text-center">
        <p className="font-body text-lg italic leading-snug text-ink/85">{caption}</p>
      </Reveal>
    </Card>
  )
}
