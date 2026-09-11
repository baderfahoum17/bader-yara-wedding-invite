// Thin botanical line-art accents, drawn as SVG so they scale crisply.

// Pointed leaf outline with a midrib, so it reads as botanical line art.
const leaf = (x, y, angle, size = 1) =>
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
        <path d={leaf(12, 28, 0, 0.8)} />
      </g>
      <g transform="rotate(30 36 22)">
        <path d={leaf(28, 24, 0, 0.9)} />
      </g>
      <g transform="rotate(-30 56 16)">
        <path d={leaf(48, 18, 0, 0.9)} />
      </g>
      <g transform="rotate(28 78 12)">
        <path d={leaf(70, 14, 0, 0.8)} />
      </g>
      <g transform="rotate(-25 100 10)">
        <path d={leaf(92, 12, 0, 0.7)} />
      </g>
      <circle cx="116" cy="10" r="1.6" fill={color} stroke="none" />
      <circle cx="4" cy="30" r="1.2" fill={color} stroke="none" />
    </svg>
  )
}

/** Symmetric divider: sprig, small bloom, mirrored sprig. */
export function Divider({ className = '', color = 'currentColor' }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`} aria-hidden="true">
      <Sprig color={color} className="h-6 w-20" />
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={color} strokeWidth="1">
        <circle cx="12" cy="12" r="2" />
        <path d="M12 4c1.5 2.5 1.5 4.5 0 6-1.5-1.5-1.5-3.5 0-6zM12 20c-1.5-2.5-1.5-4.5 0-6 1.5 1.5 1.5 3.5 0 6zM4 12c2.5-1.5 4.5-1.5 6 0-1.5 1.5-3.5 1.5-6 0zM20 12c-2.5 1.5-4.5 1.5-6 0 1.5-1.5 3.5-1.5 6 0z" />
      </svg>
      <Sprig color={color} className="h-6 w-20 -scale-x-100" />
    </div>
  )
}

/** Four sprigs pinned to the corners of a relatively positioned card. */
export function Corners({ color = 'currentColor', inset = 'inset-2', size = 'h-8 w-24' }) {
  const base = `absolute ${size} pointer-events-none`
  return (
    <div className={`absolute ${inset} pointer-events-none`} aria-hidden="true">
      <Sprig color={color} className={`${base} left-0 top-0 rotate-180 -scale-x-100 origin-top-left translate-y-0`} style={{ transform: 'scale(1,-1)' }} />
      <Sprig color={color} className={`${base} right-0 top-0`} style={{ transform: 'scale(-1,-1)' }} />
      <Sprig color={color} className={`${base} left-0 bottom-0`} />
      <Sprig color={color} className={`${base} right-0 bottom-0`} style={{ transform: 'scale(-1,1)' }} />
    </div>
  )
}
