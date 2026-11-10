import assert from 'node:assert/strict'
import { test } from 'node:test'
import { create, MAP_NAMES, step, topTen, W, walls } from './snake.ts'

test('start is clear on every map and food never lands on a wall', () => {
  for (const m of MAP_NAMES) {
    const w = walls(m)
    const s = create(w, () => 0.5)
    assert.ok(s.snake.every((c) => !w.has(c)), m)
    assert.ok(!w.has(s.food) && !s.snake.includes(s.food), m)
  }
})

test('moves, ignores reversal, grows on food, dies on wall', () => {
  const w = walls('Classic Box')
  let s = create(w, () => 0)
  const head = s.snake[0]!
  s = step(s, 'L', w) // reversal ignored: still moving right
  assert.equal(s.snake[0], head + 1)
  assert.equal(s.snake.length, 3)
  s = step({ ...s, food: s.snake[0]! + 1 }, 'R', w, () => 0)
  assert.equal(s.snake.length, 4)
  assert.equal(s.score, 1)
  for (let i = 0; i < W; i++) s = step(s, 'R', w)
  assert.ok(s.dead)
})

test('top ten keeps the ten best, highest first', () => {
  assert.deepEqual(topTen([9, 8, 7, 6, 5, 4, 3, 2, 1, 0], 5), [9, 8, 7, 6, 5, 5, 4, 3, 2, 1])
})
