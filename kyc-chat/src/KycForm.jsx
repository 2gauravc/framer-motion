import { useCallback, useState } from 'react'
import { FormProvider, useFieldArray, useFormContext } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { AnimatePresence, motion } from 'framer-motion'
import Field, { FocusContext } from './Field.jsx'
import FormSection from './FormSection.jsx'
import { CDD_STATUSES, COMPANY_STATUSES, COMPANY_TYPES, SECTIONS } from './schema.js'

function Rows({ name, title, blank, error, children }) {
  const { control, formState } = useFormContext()
  const { fields, append, remove } = useFieldArray({ control, name })
  const arrayError = formState.errors[name]?.root?.message ?? formState.errors[name]?.message
  return (
    <div className="rows">
      <div className="rows-head">
        <span>{title}</span>
        <button type="button" className="link" onClick={() => append(blank)}>
          + Add
        </button>
      </div>
      <AnimatePresence initial={false}>
        {fields.map((f, i) => (
          <motion.div
            key={f.id}
            className="row"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="row-fields">{children(i)}</div>
            <button type="button" className="icon" aria-label="Remove" onClick={() => remove(i)}>
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      {fields.length === 0 && <p className="muted">{error}</p>}
      {arrayError && <p className="error">{arrayError}</p>}
    </div>
  )
}

function Dropzone({ onFocus }) {
  const [files, setFiles] = useState([])
  const onDrop = useCallback((accepted) => setFiles((prev) => [...prev, ...accepted]), [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [], 'image/*': [] },
  })
  return (
    <div className="dropzone-wrap">
      <motion.div
        {...getRootProps({ onClick: () => onFocus('documents') })}
        className={`dropzone${isDragActive ? ' active' : ''}`}
        animate={{ scale: isDragActive ? 1.02 : 1 }}
      >
        <input {...getInputProps()} />
        <p>{isDragActive ? 'Drop files here' : 'Drag supporting documents here, or click to browse (PDF / image, optional)'}</p>
      </motion.div>
      <ul className="files">
        <AnimatePresence initial={false}>
          {files.map((f, i) => (
            <motion.li key={f.name + i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              📄 {f.name}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}

export default function KycForm({ form, completed, pulses, onFieldFocus, onSubmit, submitState }) {
  const {
    handleSubmit,
    formState: { isValid },
  } = form
  const doneCount = SECTIONS.filter((s) => completed[s.id]).length
  const disabled = !isValid || submitState === 'loading'

  return (
    <FormProvider {...form}>
      <FocusContext.Provider value={onFieldFocus}>
        <form className="kyc-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="progress">
            <div className="progress-label">
              <span>Corporate KYC</span>
              <span>
                {doneCount} / {SECTIONS.length} sections complete
              </span>
            </div>
            <div className="bar">
              <motion.div
                className="bar-fill"
                animate={{ width: `${(doneCount / SECTIONS.length) * 100}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
          </div>

          <FormSection index={0} title="CDD Metadata" done={completed.cdd} pulse={pulses.cdd}>
            <div className="grid">
              <Field name="customer" label="Customer" />
              <Field name="cddDate" label="CDD Date" type="date" />
              <Field name="cddStatus" label="CDD Status" options={CDD_STATUSES} />
            </div>
          </FormSection>

          <FormSection index={1} title="Business Profile" done={completed.business} pulse={pulses.business}>
            <div className="grid">
              <Field name="name" label="Name" />
              <Field name="jurisdiction" label="Jurisdiction" />
              <Field name="status" label="Status" options={COMPANY_STATUSES} />
              <Field name="registrationNo" label="Registration No" />
              <Field name="companyType" label="Company Type" options={COMPANY_TYPES} />
              <Field name="paidUpCapital" label="Paid Up Capital" placeholder="e.g. 1,000,000" />
              <Field name="incorporationDate" label="Incorporation Date" type="date" />
              <Field name="activity" label="Activity" />
            </div>
            <Field name="address" label="Address" textarea />
          </FormSection>

          <FormSection index={2} title="Ownership & Control" done={completed.ownership} pulse={pulses.ownership}>
            <Rows name="ubos" title="UBOs" blank={{ name: '', nationality: '', percent: '' }} error="Add at least one UBO">
              {(i) => (
                <>
                  <Field compact name={`ubos.${i}.name`} placeholder="Name" />
                  <Field compact name={`ubos.${i}.nationality`} placeholder="Nationality" />
                  <Field compact name={`ubos.${i}.percent`} placeholder="Ownership %" />
                </>
              )}
            </Rows>
            <Rows name="shareholders" title="Shareholders (>10%)" blank={{ name: '', percent: '' }} error="Add at least one shareholder above 10%">
              {(i) => (
                <>
                  <Field compact name={`shareholders.${i}.name`} placeholder="Name" />
                  <Field compact name={`shareholders.${i}.percent`} placeholder="Shareholding %" />
                </>
              )}
            </Rows>
            <Rows name="relatedParties" title="Related parties (optional)" blank={{ name: '', relationship: '' }} error="None added">
              {(i) => (
                <>
                  <Field compact name={`relatedParties.${i}.name`} placeholder="Name" />
                  <Field compact name={`relatedParties.${i}.relationship`} placeholder="Relationship" />
                </>
              )}
            </Rows>
            <Dropzone onFocus={onFieldFocus} />
          </FormSection>

          <div className="submit-bar">
            <AnimatePresence mode="wait">
              {submitState === 'success' ? (
                <motion.div
                  key="ok"
                  className="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
                  >
                    ✓
                  </motion.span>
                  Corporate KYC submitted (demo, nothing was saved)
                </motion.div>
              ) : (
                <motion.button
                  key="btn"
                  type="submit"
                  className="primary"
                  disabled={disabled}
                  whileHover={disabled ? undefined : { scale: 1.03 }}
                  whileTap={disabled ? undefined : { scale: 0.97 }}
                  exit={{ opacity: 0 }}
                >
                  {submitState === 'loading' ? 'Submitting…' : 'Submit KYC'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </form>
      </FocusContext.Provider>
    </FormProvider>
  )
}
