import { EMAIL, LINKS, SOCIAL } from '@/lib/site'
import { CopyEmail } from './CopyEmail'
import { ResolveText } from './ResolveText'

/** Contact block + footer, on every page. Nav "Contact" anchors here. */
export function Footer() {
  return (
    <footer id="contact" className="section wrap pb-28" tabIndex={-1}>
      <div className="hair pt-12">
        <ResolveText as="h2" className="display t-h1">
          Got a rough idea?
        </ResolveText>
        <p className="lead mute mt-6">I like those. Tell me about it.</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a href={`mailto:${EMAIL}`} className="inline-link break-all text-[clamp(1.125rem,2.4vw,1.75rem)] font-semibold" data-testid="email-link">
            {EMAIL}
          </a>
          <CopyEmail />
        </div>
        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 font-medium">
          {SOCIAL.map((name) => (
            <li key={name}>
              <a href={LINKS[name]} className="u py-2" target="_blank" rel="noopener noreferrer">
                {name}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="label mt-16">Built by Rishi Kaneria. Started as a rough idea, like everything here.</p>
      </div>
    </footer>
  )
}
