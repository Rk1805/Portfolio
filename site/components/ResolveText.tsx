'use client'

import { Fragment, useEffect, useRef, type ElementType } from 'react'
import { NAME_BLOCKS } from '@/lib/pix'
import { getLevel, HD, reducedMotion, subscribe } from '@/lib/resolution'

// Blocks per em at levels 0–4. Level 5 is the real text.
const BLOCKS = [6, 10, 16, 28, 48]
// How often a block takes an accent colour, per level: colour fades out as the type sharpens.
const ACCENT = [0.12, 0.08, 0.05, 0.02, 0]
// The intro starts at level 1: the server-rendered blocks (NAME_BLOCKS) are that first, coarsest frame.
const INTRO_MS = [300, 240, 200, 180]
const INK = [237, 233, 224]
const TUNGSTEN = [255, 154, 61]
const ARC = [69, 200, 224]

// true until the first heading hydrates on this page load
let firstLoad = true

type Props = {
  as?: ElementType
  children: string
  className?: string
  /** play the name resolve once on mount (hero only) */
  intro?: boolean
  /** never get sharper than this level (404) */
  max?: number
  id?: string
}

/**
 * A display heading that can be drawn as square blocks.
 * The real text stays in the DOM for screen readers, search and copy/paste; the canvas is decoration.
 */
export function ResolveText({ as: Tag = 'h2', children, className = '', intro, max = HD, id }: Props) {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = root.current
    const cv = canvas.current
    const ctx = cv?.getContext('2d', { willReadFrequently: true })
    if (!el || !cv || !ctx) return
    let introLevel = HD
    let fontsReady = false
    const timers: number[] = []

    const draw = () => {
      const level = Math.min(getLevel(), introLevel, max)
      if (level === HD || !fontsReady) {
        if (level === HD) el.dataset.level = String(HD)
        return
      }
      const box = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      const fs = parseFloat(cs.fontSize)
      const block = Math.max(2, Math.round(fs / (BLOCKS[level] ?? 48)))
      const cols = Math.ceil(box.width / block)
      const rows = Math.ceil(box.height / block)
      if (!cols || !rows) return
      cv.width = cols
      cv.height = rows
      cv.style.width = `${cols * block}px`
      cv.style.height = `${rows * block}px`
      ctx.setTransform(1 / block, 0, 0, 1 / block, 0, 0)
      ctx.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`
      if ('letterSpacing' in ctx) ctx.letterSpacing = cs.letterSpacing
      ctx.fillStyle = '#fff'
      const ascent = ctx.measureText('H').fontBoundingBoxAscent
      const upper = cs.textTransform === 'uppercase'
      el.querySelectorAll<HTMLElement>('.w').forEach((w) => {
        const b = w.getBoundingClientRect()
        const text = w.textContent ?? ''
        ctx.fillText(upper ? text.toUpperCase() : text, b.left - box.left, b.top - box.top + ascent)
      })
      // Threshold coverage into solid blocks.
      const img = ctx.getImageData(0, 0, cols, rows)
      const d = img.data
      const p = ACCENT[level] ?? 0
      for (let i = 0; i < d.length; i += 4) {
        const on = (d[i + 3] ?? 0) > 96
        const n = i / 4
        // cheap stable hash so the same block keeps its colour between redraws
        const h = ((n * 2654435761) >>> 0) / 4294967296
        const c = !on ? INK : h < p / 2 ? TUNGSTEN : h < p ? ARC : INK
        d[i] = c[0] ?? 0
        d[i + 1] = c[1] ?? 0
        d[i + 2] = c[2] ?? 0
        d[i + 3] = on ? 255 : 0
      }
      ctx.putImageData(img, 0, 0)
      el.dataset.level = String(level)
    }

    const finishIntro = () => {
      timers.forEach(clearTimeout)
      introLevel = HD
      el.removeAttribute('data-intro')
      draw()
    }
    // If hydration lands late (slow network or CPU), the CSS failsafe has shown, or is about to show,
    // the sharp name: playing the blocks then would be a flash, so the resolve is skipped.
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]
    const late = firstLoad && !!fcp && performance.now() - fcp.startTime > 1000
    firstLoad = false
    if (intro && !late && !reducedMotion() && getLevel() === HD) {
      introLevel = 1
      // scrolling away mid-resolve jumps straight to sharp
      addEventListener('scroll', finishIntro, { once: true, passive: true })
    } else el.removeAttribute('data-intro')

    document.fonts.ready.then(() => {
      fontsReady = true
      draw()
      if (introLevel === HD) return
      let t = 0
      INTRO_MS.forEach((ms, i) => {
        t += ms
        timers.push(
          window.setTimeout(() => {
            if (i + 1 === INTRO_MS.length) finishIntro()
            else {
              introLevel = i + 2
              draw()
            }
          }, t),
        )
      })
    })

    const unsub = subscribe(draw)
    const ro = new ResizeObserver(draw)
    ro.observe(el)
    return () => {
      timers.forEach(clearTimeout)
      removeEventListener('scroll', finishIntro)
      unsub()
      ro.disconnect()
    }
  }, [intro, max])

  const words = children.split(' ')
  return (
    <Tag ref={root} id={id} className={`resolve ${intro ? 'resolve-intro' : ''} ${className}`} data-testid={intro ? 'hero-name' : undefined} data-intro={intro ? '' : undefined}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="word">
            <span className="w">{w}</span>
            {intro && <PreBlocks rows={NAME_BLOCKS[w.toUpperCase()]} />}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
      <canvas ref={canvas} aria-hidden="true" />
    </Tag>
  )
}

/** Static low-res version of one word, laid over it until the script takes over. Decorative; the real text is beside it. */
function PreBlocks({ rows }: { rows?: string[] }) {
  if (!rows?.[0]) return null
  const cols = rows[0].length
  const rects: { x: number; y: number; w: number; fill: string }[] = []
  rows.forEach((row, y) => {
    for (let x = 0; x < cols; x++) {
      if (row[x] !== '#') continue
      // stable pseudo-random, so a few blocks carry the accent colours (same on server and client)
      const h = Math.abs(Math.sin((y * cols + x + 1) * 12.9898) * 43758.5453) % 1
      const fill = h < 0.04 ? 'var(--color-tungsten)' : h < 0.08 ? 'var(--color-arc)' : 'var(--color-ink)'
      const last = rects[rects.length - 1]
      if (last && last.y === y && last.x + last.w === x && last.fill === fill) last.w++
      else rects.push({ x, y, w: 1, fill })
    }
  })
  return (
    <svg className="pre" aria-hidden="true" viewBox={`0 0 ${cols} ${rows.length}`} preserveAspectRatio="none" style={{ width: `${cols / 10}em`, height: `${rows.length / 10}em` }}>
      {/* 0.08 overlap hides seams when the grid lands on fractional pixels */}
      {rects.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w + 0.08} height="1.08" fill={r.fill} />
      ))}
    </svg>
  )
}
