import type { Paper } from '../types'

export default function Stats({ papers }: { papers: Paper[] }) {
  const byYear = papers.reduce<Record<number, number>>((acc, p) => {
    acc[p.year] = (acc[p.year] || 0) + 1
    return acc
  }, {})

  const years = Object.keys(byYear).map(Number).sort()
  const maxCount = Math.max(...Object.values(byYear))

  return (
    <div className="max-w-5xl mx-auto mb-10 p-6 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]">
      <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4">Papers by Year</h3>
      <div className="flex items-end gap-2 h-24">
        {years.map(year => {
          const count = byYear[year]
          const height = (count / maxCount) * 100
          return (
            <div key={year} className="flex flex-col items-center flex-1 gap-1">
              <span className="text-xs text-[var(--color-accent)] font-mono">{count}</span>
              <div
                className="w-full rounded-t-sm transition-all duration-500"
                style={{
                  height: `${height}%`,
                  background: `linear-gradient(to top, var(--color-accent), var(--color-accent-dim))`,
                  opacity: 0.8,
                  minHeight: '4px',
                }}
              />
              <span className="text-xs text-[var(--color-text-muted)] font-mono">{year}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
