import { useMemo } from 'react'
import type { Paper } from '../types'

interface Props {
  papers: Paper[]
  onPaperClick: (p: Paper) => void
}

export default function PaperOfTheDay({ papers, onPaperClick }: Props) {
  const paper = useMemo(() => {
    if (papers.length === 0) return null
    // Deterministic "random" based on date — same paper all day
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    )
    const seed = today.getFullYear() * 366 + dayOfYear
    const idx = seed % papers.length
    return papers[idx]
  }, [papers])

  if (!paper) return null

  const mainCat = paper.categories[0] || 'vulnerability-detection'
  const catColors: Record<string, string> = {
    'vulnerability-detection': '#ff4444',
    'fuzzing': '#44aaff',
    'privacy': '#44ff88',
  }

  return (
    <div className="mb-6">
      <div
        className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 cursor-pointer hover:border-[var(--color-border-hover)] transition-all group"
        onClick={() => onPaperClick(paper)}
        style={{ borderLeftColor: catColors[mainCat], borderLeftWidth: '3px' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wider">Paper of the Day</span>
          <span className="text-xs text-[var(--color-text-muted)]">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-[var(--color-accent)]">{paper.year}</span>
              {paper.system_name && (
                <span className="text-xs font-mono font-bold text-[var(--color-accent)]">[{paper.system_name}]</span>
              )}
              <span className="text-xs">{'⭐'.repeat(paper.recommendation ?? 1)}</span>
            </div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-white transition-colors">
              {paper.title}
            </h3>
            {paper.summary && (
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">{paper.summary}</p>
            )}
          </div>
          <span className="text-xs text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
            Read more
          </span>
        </div>
      </div>
    </div>
  )
}
