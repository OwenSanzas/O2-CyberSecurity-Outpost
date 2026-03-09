import { useState, useMemo } from 'react'
import type { Paper } from '../types'

interface Props {
  papers: Paper[]
  onSearch: (q: string) => void
}

type Dimension = 'llm' | 'language' | 'vulnerability_type' | 'dataset' | 'venue'

const dimensionLabels: Record<Dimension, string> = {
  llm: 'LLM',
  language: 'Language',
  vulnerability_type: 'Vulnerability Type',
  dataset: 'Dataset',
  venue: 'Venue',
}

export default function DataExplorer({ papers, onSearch }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [dimension, setDimension] = useState<Dimension>('llm')
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  const data = useMemo(() => {
    const counts = new Map<string, { count: number; papers: Paper[] }>()

    for (const p of papers) {
      let values: string[] = []
      if (dimension === 'venue') {
        values = p.venue ? [p.venue] : []
      } else {
        const exp = p.experiment
        if (!exp) continue
        values = (exp[dimension] as string[]) ?? []
      }

      for (const v of values) {
        const existing = counts.get(v)
        if (existing) {
          existing.count++
          existing.papers.push(p)
        } else {
          counts.set(v, { count: 1, papers: [p] })
        }
      }
    }

    return [...counts.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 20)
  }, [papers, dimension])

  const selectedPapers = useMemo(() => {
    if (!selectedValue) return []
    return data.find(([v]) => v === selectedValue)?.[1].papers ?? []
  }, [data, selectedValue])

  if (!expanded) {
    return (
      <div className="max-w-5xl mx-auto mb-8">
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider bg-transparent border-none cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
        >
          <span style={{ display: 'inline-block' }}>▶</span>
          Data Explorer
          <span className="text-[var(--color-text-muted)] normal-case tracking-normal font-normal">— drill down into paper metadata</span>
        </button>
      </div>
    )
  }

  const maxCount = data.length > 0 ? data[0][1].count : 1

  return (
    <div className="max-w-5xl mx-auto mb-8">
      <button
        onClick={() => setExpanded(false)}
        className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider bg-transparent border-none cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
      >
        <span style={{ transform: 'rotate(90deg)', display: 'inline-block', transition: 'transform 0.2s' }}>▶</span>
        Data Explorer
      </button>

      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-5" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        {/* Dimension selector */}
        <div className="flex gap-1 mb-4 flex-wrap">
          {(Object.keys(dimensionLabels) as Dimension[]).map(d => (
            <button
              key={d}
              onClick={() => { setDimension(d); setSelectedValue(null) }}
              className="text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-all"
              style={{
                background: dimension === d ? 'rgba(0,255,136,0.1)' : 'transparent',
                borderColor: dimension === d ? 'var(--color-accent)' : 'var(--color-border)',
                color: dimension === d ? 'var(--color-accent)' : 'var(--color-text-muted)',
              }}
            >
              {dimensionLabels[d]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bar chart */}
          <div className="space-y-1.5">
            {data.map(([value, info]) => {
              const pct = (info.count / maxCount) * 100
              const isSelected = selectedValue === value
              return (
                <div
                  key={value}
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => setSelectedValue(isSelected ? null : value)}
                >
                  <span className={`text-xs w-6 text-right font-mono shrink-0 ${isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`}>
                    {info.count}
                  </span>
                  <div className="flex-1 h-5 bg-white/[0.03] rounded overflow-hidden relative">
                    <div
                      className="h-full rounded transition-all duration-300"
                      style={{
                        width: `${pct}%`,
                        background: isSelected ? 'var(--color-accent)' : 'rgba(0,255,136,0.2)',
                      }}
                    />
                    <span className={`absolute inset-0 px-2 flex items-center text-xs truncate ${isSelected ? 'text-[var(--color-bg-primary)] font-semibold' : 'text-[var(--color-text-secondary)]'}`}>
                      {value}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Selected value detail */}
          <div>
            {selectedValue ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {selectedValue}
                  </h4>
                  <button
                    onClick={() => onSearch(selectedValue)}
                    className="text-xs px-2 py-1 rounded border border-[var(--color-accent)]/30 text-[var(--color-accent)] bg-transparent cursor-pointer hover:bg-[var(--color-accent)]/5 transition-all"
                  >
                    Search
                  </button>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {selectedPapers.map(p => (
                    <div key={p.id} className="text-xs text-[var(--color-text-secondary)] bg-white/[0.02] rounded p-2">
                      <span className="text-[var(--color-accent)] font-mono mr-1">{p.year}</span>
                      {p.system_name && <span className="text-[var(--color-accent)] font-bold mr-1">[{p.system_name}]</span>}
                      {p.title.length > 80 ? p.title.slice(0, 80) + '...' : p.title}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-[var(--color-text-muted)]">
                Click a bar to see related papers
              </div>
            )}
          </div>
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
