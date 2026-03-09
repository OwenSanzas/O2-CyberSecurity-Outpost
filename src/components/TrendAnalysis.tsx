import { useMemo, useState } from 'react'
import type { Paper } from '../types'

interface Props {
  papers: Paper[]
}

type TrendMetric = 'llm_adoption' | 'fine_tuning' | 'categories' | 'open_source'

const metricLabels: Record<TrendMetric, string> = {
  llm_adoption: 'LLM Adoption Over Time',
  fine_tuning: 'Fine-tuning Trend',
  categories: 'Research Category Trends',
  open_source: 'Open Source Trend',
}

export default function TrendAnalysis({ papers }: Props) {
  const [metric, setMetric] = useState<TrendMetric>('llm_adoption')
  const [expanded, setExpanded] = useState(false)

  const years = useMemo(() => {
    const set = new Set(papers.map(p => p.year))
    return [...set].sort()
  }, [papers])

  const trendData = useMemo(() => {
    if (metric === 'llm_adoption') {
      // Track top LLMs over years
      const topLLMs = new Map<string, number>()
      for (const p of papers) {
        for (const l of p.experiment?.llm ?? []) {
          topLLMs.set(l, (topLLMs.get(l) || 0) + 1)
        }
      }
      const topNames = [...topLLMs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0])

      return years.map(year => {
        const yearPapers = papers.filter(p => p.year === year)
        const counts: Record<string, number> = {}
        for (const name of topNames) {
          counts[name] = yearPapers.filter(p => p.experiment?.llm?.includes(name)).length
        }
        return { year, counts, total: yearPapers.length }
      })
    }

    if (metric === 'fine_tuning') {
      return years.map(year => {
        const yearPapers = papers.filter(p => p.year === year)
        const ftCount = yearPapers.filter(p => p.experiment?.fine_tuning).length
        return {
          year,
          counts: {
            'Fine-tuned': ftCount,
            'No fine-tuning': yearPapers.length - ftCount,
          },
          total: yearPapers.length,
        }
      })
    }

    if (metric === 'categories') {
      return years.map(year => {
        const yearPapers = papers.filter(p => p.year === year)
        return {
          year,
          counts: {
            'Vuln Detection': yearPapers.filter(p => p.categories.includes('vulnerability-detection')).length,
            'Fuzzing': yearPapers.filter(p => p.categories.includes('fuzzing')).length,
            'Privacy': yearPapers.filter(p => p.categories.includes('privacy')).length,
          },
          total: yearPapers.length,
        }
      })
    }

    // open_source
    return years.map(year => {
      const yearPapers = papers.filter(p => p.year === year)
      const osCount = yearPapers.filter(p => p.experiment?.open_source).length
      return {
        year,
        counts: {
          'Open Source': osCount,
          'Closed': yearPapers.length - osCount,
        },
        total: yearPapers.length,
      }
    })
  }, [papers, years, metric])

  const colors: Record<string, string> = {
    'GPT-4': '#aa66ff',
    'GPT-3.5': '#8844cc',
    'ChatGPT': '#6622aa',
    'CodeLlama': '#44aaff',
    'Claude': '#ff8844',
    'Llama 2': '#44ff88',
    'Fine-tuned': '#ffaa44',
    'No fine-tuning': '#555',
    'Vuln Detection': '#ff4444',
    'Fuzzing': '#44aaff',
    'Privacy': '#44ff88',
    'Open Source': '#00ff88',
    'Closed': '#555',
  }

  const allKeys = trendData.length > 0 ? Object.keys(trendData[0].counts) : []
  const maxTotal = Math.max(...trendData.map(d => d.total), 1)

  if (!expanded) {
    return (
      <div className="max-w-5xl mx-auto mb-6">
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider bg-transparent border-none cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
        >
          <span style={{ display: 'inline-block' }}>▶</span>
          Trend Analysis
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto mb-8">
      <button
        onClick={() => setExpanded(false)}
        className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider bg-transparent border-none cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
      >
        <span style={{ transform: 'rotate(90deg)', display: 'inline-block' }}>▶</span>
        Trend Analysis
      </button>

      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-5" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        {/* Metric selector */}
        <div className="flex gap-1 mb-5 flex-wrap">
          {(Object.entries(metricLabels) as [TrendMetric, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setMetric(key)}
              className="text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer"
              style={{
                background: metric === key ? 'rgba(0,255,136,0.1)' : 'transparent',
                borderColor: metric === key ? 'var(--color-accent)' : 'var(--color-border)',
                color: metric === key ? 'var(--color-accent)' : 'var(--color-text-muted)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Stacked bar chart */}
        <div className="flex items-end gap-3 h-40 mb-4">
          {trendData.map(d => (
            <div key={d.year} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end" style={{ height: `${(d.total / maxTotal) * 100}%` }}>
                {allKeys.map(key => {
                  const count = d.counts[key] || 0
                  if (!count) return null
                  const pct = (count / d.total) * 100
                  return (
                    <div
                      key={key}
                      className="w-full first:rounded-t"
                      style={{
                        height: `${pct}%`,
                        background: colors[key] || '#666',
                        minHeight: count > 0 ? '2px' : 0,
                        opacity: 0.8,
                      }}
                      title={`${key}: ${count}`}
                    />
                  )
                })}
              </div>
              <span className="text-xs text-[var(--color-text-muted)] font-mono">{d.year}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs">
          {allKeys.map(key => (
            <span key={key} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: colors[key] || '#666' }} />
              <span className="text-[var(--color-text-secondary)]">{key}</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
