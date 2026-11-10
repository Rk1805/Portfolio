'use client'

import { useEffect, useRef } from 'react'
import { GUJARATI_A, HOOK, NINJA } from '@/lib/pix'
import { getLevel, HD, loadGsap, reducedMotion, subscribe } from '@/lib/resolution'

// Grid columns per level (3:2, so 12 columns = 12×8). 0 = full resolution.
const GRID = [12, 24, 48, 96, 192, 0]

const VOID = '#06070a'
const INK = '#ede9e0'
export type Art = 'pet' | 'phish' | 'bilingual' | 'route'

/**
 * Each project's cover is a composition made for it, drawn in code: typographic or abstract,
 * never a screenshot. Coordinates are in a 24×16 cell grid (u = one cell).
 */
function paintArt(ctx: CanvasRenderingContext2D, art: Art | undefined, title: string, hue: string, family: string, w: number, h: number) {
  const u = h / 16
  const blk = (x: number, y: number, cw = 1, ch = 1, c = VOID) => {
    ctx.fillStyle = c
    // +0.6px overlap: neighbouring blocks must not show a seam when the grid lands on half pixels
    ctx.fillRect(x * u, y * u, cw * u + 0.6, ch * u + 0.6)
  }
  const sprite = (rows: string[], x: number, y: number, s: number, colors: Record<string, string>) =>
    rows.forEach((row, j) => [...row].forEach((ch, i) => ch !== '.' && blk(x + i * s, y + j * s, s, s, colors[ch])))
  const big = (text: string, x: number, baseline: number, size: number, color: string, font = family) => {
    ctx.font = `900 ${size * u}px ${font}`
    ctx.fillStyle = color
    ctx.fillText(text, x * u, baseline * u)
  }
  ctx.fillStyle = hue
  ctx.fillRect(0, 0, w, h)
  ctx.textBaseline = 'alphabetic'

  if (art === 'pet') {
    // a pet on the bottom edge of a screen: the ground strip is the screen edge it walks along
    blk(0, 14, 24, 2)
    sprite(NINJA, 12.5, 4.25, 0.625, { k: VOID, i: INK })
    sprite(NINJA, 2.5, 9, 0.3125, { k: VOID, i: INK })
  } else if (art === 'phish') {
    // the number the case study turns on, with a hook hanging over it
    ctx.font = `900 100px ${family}`
    const size = Math.min(9, (22 * u * 100) / ctx.measureText('8,612').width / u)
    big('8,612', 1.5, 14.2, size, VOID)
    blk(19.75, 0, 0.5, 1)
    sprite(HOOK, 18, 1, 0.5, { k: VOID })
  } else if (art === 'bilingual') {
    // English and Gujarati, side by side
    blk(12, 0, 12, 16)
    ctx.textAlign = 'center'
    big('A', 6, 14, 15, VOID)
    // the Gujarati letter is drawn from an outline, not a font, so every device shows it
    const k = (9.5 * u) / 955
    ctx.save()
    ctx.translate(13.25 * u - 17 * k, 8 * u + 301 * k)
    ctx.scale(k, -k)
    ctx.fillStyle = hue
    ctx.fill(new Path2D(GUJARATI_A))
    ctx.restore()
    ctx.textAlign = 'left'
  } else if (art === 'route') {
    // one route, four stops: the four roles
    for (let x = 1; x < 24; x += 2) for (let y = 1; y < 16; y += 2) blk(x - 0.1, y - 0.1, 0.2, 0.2, 'rgba(6,7,10,0.35)')
    const pts: [number, number][] = [
      [3, 12],
      [3, 5],
      [10, 5],
      [10, 10],
      [17, 10],
      [17, 3],
      [21, 3],
    ]
    pts.slice(1).forEach(([x, y], i) => {
      const [px, py] = pts[i]!
      blk(Math.min(px, x) - 0.25, Math.min(py, y) - 0.25, Math.abs(x - px) + 0.5, Math.abs(y - py) + 0.5)
    })
    ;[pts[0]!, pts[2]!, pts[4]!, pts[6]!].forEach(([x, y], i) => {
      blk(x - 1.25, y - 1.25, 2.5, 2.5)
      blk(x - 0.75, y - 0.75, 1.5, 1.5, i === 3 ? INK : hue)
    })
  } else {
    // no composition defined: the title itself is the cover
    const lines = title.toUpperCase().split(' ')
    ctx.font = `900 100px ${family}`
    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width))
    const fs = Math.min(h / (lines.length * 0.86 + 0.1), (w * 0.94 * 100) / widest)
    ctx.font = `900 ${fs}px ${family}`
    ctx.fillStyle = VOID
    lines.forEach((l, i) => ctx.fillText(l, w * 0.03, h - h * 0.05 - (lines.length - 1 - i) * fs * 0.86))
  }
}

type Props = {
  title: string
  hue: string
  art?: Art
  /** right-align the cover within its row */
  side?: 'left' | 'right'
  /** real cover image, once Rishi supplies media; until then the title on the hue is the cover */
  src?: string
  /** 'scroll': sharpens toward the viewport centre. 'once': resolves on load and stays sharp. */
  mode?: 'scroll' | 'once'
}

/** Project resolve: one canvas, redrawn only when its resolution level changes. */
export function Cover({ title, hue, art, src, side = 'left', mode = 'scroll' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const readout = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return
    const still = reducedMotion()
    let own = still ? HD : 0 // this cover's level from scroll / intro
    let shown = -1
    let img: HTMLImageElement | undefined
    let dead = false
    const timers: number[] = []

    const paint = (w: number, h: number) => {
      if (img) {
        ctx.drawImage(img, 0, 0, w, h)
        return
      }
      paintArt(ctx, art, title, hue, getComputedStyle(cv).fontFamily, w, h)
    }

    const draw = (force = false) => {
      const level = Math.min(own, getLevel())
      if (level === shown && !force) return
      shown = level
      const w = cv.clientWidth
      const h = cv.clientHeight
      if (!w) return
      const cols = GRID[level] ?? 0
      const scale = cols ? cols / w : Math.min(devicePixelRatio, 2)
      cv.width = Math.round(w * scale)
      cv.height = Math.round(h * scale)
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      paint(w, h)
      cv.toggleAttribute('data-sharp', !cols)
      cv.dataset.level = String(level)
      // the live readout names the moment: 12 × 8 … HD
      if (readout.current) readout.current.textContent = cols ? `${cols} × ${(cols * 2) / 3}` : 'HD'
    }

    const start = () => {
      if (dead) return
      draw(true)
      if (still) return
      if (mode === 'once') {
        for (let i = 1; i <= HD; i++)
          timers.push(
            window.setTimeout(() => {
              own = i
              draw()
            }, i * 140),
          )
        return
      }
      loadGsap().then(({ ScrollTrigger }) => {
        if (dead) return
        const st = ScrollTrigger.create({
          trigger: cv,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            // 0 at viewport centre, 1 at the edges; sharp inside the middle band
            const d = Math.abs(self.progress - 0.5) * 2
            own = d < 0.35 ? HD : Math.max(0, Math.floor(HD - ((d - 0.35) / 0.65) * (HD + 0.99)))
            draw()
          },
          onRefresh: (self) => self.vars.onUpdate?.(self),
        })
        cleanups.push(() => st.kill())
      })
    }

    const cleanups: (() => void)[] = [subscribe(() => draw())]
    const ro = new ResizeObserver(() => draw(true))
    ro.observe(cv)
    cleanups.push(() => ro.disconnect())

    const ready = () => document.fonts.ready.then(start)
    if (src) {
      const i = new Image()
      i.onload = () => {
        img = i
        ready()
      }
      i.onerror = ready
      i.src = src
    } else ready()

    return () => {
      dead = true
      timers.forEach(clearTimeout)
      cleanups.forEach((f) => f())
    }
  }, [title, hue, art, src, mode])

  return (
    <div className="cover-wrap" data-side={side} aria-hidden="true">
      <canvas ref={ref} className="cover display" style={{ '--hue': hue } as React.CSSProperties} data-testid="cover" />
      <p className="label readout js-only">
        <span>Resolution</span>
        <span ref={readout} className="tabular-nums" data-testid="cover-readout">
          12 × 8
        </span>
      </p>
    </div>
  )
}
