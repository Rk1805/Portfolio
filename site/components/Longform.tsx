import type { ReactNode } from 'react'

/** The reading layout shared by case studies and blog posts. */
export function Longform({ children, hue }: { children: ReactNode; hue?: string }) {
  return (
    <div className="prose" style={hue ? ({ '--hue': hue } as React.CSSProperties) : undefined}>
      {children}
    </div>
  )
}

/* Media slots for MDX. Real files only: nothing renders until a src is given. */
export function Figure({ src, alt, caption, width = 1600, height = 1000 }: { src?: string; alt: string; caption?: string; width?: number; height?: number }) {
  if (!src) return null
  return (
    <figure>
      {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised by Assets */}
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" className="w-full h-auto border border-line" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

export function Video({ src, poster, caption, label }: { src?: string; poster?: string; caption?: string; label: string }) {
  if (!src) return null
  return (
    <figure>
      <video src={src} poster={poster} controls muted playsInline preload="none" aria-label={label} className="w-full border border-line" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
