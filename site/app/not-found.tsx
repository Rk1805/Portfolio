import type { Metadata } from 'next'
import { ResolveText } from '@/components/ResolveText'
import { TLink } from '@/components/Wipe'

export const metadata: Metadata = { title: '404' }

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[80svh] flex-col items-center justify-center pt-32 text-center">
      {/* the one heading that never resolves */}
      <ResolveText as="h1" max={1} className="display t-mega">
        404
      </ResolveText>
      <p className="lead mt-8">This page didn&apos;t resolve.</p>
      <p className="mt-8">
        <TLink href="/" className="btn btn-primary">
          Back to home
        </TLink>
      </p>
    </section>
  )
}
