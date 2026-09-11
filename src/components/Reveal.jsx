import { motion } from 'framer-motion'
import { ease } from '../motion.js'

/** Scroll-triggered reveal: rises out of a soft blur once, when ~25% is in view. */
export default function Reveal({ children, delay = 0, y = 24, className = '', ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, ease, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
