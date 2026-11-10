import { createContext, useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'

export const FocusContext = createContext(() => {})

function getError(errors, name) {
  return name.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), errors)
}

export default function Field({ name, label, type = 'text', options, placeholder, textarea, compact }) {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const onFocus = useContext(FocusContext)
  const error = getError(errors, name)
  const id = `f-${name.replace(/\./g, '-')}`
  const props = { id, ...register(name), onFocus: () => onFocus(name), 'aria-invalid': !!error }

  let control
  if (options) {
    control = (
      <select {...props}>
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    )
  } else if (textarea) {
    control = <textarea rows={2} placeholder={placeholder} {...props} />
  } else {
    control = <input type={type} placeholder={placeholder} {...props} />
  }

  return (
    <div className={`field${compact ? ' compact' : ''}`}>
      {label && <label htmlFor={id}>{label}</label>}
      {control}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            className="error"
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
