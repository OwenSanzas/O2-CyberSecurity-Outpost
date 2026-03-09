import { useMemo } from 'react'
import type { Paper } from '../types'

interface Props {
  papers: Paper[]
}

export default function Insights({ papers }: Props) {
  const insights = useMemo(() => {
    // Venue breakdown
    const venues = new Map<string, number>()
    for (const p of papers) {
      if (p.venue) venues.set(p.venue, (venues.get(p.venue) || 0) + 1)
    }
    const topVenues = [...venues.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)

    // Author frequency
    const authorCounts = new Map<string, number>()
    for (const p of papers) {
      const authors = p.authors.split(/,\s*/).map(a => a.trim()).filter(Boolean)
      for (const a of authors) {
        authorCounts.set(a, (authorCounts.get(a) || 0) + 1)
      }
    }
    const topAuthors = [...authorCounts.entries()]
      .filter(([, c]) => c >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    // Papers with code
    const withCode = papers.filter(p => p.codeUrl).length
    const withSlides = papers.filter(p => p.slidesUrl).length
    const withTalk = papers.filter(p => p.talkUrl).length
    const topTier = papers.filter(p => (p.recommendation ?? 1) >= 3).length
    const withSystem = papers.filter(p => p.system_name).length

    // Newest paper
    const newest = [...papers].sort((a, b) => b.year - a.year)[0]

    return { topVenues, topAuthors, withCode, withSlides, withTalk, topTier, withSystem, newest }
  }, [papers])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Quick insights */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4">
        <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Collection Overview</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--color-text-muted)]">With source code</span>
            <span className="text-[var(--color-accent)] font-mono">{insights.withCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-muted)]">Named systems</span>
            <span className="text-[var(--color-accent)] font-mono">{insights.withSystem}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-muted)]">Top-tier venue</span>
            <span className="text-[#ffd700] font-mono">{insights.topTier}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-muted)]">With slides</span>
            <span className="text-[var(--color-text-secondary)] font-mono">{insights.withSlides}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-muted)]">With talk video</span>
            <span className="text-[var(--color-text-secondary)] font-mono">{insights.withTalk}</span>
          </div>
        </div>
      </div>

      {/* Top venues */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4">
        <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Top Venues</h4>
        <div className="space-y-1.5">
          {insights.topVenues.slice(0, 7).map(([venue, count]) => (
            <div key={venue} className="flex items-center gap-2 text-xs">
              <span className="text-[var(--color-accent)] font-mono font-bold w-5 text-right shrink-0">{count}</span>
              <span className="text-[var(--color-text-secondary)] truncate">{venue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top authors */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4">
        <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Prolific Authors</h4>
        {insights.topAuthors.length > 0 ? (
          <div className="space-y-1.5">
            {insights.topAuthors.slice(0, 7).map(([author, count]) => (
              <div key={author} className="flex items-center gap-2 text-xs">
                <span className="text-[var(--color-accent)] font-mono font-bold w-5 text-right shrink-0">{count}</span>
                <span className="text-[var(--color-text-secondary)] truncate">{author}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--color-text-muted)]">Analyzing...</p>
        )}
      </div>
    </div>
  )
}
