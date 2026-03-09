import { useState } from 'react'

interface Props {
  paperCount?: number
  componentCount?: number
  readProgress?: { read: number; reading: number }
}

export default function Footer({ paperCount, componentCount, readProgress }: Props) {
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

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-[var(--color-border)] mt-16">
      <div className="max-w-5xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-2">
              <span className="text-[var(--color-accent)]">O2</span> CyberSecurity Outpost
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              A curated, searchable collection of research papers on LLM-based software security.
            </p>
            <button
              onClick={() => setShowCite(!showCite)}
              className="mt-3 text-xs px-3 py-1.5 rounded-lg border border-[var(--color-accent)]/30 text-[var(--color-accent)] bg-transparent cursor-pointer hover:bg-[var(--color-accent)]/5 transition-all"
            >
              Cite This Collection
            </button>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://github.com/OwenSanzas/O2-CyberSecurity-Outpost" target="_blank" rel="noopener"
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="https://github.com/OwenSanzas/LLM-For-Software-Security" target="_blank" rel="noopener"
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
                  Paper Collection Source
                </a>
              </li>
              <li>
                <a href="mailto:zesheng@tamu.edu"
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">About</h4>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              Based on the survey <em>"Large Language Models in Software Security"</em>
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mt-2">
              Texas A&M University
            </p>
          </div>
        </div>

        {/* Citation box */}
        {showCite && (
          <div className="mb-6 p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">BibTeX Citation</span>
              <button
                onClick={copyCitation}
                className="text-xs text-[var(--color-accent)] bg-transparent border-none cursor-pointer hover:underline"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-xs text-[var(--color-text-secondary)] font-mono whitespace-pre-wrap leading-relaxed">{citation}</pre>
          </div>
        )}

        {/* Reading progress stats */}
        {readProgress && (readProgress.read > 0 || readProgress.reading > 0) && (
          <div className="mb-6 flex items-center gap-4 p-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Reading Progress</span>
            <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                {readProgress.read} read
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                {readProgress.reading} reading
              </span>
              {paperCount && paperCount > 0 && (
                <span className="text-[var(--color-text-secondary)]">
                  ({Math.round(((readProgress.read + readProgress.reading) / paperCount) * 100)}% engaged)
                </span>
              )}
            </div>
          </div>
        )}

        <div className="border-t border-[var(--color-border)] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[var(--color-text-muted)]">
            &copy; {currentYear} Built with React + Tailwind CSS. Powered by open research.
            {paperCount && <span className="ml-2 text-[var(--color-text-secondary)]">{paperCount} papers indexed</span>}
            {componentCount && <span className="ml-2">| {componentCount} components</span>}
          </p>

          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--color-text-muted)] font-mono inline-flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[10px] text-[var(--color-text-secondary)] font-mono leading-none">?</kbd>
              <span>for shortcuts</span>
            </span>

            <a
              href="#top"
              onClick={scrollToTop}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1 no-underline"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
              Back to top
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </footer>
  )
}
