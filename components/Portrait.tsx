import Image from 'next/image'
import { PORTRAIT_FOCUS, PORTRAIT_SRC } from '@/content/site'

interface PortraitProps {
  readonly alt: string
  readonly sizes: string
  readonly priority?: boolean
  readonly className?: string
}

export default function Portrait({ alt, sizes, priority = false, className = '' }: PortraitProps) {
  return (
    <div className={`relative aspect-square w-full overflow-hidden rounded-md border border-line2 bg-bg2 ${className}`}>
      <Image
        src={PORTRAIT_SRC}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={70}
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
