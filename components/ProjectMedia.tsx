'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

interface ProjectMediaProps {
  /** Préfixe des médias de public/projects/. */
  readonly capture: string
  readonly logo: string
  readonly alt: string
  /** Mois et année de départ du projet, révélés à côté du logo. */
  readonly since: string
}

/** Au plus trois boucles vidéo en lecture en même temps : la plus ancienne se fige sur son poster. */
const MAX_PLAYING = 3
const playing = new Set<HTMLVideoElement>()

function startVideo(video: HTMLVideoElement): void {
  playing.delete(video)
  playing.add(video)
  while (playing.size > MAX_PLAYING) {
    const oldest = playing.values().next().value
    if (!oldest) break
    oldest.pause()
    playing.delete(oldest)
  }
  void video.play().catch(() => undefined)
}

function stopVideo(video: HTMLVideoElement): void {
  video.pause()
  playing.delete(video)
}

function wantsNoMotion(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return connection?.saveData === true
}

/**
 * Visuel d'un projet : capture neuve du vrai site (poster WebP) dans une fenêtre qui s'incline au survol,
 * capture mobile en médaillon, logo qui révèle sa date. La boucle vidéo (6 à 8 s, sans son) n'est montée
 * qu'à l'approche de l'écran, ne joue que lorsque la carte est visible, et n'existe pas si le mouvement est réduit.
 */
export default function ProjectMedia({ capture, logo, alt, since }: ProjectMediaProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const visibleRef = useRef(false)
  const [armed, setArmed] = useState(false)
  const [ready, setReady] = useState(false)

  const attachVideo = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node
    if (node && visibleRef.current) startVideo(node)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root || wantsNoMotion()) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1]
        if (!entry) return
        visibleRef.current = entry.isIntersecting
        const video = videoRef.current
        if (entry.isIntersecting) {
          setArmed(true)
          if (video) startVideo(video)
        } else if (video) {
          stopVideo(video)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(root)
    const onVisibility = () => {
      const video = videoRef.current
      if (!video) return
      if (document.visibilityState === 'hidden') stopVideo(video)
      else if (visibleRef.current) startVideo(video)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      const video = videoRef.current
      if (video) stopVideo(video)
    }
  }, [])

  return (
    <div ref={rootRef} className="proj-media">
      <div className="proj-screen">
        <Image
          src={`/projects/${capture}-d.webp`}
          width={960}
          height={600}
          alt={alt}
          unoptimized
          sizes="(min-width: 1024px) 360px, 90vw"
          className="block h-auto w-full"
        />
        {armed ? (
          <video
            ref={attachVideo}
            aria-hidden="true"
            tabIndex={-1}
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            width={960}
            height={600}
            onPlaying={() => setReady(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              ready ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src={`/projects/${capture}.webm`} type="video/webm" />
            <source src={`/projects/${capture}.mp4`} type="video/mp4" />
          </video>
        ) : null}
      </div>
      <div aria-hidden="true" className="proj-phone">
        <Image src={`/projects/${capture}-m.webp`} width={390} height={844} alt="" unoptimized className="block h-auto w-full" />
      </div>
      <div className="proj-chip">
        <span className="proj-chip-tile">
          <Image src={`/logos/${logo}/mark.svg`} width={36} height={36} alt="" unoptimized className="block h-9 w-9" />
        </span>
        <span className="proj-chip-label">{since}</span>
      </div>
    </div>
  )
}
