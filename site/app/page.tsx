import { Portrait } from '@/components/Portrait'
import { ResolveText } from '@/components/ResolveText'
import { Experience, OffScreen } from '@/components/Sections'
import { TLink } from '@/components/Wipe'
import { WorkCard } from '@/components/WorkCard'
import { getWork } from '@/lib/content'

const NOW = [
  ['Agentic AI', 'Learning to use the power of AI properly: agents that plan, use tools and finish multi-step work.'],
  ['AI for cybersecurity', 'Working out where AI genuinely helps in security, and where a human still has to look.'],
  ['This site', 'Built with a team of AI agents. The blog comes next.'],
]

export default async function Home() {
  const work = await getWork()
  return (
    <>
      <section className="hero wrap" aria-label="Introduction">
        <div className="hero-portrait">
          <Portrait priority className="h-full" />
        </div>
        <p className="label mb-4">RISHI KANERIA — PORTFOLIO</p>
        <ResolveText as="h1" intro className="display t-mega">
          Rishi Kaneria
        </ResolveText>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <p className="lead max-w-[30ch]">Software engineer and builder. I take ideas from rough to real.</p>
          <p className="label">Scroll to sharpen</p>
        </div>
      </section>

      <section className="section wrap" aria-label="Intro">
        <p className="lead max-w-[46ch] text-[clamp(1.375rem,2.6vw,2.25rem)]">
          I&apos;m a final-year Computer Science student at IIT Jodhpur. I like the whole trip from &quot;what if&quot; to &quot;it works&quot; — so I&apos;ve
          ended up building across web, mobile, security and blockchain rather than choosing one. This is where I keep the things I&apos;ve made and the things
          I&apos;m figuring out.
        </p>
      </section>

      <section className="section wrap" aria-labelledby="work">
        <div className="ramp" />
        <p className="label mb-4">01 — WORK</p>
        <ResolveText as="h2" id="work" className="display t-h2 max-w-[16ch]">
          Things I&apos;ve taken from idea to working.
        </ResolveText>
        <div className="mt-16 grid gap-[clamp(72px,10vw,144px)]">
          {work.map((w, i) => (
            <WorkCard key={w.slug} slug={w.slug} meta={w.meta} index={i} />
          ))}
        </div>
        <p className="mt-16">
          <TLink href="/work" className="u py-2 text-xl font-semibold">
            All work →
          </TLink>
        </p>
      </section>

      <section className="section wrap" aria-labelledby="now">
        <div className="ramp" />
        <p className="label mb-4">02 — NOW</p>
        <ResolveText as="h2" id="now" className="display t-h2">
          Still low-res. Getting sharper.
        </ResolveText>
        <p className="lead mute mt-6 max-w-[40ch]">What I&apos;m learning, poking at, and working towards right now.</p>
        <dl className="mt-12">
          {NOW.map(([name, text]) => (
            <div key={name} className="hair cols items-baseline gap-y-3 py-8">
              <dt className="display t-h2 col-span-12 lg:col-span-6">{name}</dt>
              <dd className="mute col-span-12 text-[1.1875rem] lg:col-span-5 lg:col-start-8">{text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Experience label="03 — EXPERIENCE" />
      <OffScreen label="04 — OFF-SCREEN" />

      <section className="section wrap" aria-labelledby="playground">
        <div className="ramp" />
        <p className="label mb-4">05 — PLAYGROUND</p>
        <ResolveText as="h2" id="playground" className="display t-h2">
          The 25% that isn&apos;t serious.
        </ResolveText>
        <p className="lead mute mt-6 max-w-[40ch]">Experiments, a playable Snake, and a dial that turns this whole site 8-bit.</p>
        <p className="mt-8">
          <TLink href="/playground" className="u py-2 text-xl font-semibold">
            Enter the playground →
          </TLink>
        </p>
      </section>
    </>
  )
}
