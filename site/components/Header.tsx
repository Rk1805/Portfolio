import { slugs } from '@/lib/content'
import { TLink } from './Wipe'

export function Header() {
  // Blog appears by itself once content/blog/ has a post.
  const nav = [
    ['Work', '/work'],
    ['Playground', '/playground'],
    ['About', '/about'],
    ...(slugs('blog').length ? [['Blog', '/blog']] : []),
  ] as [string, string][]
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        <TLink href="/" className="py-3 font-bold tracking-tight">
          RK<span className="sr-only">, Rishi Kaneria, home</span>
        </TLink>
        <nav aria-label="Main">
          <ul className="flex items-center gap-4 text-[0.9375rem] font-medium sm:gap-8">
            {nav.map(([name, href]) => (
              <li key={href}>
                <TLink href={href} nav className="u py-3">
                  {name}
                </TLink>
              </li>
            ))}
            <li>
              <a href="#contact" className="u py-3">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
