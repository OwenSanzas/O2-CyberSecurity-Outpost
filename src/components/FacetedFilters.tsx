import { useState, useMemo } from 'react'
import type { Aggregation } from '../hooks/useAggregations'

interface Props {
  aggregations: Aggregation[]
  activeFilters: Record<string, string[]>
  onFilterChange: (key: string, values: string[]) => void
}

const facetIcons: Record<string, string> = {
  llm: '🤖',
  model_family: '🧠',
  fine_tuning: '🔧',
  language: '💻',
  target_domain: '🎯',
  vulnerability_type: '⚠️',
  dataset: '📊',
  fuzzer: '🐛',
  static_tool: '🔍',
  recommendation: '⭐',
}

export default function FacetedFilters({ aggregations, activeFilters, onFilterChange }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({})

  const toggle = (key: string, value: string) => {
    const current = activeFilters[key] || []
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    onFilterChange(key, next)
  }

  const activeCount = Object.values(activeFilters).reduce((s, v) => s + v.length, 0)

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Filters</h3>
        {activeCount > 0 && (
          <button
            onClick={() => aggregations.forEach(a => onFilterChange(a.key, []))}
            className="text-xs text-[var(--color-accent)] bg-transparent border-none cursor-pointer hover:underline"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* Active filters summary */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-1 mb-3 pb-3 border-b border-[var(--color-border)]">
          {Object.entries(activeFilters).map(([key, values]) =>
            values.map(v => (
              <button
                key={`${key}-${v}`}
                onClick={() => toggle(key, v)}
                className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 cursor-pointer transition-all hover:bg-[var(--color-accent)]/20"
              >
                {v} ✕
              </button>
            ))
          )}
        </div>
      )}

      {aggregations.map(agg => {
        const isCollapsed = collapsed[agg.key] ?? (agg.buckets.length > 8)
        const searchTerm = searchTerms[agg.key] || ''
        const filtered = searchTerm
          ? agg.buckets.filter(b => b.value.toLowerCase().includes(searchTerm.toLowerCase()))
          : agg.buckets
        const shown = isCollapsed ? filtered.slice(0, 5) : filtered
        const active = activeFilters[agg.key] || []
        const icon = facetIcons[agg.key] || '📌'
        const hasActiveInGroup = active.length > 0

        return (
          <div key={agg.key} className="mb-4 last:mb-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                {icon} {agg.label}
                {hasActiveInGroup && (
                  <span className="ml-1 text-[var(--color-accent)]">({active.length})</span>
                )}
              </div>
              {hasActiveInGroup && (
                <button
                  onClick={() => onFilterChange(agg.key, [])}
                  className="text-xs text-[var(--color-text-muted)] bg-transparent border-none cursor-pointer hover:text-[var(--color-accent)]"
                >
                  clear
                </button>
              )}
            </div>

            {/* Inline search for large filter groups */}
            {agg.buckets.length > 8 && (
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerms(prev => ({ ...prev, [agg.key]: e.target.value }))}
                placeholder="Filter..."
                className="w-full mb-1.5 px-2 py-1 text-xs bg-transparent border border-[var(--color-border)] rounded text-[var(--color-text-secondary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]/30"
              />
            )}

            <div className="flex flex-wrap gap-1">
              {shown.map(bucket => {
                const isActive = active.includes(bucket.value)
                return (
                  <button
                    key={bucket.value}
                    onClick={() => toggle(agg.key, bucket.value)}
                    className="text-xs px-2 py-1 rounded-md border transition-all cursor-pointer"
                    style={{
                      background: isActive ? 'rgba(0,255,136,0.1)' : 'transparent',
                      borderColor: isActive ? 'var(--color-accent)' : 'var(--color-border)',
                      color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    }}
                  >
                    {bucket.value}
                    <span className="ml-1 opacity-50">{bucket.count}</span>
                  </button>
                )
              })}
            </div>
            {filtered.length > 5 && (
              <button
                onClick={() => setCollapsed(c => ({ ...c, [agg.key]: !isCollapsed }))}
                className="text-xs text-[var(--color-text-muted)] mt-1 bg-transparent border-none cursor-pointer hover:text-[var(--color-text-secondary)]"
              >
                {isCollapsed ? `+${filtered.length - 5} more` : 'Show less'}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
