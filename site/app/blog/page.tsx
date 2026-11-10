import type { Metadata } from 'next'
import { ResolveText } from '@/components/ResolveText'
import { TLink } from '@/components/Wipe'
import { notFound } from 'next/navigation'
import { getPosts } from '@/lib/content'

export const metadata: Metadata = { title: 'Notes', description: "Things I've learned the slow way." }

export default async function Blog() {
  const posts = await getPosts()
  // No posts yet: the route does not exist (and the nav link is hidden). Drop a file in content/blog/ and it appears.
  if (!posts.length) notFound()
  return (
    <section className="wrap pt-40">
      <ResolveText as="h1" className="display t-h1">
        Notes
      </ResolveText>
      <p className="lead mute mt-6">Things I&apos;ve learned the slow way.</p>
      <ul className="mt-16">
        {posts.map(({ slug, meta }) => (
          <li key={slug} className="hair">
            <TLink href={`/blog/${slug}`} className="row-link cols items-baseline gap-y-2 py-6">
              <span className="row-title display t-h3 col-span-12 md:col-span-5">{meta.title}</span>
              <span className="col-span-12 md:col-span-5">{meta.summary}</span>
              <time className="label col-span-12 md:col-span-2 md:text-right" dateTime={meta.date}>
                {meta.date}
              </time>
            </TLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
