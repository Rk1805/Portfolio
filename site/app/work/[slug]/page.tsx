import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Cover } from '@/components/Cover'
import { Longform } from '@/components/Longform'
import { ResolveText } from '@/components/ResolveText'
import { TLink } from '@/components/Wipe'
import { getWork, slugs } from '@/lib/content'

export const dynamicParams = false
export const generateStaticParams = () => slugs('work').map((slug) => ({ slug }))

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = (await getWork()).find((w) => w.slug === slug)
  if (!item) return {}
  const { title, summary } = item.meta
  return {
    title,
    description: summary,
    openGraph: { title, description: summary, type: 'article', images: [{ url: `/og/${slug}.png`, width: 1200, height: 630, alt: `${title}. ${summary}` }] },
  }
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params
  const work = await getWork()
  const i = work.findIndex((w) => w.slug === slug)
  const item = work[i]
  const next = work[(i + 1) % work.length]
  if (!item || !next) notFound()
  const { meta, Body } = item
  const hue = { '--hue': meta.hue } as React.CSSProperties

  return (
    <article className="wrap pt-32" style={hue}>
      <p>
        <TLink href="/work" className="u label py-2">
          ← Work
        </TLink>
      </p>
      <ResolveText as="h1" className="display t-h1 mt-6">
        {meta.title}
      </ResolveText>
      <div className="rule mt-8" />
      <dl className="cols gap-y-6 py-8" data-testid="meta-row">
        {(
          [
            ['Role', meta.role],
            ['Year', meta.year],
            ['Stack', meta.stack],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="col-span-6 md:col-span-3">
            <dt className="label">{k}</dt>
            <dd className="mt-1 font-medium">{v}</dd>
          </div>
        ))}
        {meta.links?.length ? (
          <div className="col-span-6 md:col-span-3">
            <dt className="label">Links</dt>
            <dd className="mt-1 font-medium">
              {meta.links.map((l) => (
                <a key={l.href} href={l.href} className="inline-link mr-4" target="_blank" rel="noopener noreferrer">
                  {l.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
      <Cover title={meta.title} hue={meta.hue} art={meta.art} src={meta.cover} mode="once" />

      <p className="lead my-[clamp(56px,8vw,112px)] max-w-[34ch] text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[1.2]">{meta.hook}</p>

      <Longform hue={meta.hue}>
        <Body />
      </Longform>

      <nav aria-label="Next project" className="hair mt-[clamp(72px,10vw,144px)] pt-10">
        <TLink href={`/work/${next.slug}`} className="row-link block" data-testid="next-project">
          <span className="label">Next project →</span>
          <span className="row-title display t-h1 mt-2 block">{next.meta.title}</span>
        </TLink>
      </nav>
    </article>
  )
}
