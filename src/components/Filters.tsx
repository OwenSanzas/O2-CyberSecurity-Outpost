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

const categoryOptions: { value: CategoryFilter; label: string; description: string; color: string; icon: string }[] = [
  { value: 'all', label: 'All Papers', description: 'Browse everything', color: 'var(--color-text-secondary)', icon: '📋' },
  { value: 'vulnerability-detection', label: 'Vulnerability Detection', description: 'Finding bugs with LLMs', color: '#ff4444', icon: '🛡️' },
  { value: 'fuzzing', label: 'Fuzzing', description: 'Automated test generation', color: '#44aaff', icon: '🔧' },
  { value: 'privacy', label: 'Privacy & Data Security', description: 'LLM privacy research', color: '#44ff88', icon: '🔒' },
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

  const resetAll = () => {
    onCategoryChange('all')
    onYearChange('all')
    onRecommendationChange('all')
    onSortChange('year-desc')
    onVenueChange?.('all')
  }

  return (
    <div className="mb-6">
      {/* Category cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {categoryOptions.map(opt => {
          const isActive = category === opt.value
          const count = opt.value === 'all' ? totalCount : (categoryCounts?.[opt.value] || 0)
          return (
            <button
              key={opt.value}
              onClick={() => onCategoryChange(opt.value)}
              className="text-left px-3 py-2.5 rounded-xl border transition-all cursor-pointer"
              style={{
                background: isActive ? `${opt.color}11` : 'var(--color-bg-card)',
                borderColor: isActive ? opt.color : 'var(--color-border)',
                borderWidth: isActive ? '2px' : '1px',
              }}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-sm">{opt.icon}</span>
                <span className="text-xs font-semibold" style={{ color: isActive ? opt.color : 'var(--color-text-primary)' }}>
                  {opt.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[var(--color-text-muted)]">{opt.description}</span>
                {count !== undefined && (
                  <span className="text-[10px] font-mono" style={{ color: opt.color, opacity: isActive ? 1 : 0.6 }}>
                    {count}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Filter dropdowns row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Year */}
        <select
          value={yearFilter}
          onChange={e => onYearChange(e.target.value)}
          className="px-3 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] cursor-pointer focus:outline-none focus:border-[var(--color-accent)]/50"
        >
          <option value="all">All Years</option>
          {years.length >= 3 && (
            <>
              <option value={`${years[0]}-${years[1]}`}>Last 2 years ({years[1]}–{years[0]})</option>
              {years.length >= 4 && <option value={`${years[0]}-${years[2]}`}>Last 3 years ({years[2]}–{years[0]})</option>}
            </>
          )}
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        {/* Recommendation */}
        <select
          value={recommendationFilter}
          onChange={e => onRecommendationChange(e.target.value)}
          className="px-3 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] cursor-pointer focus:outline-none focus:border-[var(--color-accent)]/50"
        >
          <option value="all">All Quality</option>
          <option value="3">Top-tier</option>
          <option value="2">Quality</option>
          <option value="1">Standard</option>
        </select>

        {/* Venue */}
        {venues && venues.length > 0 && onVenueChange && (
          <select
            value={venueFilter || 'all'}
            onChange={e => onVenueChange(e.target.value)}
            className="px-3 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] cursor-pointer focus:outline-none focus:border-[var(--color-accent)]/50 max-w-[200px]"
          >
            <option value="all">All Venues</option>
            {venues.map(v => <option key={v} value={v}>{v.length > 35 ? v.slice(0, 35) + '...' : v}</option>)}
          </select>
        )}

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value as SortBy)}
          className="px-3 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] cursor-pointer focus:outline-none focus:border-[var(--color-accent)]/50"
        >
          <option value="year-desc">Newest First</option>
          <option value="year-asc">Oldest First</option>
          <option value="recommendation">By Quality</option>
          <option value="title">Title A-Z</option>
        </select>

        {/* Reset */}
        {hasFilters && (
          <button
            onClick={resetAll}
            className="text-xs text-[var(--color-text-muted)] bg-transparent border-none cursor-pointer hover:text-[var(--color-accent)] transition-colors"
          >
            Reset all
          </button>
        )}
      </div>
    </div>
  )
}
