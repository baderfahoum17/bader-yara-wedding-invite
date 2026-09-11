// Thin botanical line-art accents, drawn as SVG so they scale crisply.
// Sprig: small curving leafy twig. Branch: a longer olive branch for framing empty
// canvas. Bloom: the small four-petal flower used in dividers and as a glyph.

// Pointed leaf outline with a midrib, so it reads as botanical line art.
const leaf = (x, y, size = 1) =>
  `M ${x} ${y} c ${6 * size} ${-8 * size} ${14 * size} ${-8 * size} ${18 * size} 0 c ${-4 * size} ${8 * size} ${-12 * size} ${8 * size} ${-18 * size} 0 z M ${x + 3 * size} ${y} L ${x + 15 * size} ${y}`

/** A curving sprig with alternating leaves. Points right; rotate/flip with CSS. */
export function Sprig({ className = '', color = 'currentColor', ...rest }) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      <path d="M 2 30 C 30 30 50 10 118 10" />
      <g transform="rotate(-35 20 26)">
        <path d={leaf(12, 28, 0.8)} />
      </g>
      <g transform="rotate(30 36 22)">
        <path d={leaf(28, 24, 0.9)} />
      </g>
      <g transform="rotate(-30 56 16)">
        <path d={leaf(48, 18, 0.9)} />
      </g>
      <g transform="rotate(28 78 12)">
        <path d={leaf(70, 14, 0.8)} />
      </g>
      <g transform="rotate(-25 100 10)">
        <path d={leaf(92, 12, 0.7)} />
      </g>
      <circle cx="116" cy="10" r="1.6" fill={color} stroke="none" />
      <circle cx="4" cy="30" r="1.2" fill={color} stroke="none" />
    </svg>
  )
}

// --- Branch -------------------------------------------------------------------

// Narrow lanceolate olive leaf, base at the origin, pointing along +x.
const oliveLeaf = (size = 1) =>
  `M 0 0 c ${5 * size} ${-4.5 * size} ${15 * size} ${-5 * size} ${23 * size} 0 c ${-8 * size} ${5 * size} ${-18 * size} ${4.5 * size} ${-23 * size} 0 z M ${3 * size} 0 L ${19 * size} 0`

// Cubic Bézier point + tangent angle (degrees), so leaves sit on the stem and follow it.
function cubic([p0, p1, p2, p3]) {
  return (t) => {
    const m = 1 - t
    const x = m * m * m * p0[0] + 3 * m * m * t * p1[0] + 3 * m * t * t * p2[0] + t * t * t * p3[0]
    const y = m * m * m * p0[1] + 3 * m * m * t * p1[1] + 3 * m * t * t * p2[1] + t * t * t * p3[1]
    const dx = 3 * m * m * (p1[0] - p0[0]) + 6 * m * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0])
    const dy = 3 * m * m * (p1[1] - p0[1]) + 6 * m * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1])
    return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI }
  }
}

const stemPts = [
  [6, 142],
  [110, 146],
  [170, 40],
  [314, 14],
]
const stem = cubic(stemPts)
const stemPath = `M ${stemPts[0]} C ${stemPts[1]} ${stemPts[2]} ${stemPts[3]}`

// Offshoot leaving the main stem about a third of the way along, rising back over it.
const forkAt = stem(0.3)
const forkPts = [
  [forkAt.x, forkAt.y],
  [forkAt.x + 4, forkAt.y - 34],
  [forkAt.x + 16, forkAt.y - 66],
  [forkAt.x + 44, forkAt.y - 92],
]
const fork = cubic(forkPts)
const forkPath = `M ${forkPts[0]} C ${forkPts[1]} ${forkPts[2]} ${forkPts[3]}`

// Leaves along a curve: alternating sides, shrinking toward the tip.
function leavesAlong(curve, ts, { spread = 38, from = 1, to = 0.7, side = 1 } = {}) {
  return ts.map((t, i) => {
    const p = curve(t)
    const s = from + (to - from) * (i / Math.max(ts.length - 1, 1))
    const dir = i % 2 === 0 ? side : -side
    return <path key={t} d={oliveLeaf(s)} transform={`translate(${p.x} ${p.y}) rotate(${p.angle + dir * spread})`} />
  })
}

// An olive: short stalk off the stem, small fruit at its end.
function Olive({ curve, t, side, color, length = 7, tilt = 0 }) {
  const p = curve(t)
  const a = ((p.angle + side * 90 + tilt) * Math.PI) / 180
  const ex = p.x + Math.cos(a) * length
  const ey = p.y + Math.sin(a) * length
  return (
    <g>
      <path d={`M ${p.x} ${p.y} L ${ex} ${ey}`} />
      <ellipse cx={ex} cy={ey} rx="2.8" ry="3.7" transform={`rotate(${p.angle + side * 90 + tilt + 90} ${ex} ${ey})`} fill={color} stroke="none" />
    </g>
  )
}

/**
 * A long olive branch: main stem, a rising offshoot, alternating leaves and a few olives.
 * Base bottom-left, tip top-right; rotate/flip with CSS to trail in from a corner.
 * Stroke does not scale, so it keeps the same hairline weight as Sprig at any size.
 */
export function Branch({ className = '', color = 'currentColor', ...rest }) {
  return (
    <svg
      viewBox="0 0 320 150"
      fill="none"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`branch-hairline ${className}`}
      aria-hidden="true"
      {...rest}
    >
      <g>
        <path d={stemPath} />
        <path d={forkPath} />
        {leavesAlong(stem, [0.07, 0.14, 0.21, 0.28, 0.36, 0.44, 0.52, 0.6, 0.68, 0.76, 0.84, 0.92], { from: 1.5, to: 0.8, side: 1, spread: 36 })}
        {leavesAlong(fork, [0.25, 0.45, 0.65, 0.85], { from: 1.15, to: 0.75, side: -1, spread: 34 })}
        <Olive curve={stem} t={0.4} side={1} color={color} tilt={-20} length={8} />
        <Olive curve={stem} t={0.42} side={1} color={color} length={11} tilt={20} />
        <Olive curve={stem} t={0.64} side={-1} color={color} tilt={12} length={8} />
        <Olive curve={fork} t={0.55} side={1} color={color} tilt={-10} length={7} />
        <circle cx={stemPts[3][0]} cy={stemPts[3][1]} r="1.6" fill={color} stroke="none" />
        <circle cx={forkPts[3][0]} cy={forkPts[3][1]} r="1.3" fill={color} stroke="none" />
        <circle cx={stemPts[0][0]} cy={stemPts[0][1]} r="1.2" fill={color} stroke="none" />
      </g>
    </svg>
  )
}

// --- Bloom ---------------------------------------------------------------------

/** Small four-petal bloom, line-art. Used in the divider and as a standalone glyph. */
export function Bloom({ className = '', color = 'currentColor', strokeWidth = 1, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" aria-hidden="true" {...rest}>
      <circle cx="12" cy="12" r="2" />
      <path d="M12 4c1.5 2.5 1.5 4.5 0 6-1.5-1.5-1.5-3.5 0-6zM12 20c-1.5-2.5-1.5-4.5 0-6 1.5 1.5 1.5 3.5 0 6zM4 12c2.5-1.5 4.5-1.5 6 0-1.5 1.5-3.5 1.5-6 0zM20 12c-2.5 1.5-4.5 1.5-6 0 1.5-1.5 3.5-1.5 6 0z" />
    </svg>
  )
}

/** Symmetric divider: sprig, small bloom, mirrored sprig. */
export function Divider({ className = '', color = 'currentColor' }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`} aria-hidden="true">
      <Sprig color={color} className="h-6 w-20" />
      <Bloom color={color} className="h-4 w-4" />
      <Sprig color={color} className="h-6 w-20 -scale-x-100" />
    </div>
  )
}
