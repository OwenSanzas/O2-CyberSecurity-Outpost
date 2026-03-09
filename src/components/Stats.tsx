import { useMemo, useState } from 'react'
import type { Paper } from '../types'

export default function Stats({ papers }: { papers: Paper[] }) {
  const [expanded, setExpanded] = useState(false)

  const { byYear, byCategory, topLLMs, topLanguages, topVulnTypes, fineTuned, openSource } = useMemo(() => {
    const byYear: Record<number, number> = {}
    const byCategory: Record<string, number> = {}
    const llmCounts: Record<string, number> = {}
    const langCounts: Record<string, number> = {}
    const vulnCounts: Record<string, number> = {}
    let fineTuned = 0
    let openSource = 0

    for (const p of papers) {
      byYear[p.year] = (byYear[p.year] || 0) + 1
      for (const c of p.categories) byCategory[c] = (byCategory[c] || 0) + 1
      for (const l of (p.experiment?.llm ?? [])) llmCounts[l] = (llmCounts[l] || 0) + 1
      for (const l of (p.experiment?.language ?? [])) langCounts[l] = (langCounts[l] || 0) + 1
      for (const v of (p.experiment?.vulnerability_type ?? [])) vulnCounts[v] = (vulnCounts[v] || 0) + 1
      if (p.experiment?.fine_tuning) fineTuned++
      if (p.experiment?.open_source) openSource++
    }

    const topLLMs = Object.entries(llmCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)
    const topLanguages = Object.entries(langCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)
    const topVulnTypes = Object.entries(vulnCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)

    return { byYear, byCategory, topLLMs, topLanguages, topVulnTypes, fineTuned, openSource }
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
    <div className="max-w-5xl mx-auto mb-10">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider bg-transparent border-none cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
      >
        <span style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▶</span>
        Dashboard
      </button>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          {/* Quick stats row */}
          <div className="p-4 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] text-center">
            <div className="text-2xl font-bold text-[var(--color-accent)] font-mono">{papers.length}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">Total Papers</div>
          </div>
          <div className="p-4 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] text-center">
            <div className="text-2xl font-bold text-[var(--color-orange)] font-mono">{fineTuned}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">Fine-tuned</div>
          </div>
          <div className="p-4 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] text-center">
            <div className="text-2xl font-bold text-[var(--color-green)] font-mono">{openSource}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">Open Source</div>
          </div>
          <div className="p-4 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] text-center">
            <div className="text-2xl font-bold text-[var(--color-purple)] font-mono">{topLLMs.length}+</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">LLMs Studied</div>
          </div>

          {/* Papers by Year */}
          <div className="p-5 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] col-span-1 md:col-span-2 lg:col-span-4">
            <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider">
              Papers by Year
            </h3>
            <div className="flex items-end gap-2 h-28">
              {years.map(year => {
                const count = byYear[year]
                const height = (count / maxYearCount) * 100
                return (
                  <div key={year} className="flex flex-col items-center flex-1 gap-1 group">
                    <span className="text-xs text-[var(--color-accent)] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity">{count}</span>
                    <div
                      className="w-full rounded-t transition-all duration-700 group-hover:opacity-100"
                      style={{
                        height: `${height}%`,
                        background: `linear-gradient(to top, var(--color-accent), var(--color-accent-dim))`,
                        opacity: 0.7,
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
          <div className="p-5 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] col-span-1 md:col-span-1 lg:col-span-2">
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
                      <span className="text-[var(--color-text-muted)] font-mono">{count} ({pct.toFixed(0)}%)</span>
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

          {/* Top LLMs */}
          <div className="p-5 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] col-span-1 md:col-span-1 lg:col-span-2">
            <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">
              Most Used LLMs
            </h3>
            {topLLMs.length > 0 ? (
              <div className="space-y-2">
                {topLLMs.map(([name, count]) => {
                  const pct = (count / Math.max(...topLLMs.map(l => l[1] as number))) * 100
                  return (
                    <div key={name}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-[var(--color-purple)] truncate mr-2">{name}</span>
                        <span className="text-[var(--color-text-muted)] font-mono shrink-0">{count}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--color-purple)]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-[var(--color-text-muted)]">No data</p>
            )}
          </div>

          {/* Target Languages */}
          {topLanguages.length > 0 && (
            <div className="p-5 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] col-span-1 md:col-span-1 lg:col-span-2">
              <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">
                Target Languages
              </h3>
              <div className="space-y-2">
                {topLanguages.map(([name, count]) => {
                  const pct = (count / Math.max(...topLanguages.map(l => l[1] as number))) * 100
                  return (
                    <div key={name}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-[var(--color-blue)] truncate mr-2">{name}</span>
                        <span className="text-[var(--color-text-muted)] font-mono shrink-0">{count}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--color-blue)]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Top Vulnerability Types */}
          {topVulnTypes.length > 0 && (
            <div className="p-5 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] col-span-1 md:col-span-1 lg:col-span-2">
              <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">
                Vulnerability Types
              </h3>
              <div className="space-y-2">
                {topVulnTypes.map(([name, count]) => {
                  const pct = (count / Math.max(...topVulnTypes.map(v => v[1] as number))) * 100
                  return (
                    <div key={name}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-[var(--color-red)] truncate mr-2">{name}</span>
                        <span className="text-[var(--color-text-muted)] font-mono shrink-0">{count}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--color-red)]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
