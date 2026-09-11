import { motion } from 'framer-motion'

/** Scroll-triggered fade/slide reveal. Plays once when ~30% of the element is in view. */
export default function Reveal({ children, delay = 0, y = 28, className = '', ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
