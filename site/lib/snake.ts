// Pure Snake rules. The original is Rishi's 2024 terminal game in C; this is a web re-implementation.
export const W = 28
export const H = 20
export type Dir = 'U' | 'D' | 'L' | 'R'
export type MapName = 'Classic Box' | 'Compartment' | 'Apartment'
export const MAP_NAMES: MapName[] = ['Classic Box', 'Compartment', 'Apartment']
export type State = { snake: number[]; dir: Dir; food: number; score: number; dead: boolean }

const at = (x: number, y: number) => y * W + x
const DELTA: Record<Dir, number> = { U: -W, D: W, L: -1, R: 1 }
const OPPOSITE: Record<Dir, Dir> = { U: 'D', D: 'U', L: 'R', R: 'L' }

export function walls(map: MapName): Set<number> {
  const s = new Set<number>()
  for (let x = 0; x < W; x++) s.add(at(x, 0)).add(at(x, H - 1))
  for (let y = 0; y < H; y++) s.add(at(0, y)).add(at(W - 1, y))
  if (map === 'Compartment') {
    // two dividers, each with a doorway in the middle
    for (let y = 1; y < H - 1; y++) if (y < 8 || y > 11) s.add(at(9, y)).add(at(18, y))
  }
  if (map === 'Apartment') {
    // a corridor wall with two doors, and a room wall on each side
    for (let y = 1; y < H - 1; y++) if (![4, 5, 14, 15].includes(y)) s.add(at(14, y))
    for (let x = 1; x < 14; x++) if (x !== 6 && x !== 7) s.add(at(x, 7))
    for (let x = 15; x < W - 1; x++) if (x !== 20 && x !== 21) s.add(at(x, 12))
  }
  return s
}

function placeFood(snake: number[], w: Set<number>, rnd: () => number) {
  const free: number[] = []
  for (let i = 0; i < W * H; i++) if (!w.has(i) && !snake.includes(i)) free.push(i)
  return free[Math.floor(rnd() * free.length)] ?? -1
}

export function create(w: Set<number>, rnd: () => number = Math.random): State {
  const snake = [at(5, 10), at(4, 10), at(3, 10)]
  return { snake, dir: 'R', food: placeFood(snake, w, rnd), score: 0, dead: false }
}

/** One tick. `want` is the last direction the player asked for; reversing into yourself is ignored. */
export function step(s: State, want: Dir, w: Set<number>, rnd: () => number = Math.random): State {
  if (s.dead) return s
  const dir = want === OPPOSITE[s.dir] ? s.dir : want
  const head = (s.snake[0] ?? 0) + DELTA[dir]
  const eats = head === s.food
  const body = eats ? s.snake : s.snake.slice(0, -1) // the tail cell frees up this tick unless we grow
  if (w.has(head) || body.includes(head)) return { ...s, dir, dead: true }
  const snake = [head, ...body]
  return eats ? { snake, dir, food: placeFood(snake, w, rnd), score: s.score + 1, dead: false } : { ...s, snake, dir }
}

export function topTen(scores: number[], score: number) {
  return [...scores, score].sort((a, b) => b - a).slice(0, 10)
}
