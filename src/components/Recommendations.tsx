import type { Paper } from '../types'

interface RecommendedPaper {
  paper: Paper
  score: number
  reasons: string[]
}

interface Props {
  recommendations: RecommendedPaper[]
  onPaperClick: (paper: Paper) => void
}

export default function Recommendations({ recommendations, onPaperClick }: Props) {
  if (recommendations.length === 0) return null

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          Recommended For You
        </span>
        <span className="text-xs text-[var(--color-text-muted)]">— based on your reading activity</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {recommendations.map(({ paper, score, reasons }) => (
          <div
            key={paper.id}
            onClick={() => onPaperClick(paper)}
            className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 cursor-pointer hover:border-[var(--color-border-hover)] hover:translate-y-[-2px] transition-all group"
            style={{ animation: 'fadeIn 0.3s ease-out' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-[var(--color-accent)]">{paper.year}</span>
              {paper.system_name && (
                <span className="text-xs font-mono font-bold text-[var(--color-accent)]">[{paper.system_name}]</span>
              )}
              <span
                className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                title={`Match score: ${Math.round(score)}`}
              >
                {score >= 20 ? 'Strong' : score >= 10 ? 'Good' : 'Possible'} match
              </span>
            </div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2 line-clamp-2 group-hover:text-white transition-colors">
              {paper.title}
            </h4>
            {reasons.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {reasons.map((reason, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-purple)]/10 text-[var(--color-purple)]"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
