'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/** Un seul observateur pour toute la page : transition CSS d'opacité et de transformation, jouée par le compositeur. */
export default function RevealController() {
  const pathname = usePathname()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-shown', '')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -60px 0px' },
    )
    document.querySelectorAll('[data-reveal]:not([data-shown])').forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [pathname])

  return null
}
