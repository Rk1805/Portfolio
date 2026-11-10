import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Longform } from '@/components/Longform'
import { ResolveText } from '@/components/ResolveText'
import { TLink } from '@/components/Wipe'
import { getPosts, slugs } from '@/lib/content'

export const dynamicParams = false
export const generateStaticParams = () => slugs('blog').map((slug) => ({ slug }))

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = (await getPosts()).find((p) => p.slug === slug)
  return post ? { title: post.meta.title, description: post.meta.summary, openGraph: { type: 'article', title: post.meta.title, description: post.meta.summary } } : {}
}

export default async function Post({ params }: Props) {
  const { slug } = await params
  const posts = await getPosts()
  const i = posts.findIndex((p) => p.slug === slug)
  const post = posts[i]
  if (!post) notFound()
  const next = posts.length > 1 ? posts[(i + 1) % posts.length] : undefined
  return (
    <article className="wrap pt-32">
      <p>
        <TLink href="/blog" className="u label py-2">
          ← Notes
        </TLink>
      </p>
      <ResolveText as="h1" className="display t-h1 mt-6">
        {post.meta.title}
      </ResolveText>
      <div className="rule mt-8" />
      <p className="label py-8">
        <time dateTime={post.meta.date}>{post.meta.date}</time>
      </p>
      <Longform>
        <post.Body />
      </Longform>
      {next && (
        <nav aria-label="Next note" className="hair mt-[clamp(72px,10vw,144px)] pt-10">
          <TLink href={`/blog/${next.slug}`} className="row-link block">
            <span className="label">Next note →</span>
            <span className="row-title display t-h2 mt-2 block">{next.meta.title}</span>
          </TLink>
        </nav>
      )}
    </article>
  )
}
