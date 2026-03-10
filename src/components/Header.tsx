import type { Language } from '../types'

interface Props {
  paperCount: number
  categoryCount: number
  venueCount: number
  yearRange: string
  lang: Language
  onLangChange: (l: Language) => void
  theme?: 'dark' | 'light'
  onThemeToggle?: () => void
}

export default function Header({ paperCount, categoryCount: _categoryCount, venueCount: _venueCount, yearRange, lang, onLangChange, theme, onThemeToggle }: Props) {
  return (
    <header className="relative px-4 md:px-6 pt-4 pb-6 md:pt-6 md:pb-8">
      <div className="max-w-5xl mx-auto">
        {/* Title row with controls */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight">
              <span className="text-[var(--color-accent)]">O2</span>
              <span className="text-[var(--color-text-primary)]"> CyberSecurity </span>
              <span className="animated-gradient-title">Outpost</span>
            </h1>
            <p className="text-xs text-[var(--color-text-muted)] mt-1 mb-2">
              LLM-powered security research &middot; {paperCount} papers &middot; {yearRange}
            </p>
            <a
              href="https://doi.org/10.1145/3769082"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)]/50 transition-all"
            >
              <span className="font-semibold">ACM Computing Surveys 2025</span>
              <span className="text-[var(--color-text-muted)]">·</span>
              <span className="text-[var(--color-text-secondary)]">{lang === 'zh' ? 'LLM在软件安全中的应用：漏洞检测技术与洞察综述' : 'LLMs in Software Security: A Survey of Vulnerability Detection Techniques and Insights'}</span>
              <span className="opacity-60">↗</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 mt-1">
            {onThemeToggle && (
              <button
                onClick={onThemeToggle}
                className="px-2 py-1 text-xs font-mono border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? '☀' : '🌙'}
              </button>
            )}
            <button
              onClick={() => onLangChange(lang === 'en' ? 'zh' : 'en')}
              className="px-2 py-1 text-xs font-mono border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer"
            >
              {lang === 'en' ? '中' : 'EN'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
