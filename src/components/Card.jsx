import { Corners } from './Floral.jsx'

/** Blush content card with gold hairline border and floral corners. */
export default function Card({ children, className = '', id }) {
  return (
    <section id={id} className={`px-4 py-6 ${className}`}>
      <div className="relative mx-auto w-full max-w-md rounded-3xl p-[1px] gold-foil shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <div className="relative rounded-[calc(1.5rem-1px)] texture-blush px-6 py-10 sm:px-8">
          <div className="pointer-events-none absolute inset-3 rounded-2xl border border-gold/40" />
          <Corners color="#b76e79" inset="inset-4" size="h-6 w-16" />
          <div className="relative">{children}</div>
        </div>
      </div>
    </section>
  )
}
