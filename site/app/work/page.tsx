import type { Metadata } from 'next'
import { ResolveText } from '@/components/ResolveText'
import { WorkCard } from '@/components/WorkCard'
import { getWork } from '@/lib/content'
import { ALSO_BUILT } from '@/lib/site'

export const metadata: Metadata = { title: 'Work', description: 'Four projects in full, then everything else Rishi Kaneria has built.' }

export default async function Work() {
  const work = await getWork()
  return (
    <>
      <section className="wrap pt-40">
        <ResolveText as="h1" className="display t-h1">
          Work
        </ResolveText>
        <p className="lead mute mt-6">Four projects in full, then everything else.</p>
        <div className="mt-20 grid gap-[clamp(72px,10vw,144px)]">
          {work.map((w, i) => (
            <WorkCard key={w.slug} slug={w.slug} meta={w.meta} index={i} as="h2" />
          ))}
        </div>
      </section>

      <section className="section wrap" aria-labelledby="also">
        <ResolveText as="h2" id="also" className="display t-h2">
          Also built
        </ResolveText>
        <ul className="mt-10">
          {ALSO_BUILT.map((p) => (
            <li key={p.name} className="hair">
              <a href={p.repo} target="_blank" rel="noopener noreferrer" className="row-link cols items-baseline gap-y-2 py-6" data-testid="also-row">
                <span className="row-title display t-h3 col-span-12 md:col-span-4">{p.name}</span>
                <span className="col-span-12 md:col-span-5">{p.text}</span>
                <span className="label col-span-12 md:col-span-3 md:text-right">
                  {p.meta ? `${p.meta} · ` : ''}GitHub<span className="sr-only"> (opens in a new tab)</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
