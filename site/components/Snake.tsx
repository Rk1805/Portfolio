'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { create, H, MAP_NAMES, step, topTen, W, walls, type Dir, type MapName, type State } from '@/lib/snake'

const KEYS: Record<string, Dir> = { w: 'U', a: 'L', s: 'D', d: 'R', arrowup: 'U', arrowleft: 'L', arrowdown: 'D', arrowright: 'R' }
const CELL = 16
const STORE = 'snake-scores-v1'
type Scores = Partial<Record<MapName, number[]>>

// localStorage is user-editable: keep only finite numbers per known map, anything else reads as empty.
const readScores = (): Scores => {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORE) ?? '{}')
    const out: Scores = {}
    if (raw && typeof raw === 'object')
      for (const m of MAP_NAMES) {
        const list = (raw as Record<string, unknown>)[m]
        if (Array.isArray(list)) out[m] = list.filter((n): n is number => typeof n === 'number' && Number.isFinite(n)).slice(0, 10)
      }
    return out
  } catch {
    return {}
  }
}

export function Snake() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [map, setMap] = useState<MapName>('Classic Box')
  const [speed, setSpeed] = useState(3)
  const [status, setStatus] = useState<'ready' | 'playing' | 'paused' | 'over'>('ready')
  const [score, setScore] = useState(0)
  const [scores, setScores] = useState<Scores>({})
  const game = useRef<{ s: State; w: Set<number>; want: Dir }>(null)

  const paint = useCallback(() => {
    const ctx = canvas.current?.getContext('2d')
    const g = game.current
    if (!ctx || !g) return
    ctx.fillStyle = '#06070a'
    ctx.fillRect(0, 0, W * CELL, H * CELL)
    const cell = (i: number, color: string) => {
      ctx.fillStyle = color
      ctx.fillRect((i % W) * CELL, Math.floor(i / W) * CELL, CELL, CELL)
    }
    g.w.forEach((i) => cell(i, '#232833'))
    if (g.s.food >= 0) cell(g.s.food, '#45c8e0')
    g.s.snake.forEach((i, n) => cell(i, n === 0 ? '#ff9a3d' : '#ede9e0'))
  }, [])

  const reset = useCallback(
    (m: MapName) => {
      const w = walls(m)
      game.current = { s: create(w), w, want: 'R' }
      setScore(0)
      paint()
    },
    [paint],
  )

  useEffect(() => {
    setScores(readScores())
    reset('Classic Box')
  }, [reset])

  // Game loop: fixed tick, only while playing.
  useEffect(() => {
    if (status !== 'playing') return
    const id = setInterval(() => {
      const g = game.current
      if (!g) return
      g.s = step(g.s, g.want, g.w)
      setScore(g.s.score)
      paint()
      if (g.s.dead) {
        setStatus('over')
        if (g.s.score > 0) {
          const next = { ...readScores() }
          next[map] = topTen(next[map] ?? [], g.s.score)
          try {
            localStorage.setItem(STORE, JSON.stringify(next))
          } catch {
            // private mode: scores just don't persist
          }
          setScores(next)
        }
      }
    }, 240 - speed * 36)
    return () => clearInterval(id)
  }, [status, speed, map, paint])

  // Keys are only captured while a game is running, so the page stays scrollable otherwise.
  useEffect(() => {
    if (status !== 'playing') return
    const key = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      const dir = KEYS[k]
      if (dir && game.current) {
        e.preventDefault()
        game.current.want = dir
      } else if (k === 'escape' || k === ' ') {
        e.preventDefault()
        setStatus('paused')
      }
    }
    const blur = () => setStatus('paused')
    addEventListener('keydown', key)
    addEventListener('blur', blur)
    return () => {
      removeEventListener('keydown', key)
      removeEventListener('blur', blur)
    }
  }, [status])

  const start = () => {
    if (status === 'over' || status === 'ready') reset(map)
    setStatus('playing')
    canvas.current?.focus({ preventScroll: true })
  }
  const turn = (d: Dir) => {
    if (game.current) game.current.want = d
  }
  const pickMap = (m: MapName) => {
    setMap(m)
    setStatus('ready')
    reset(m)
  }
  const list = scores[map] ?? []

  return (
    <div className="js-only grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]" data-testid="snake">
      <div>
        <div className="relative border-2 border-line bg-void">
          <canvas
            ref={canvas}
            width={W * CELL}
            height={H * CELL}
            tabIndex={0}
            role="img"
            aria-label={`Snake game board, ${map} map. Score ${score}.`}
            className="block w-full [image-rendering:pixelated]"
            style={{ aspectRatio: `${W} / ${H}`, touchAction: 'none' }}
          />
          {status !== 'playing' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-void/60">
              {status === 'over' && (
                <p className="display t-h3" role="status">
                  Game over. Score {score}
                </p>
              )}
              {status === 'paused' && <p className="display t-h3">Paused</p>}
              <button type="button" className="btn btn-primary" onClick={start} data-testid="snake-start">
                {status === 'paused' ? 'Resume' : status === 'over' ? 'Play again' : 'Start game'}
              </button>
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="label" aria-live="off">
            Score <strong className="text-ink">{score}</strong>
          </p>
          <p className="label">
            <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> or arrow keys to move. <kbd>Esc</kbd> pauses.
          </p>
        </div>
        {/* touch controls */}
        <div className="mx-auto mt-4 grid w-[168px] grid-cols-3 gap-2 [@media(hover:hover)_and_(pointer:fine)]:hidden" aria-label="Direction buttons" role="group">
          {(
            [
              ['U', 'Up', 'col-start-2'],
              ['L', 'Left', 'col-start-1 row-start-2'],
              ['D', 'Down', 'col-start-2 row-start-2'],
              ['R', 'Right', 'col-start-3 row-start-2'],
            ] as const
          ).map(([d, name, pos]) => (
            <button key={d} type="button" className={`btn !p-0 ${pos}`} aria-label={name} onPointerDown={() => turn(d)}>
              <span aria-hidden="true" className={`block h-3 w-3 bg-ink`} />
            </button>
          ))}
        </div>
      </div>

      <div className="grid content-start gap-6">
        <fieldset>
          <legend className="label mb-2">Map</legend>
          <div className="flex flex-wrap gap-2">
            {MAP_NAMES.map((m) => (
              <button key={m} type="button" className="btn" aria-pressed={m === map} onClick={() => pickMap(m)}>
                {m}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="grid gap-1">
          <span className="label">Speed {speed} of 5</span>
          <input className="range range-wide" type="range" min={1} max={5} step={1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
        </label>
        <div>
          <h3 className="label mb-2">High scores, {map}</h3>
          {list.length ? (
            <ol className="grid grid-cols-2 gap-x-6 tabular-nums" data-testid="snake-scores">
              {list.map((n, i) => (
                <li key={i} className="flex justify-between border-b border-line py-1">
                  <span className="mute">{i + 1}</span>
                  <span>{n}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mute">No scores on this map yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
