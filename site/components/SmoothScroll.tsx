'use client'

import { useEffect } from 'react'
import { loadGsap, reducedMotion } from '@/lib/resolution'

/** Lenis on wheel/trackpad only; touch and reduced-motion keep native scrolling. Loaded after first paint. */
export function SmoothScroll() {
  useEffect(() => {
    if (reducedMotion() || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let stop = () => {}
    let dead = false
    const id = window.setTimeout(async () => {
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([import('lenis'), loadGsap()])
      if (dead) return
      const lenis = new Lenis({ lerp: 0.1, anchors: true })
      lenis.on('scroll', ScrollTrigger.update)
      const raf = (t: number) => lenis.raf(t * 1000)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)
      stop = () => {
        gsap.ticker.remove(raf)
        lenis.destroy()
      }
    }, 200)
    return () => {
      dead = true
      clearTimeout(id)
      stop()
    }
  }, [])
  return null
}
