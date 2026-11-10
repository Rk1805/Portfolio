'use client'

import { useRef, useState } from 'react'
import { EMAIL } from '@/lib/site'

export function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const t = useRef(0)
  return (
    <button
      type="button"
      className="btn js-only"
      data-testid="copy-email"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(EMAIL)
          setCopied(true)
          clearTimeout(t.current)
          t.current = window.setTimeout(() => setCopied(false), 2000)
        } catch {
          // clipboard blocked: the mailto link next to this button still works
        }
      }}
    >
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
      <span className="sr-only"> email address</span>
    </button>
  )
}
