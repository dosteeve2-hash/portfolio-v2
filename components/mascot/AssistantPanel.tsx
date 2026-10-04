'use client'

import Link from 'next/link'
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { actionHref, type AssistantAction, type SectionId } from '@/content/assistantKb'
import type { Locale } from '@/content/locales'
import { fill, mascotText } from '@/content/mascotText'
import { MASCOT_NAME } from '@/content/site'
import type { Dictionary } from '@/content/types'
import { answerQuestion } from '@/lib/assistant'
import type { Expression } from './pose'

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
  readonly onMood: (expression: Expression, holdMs?: number) => void
  readonly onClose: () => void
}

const THINK_MS = 400

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

export default function AssistantPanel({ locale, dict, reduceMotion, onMood, onClose }: AssistantPanelProps) {
  const text = mascotText[locale]
  const titleId = useId()
  const nextId = useRef(2)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timers = useRef<number[]>([])
  const [input, setInput] = useState('')
  const [live, setLive] = useState(() => fill(text.welcome, { name: MASCOT_NAME }))
  const [messages, setMessages] = useState<readonly Message[]>(() => [
    {
      id: 1,
      role: 'bot',
      text: fill(text.welcome, { name: MASCOT_NAME }),
      actions: [],
      suggestions: [],
      done: false,
    },
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
    const pending = timers.current
    return () => {
      pending.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const markDone = useCallback((id: number) => {
    setMessages((current) => current.map((message) => (message.id === id && !message.done ? { ...message, done: true } : message)))
  }, [])

  const submit = useCallback(
    (raw: string) => {
      const question = raw.trim()
      if (question.length === 0) return
      const userId = nextId.current
      const botId = nextId.current + 1
      nextId.current += 2
      setInput('')
      setMessages((current) => [
        ...current.map((message) => (message.done ? message : { ...message, done: true })),
        { id: userId, role: 'user', text: question, actions: [], suggestions: [], done: true },
      ])
      onMood('thinking')
      const timer = window.setTimeout(() => {
        const reply = answerQuestion(question, locale)
        setMessages((current) => [
          ...current,
          { id: botId, role: 'bot', text: reply.text, actions: reply.actions, suggestions: reply.suggestions, done: false },
        ])
        setLive(reply.text)
        onMood(reply.found ? 'happy' : 'curious', 2800)
        const first = reply.actions[0]
        if (first && first.kind === 'scroll' && window.matchMedia('(min-width: 768px)').matches) {
          const scrollTimer = window.setTimeout(() => goTo(first.section), 500)
          timers.current.push(scrollTimer)
        }
      }, reduceMotion ? 0 : THINK_MS)
      timers.current.push(timer)
    },
    [goTo, locale, onMood, reduceMotion],
  )

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit(input)
  }

  const renderAction = (action: AssistantAction) => {
    const className =
      'inline-flex items-center gap-1.5 rounded-lg border border-gold/50 bg-gold/10 px-3 py-1.5 font-mono text-[11px] text-gold2 transition-colors hover:bg-gold/20'
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
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className="pointer-events-auto flex max-h-[min(540px,calc(100svh-12rem))] w-[min(calc(100vw-1.5rem),380px)] md:max-h-[min(540px,calc(100svh-15rem))] xl:max-h-[min(540px,calc(100svh-17rem))] flex-col overflow-hidden rounded-2xl border border-line2 bg-bg3 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7),0_0_0_1px_rgba(240,168,50,0.08)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line2 bg-bg2 px-4 py-3">
        <h2 id={titleId} className="font-display text-lg italic text-gold2">
          {fill(text.panelTitle, { name: MASCOT_NAME })}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={text.close}
          className="grid h-8 w-8 place-items-center rounded-lg border border-line2 text-text2 transition-colors hover:border-gold hover:text-text"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <div key={message.id} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div className="max-w-[92%]">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-text3">
                {message.role === 'user' ? text.you : MASCOT_NAME}
              </p>
              {message.role === 'user' ? (
                <p className="whitespace-pre-line rounded-xl rounded-tr-sm bg-gold px-3 py-2 text-sm text-bg">{message.text}</p>
              ) : (
                <div
                  aria-hidden={!message.done}
                  title={message.done ? undefined : text.skipTyping}
                  onClick={() => markDone(message.id)}
                  className="cursor-default whitespace-pre-line rounded-xl rounded-tl-sm border border-line2 bg-bg2 px-3 py-2 text-sm leading-relaxed text-text"
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
                      className="rounded-full border border-line2 bg-bg px-3 py-1 text-xs text-text2 transition-colors hover:border-gold hover:text-text"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {live}
      </div>

      <div className="border-t border-line2 bg-bg2 px-4 pb-3 pt-3">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text3">{text.quickTitle}</p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {text.quick.map((question) => (
            <button
              key={question.id}
              type="button"
              onClick={() => submit(question.label)}
              className="rounded-full border border-line2 bg-bg px-2.5 py-1 text-xs text-text2 transition-colors hover:border-gold hover:text-text"
            >
              {question.label}
            </button>
          ))}
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
            className="min-w-0 flex-1 rounded-lg border border-line2 bg-bg px-3 py-2 text-sm text-text placeholder:text-text3 focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-gold px-3.5 py-2 text-sm font-medium text-bg transition-colors hover:bg-gold2"
          >
            {text.send}
          </button>
        </form>
      </div>
    </div>
  )
}
