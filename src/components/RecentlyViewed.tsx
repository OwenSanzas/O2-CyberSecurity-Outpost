import type { Paper } from '../types'

interface Props {
  papers: Paper[]
  recentIds: string[]
  onPaperClick: (p: Paper) => void
}

export default function RecentlyViewed({ papers, recentIds, onPaperClick }: Props) {
  if (recentIds.length === 0) return null

  const recentPapers = recentIds
    .map(id => papers.find(p => p.id === id))
    .filter((p): p is Paper => !!p)
    .slice(0, 5)

  if (recentPapers.length === 0) return null

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-[var(--color-text-muted)] shrink-0">Recent:</span>
        {recentPapers.map(p => (
          <button
            key={p.id}
            onClick={() => onPaperClick(p)}
            className="shrink-0 text-xs px-2.5 py-1 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[var(--color-bg-card)] hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text-primary)] transition-all cursor-pointer truncate max-w-[180px]"
          >
            {p.system_name ? `[${p.system_name}] ` : ''}
            {p.title.slice(0, 30)}{p.title.length > 30 ? '...' : ''}
          </button>
        ))}
      </div>
    </div>
  )
}
