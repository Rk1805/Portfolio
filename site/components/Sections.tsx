import { ICONS } from '@/lib/pix'
import { Pix } from './Pix'
import { ResolveText } from './ResolveText'

/* Copy: plan/story.md §4. Shared by home and about. */

const CAMPUS = [
  ['Core Member, DevlUp Labs', 'Aug 2025 – May 2026'],
  ['Core Member, Programming Club', 'Aug 2025 – Apr 2026'],
  ['Senior Executive Member, E-Cell', 'Apr 2024 – Apr 2025'],
  ["Assistant Head, Ideathon — Prometeo E-Conclave '25", 'Dec 2024 – Jan 2025'],
]
// figure + what it is; together each reads exactly as the line in story.md
const BRAGS = [
  ['2375', 'AIR', 'JEE Advanced 2023', 'AIR 2375, JEE Advanced 2023'],
  ['8', 'AIR', 'National Mathematics Talent Contest (Inter), 2022', 'AIR 8, National Mathematics Talent Contest (Inter), 2022'],
  ['1409', 'Max rating', 'Specialist on Codeforces', 'Specialist on Codeforces, max rating 1409'],
]
const TILES = [
  ['Gaming', 'FIFA 26, Clash of Clans, and big single-player games like the Batman and Tomb Raider series.'],
  ['Music', 'I love listening and I love singing. Old songs especially — Kishore Kumar above all.'],
  ['Sport', "I'll play almost anything. Mostly cricket, football and tennis."],
  ['Mountains', 'Give me a cold morning and a view.'],
]

export function Experience({ label }: { label?: string }) {
  return (
    <section className="section wrap" aria-labelledby="experience">
      <div className="ramp" />
      {label && <p className="label mb-4">{label}</p>}
      <ResolveText as="h2" id="experience" className="display t-h2">
        Experience
      </ResolveText>
      <div className="mt-12">
        <article className="hair cols items-baseline gap-y-3 py-8">
          <h3 className="display t-h2 col-span-12 lg:col-span-4">Accenture</h3>
          <p className="mute col-span-12 lg:col-span-3">Advanced Application Engineering Analyst Intern · Bengaluru · May – July 2026</p>
          <p className="col-span-12 lg:col-span-4 lg:col-start-9">
            Trained in generative and agentic AI, SIEM on Splunk, and endpoint detection and response on CrowdStrike Falcon, then built the Phishing Email
            Analyzer as the closing project.
          </p>
        </article>
        <article className="hair cols items-baseline gap-y-3 py-8">
          <h3 className="display t-h2 col-span-12 lg:col-span-4">IIT Jodhpur</h3>
          <p className="mute col-span-12 lg:col-span-8">B.Tech in Computer Science and Engineering · 2023 – 2027 · final year</p>
        </article>
      </div>
      <div className="cols mt-16 gap-y-16">
        <div className="col-span-12 lg:col-span-4">
          <h3 className="font-bold">On campus</h3>
          <ul className="mt-3">
            {CAMPUS.map(([role, when]) => (
              <li key={role} className="hair py-3">
                {role}
                <span className="label block">{when}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <h3 className="font-bold">Numbers I&apos;m allowed to brag about</h3>
          <ul className="mt-3">
            {BRAGS.map(([figure, what, where, spoken]) => (
              <li key={figure} className="hair py-4" data-testid="brag">
                {/* the sentence as written in the copy for screen readers; the big figure is the visual version of it */}
                <span className="sr-only">{spoken}</span>
                <span aria-hidden="true" className="grid grid-cols-[clamp(8.5rem,27vw,25rem)_minmax(0,1fr)] items-baseline gap-x-6">
                  <ResolveText as="span" className="display t-h1 tabular-nums">
                    {figure!}
                  </ResolveText>
                  <span>
                    <span className="label block">{what}</span>
                    {where}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function OffScreen({ label }: { label?: string }) {
  return (
    <section className="section wrap" aria-labelledby="off-screen">
      <div className="ramp" />
      {label && <p className="label mb-4">{label}</p>}
      <ResolveText as="h2" id="off-screen" className="display t-h2 max-w-[14ch]">
        What I do when nothing is compiling.
      </ResolveText>
      <dl className="cols mt-12">
        {TILES.map(([name, text]) => (
          <div key={name} className="hair col-span-12 py-6 sm:col-span-6 lg:col-span-3">
            <dt className="display t-h3">
              <Pix rows={ICONS[name!] ?? []} size={6} className="mb-6 block" />
              {name}
            </dt>
            <dd className="mute mt-3 max-w-[34ch]">{text}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
