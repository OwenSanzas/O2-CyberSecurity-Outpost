import { useState } from 'react'

export default function ShareButton() {
  const [copied, setCopied] = useState(false)

  const share = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={share}
      className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
      title="Copy current URL with filters"
    >
      {copied ? 'Link copied!' : 'Share'}
    </button>
  )
}
