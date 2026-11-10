'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { reducedMotion, subscribe } from '@/lib/resolution'

// three.js + R3F live in their own chunk and never load before first paint.
const PortraitGL = dynamic(() => import('./PortraitGL'), { ssr: false })

const hasWebGL = () => {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

/**
 * Rishi, as a mosaic only. The poster is the rest state and the fallback;
 * the shader is layered on top when someone can actually interact with it.
 */
export function Portrait({ priority, className = '' }: { priority?: boolean; className?: string }) {
  const [gl, setGl] = useState(false)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (reducedMotion()) return
    setArmed(true)
    // probing WebGL creates a context, which is slow on weak devices: only do it when the shader is wanted
    const on = () => setGl((v) => v || hasWebGL())
    const unsub = subscribe(on) // the dial changes the portrait too
    // Pointer devices: warm it up once the page is idle. Touch: wait for a touch.
    let idle = 0
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const go = () => (idle = window.setTimeout(on, 1500))
      if (document.readyState === 'complete') go()
      else addEventListener('load', go, { once: true })
    }
    return () => {
      unsub()
      clearTimeout(idle)
    }
  }, [])

  return (
    <div className={`portrait ${className}`} data-testid="portrait" onPointerDown={armed ? () => setGl((v) => v || hasWebGL()) : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element -- 344-byte mosaic, nothing to optimise */}
      <img
        src="/media/portrait/portrait-poster.webp"
        width={640}
        height={800}
        alt="Pixelated portrait of Rishi Kaneria that sharpens as you move over it."
        fetchPriority={priority ? 'high' : undefined}
        loading={priority ? undefined : 'lazy'}
        decoding="async"
        draggable={false}
      />
      {gl && <PortraitGL />}
    </div>
  )
}
