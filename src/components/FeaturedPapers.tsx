import type { Paper, Language } from '../types'

interface Props {
  papers: Paper[]
  lang: Language
  onPaperClick: (p: Paper) => void
}

const categoryColors: Record<string, string> = {
  'vulnerability-detection': '#ff4444',
  'fuzzing': '#44aaff',
  'privacy': '#44ff88',
}

export default function FeaturedPapers({ papers, lang, onPaperClick }: Props) {
  // Get top-tier papers (recommendation level 3)
  const featured = papers
    .filter(p => (p.recommendation ?? 1) >= 3)
    .sort((a, b) => b.year - a.year)
    .slice(0, 4)

  if (featured.length === 0) return null

  return (
    <div className="max-w-5xl mx-auto mb-10">
      <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider flex items-center gap-2">
        <span className="text-yellow-400">⭐</span> Featured Top-Tier Papers
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {featured.map(paper => {
          const summary = lang === 'zh' ? (paper.summary_zh || paper.summary) : paper.summary
          const mainCat = paper.categories[0] || 'vulnerability-detection'
          return (
            <div
              key={paper.id}
              onClick={() => onPaperClick(paper)}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 cursor-pointer hover:border-[var(--color-border-hover)] hover:translate-y-[-1px] transition-all group"
              style={{ borderTopColor: categoryColors[mainCat], borderTopWidth: '2px' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-[var(--color-accent)]">{paper.year}</span>
                <span className="text-xs">⭐⭐⭐</span>
                <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                  {paper.venue && paper.venue.length > 30 ? paper.venue.slice(0, 30) + '...' : paper.venue}
                </span>
              </div>
              <div className="mb-1">
                {paper.system_name && (
                  <span className="text-sm font-mono font-bold text-[var(--color-accent)] mr-1">[{paper.system_name}]</span>
                )}
                <span className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-white transition-colors">
                  {paper.title.length > 80 ? paper.title.slice(0, 80) + '...' : paper.title}
                </span>
              </div>
              {summary && (
                <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                  {summary}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
