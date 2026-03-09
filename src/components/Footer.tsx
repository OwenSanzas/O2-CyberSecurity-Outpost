import { useState } from 'react'

interface Props {
  paperCount?: number
  componentCount?: number
}

export default function Footer({ paperCount, componentCount }: Props) {
  const [showCite, setShowCite] = useState(false)
  const [copied, setCopied] = useState(false)

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
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
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

        <div className="border-t border-[var(--color-border)] pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-[var(--color-text-muted)]">
            Built with React + Tailwind CSS. Powered by open research.
            {paperCount && <span className="ml-2 text-[var(--color-text-secondary)]">{paperCount} papers indexed</span>}
            {componentCount && <span className="ml-2">| {componentCount} components</span>}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] font-mono">
            <span className="text-[var(--color-accent)]">●</span> Last updated: March 2026
          </p>
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
