import type { Paper, Language } from '../types'

const categoryColors: Record<string, string> = {
  'vulnerability-detection': '#ff4444',
  'fuzzing': '#44aaff',
  'privacy': '#44ff88',
}

const categoryLabels: Record<string, string> = {
  'vulnerability-detection': 'Vuln Detection',
  'fuzzing': 'Fuzzing',
  'privacy': 'Privacy',
}

const recStars = (level: number) => '⭐'.repeat(level)

interface Props {
  paper: Paper
  lang: Language
  onClick: () => void
}

export default function PaperCard({ paper, lang, onClick }: Props) {
  const mainCategory = paper.categories[0] || 'vulnerability-detection'
  const color = categoryColors[mainCategory] || '#888'
  const rec = paper.recommendation ?? 1
  const summary = lang === 'zh' ? (paper.summary_zh || paper.summary) : paper.summary
  const exp = paper.experiment

  return (
    <div
      onClick={onClick}
      className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-5 transition-all duration-200 hover:border-[var(--color-border-hover)] hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20 cursor-pointer group"
      style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
    >
      {/* Top row */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs font-mono font-bold text-[var(--color-accent)]">{paper.year}</span>
        <span className="text-xs" title={`Recommendation Level ${rec}`}>{recStars(rec)}</span>
        {paper.venue && (
          <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)]">
            {paper.venue.length > 50 ? paper.venue.slice(0, 50) + '...' : paper.venue}
          </span>
        )}
        {paper.categories.map(cat => (
          <span key={cat} className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${categoryColors[cat]}15`, color: categoryColors[cat] }}>
            {categoryLabels[cat] || cat}
          </span>
        ))}
        {exp?.open_source && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
            Open Source
          </span>
        )}
        {/* Click hint */}
        <span className="ml-auto text-xs text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
          Click to expand →
        </span>
      </div>

      {/* System name + Title */}
      <div className="mb-1.5">
        {paper.system_name && (
          <span className="text-sm font-mono font-bold text-[var(--color-accent)] mr-2">
            [{paper.system_name}]
          </span>
        )}
        <h3 className="text-base font-semibold leading-snug text-[var(--color-text-primary)] inline group-hover:text-white transition-colors">
          {paper.title}
        </h3>
      </div>

      {/* Authors */}
      {paper.authors && (
        <p className="text-xs text-[var(--color-text-secondary)] mb-2">
          {paper.authors}
        </p>
      )}

      {/* Summary */}
      {summary && (
        <p className="text-sm text-[var(--color-text-primary)] mb-3 bg-white/[0.03] px-3 py-2 rounded-lg border-l-2 border-[var(--color-accent)]/30">
          {summary}
        </p>
      )}

      {/* Experiment tags (compact) */}
      {exp && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {exp.llm?.map(l => (
            <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-purple)]/10 text-[var(--color-purple)]">
              🤖 {l}
            </span>
          ))}
          {exp.language?.map(l => (
            <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-blue)]/10 text-[var(--color-blue)]">
              {l}
            </span>
          ))}
          {exp.fine_tuning && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-orange)]/10 text-[var(--color-orange)]">
              Fine-tuned
            </span>
          )}
          {exp.dataset?.slice(0, 3).map(d => (
            <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-green)]/10 text-[var(--color-green)]">
              {d}
            </span>
          ))}
        </div>
      )}

      {/* Key results one-liner */}
      {exp?.key_results && (
        <div className="text-xs text-[var(--color-text-secondary)]">
          📈 {exp.key_results}
        </div>
      )}
    </div>
  )
}
