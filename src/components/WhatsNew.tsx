import { useState, useMemo } from 'react'
import type { Paper } from '../types'

interface Props {
  papers: Paper[]
  onPaperClick: (p: Paper) => void
}

export default function WhatsNew({ papers, onPaperClick }: Props) {
  const [expanded, setExpanded] = useState(false)

  const recentPapers = useMemo(() => {
    return [...papers]
      .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title))
      .slice(0, 5)
  }, [papers])

  return (
    <div className="mb-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider bg-transparent border-none cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
      >
        <span style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▶</span>
        What's New
        <span className="text-[var(--color-text-muted)] normal-case tracking-normal font-normal">— latest additions</span>
      </button>

      {expanded && (
        <div
          className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] overflow-hidden"
          style={{ animation: 'whatsNewFadeIn 0.3s ease-out' }}
        >
          {recentPapers.map((paper) => (
            <button
              key={paper.id}
              onClick={() => onPaperClick(paper)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left bg-transparent border-none cursor-pointer transition-colors hover:bg-[rgba(0,255,136,0.05)] border-b border-b-[var(--color-border)] last:border-b-0"
            >
              <span className="text-xs font-mono text-[var(--color-accent)] shrink-0">{paper.year}</span>
              {paper.system_name && (
                <span className="text-xs font-semibold text-[var(--color-text-primary)] shrink-0 bg-[rgba(0,255,136,0.1)] px-1.5 py-0.5 rounded">
                  {paper.system_name}
                </span>
              )}
              <span className="text-sm text-[var(--color-text-primary)] truncate">{paper.title}</span>
              <span className="text-xs text-[var(--color-text-muted)] shrink-0 ml-auto">{paper.venue}</span>
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes whatsNewFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
