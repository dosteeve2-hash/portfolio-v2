import Image from 'next/image'
import type { Dictionary, GalleryPhotoId } from '@/content/types'
import Reveal from './Reveal'
import Section from './Section'

interface GalleryPhoto {
  readonly id: GalleryPhotoId
  readonly src: string
}

const PHOTOS: readonly GalleryPhoto[] = [
  { id: 'main', src: '/photos/main.webp' },
  { id: 'campus', src: '/photos/campus.webp' },
  { id: 'classroom', src: '/photos/look-2.webp' },
  { id: 'headphones', src: '/photos/headphones.webp' },
]

export default function Gallery({ dict }: { readonly dict: Dictionary }) {
  return (
    <Section id="gallery" index={8} label={dict.gallery.title} title={dict.gallery.title} intro={dict.gallery.intro}>
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {PHOTOS.map((photo, index) => {
          const text = dict.gallery.photos[photo.id]
          return (
            <li key={photo.id}>
              <Reveal delay={index * 0.06}>
                <figure className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-bg2 shadow-soft ring-1 ring-line">
                    <Image
                      src={photo.src}
                      alt={text.alt}
                      width={600}
                      height={800}
                      loading="lazy"
                      sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 50vw"
                      className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.04]"
                    />
                  </div>
                  <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-text2">
                    {text.caption}
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
