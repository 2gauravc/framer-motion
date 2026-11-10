import { SECTIONS } from './schema.js'

// Stubbed responder. Replace the body of getReply() with a real backend / LLM call later.
// Returns { text, action? } where action is 'fill' | 'clear' for form-aware behaviour.
export async function getReply(message, ctx = {}) {
  const m = message.toLowerCase()
  const missing = ctx.missingSections ?? []

  if (/\b(fill|autofill|demo|sample|populate)\b/.test(m)) {
    return { text: 'Sure, I\'ll fill the form with sample company data, section by section.', action: 'fill' }
  }
  if (/\b(clear|reset|start over|empty)\b/.test(m)) {
    return { text: 'Okay, I\'ve cleared the form.', action: 'clear' }
  }
  if (/\b(missing|left|remaining|progress|status|complete|done)\b/.test(m) && !/cdd status/.test(m)) {
    return {
      text: missing.length
        ? `Still to complete: ${missing.join(', ')}.`
        : 'All sections are complete. You can submit the form.',
    }
  }
  if (/\b(document|upload|accepted|evidence|proof)\b/.test(m)) {
    return {
      text: 'Typical documents are the certificate of incorporation, a recent registry extract, the register of shareholders and an ownership structure chart. Uploading is optional in this demo.',
    }
  }
  if (/\b(why|need|purpose|reason)\b/.test(m)) {
    return {
      text: 'Regulators require firms to identify a company and the people behind it before onboarding. This helps prevent money laundering, fraud and sanctions breaches.',
    }
  }
  if (/\b(ubo|beneficial|owner)/.test(m)) {
    return {
      text: 'A UBO is a natural person who ultimately owns or controls the company, usually with 25% or more or control by other means. Trace through any holding companies until you reach a person.',
    }
  }
  if (/\b(shareholder|10%|ten percent)\b/.test(m)) {
    return { text: 'List every shareholder holding more than 10%, whether a person or a company.' }
  }
  if (/\b(related|subsidiar|parent|affiliate)/.test(m)) {
    return { text: 'Related parties are connected entities or individuals such as a parent, subsidiaries or affiliates. This section is optional.' }
  }
  if (/\b(hi|hello|hey|help)\b/.test(m)) {
    return {
      text: 'Hi! I can explain any field (just click into it), check what\'s missing, or say "fill demo data" and I\'ll fill the form for you.',
    }
  }
  return {
    text: 'I\'m a demo assistant, so I only know a few things. Try "fill demo data", "what\'s missing?", or click into a field and I\'ll explain it.',
  }
}

export function sectionTitles(ids) {
  return ids.map((id) => SECTIONS.find((s) => s.id === id).title)
}
