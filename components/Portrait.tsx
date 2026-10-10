import Image from 'next/image'
import { PORTRAIT_FOCUS, PORTRAIT_SRC } from '@/content/site'

interface PortraitProps {
  readonly alt: string
  readonly sizes: string
  readonly priority?: boolean
}

export default function Portrait({ alt, sizes, priority = false }: PortraitProps) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-full bg-bg3 shadow-lift ring-4 ring-white">
      <Image
        src={PORTRAIT_SRC}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{
          objectPosition: PORTRAIT_FOCUS.position,
          transform: `scale(${PORTRAIT_FOCUS.scale})`,
          transformOrigin: PORTRAIT_FOCUS.position,
        }}
      />
    </div>
  )
}
