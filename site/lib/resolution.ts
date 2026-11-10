// The site's resolution level: 0 = 8-bit … 5 = HD. Set by the dial, read by every resolve surface.
export const HD = 5
let level = HD
const subs = new Set<() => void>()

export const getLevel = () => level
export function setLevel(n: number) {
  const next = Math.max(0, Math.min(HD, Math.round(n)))
  if (next === level) return
  level = next
  subs.forEach((f) => f())
}
export function subscribe(f: () => void) {
  subs.add(f)
  return () => {
    subs.delete(f)
  }
}

export const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

// GSAP + ScrollTrigger are loaded once, after first paint, by whoever needs them first.
let gsapP: Promise<{ gsap: typeof import('gsap').gsap; ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger }> | undefined
export function loadGsap() {
  gsapP ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, s]) => {
    g.gsap.registerPlugin(s.ScrollTrigger)
    return { gsap: g.gsap, ScrollTrigger: s.ScrollTrigger }
  })
  return gsapP
}
