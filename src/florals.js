// Watercolor floral clusters that frame the Trunks card on the cover.
// Positions are percentages of the card box (`md` overrides apply from 768px up); drift is the direction each cluster parts
// toward when the seal is tapped. `layer` puts the cluster behind or in front of the card
// edge so the frame reads as physically layered. Sway timings are staggered and use
// non-multiple durations so the idle motion never phases into unison.
//
// Two source paintings (keyed to real alpha, WebP): a round bouquet with a trailing
// eucalyptus stem, used twice mirrored, and a tall larkspur stem.

import bouquet from './assets/florals/cluster-a.webp'
import stem from './assets/florals/cluster-c.webp'

export const clusters = [
  {
    id: 'top-left',
    src: bouquet,
    layer: 'front',
    style: { top: '-10%', left: '-13%', width: '50%' },
    rotate: 22,
    flip: false,
    origin: '70% 70%',
    sway: { rotate: 1.3, x: 3, y: 2, rotateDuration: 11, driftDuration: 17, delay: -3 },
    drift: { x: -120, y: -90, rotate: -8 },
    stagger: 0,
  },
  {
    id: 'bottom-right',
    src: bouquet,
    layer: 'front',
    style: { bottom: '-8%', right: '-14%', width: '54%' },
    rotate: 202,
    flip: false,
    origin: '30% 30%',
    sway: { rotate: 1.1, x: -3, y: 2, rotateDuration: 13, driftDuration: 19, delay: -8 },
    drift: { x: 130, y: 100, rotate: 8 },
    stagger: 0.06,
  },
  {
    id: 'stem-right',
    src: stem,
    layer: 'behind',
    // Mobile: peeks above the top-right corner (there is headroom under the monogram).
    style: { top: '-14%', right: '7%', width: '24%' },
    rotate: 10,
    // Desktop: the card fills the viewport height, so the stem leans out from behind
    // the right edge into the gap before the names instead.
    md: { style: { top: '2%', right: '-4%', width: '20%' }, rotate: 24 },
    flip: false,
    origin: '50% 100%',
    sway: { rotate: 2.2, x: 2, y: -1, rotateDuration: 9.5, driftDuration: 15, delay: -5 },
    drift: { x: 70, y: -80, rotate: 7 },
    stagger: 0.03,
  },
]
