'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useRef, type ComponentProps } from 'react'
import { reducedMotion } from '@/lib/resolution'

const COVER_MS = 380
const REVEAL_MS = 520
const N = 96

// Deterministic per-block delays (same on server and client).
const rnd = (i: number) => (((i + 1) * 2654435761) >>> 0) / 4294967296
const BLOCKS = Array.from({ length: N }, (_, i) => ({
  c: Math.round(rnd(i) * 200),
  // reveal clears roughly top-left first, where the next page's title is
  r: Math.round(((i % 12) / 12 + Math.floor(i / 12) / 8) * 110 + rnd(i + N) * 120),
}))

const Ctx = createContext<(href: string) => void>(() => {})

/** Pixel wipe between routes: blocks cover, the route changes underneath, blocks clear. */
export function WipeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const el = useRef<HTMLDivElement>(null)
  const phase = useRef<'idle' | 'cover' | 'reveal'>('idle')
  const timer = useRef(0)

  const set = (p: typeof phase.current) => {
    phase.current = p
    if (el.current) el.current.dataset.phase = p
  }
  const reveal = useCallback(() => {
    if (phase.current !== 'cover') return
    clearTimeout(timer.current)
    set('reveal')
    timer.current = window.setTimeout(() => set('idle'), REVEAL_MS)
  }, [])

  // The new route has rendered.
  useEffect(reveal, [pathname, reveal])
  useEffect(() => () => clearTimeout(timer.current), [])

  const go = useCallback(
    (href: string) => {
      if (phase.current === 'cover') return
      if (reducedMotion()) return router.push(href)
      clearTimeout(timer.current)
      set('cover')
      timer.current = window.setTimeout(() => {
        router.push(href)
        // never leave the page covered if navigation stalls
        timer.current = window.setTimeout(reveal, 2500)
      }, COVER_MS)
    },
    [router, reveal],
  )

  return (
    <Ctx.Provider value={go}>
      {children}
      <div ref={el} className="wipe" data-phase="idle" aria-hidden="true">
        {BLOCKS.map((b, i) => (
          <i key={i} style={{ '--c': `${b.c}ms`, '--r': `${b.r}ms` } as React.CSSProperties} />
        ))}
      </div>
    </Ctx.Provider>
  )
}

/** next/link that plays the wipe. Modified clicks, new tabs and same-page links behave natively. */
export function TLink({ href, onClick, nav, ...rest }: Omit<ComponentProps<typeof Link>, 'href'> & { href: string; nav?: boolean }) {
  const go = useContext(Ctx)
  const pathname = usePathname()
  return (
    <Link
      href={href}
      aria-current={nav && pathname.startsWith(href) ? 'page' : undefined}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        if (href === pathname) return
        e.preventDefault()
        go(href)
      }}
      {...rest}
    />
  )
}
