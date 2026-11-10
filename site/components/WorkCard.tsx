import type { WorkMeta } from '@/lib/content'
import { Cover } from './Cover'
import { TLink } from './Wipe'

/** One project per row: the cover gets the full width, the words sit under it. Sides alternate. */
export function WorkCard({ slug, meta, index, as: H = 'h3' }: { slug: string; meta: WorkMeta; index: number; as?: 'h2' | 'h3' }) {
  const href = `/work/${slug}`
  const right = index % 2 === 1
  return (
    <article data-testid="work-card">
      <TLink href={href} tabIndex={-1} aria-hidden="true" className="block">
        <Cover title={meta.title} hue={meta.hue} art={meta.art} src={meta.cover} side={right ? 'right' : 'left'} />
      </TLink>
      <div className="cols mt-8 items-start gap-y-4">
        <H className="display t-h2 col-span-12 lg:col-span-6">{meta.title}</H>
        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          <p className="max-w-[44ch] text-[1.1875rem]">{meta.summary}</p>
          <p className="label mt-3">{meta.tags}</p>
          <TLink href={href} className="u mt-5 py-2 font-semibold">
            Read the case study<span className="sr-only">: {meta.title}</span>
          </TLink>
        </div>
      </div>
    </article>
  )
}
