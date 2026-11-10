import fs from 'node:fs'
import path from 'node:path'
import type { ComponentType } from 'react'

export type WorkMeta = {
  title: string
  order: number
  hue: string
  art?: 'pet' | 'phish' | 'bilingual' | 'route' // which code-drawn cover composition to use
  summary: string // card line on home and /work
  tags: string
  role: string
  year: string
  stack: string
  hook: string
  links?: { label: string; href: string }[]
  cover?: string // path under /media/work/<slug>/ once real media exists
}
export type PostMeta = { title: string; date: string; summary: string }

type Kind = 'work' | 'blog'
type Entry<M> = { slug: string; meta: M; Body: ComponentType }

// Files starting with "_" are drafts/templates and are never listed or routed.
export function slugs(kind: Kind) {
  return fs
    .readdirSync(path.join(process.cwd(), 'content', kind))
    .filter((f) => f.endsWith('.mdx') && !f.startsWith('_'))
    .map((f) => f.slice(0, -4))
}

async function load<M>(kind: Kind, slug: string): Promise<Entry<M>> {
  const mod = (await import(`@/content/${kind}/${slug}.mdx`)) as { default: ComponentType; meta: M }
  return { slug, meta: mod.meta, Body: mod.default }
}

export async function getWork() {
  const all = await Promise.all(slugs('work').map((s) => load<WorkMeta>('work', s)))
  return all.sort((a, b) => a.meta.order - b.meta.order)
}
export async function getPosts() {
  const all = await Promise.all(slugs('blog').map((s) => load<PostMeta>('blog', s)))
  return all.sort((a, b) => b.meta.date.localeCompare(a.meta.date))
}
