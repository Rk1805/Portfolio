import type { Metadata } from 'next'
import { Dial } from '@/components/Dial'
import { Portrait } from '@/components/Portrait'
import { ResolveText } from '@/components/ResolveText'
import { Snake } from '@/components/Snake'

export const metadata: Metadata = { title: 'Playground', description: 'Small things made for no reason: a playable Snake, a resolution dial and a pixel portrait.' }

export default function Playground() {
  return (
    <div className="wrap pt-40">
      <ResolveText as="h1" className="display t-h1">
        Playground
      </ResolveText>
      <p className="lead mute mt-6">Small things made for no reason. Some of them work.</p>

      <section className="section" aria-labelledby="snake">
        <div className="cols gap-y-8">
          <div className="col-span-12 lg:col-span-4">
            <ResolveText as="h2" id="snake" className="display t-h2">
              Snake
            </ResolveText>
            <p className="mt-6 max-w-[44ch]">
              <strong>Snake, in C.</strong> My 2024 take on the phone classic, written for the terminal. Three maps — Classic Box, Compartment and Apartment —
              adjustable speed, and a top-ten high-score table per map that survives quitting. I rebuilt it here so you can play it. <kbd>W</kbd> <kbd>A</kbd>{' '}
              <kbd>S</kbd> <kbd>D</kbd> to move.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <Snake />
            <noscript>
              <p className="mute border-2 border-line p-6">Snake and the dial need JavaScript, which is switched off in this browser.</p>
            </noscript>
          </div>
        </div>
      </section>

      <section className="section cols gap-y-16">
        <div className="col-span-12 lg:col-span-6" aria-labelledby="dial">
          <ResolveText as="h2" id="dial" className="display t-h2">
            Resolution dial
          </ResolveText>
          <p className="mt-6 mb-8 max-w-[44ch]">Drag it. The site goes from 8-bit to HD and back.</p>
          <Dial wide />
        </div>
        <div className="col-span-12 lg:col-span-5 lg:col-start-8" aria-labelledby="pixel-me">
          <ResolveText as="h2" id="pixel-me" className="display t-h2">
            Pixel me
          </ResolveText>
          <p className="mt-6 mb-8 max-w-[44ch]">Move across the portrait to sharpen it. It never quite gets there.</p>
          <Portrait className="w-full max-w-[420px]" />
        </div>
      </section>

      <p className="section mute border-2 border-dashed border-line p-8 !pt-8 mt-[var(--gap-section)]">More experiments land here as I make them.</p>
    </div>
  )
}
