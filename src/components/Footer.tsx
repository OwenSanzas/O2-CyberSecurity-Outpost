import { useState } from 'react'

interface Props {
  paperCount?: number
  readProgress?: { read: number; reading: number }
}

export default function Footer({ paperCount, readProgress }: Props) {
  const [showCite, setShowCite] = useState(false)
  const [copied, setCopied] = useState(false)

  const currentYear = new Date().getFullYear()

  const citation = `@misc{o2outpost2025,
  title={O2 CyberSecurity Outpost: A Curated Collection of LLM-Based Security Research},
  author={Zesheng Ye},
  year={2025},
  howpublished={\\url{https://OwenSanzas.github.io/O2-CyberSecurity-Outpost/}},
  note={Texas A\\&M University}
}`

  const copyCitation = () => {
    navigator.clipboard.writeText(citation).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <footer className="border-t border-[var(--color-border)] mt-16">
      <div className="max-w-5xl mx-auto py-10 px-6">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
          <div>
            <h3 className="text-base font-bold mb-1">
              <span className="text-[var(--color-accent)]">O2</span> CyberSecurity Outpost
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-sm">
              A curated collection of LLM-based software security research papers.
            </p>
          </div>

          <div className="flex gap-6 text-sm">
            <a href="https://github.com/OwenSanzas/O2-CyberSecurity-Outpost" target="_blank" rel="noopener"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
              GitHub
            </a>
            <a href="https://github.com/OwenSanzas/LLM-For-Software-Security" target="_blank" rel="noopener"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
              Paper Source
            </a>
            <button
              onClick={() => setShowCite(!showCite)}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors bg-transparent border-none cursor-pointer text-sm"
            >
              Cite
            </button>
          </div>
        </div>

        {showCite && (
          <div className="mb-6 p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">BibTeX</span>
              <button onClick={copyCitation} className="text-xs text-[var(--color-accent)] bg-transparent border-none cursor-pointer hover:underline">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-xs text-[var(--color-text-secondary)] font-mono whitespace-pre-wrap leading-relaxed">{citation}</pre>
          </div>
        )}

        {readProgress && (readProgress.read > 0 || readProgress.reading > 0) && (
          <div className="mb-6 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              {readProgress.read} read
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              {readProgress.reading} reading
            </span>
          </div>
        )}

        <div className="border-t border-[var(--color-border)] pt-4 flex justify-between items-center">
          <p className="text-xs text-[var(--color-text-muted)]">
            &copy; {currentYear} Texas A&M University
            {paperCount && <span className="ml-2">&middot; {paperCount} papers</span>}
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors bg-transparent border-none cursor-pointer"
          >
            ↑ Top
          </button>
        </div>
      </div>
    </footer>
  )
}
