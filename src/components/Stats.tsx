import { useMemo } from 'react'
import type { Paper } from '../types'

export default function Stats({ papers }: { papers: Paper[] }) {
  const { byYear, byCategory, topLLMs, topLanguages } = useMemo(() => {
    const byYear: Record<number, number> = {}
    const byCategory: Record<string, number> = {}
    const llmCounts: Record<string, number> = {}
    const langCounts: Record<string, number> = {}

    for (const p of papers) {
      byYear[p.year] = (byYear[p.year] || 0) + 1
      for (const c of p.categories) byCategory[c] = (byCategory[c] || 0) + 1
      for (const l of (p.experiment?.llm ?? [])) llmCounts[l] = (llmCounts[l] || 0) + 1
      for (const l of (p.experiment?.language ?? [])) langCounts[l] = (langCounts[l] || 0) + 1
    }

    const topLLMs = Object.entries(llmCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)
    const topLanguages = Object.entries(langCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)

    return { byYear, byCategory, topLLMs, topLanguages }
  }, [papers])

  const years = Object.keys(byYear).map(Number).sort()
  const maxYearCount = Math.max(...Object.values(byYear))

  const catColors: Record<string, string> = {
    'vulnerability-detection': '#ff4444',
    'fuzzing': '#44aaff',
    'privacy': '#44ff88',
  }
  const catLabels: Record<string, string> = {
    'vulnerability-detection': 'Vuln Detection',
    'fuzzing': 'Fuzzing',
    'privacy': 'Privacy',
  }

  return (
    <div className="max-w-5xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Papers by Year */}
      <div className="p-5 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] col-span-1 md:col-span-2">
        <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider">
          Papers by Year
        </h3>
        <div className="flex items-end gap-2 h-28">
          {years.map(year => {
            const count = byYear[year]
            const height = (count / maxYearCount) * 100
            return (
              <div key={year} className="flex flex-col items-center flex-1 gap-1">
                <span className="text-xs text-[var(--color-accent)] font-mono font-bold">{count}</span>
                <div
                  className="w-full rounded-t transition-all duration-700"
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

      {/* Categories breakdown */}
      <div className="p-5 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]">
        <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">
          By Category
        </h3>
        <div className="space-y-3">
          {Object.entries(byCategory).map(([cat, count]) => {
            const pct = (count / papers.length) * 100
            return (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: catColors[cat] }}>{catLabels[cat] || cat}</span>
                  <span className="text-[var(--color-text-muted)] font-mono">{count}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: catColors[cat] }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top LLMs & Languages */}
      <div className="p-5 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]">
        <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">
          Most Used LLMs
        </h3>
        {topLLMs.length > 0 ? (
          <div className="space-y-2">
            {topLLMs.map(([name, count]) => {
              const pct = (count / papers.length) * 100
              return (
                <div key={name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--color-purple)]">🤖 {name}</span>
                    <span className="text-[var(--color-text-muted)] font-mono">{count}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--color-purple)]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-xs text-[var(--color-text-muted)]">Data being enriched...</p>
        )}

        {topLanguages.length > 0 && (
          <>
            <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] mt-4 mb-3 uppercase tracking-wider">
              Target Languages
            </h3>
            <div className="space-y-2">
              {topLanguages.map(([name, count]) => {
                const pct = (count / papers.length) * 100
                return (
                  <div key={name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--color-blue)]">💻 {name}</span>
                      <span className="text-[var(--color-text-muted)] font-mono">{count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[var(--color-blue)]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
