import type { Paper } from '../types'

interface Props {
  papers: Paper[]
  totalCount: number
  query: string
  hasFilters: boolean
}

export default function FilterSummary({ papers, totalCount, query, hasFilters }: Props) {
  if (!hasFilters && !query) return null
  if (papers.length === 0) return null
  if (papers.length === totalCount) return null

  const years = papers.map(p => p.year)
  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)
  const yearRange = minYear === maxYear ? `${minYear}` : `${minYear}–${maxYear}`

  const withCode = papers.filter(p => p.codeUrl).length
  const topTier = papers.filter(p => (p.recommendation ?? 1) >= 3).length

  const llmSet = new Set<string>()
  for (const p of papers) {
    for (const l of p.experiment?.llm ?? []) llmSet.add(l)
  }

  return (
    <div className="mb-3 px-3 py-2 bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text-muted)] flex flex-wrap items-center gap-x-4 gap-y-1">
      <span>
        <span className="text-[var(--color-accent)] font-mono font-bold">{papers.length}</span>/{totalCount} papers
      </span>
      <span>Years: <span className="text-[var(--color-text-secondary)]">{yearRange}</span></span>
      {topTier > 0 && <span>Top-tier: <span className="text-[#ffd700]">{topTier}</span></span>}
      {withCode > 0 && <span>With code: <span className="text-[var(--color-accent)]">{withCode}</span></span>}
      {llmSet.size > 0 && <span>LLMs: <span className="text-[var(--color-purple)]">{llmSet.size}</span></span>}
    </div>
  )
}
