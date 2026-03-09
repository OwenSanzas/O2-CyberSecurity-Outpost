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

export default function Header({ paperCount, categoryCount, venueCount, yearRange, lang, onLangChange, theme, onThemeToggle }: Props) {
  return (
    <header className="relative px-4 md:px-6 pt-6 pb-8 md:pt-8 md:pb-10">
      <div className="max-w-5xl mx-auto">
        {/* Top bar: controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--color-accent)] tracking-[3px] uppercase font-semibold opacity-80">
              SYSTEM ONLINE
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onThemeToggle && (
              <button
                onClick={onThemeToggle}
                className="px-2.5 py-1 text-xs font-mono border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50 transition-colors cursor-pointer"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            )}
            <button
              onClick={() => onLangChange(lang === 'en' ? 'zh' : 'en')}
              className="px-2.5 py-1 text-xs font-mono border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50 transition-colors cursor-pointer"
            >
              {lang === 'en' ? '中文' : 'EN'}
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-2">
            <span className="text-[var(--color-accent)]">O2</span>
            <span className="text-[var(--color-text-primary)]"> CyberSecurity </span>
            <span className="animated-gradient-title">Outpost</span>
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-lg mx-auto">
            Tracking the frontier of LLM-powered security research
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-6 md:gap-10">
          {[
            { value: paperCount, label: 'Papers' },
            { value: categoryCount, label: 'Categories' },
            { value: venueCount, label: 'Venues' },
            { value: yearRange, label: 'Timeline' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-lg md:text-xl font-bold text-[var(--color-accent)] font-mono">{s.value}</div>
              <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
