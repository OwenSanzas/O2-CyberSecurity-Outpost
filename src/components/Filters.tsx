import type { CategoryFilter, SortBy } from '../types'

interface Props {
  category: CategoryFilter
  onCategoryChange: (c: CategoryFilter) => void
  yearFilter: string
  onYearChange: (y: string) => void
  sortBy: SortBy
  onSortChange: (s: SortBy) => void
  years: number[]
  recommendationFilter: string
  onRecommendationChange: (r: string) => void
}

const categoryOptions: { value: CategoryFilter; label: string; color: string }[] = [
  { value: 'all', label: 'All', color: '#e0e0e0' },
  { value: 'vulnerability-detection', label: 'Vuln Detection', color: '#ff4444' },
  { value: 'fuzzing', label: 'Fuzzing', color: '#44aaff' },
  { value: 'privacy', label: 'Privacy', color: '#44ff88' },
]

export default function Filters({
  category, onCategoryChange,
  yearFilter, onYearChange,
  sortBy, onSortChange,
  years,
  recommendationFilter, onRecommendationChange,
}: Props) {
  const hasFilters = category !== 'all' || yearFilter !== 'all' || recommendationFilter !== 'all' || sortBy !== 'year-desc'

  const resetAll = () => {
    onCategoryChange('all')
    onYearChange('all')
    onRecommendationChange('all')
    onSortChange('year-desc')
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 max-w-5xl mx-auto">
      {/* Category tabs */}
      <div className="flex gap-0.5 bg-[var(--color-bg-card)] rounded-lg p-0.5 border border-[var(--color-border)]">
        {categoryOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => onCategoryChange(opt.value)}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border-none"
            style={{
              background: category === opt.value ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: category === opt.value ? opt.color : 'var(--color-text-muted)',
              boxShadow: category === opt.value ? `0 0 8px ${opt.color}22` : 'none',
            }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
              style={{ background: opt.color, opacity: category === opt.value ? 1 : 0.4 }} />
            {opt.label}
          </button>
        ))}
      </div>

      {/* Year */}
      <select
        value={yearFilter}
        onChange={e => onYearChange(e.target.value)}
        className="px-3 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] cursor-pointer focus:outline-none focus:border-[var(--color-accent)]/50"
      >
        <option value="all">All Years</option>
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>

      {/* Recommendation */}
      <select
        value={recommendationFilter}
        onChange={e => onRecommendationChange(e.target.value)}
        className="px-3 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] cursor-pointer focus:outline-none focus:border-[var(--color-accent)]/50"
      >
        <option value="all">All Levels</option>
        <option value="3">Top-tier</option>
        <option value="2">Quality</option>
        <option value="1">Standard</option>
      </select>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={e => onSortChange(e.target.value as SortBy)}
        className="px-3 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] cursor-pointer focus:outline-none focus:border-[var(--color-accent)]/50"
      >
        <option value="year-desc">Newest First</option>
        <option value="year-asc">Oldest First</option>
        <option value="recommendation">By Recommendation</option>
        <option value="title">Title A-Z</option>
      </select>

      {/* Reset */}
      {hasFilters && (
        <button
          onClick={resetAll}
          className="text-xs text-[var(--color-text-muted)] bg-transparent border-none cursor-pointer hover:text-[var(--color-accent)] transition-colors"
        >
          Reset
        </button>
      )}
    </div>
  )
}
