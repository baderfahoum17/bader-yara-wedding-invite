/**
 * Full-bleed section band on velvet (wine) or paper (blush), with a 12-column
 * grid inside. Sections place their children on the grid; no cards.
 */
export default function Band({ id, tone = 'wine', className = '', children }) {
  const blush = tone === 'blush'
  return (
    <section
      id={id}
      className={`relative ${blush ? 'texture-blush text-ink' : 'texture-wine text-ivory'} ${className}`}
    >
      {blush && <div aria-hidden="true" className="rule-gold absolute inset-x-0 top-0 h-px" />}
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-y-10 px-6 py-24 md:grid-cols-12 md:gap-x-10 md:px-12 md:py-40">
        {children}
      </div>
    </section>
  )
}

/** Section heading: one display voice, large and light, tight leading. */
export function Title({ children, className = '' }) {
  return (
    <h2
      className={`text-balance font-display text-5xl leading-[0.95] tracking-[-0.02em] md:text-7xl ${className}`}
    >
      {children}
    </h2>
  )
}

/** Small drawn arrow for text links. */
export function Arrow({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  )
}
