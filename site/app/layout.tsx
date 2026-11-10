import type { Metadata, Viewport } from 'next'
import { Big_Shoulders, Hanken_Grotesk } from 'next/font/google'
import { Dial } from '@/components/Dial'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SmoothScroll } from '@/components/SmoothScroll'
import { WipeProvider } from '@/components/Wipe'
import { LINKS, SITE_URL } from '@/lib/site'
import './globals.css'

// Two families, downloaded at build time and served from this origin.
const display = Big_Shoulders({ subsets: ['latin'], weight: ['900'], variable: '--font-display-face', display: 'swap', adjustFontFallback: false }) // fallback is Impact, set in globals.css
const text = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-text-face', display: 'swap' })

const description = 'Portfolio of Rishi Kaneria, a final-year Computer Science student at IIT Jodhpur building across web, mobile, security and blockchain.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Rishi Kaneria — Software engineer and builder', template: '%s — Rishi Kaneria' },
  description,
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    siteName: 'Rishi Kaneria',
    title: 'Rishi Kaneria — Software engineer and builder',
    description,
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Rishi Kaneria. From rough to real.' }],
  },
  twitter: { card: 'summary_large_image' },
}
export const viewport: Viewport = { themeColor: '#06070a', colorScheme: 'dark' }

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rishi Kaneria',
  url: SITE_URL,
  jobTitle: 'Software engineer',
  alumniOf: 'IIT Jodhpur',
  sameAs: [LINKS.GitHub, LINKS.LinkedIn, LINKS.Instagram],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`}>
      <body>
        {/* JavaScript off: show the name at once and hide controls that cannot work */}
        <noscript>
          <style>{`.resolve-intro[data-intro]::before,.pre,.js-only{display:none!important}.resolve-intro[data-intro] .w{animation:none!important}`}</style>
        </noscript>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <WipeProvider>
          <Header />
          <main id="main" tabIndex={-1}>
            <p className="rm-note sr-only">Animations are reduced to respect your system setting.</p>
            {children}
          </main>
          <Footer />
        </WipeProvider>
        <Dial />
        <SmoothScroll />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      </body>
    </html>
  )
}
