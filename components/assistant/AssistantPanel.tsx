'use client'

import { Briefcase, FileDown, FolderKanban, Mail, SendHorizontal, User, Wrench, X, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { actionHref, type AssistantAction, type SectionId } from '@/content/assistantKb'
import type { Locale } from '@/content/locales'
import { fill, mascotText, type QuickQuestion } from '@/content/mascotText'
import type { Dictionary } from '@/content/types'
import { answerQuestion } from '@/lib/assistant'
import AssistantMark from './AssistantMark'

interface Message {
  readonly id: number
  readonly role: 'user' | 'bot'
  readonly text: string
  readonly actions: readonly AssistantAction[]
  readonly suggestions: readonly string[]
  readonly done: boolean
}

interface AssistantPanelProps {
  readonly locale: Locale
  readonly dict: Dictionary
  readonly reduceMotion: boolean
  readonly closing: boolean
  readonly onClose: () => void
}

const THINK_MS = 650

const quickIcons: Readonly<Record<QuickQuestion['id'], LucideIcon>> = {
  who: User,
  skills: Wrench,
  projects: FolderKanban,
  internship: Briefcase,
  contact: Mail,
  cv: FileDown,
}

const FOCUSABLE = 'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'

function TypedText({
  text,
  animate,
  onProgress,
  onDone,
}: {
  readonly text: string
  readonly animate: boolean
  readonly onProgress: () => void
  readonly onDone: () => void
}) {
  const [count, setCount] = useState(animate ? 0 : text.length)
  const progress = useRef(onProgress)
  const done = useRef(onDone)

  useEffect(() => {
    progress.current = onProgress
    done.current = onDone
  })

  useEffect(() => {
    if (!animate) {
      done.current()
      return undefined
    }
    let index = 0
    const step = Math.max(1, Math.ceil(text.length / 240))
    const timer = window.setInterval(() => {
      index += step
      if (index >= text.length) {
        window.clearInterval(timer)
        setCount(text.length)
        done.current()
      } else {
        setCount(index)
      }
      progress.current()
    }, 14)
    return () => window.clearInterval(timer)
  }, [animate, text])

  return <>{text.slice(0, animate ? count : text.length)}</>
}

/** « En train de répondre » : trois repères de calque qui se tracent l'un après l'autre. */
function Working({ label }: { readonly label: string }) {
  return (
    <div role="status" className="inline-flex items-center gap-2 rounded-sm border border-line2 bg-bg2 px-3 py-2.5">
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="assistant-tick block h-3 w-3 border border-accent" style={{ animationDelay: `${i * 0.16}s` }} />
        ))}
      </span>
    </div>
  )
}

export default function AssistantPanel({ locale, dict, reduceMotion, closing, onClose }: AssistantPanelProps) {
  const text = mascotText[locale]
  const titleId = useId()
  const nextId = useRef(2)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timers = useRef<number[]>([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [live, setLive] = useState(text.welcome)
  const [messages, setMessages] = useState<readonly Message[]>(() => [
    { id: 1, role: 'bot', text: text.welcome, actions: [], suggestions: [], done: false },
  ])

  const sectionLabel = useCallback(
    (section: SectionId): string => {
      const labels: Readonly<Record<SectionId, string>> = {
        about: dict.nav.about,
        skills: dict.nav.skills,
        projects: dict.nav.projects,
        architecture: dict.nav.architecture,
        certifications: dict.nav.certifications,
        journey: dict.nav.journey,
        contact: dict.nav.contact,
      }
      return labels[section]
    },
    [dict],
  )

  const scrollToBottom = useCallback(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [])

  const goTo = useCallback(
    (section: SectionId) => {
      document.getElementById(section)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    },
    [reduceMotion],
  )

  useEffect(() => {
    inputRef.current?.focus()
    const pendingTimers = timers.current
    return () => {
      pendingTimers.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, pending, scrollToBottom])

  const markDone = useCallback((id: number) => {
    setMessages((current) => current.map((message) => (message.id === id && !message.done ? { ...message, done: true } : message)))
  }, [])

  const submit = useCallback(
    (raw: string) => {
      const question = raw.trim()
      if (question.length === 0 || pending) return
      const userId = nextId.current
      const botId = nextId.current + 1
      nextId.current += 2
      setInput('')
      setMessages((current) => [
        ...current.map((message) => (message.done ? message : { ...message, done: true })),
        { id: userId, role: 'user', text: question, actions: [], suggestions: [], done: true },
      ])
      setPending(!reduceMotion)
      const timer = window.setTimeout(() => {
        const reply = answerQuestion(question, locale)
        setPending(false)
        setMessages((current) => [
          ...current,
          { id: botId, role: 'bot', text: reply.text, actions: reply.actions, suggestions: reply.suggestions, done: false },
        ])
        setLive(reply.text)
        const first = reply.actions[0]
        if (first && first.kind === 'scroll' && window.matchMedia('(min-width: 768px)').matches) {
          timers.current.push(window.setTimeout(() => goTo(first.section), 500))
        }
      }, reduceMotion ? 0 : THINK_MS)
      timers.current.push(timer)
    },
    [goTo, locale, pending, reduceMotion],
  )

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit(input)
  }

  /** Échap ferme ; Tab reste dans le panneau (focus piégé). */
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
      return
    }
    if (event.key !== 'Tab') return
    const nodes = Array.from(rootRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter((n) => n.offsetParent !== null)
    const first = nodes[0]
    const last = nodes.at(-1)
    if (!first || !last) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const renderAction = (action: AssistantAction) => {
    const className =
      'inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent transition-colors hover:bg-accent/20'
    switch (action.kind) {
      case 'scroll':
        return (
          <button
            key="scroll"
            type="button"
            className={className}
            onClick={() => {
              goTo(action.section)
              if (!window.matchMedia('(min-width: 768px)').matches) onClose()
            }}
          >
            {fill(text.goTo, { section: sectionLabel(action.section) })}
          </button>
        )
      case 'cv':
        return (
          <Link key="cv" href={actionHref(action, locale)} className={className}>
            {text.openCv}
          </Link>
        )
      case 'mail':
        return (
          <a key="mail" href={actionHref(action, locale)} className={className}>
            {text.writeMail}
          </a>
        )
      case 'github':
        return (
          <a key="github" href={actionHref(action, locale)} target="_blank" rel="noopener noreferrer" className={className}>
            {text.openGithub}
          </a>
        )
      case 'linkedin':
        return (
          <a key="linkedin" href={actionHref(action, locale)} target="_blank" rel="noopener noreferrer" className={className}>
            {text.openLinkedin}
          </a>
        )
    }
  }

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onKeyDown={onKeyDown}
      data-state={closing ? 'closing' : 'open'}
      className="assistant-panel pointer-events-auto flex max-h-[min(560px,calc(100svh-7.5rem))] w-[min(calc(100vw-1.5rem),380px)] flex-col overflow-hidden rounded-md border border-line2 bg-bg3 shadow-[0_24px_60px_-18px_rgba(20,33,61,0.45),0_0_0_1px_rgba(31,79,216,0.12)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line2 bg-bg2 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <AssistantMark size={30} className="text-accent" />
          <h2 id={titleId} className="font-display text-base font-semibold text-navy">
            {text.panelTitle}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={text.close}
          className="grid h-11 w-11 place-items-center rounded-sm border border-line2 text-text2 transition-colors hover:border-accent hover:text-text"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <div key={message.id} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div className="max-w-[92%]">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-text2">
                {message.role === 'user' ? text.you : text.assistantName}
              </p>
              {message.role === 'user' ? (
                <p className="whitespace-pre-line rounded-sm bg-accent px-3 py-2 text-sm text-on-accent">{message.text}</p>
              ) : (
                <div
                  aria-hidden={!message.done}
                  title={message.done ? undefined : text.skipTyping}
                  onClick={() => markDone(message.id)}
                  className="cursor-default whitespace-pre-line rounded-sm border border-line2 bg-bg2 px-3 py-2 text-sm leading-relaxed text-text"
                >
                  <TypedText
                    text={message.text}
                    animate={!message.done && !reduceMotion}
                    onProgress={scrollToBottom}
                    onDone={() => markDone(message.id)}
                  />
                </div>
              )}
              {message.role === 'bot' && message.done && message.actions.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">{message.actions.map((action) => renderAction(action))}</div>
              ) : null}
              {message.role === 'bot' && message.done && message.suggestions.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => submit(suggestion)}
                      className="min-h-11 rounded-sm border border-line2 bg-bg px-3 py-1 text-xs text-text2 transition-colors hover:border-accent hover:text-text"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
        {pending ? (
          <div className="flex justify-start">
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-text2">{text.assistantName}</p>
              <Working label={text.thinking} />
            </div>
          </div>
        ) : null}
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {live}
      </div>

      <div className="border-t border-line2 bg-bg2 px-4 pb-3 pt-3">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text2">{text.quickTitle}</p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {text.quick.map((question) => {
            const Icon = quickIcons[question.id]
            return (
              <button
                key={question.id}
                type="button"
                onClick={() => submit(question.label)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-line2 bg-bg px-2.5 py-1 text-xs text-text2 transition-colors hover:border-accent hover:text-text"
              >
                <Icon size={14} aria-hidden="true" className="shrink-0 text-accent" />
                {question.label}
              </button>
            )
          })}
        </div>
        <form onSubmit={onSubmit} className="flex gap-2">
          <label htmlFor={`${titleId}-input`} className="sr-only">
            {text.inputLabel}
          </label>
          <input
            id={`${titleId}-input`}
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={200}
            autoComplete="off"
            placeholder={text.placeholder}
            className="min-h-11 min-w-0 flex-1 rounded-sm border border-line2 bg-bg px-3 py-2 text-sm text-text placeholder:text-text2 focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            aria-label={text.send}
            className="grid min-h-11 min-w-11 place-items-center rounded-sm bg-accent text-on-accent transition-colors hover:bg-accent-hover"
          >
            <SendHorizontal size={17} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  )
}
