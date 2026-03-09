import { useMemo, useState } from 'react'
import type { Paper } from '../types'

interface Props {
  papers: Paper[]
}

type Dimension = 'category' | 'llm_family' | 'has_finetuning'

const dimLabels: Record<Dimension, string> = {
  category: 'Category',
  llm_family: 'Model Family',
  has_finetuning: 'Fine-tuning',
}

export default function ResearchHeatmap({ papers }: Props) {
  const [dimension, setDimension] = useState<Dimension>('category')
  const [expanded, setExpanded] = useState(false)

  const years = useMemo(() => {
    const set = new Set(papers.map(p => p.year))
    return [...set].sort()
  }, [papers])

  const { groups, maxCount, data } = useMemo(() => {
    let groups: string[] = []
    const data: Record<string, Record<number, number>> = {}

    if (dimension === 'category') {
      groups = ['vulnerability-detection', 'fuzzing', 'privacy']
      const labels: Record<string, string> = { 'vulnerability-detection': 'Vuln Detection', 'fuzzing': 'Fuzzing', 'privacy': 'Privacy' }
      for (const g of groups) {
        data[labels[g]] = {}
        for (const y of years) {
          data[labels[g]][y] = papers.filter(p => p.year === y && p.categories.includes(g)).length
        }
      }
      groups = groups.map(g => labels[g])
    } else if (dimension === 'llm_family') {
      const families = new Map<string, number>()
      for (const p of papers) {
        for (const f of p.experiment?.model_family ?? []) {
          families.set(f, (families.get(f) || 0) + 1)
        }
      }
      groups = [...families.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(e => e[0])
      for (const g of groups) {
        data[g] = {}
        for (const y of years) {
          data[g][y] = papers.filter(p => p.year === y && (p.experiment?.model_family ?? []).includes(g)).length
        }
      }
    } else {
      groups = ['Fine-tuned', 'Not fine-tuned']
      data['Fine-tuned'] = {}
      data['Not fine-tuned'] = {}
      for (const y of years) {
        const yp = papers.filter(p => p.year === y)
        data['Fine-tuned'][y] = yp.filter(p => p.experiment?.fine_tuning).length
        data['Not fine-tuned'][y] = yp.filter(p => !p.experiment?.fine_tuning).length
      }
    }

    let maxCount = 0
    for (const g of groups) {
      for (const y of years) {
        maxCount = Math.max(maxCount, data[g]?.[y] || 0)
      }
    }

    return { groups, maxCount, data }
  }, [papers, years, dimension])

  if (!expanded) {
    return (
      <div className="max-w-5xl mx-auto mb-6">
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider bg-transparent border-none cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
        >
          <span>▶</span> Research Heatmap
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
        Research Heatmap
      </button>

      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-5" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        {/* Dimension selector */}
        <div className="flex gap-1 mb-4">
          {(Object.entries(dimLabels) as [Dimension, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setDimension(key)}
              className="text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer"
              style={{
                background: dimension === key ? 'rgba(0,255,136,0.1)' : 'transparent',
                borderColor: dimension === key ? 'var(--color-accent)' : 'var(--color-border)',
                color: dimension === key ? 'var(--color-accent)' : 'var(--color-text-muted)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="overflow-x-auto">
          <table className="text-xs">
            <thead>
              <tr>
                <th className="pr-3 py-1 text-left text-[var(--color-text-muted)]"></th>
                {years.map(y => (
                  <th key={y} className="px-2 py-1 text-center text-[var(--color-text-muted)] font-mono">{y}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map(g => (
                <tr key={g}>
                  <td className="pr-3 py-1 text-[var(--color-text-secondary)] whitespace-nowrap">{g}</td>
                  {years.map(y => {
                    const count = data[g]?.[y] || 0
                    const intensity = maxCount > 0 ? count / maxCount : 0
                    return (
                      <td key={y} className="px-1 py-1">
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center font-mono"
                          style={{
                            background: count > 0 ? `rgba(0, 255, 136, ${intensity * 0.6 + 0.05})` : 'rgba(255,255,255,0.02)',
                            color: intensity > 0.5 ? '#000' : 'var(--color-text-muted)',
                          }}
                          title={`${g} in ${y}: ${count} papers`}
                        >
                          {count || ''}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
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
