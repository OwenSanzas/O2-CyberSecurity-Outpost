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
  categoryCounts?: Record<string, number>
  totalCount?: number
  venues?: string[]
  venueFilter?: string
  onVenueChange?: (v: string) => void
}

const categoryOptions: { value: CategoryFilter; label: string; color: string; icon: string }[] = [
  { value: 'all', label: 'All', color: 'var(--color-text-secondary)', icon: '📋' },
  { value: 'vulnerability-detection', label: 'Vulnerability', color: '#ff4444', icon: '🛡️' },
  { value: 'fuzzing', label: 'Fuzzing', color: '#44aaff', icon: '🔧' },
  { value: 'fuzzing-harness', label: 'Harness Gen', color: '#ffaa44', icon: '🎯' },
  { value: 'patching', label: 'Patching', color: '#aa66ff', icon: '🩹' },
  { value: 'privacy', label: 'Privacy', color: '#44ff88', icon: '🔒' },
]

export default function Filters({
  category, onCategoryChange,
  yearFilter, onYearChange,
  sortBy, onSortChange,
  years,
  recommendationFilter, onRecommendationChange,
  categoryCounts, totalCount,
  venues, venueFilter, onVenueChange,
}: Props) {
  const hasFilters = category !== 'all' || yearFilter !== 'all' || recommendationFilter !== 'all' || sortBy !== 'year-desc' || (venueFilter && venueFilter !== 'all')

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Category buttons */}
        {categoryOptions.map(opt => {
          const isActive = category === opt.value
          const count = opt.value === 'all' ? totalCount : (categoryCounts?.[opt.value] || 0)
          return (
            <button
              key={opt.value}
              onClick={() => onCategoryChange(opt.value)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer"
              style={{
                background: isActive ? `${opt.color}11` : 'var(--color-bg-card)',
                borderColor: isActive ? opt.color : 'var(--color-border)',
                color: isActive ? opt.color : 'var(--color-text-secondary)',
              }}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
              {count !== undefined && (
                <span className="font-mono text-[10px] opacity-60">{count}</span>
              )}
            </button>
          )
        })}

        <span className="w-px h-5 bg-[var(--color-border)] hidden md:block" />

        <select
          value={yearFilter}
          onChange={e => onYearChange(e.target.value)}
          className="px-2.5 py-1.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] cursor-pointer focus:outline-none focus:border-[var(--color-accent)]/50"
        >
          <option value="all">All Years</option>
          {years.length >= 3 && (
            <option value={`${years[0]}-${years[1]}`}>Last 2 years</option>
          )}
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <select
          value={recommendationFilter}
          onChange={e => onRecommendationChange(e.target.value)}
          className="px-2.5 py-1.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] cursor-pointer focus:outline-none focus:border-[var(--color-accent)]/50"
        >
          <option value="all">Quality</option>
          <option value="3">Top-tier</option>
          <option value="2">Quality</option>
          <option value="1">Standard</option>
        </select>

        {venues && venues.length > 0 && onVenueChange && (
          <select
            value={venueFilter || 'all'}
            onChange={e => onVenueChange(e.target.value)}
            className="px-2.5 py-1.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] cursor-pointer focus:outline-none focus:border-[var(--color-accent)]/50 max-w-[160px]"
          >
            <option value="all">Venue</option>
            {venues.map(v => <option key={v} value={v}>{v.length > 30 ? v.slice(0, 30) + '...' : v}</option>)}
          </select>
        )}

        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value as SortBy)}
          className="px-2.5 py-1.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] cursor-pointer focus:outline-none focus:border-[var(--color-accent)]/50"
        >
          <option value="year-desc">Newest</option>
          <option value="year-asc">Oldest</option>
          <option value="recommendation">Top Quality</option>
          <option value="title">A-Z</option>
        </select>

        {hasFilters && (
          <button
            onClick={() => {
              onCategoryChange('all')
              onYearChange('all')
              onRecommendationChange('all')
              onSortChange('year-desc')
              onVenueChange?.('all')
            }}
            className="text-xs text-[var(--color-text-muted)] bg-transparent border-none cursor-pointer hover:text-[var(--color-accent)] transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
