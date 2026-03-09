import { useState } from 'react'
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

      {aggregations.map(agg => {
        const isCollapsed = collapsed[agg.key] ?? (agg.buckets.length > 8)
        const shown = isCollapsed ? agg.buckets.slice(0, 5) : agg.buckets
        const active = activeFilters[agg.key] || []
        const icon = facetIcons[agg.key] || '📌'

        return (
          <div key={agg.key} className="mb-4 last:mb-0">
            <div className="text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
              {icon} {agg.label}
            </div>
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
            {agg.buckets.length > 5 && (
              <button
                onClick={() => setCollapsed(c => ({ ...c, [agg.key]: !isCollapsed }))}
                className="text-xs text-[var(--color-text-muted)] mt-1 bg-transparent border-none cursor-pointer hover:text-[var(--color-text-secondary)]"
              >
                {isCollapsed ? `+${agg.buckets.length - 5} more` : 'Show less'}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
