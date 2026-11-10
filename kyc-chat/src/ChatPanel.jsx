import { AnimatePresence, motion } from 'framer-motion'
import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'

const SUGGESTIONS = ['What documents are accepted?', 'Why do you need this?', 'Fill demo data', "What's missing?"]

function Dots() {
  return (
    <span className="dots" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  )
}

export default function ChatPanel({ messages, typing, onSend, helpOn, onToggleHelp }) {
  return (
    <div className="chat">
      <div className="chat-head">
        <span>Assistant</span>
        <label className="switch-label">
          Field help
          <button
            type="button"
            role="switch"
            aria-checked={helpOn}
            className={`switch${helpOn ? ' on' : ''}`}
            onClick={onToggleHelp}
          >
            <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="knob" />
          </button>
        </label>
      </div>
      <MainContainer>
        <ChatContainer>
          <MessageList
            typingIndicator={typing ? <TypingIndicator content={<Dots />} /> : null}
            scrollBehavior="smooth"
          >
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Message
                    model={{
                      message: m.text,
                      sender: m.sender,
                      direction: m.sender === 'user' ? 'outgoing' : 'incoming',
                      position: 'single',
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </MessageList>
          <MessageInput
            placeholder="Ask about the form…"
            attachButton={false}
            onSend={(_html, text) => onSend(text)}
          />
        </ChatContainer>
      </MainContainer>
      <div className="chips">
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s}
            type="button"
            className="chip"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.07 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSend(s)}
          >
            {s}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
