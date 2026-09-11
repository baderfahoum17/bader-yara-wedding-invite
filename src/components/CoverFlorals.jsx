import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { clusters } from '../florals.js'
import { ease } from '../motion.js'

const MD = '(min-width: 768px)'

function useDesktop() {
  const [md, setMd] = useState(() => window.matchMedia(MD).matches)
  useEffect(() => {
    const mq = window.matchMedia(MD)
    const onChange = (e) => setMd(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return md
}

/**
 * Floral clusters framing the cover card. Rendered twice by Cover: once for the
 * `behind` layer (under the card) and once for `front` (over its edge).
 *
 * Three nested elements, each with one job, so nothing fights over `transform`:
 *   motion.div   enter / part-on-open (framer, transform + opacity only)
 *   .floral-sway rotate  idle rotation, CSS keyframes
 *   .floral-sway drift   idle translation, CSS keyframes at a different period
 *   img          static base rotation / flip
 *
 * Idle sway is CSS so it costs nothing on the main thread and is switched off wholesale
 * by prefers-reduced-motion. The open drift is folded into the seal timeline: it starts
 * with the card lift (0.15s) and finishes as the card recedes.
 */
export default function CoverFlorals({ layer, opening }) {
  const desktop = useDesktop()
  return clusters
    .filter((c) => c.layer === layer)
    .map((base) => ({ ...base, ...(desktop ? base.md : null) }))
    .map((c) => (
      <motion.div
        key={c.id}
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{ ...c.style, zIndex: layer === 'front' ? 20 : 0 }}
        initial={{ opacity: 0, x: c.drift.x * 0.18, y: c.drift.y * 0.18, scale: 0.96 }}
        animate={
          opening
            ? { opacity: 0, x: c.drift.x, y: c.drift.y, scale: 1.03, rotate: c.drift.rotate }
            : { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }
        }
        transition={
          opening
            ? { duration: 1.0, delay: 0.15 + c.stagger, ease: [0.22, 1, 0.36, 1] }
            : { duration: 1.7, delay: 0.75 + c.stagger * 4, ease }
        }
      >
        <div
          className="floral-sway rotate"
          style={{
            transformOrigin: c.origin,
            '--sway-rotate': `${c.sway.rotate}deg`,
            '--sway-duration': `${c.sway.rotateDuration}s`,
            '--sway-delay': `${c.sway.delay}s`,
          }}
        >
          <div
            className="floral-sway drift"
            style={{
              '--sway-x': `${c.sway.x}px`,
              '--sway-y': `${c.sway.y}px`,
              '--sway-duration': `${c.sway.driftDuration}s`,
              '--sway-delay': `${c.sway.delay * 1.7}s`,
            }}
          >
            <img
              src={c.src}
              alt=""
              className="block w-full select-none"
              draggable="false"
              decoding="async"
              style={{ transform: `rotate(${c.rotate}deg) scaleX(${c.flip ? -1 : 1})` }}
            />
          </div>
        </div>
      </motion.div>
    ))
}
