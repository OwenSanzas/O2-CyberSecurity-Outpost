export default function Footer() {
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
                  Contact Us
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

        <div className="border-t border-[var(--color-border)] pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-[var(--color-text-muted)]">
            Built with React + Tailwind CSS. Powered by open research.
          </p>
          <p className="text-xs text-[var(--color-text-muted)] font-mono">
            <span className="text-[var(--color-accent)]">●</span> Last updated: 2025
          </p>
        </div>
      </div>
    </footer>
  )
}
