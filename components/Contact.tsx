import type { Locale } from '@/content/locales'
import { cvHref, githubUrl, SITE } from '@/content/site'
import type { Dictionary } from '@/content/types'
import Cta from './Cta'
import Reveal from './Reveal'
import Section from './Section'

interface Channel {
  readonly label: string
  readonly value: string
  readonly href: string
}

export default function Contact({ locale, dict }: { readonly locale: Locale; readonly dict: Dictionary }) {
  const channels: Channel[] = [
    { label: dict.contact.email, value: SITE.email, href: `mailto:${SITE.email}` },
    { label: dict.contact.github, value: `github.com/${SITE.githubUser}`, href: githubUrl() },
  ]
  if (SITE.linkedinUrl) {
    channels.push({
      label: dict.contact.linkedin,
      value: SITE.linkedinUrl.replace(/^https?:\/\/(www\.)?/, ''),
      href: SITE.linkedinUrl,
    })
  }

  return (
    <Section id="contact" index={8} label={dict.nav.contact} title={dict.contact.title} intro={dict.contact.text}>
      <Reveal>
        <ul className="grid gap-4 md:grid-cols-3">
          {channels.map((channel) => (
            <li key={channel.label}>
              <a
                data-spotlight
                href={channel.href}
                {...(channel.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="block h-full rounded-2xl border border-line2 bg-bg3 p-5 transition-colors hover:border-gold"
              >
                <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-text2">
                  {channel.label}
                </span>
                <span className="mt-2 block break-all font-display text-lg italic text-gold2">{channel.value}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Cta href={cvHref(locale)}>{dict.contact.cv}</Cta>
        </div>
      </Reveal>
    </Section>
  )
}
