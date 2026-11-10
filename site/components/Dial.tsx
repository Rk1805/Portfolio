'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getLevel, HD, setLevel, subscribe } from '@/lib/resolution'

const NAMES = ['8-bit', 'Very low', 'Low', 'Medium', 'High', 'HD']

/** The resolve device, handed to the visitor. A native range input: keyboard, touch and AT for free. */
export function Dial({ wide }: { wide?: boolean }) {
  const [v, setV] = useState(HD)
  const pathname = usePathname()
  useEffect(() => {
    setV(getLevel())
    return subscribe(() => setV(getLevel()))
  }, [])

  const input = (
    <input
      className={`range ${wide ? 'range-wide' : ''}`}
      type="range"
      min={0}
      max={HD}
      step={1}
      value={v}
      onChange={(e) => setLevel(Number(e.target.value))}
      aria-label="Site resolution, from 8-bit to HD"
      aria-valuetext={NAMES[v]}
      data-testid={wide ? 'dial-inline' : 'dial'}
    />
  )
  if (wide)
    return (
      <div className="js-only flex items-center gap-3 text-sm font-bold tracking-wide">
        <span aria-hidden="true">8-BIT</span>
        {input}
        <span aria-hidden="true">HD</span>
      </div>
    )
  // the playground has its own full-size dial; the corner one would sit on top of the Snake controls
  if (pathname === '/playground') return null
  return (
    <aside className="dial js-only" aria-label="Resolution dial">
      <span aria-hidden="true">8-BIT</span>
      {input}
      <span aria-hidden="true">HD</span>
      <span className="dial-tip" role="tooltip">
        Drag to change the resolution of this site.
      </span>
    </aside>
  )
}
