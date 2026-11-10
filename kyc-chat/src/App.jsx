import { useCallback, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import KycForm from './KycForm.jsx'
import ChatPanel from './ChatPanel.jsx'
import { getReply, sectionTitles } from './getReply.js'
import { getFieldHelp } from './fieldHelp.js'
import { SECTIONS, demoData, emptyValues, schema } from './schema.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let nextId = 1

function filled(v) {
  if (Array.isArray(v)) return v.length > 0 && v.every((row) => Object.values(row).every((x) => String(x ?? '').trim()))
  return String(v ?? '').trim() !== ''
}

export default function App() {
  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: emptyValues,
  })
  const { watch, formState, reset, getValues, trigger } = form

  const [messages, setMessages] = useState([
    {
      id: nextId++,
      sender: 'bot',
      text: 'Hi! I\'m your KYC assistant. Turn on "Field help" and I\'ll explain each field you click into, or say "fill demo data".',
    },
  ])
  const [typing, setTyping] = useState(false)
  const [helpOn, setHelpOn] = useState(false)
  const [pulses, setPulses] = useState({})
  const [submitState, setSubmitState] = useState('idle')
  const lastHelp = useRef(null)
  const queue = useRef(Promise.resolve())

  const values = watch()
  const completed = useMemo(() => {
    const out = {}
    for (const s of SECTIONS) {
      const required = s.id === 'ownership' ? ['ubos', 'shareholders'] : s.fields
      out[s.id] = required.every((f) => filled(values[f]) && !formState.errors[f])
    }
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values), formState.errors])
  const missing = SECTIONS.filter((s) => !completed[s.id]).map((s) => s.id)

  // Serialise bot output so overlapping messages never interleave.
  const botSay = useCallback((text, delay = 700) => {
    queue.current = queue.current.then(async () => {
      setTyping(true)
      await sleep(delay)
      setTyping(false)
      setMessages((m) => [...m, { id: nextId++, sender: 'bot', text }])
    })
    return queue.current
  }, [])

  const fillForm = useCallback(async () => {
    for (const s of SECTIONS) {
      await sleep(550)
      reset({ ...getValues(), ...demoData[s.id] }, { keepDefaultValues: true })
      setPulses((p) => ({ ...p, [s.id]: (p[s.id] ?? 0) + 1 }))
      await trigger(s.fields)
    }
    botSay('Done. All three sections are filled with sample data. Review them and submit.', 400)
  }, [botSay, getValues, reset, trigger])

  const clearForm = useCallback(() => {
    reset(emptyValues)
    setSubmitState('idle')
    lastHelp.current = null
  }, [reset])

  const handleSend = useCallback(
    (text) => {
      const t = text.trim()
      if (!t) return
      setMessages((m) => [...m, { id: nextId++, sender: 'user', text: t }])
      queue.current = queue.current.then(async () => {
        setTyping(true)
        await sleep(800)
        const reply = await getReply(t, { missingSections: sectionTitles(missing) })
        setTyping(false)
        setMessages((m) => [...m, { id: nextId++, sender: 'bot', text: reply.text }])
        if (reply.action === 'fill') await fillForm()
        if (reply.action === 'clear') clearForm()
      })
    },
    [missing, fillForm, clearForm]
  )

  const handleFocus = useCallback(
    (name) => {
      if (!helpOn) return
      const help = getFieldHelp(name)
      if (!help || lastHelp.current === help.key) return
      lastHelp.current = help.key
      botSay(`${help.label}: ${help.text}`, 450)
    },
    [botSay, helpOn]
  )

  const toggleHelp = useCallback(() => {
    lastHelp.current = null
    setHelpOn(!helpOn)
    if (!helpOn) botSay('Field help is on. Click into any field and I\'ll explain it.', 400)
  }, [botSay, helpOn])

  const handleSubmit = useCallback(async () => {
    setSubmitState('loading')
    await sleep(1400)
    setSubmitState('success')
    botSay('Submitted. This is a demo, so nothing was saved or sent anywhere.', 400)
  }, [botSay])

  return (
    <div className="app">
      <motion.div className="panel form-panel" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <KycForm
          form={form}
          completed={completed}
          pulses={pulses}
          onFieldFocus={handleFocus}
          onSubmit={handleSubmit}
          submitState={submitState}
        />
      </motion.div>
      <motion.div className="panel chat-panel" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <ChatPanel messages={messages} typing={typing} onSend={handleSend} helpOn={helpOn} onToggleHelp={toggleHelp} />
      </motion.div>
    </div>
  )
}
