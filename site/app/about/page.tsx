import type { Metadata } from 'next'
import { Portrait } from '@/components/Portrait'
import { ResolveText } from '@/components/ResolveText'
import { Experience, OffScreen } from '@/components/Sections'
import { LINKS } from '@/lib/site'

export const metadata: Metadata = { title: 'About', description: 'Rishi Kaneria: software engineer and builder from Bengaluru, final-year Computer Science and Engineering at IIT Jodhpur.' }

export default function About() {
  return (
    <>
      <section className="wrap pt-40">
        <ResolveText as="h1" className="display t-h1">
          About
        </ResolveText>
        <div className="cols mt-12 gap-y-12">
          <div className="col-span-12 grid gap-6 text-[1.1875rem] leading-[1.65] lg:col-span-7">
            <p className="lead">
              I&apos;m Rishi — a software engineer and builder from Bengaluru, in my final year of Computer Science and Engineering at IIT Jodhpur.
            </p>
            <p className="measure">
              I enjoy taking a project the whole way: the vague idea, the first ugly version, and the thing someone can actually use. That&apos;s led me through
              web apps, mobile apps, a native Mac app, a security tool during my internship at Accenture, and some blockchain work. I don&apos;t want to be
              restricted to one domain, and so far nobody has made me choose.
            </p>
            <p className="measure">
              Away from the keyboard it&apos;s FIFA and Clash of Clans, Kishore Kumar songs sung with more confidence than skill, and whatever sport is being
              played nearby.
            </p>
            <p className="label">From Bengaluru, studying in Jodhpur.</p>
          </div>
          <div className="col-span-8 col-start-3 sm:col-span-6 sm:col-start-4 lg:col-span-4 lg:col-start-9">
            <Portrait priority />
          </div>
        </div>
      </section>

      <Experience />
      <OffScreen />

      <section className="section wrap" aria-labelledby="links">
        <ResolveText as="h2" id="links" className="display t-h2">
          Links
        </ResolveText>
        <ul className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-xl font-semibold">
          {Object.entries(LINKS).map(([name, href]) => (
            <li key={name}>
              <a href={href} className="u py-2" target="_blank" rel="noopener noreferrer">
                {name}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
