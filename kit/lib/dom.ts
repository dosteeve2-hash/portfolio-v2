export const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export function inViewport(el: Element, margin = 0): boolean {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight - margin && rect.bottom > 0
}

/** Appelle `onEnter` une seule fois, à la première entrée dans l'écran, puis arrête d'observer. */
export function onFirstView(el: Element, onEnter: () => void, rootMargin = '0px 0px -8% 0px', threshold = 0): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      observer.disconnect()
      onEnter()
    },
    { rootMargin, threshold },
  )
  observer.observe(el)
  return () => observer.disconnect()
}

export const srOnlyStyle = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
} as const

type Job = () => (() => void) | undefined
const queue: Job[] = []
let scheduled = false

function flush(): void {
  scheduled = false
  const jobs = queue.splice(0)
  // Toutes les lectures d'abord, toutes les écritures ensuite : une seule mise en page au lieu d'une par élément.
  const writes = jobs.map((job) => job())
  for (const write of writes) write?.()
}

/**
 * Regroupe les mesures (lectures du DOM) puis les modifications (écritures) de tous les composants montés
 * dans le même passage : évite les mises en page forcées en cascade au chargement.
 * `read` renvoie la fonction d'écriture à exécuter, ou rien.
 */
export function batchLayout(read: Job): void {
  queue.push(read)
  if (!scheduled) {
    scheduled = true
    queueMicrotask(flush)
  }
}
