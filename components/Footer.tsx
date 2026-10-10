import { SITE } from '@/content/site'
import type { Dictionary } from '@/content/types'

export default function Footer({ dict }: { readonly dict: Dictionary }) {
  return (
    <footer className="theme-navy border-t border-line bg-[#07173c] py-10 text-text">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
        <p className="font-display text-lg italic text-accent">
          {dict.brand.name} <span className="text-text2">· {dict.brand.slogan}</span>
        </p>
        <p className="font-mono text-xs text-text2">
          © {new Date().getFullYear()} {SITE.name}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  )
}
