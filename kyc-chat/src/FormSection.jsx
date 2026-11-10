import { motion } from 'framer-motion'

export default function FormSection({ index, title, done, pulse, children }) {
  return (
    <motion.section
      className="form-section"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.12, duration: 0.4 }}
    >
      <motion.div
        key={pulse}
        className="section-inner"
        initial={pulse ? { boxShadow: '0 0 0 3px rgba(79,70,229,0.5)' } : false}
        animate={{ boxShadow: '0 0 0 0px rgba(79,70,229,0)' }}
        transition={{ duration: 1.1 }}
      >
        <h3>
          <span className={`step${done ? ' done' : ''}`}>{done ? '✓' : index + 1}</span>
          {title}
        </h3>
        {children}
      </motion.div>
    </motion.section>
  )
}
