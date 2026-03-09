import { useMemo } from 'react'
import type { Paper } from '../types'

interface Props {
  papers: Paper[]
  onTagClick: (tag: string) => void
}

interface TagInfo {
  text: string
  count: number
  type: 'llm' | 'language' | 'vuln' | 'dataset'
}

const typeColors = {
  llm: 'var(--color-purple)',
  language: 'var(--color-blue)',
  vuln: 'var(--color-red)',
  dataset: 'var(--color-green)',
}

export default function TagCloud({ papers, onTagClick }: Props) {
  const tags = useMemo(() => {
    const counts = new Map<string, TagInfo>()

    for (const p of papers) {
      const exp = p.experiment
      if (!exp) continue
      for (const l of exp.llm ?? []) {
        const existing = counts.get(l)
        counts.set(l, { text: l, count: (existing?.count || 0) + 1, type: 'llm' })
      }
      for (const l of exp.language ?? []) {
        const existing = counts.get(l)
        counts.set(l, { text: l, count: (existing?.count || 0) + 1, type: 'language' })
      }
      for (const v of exp.vulnerability_type ?? []) {
        const existing = counts.get(v)
        counts.set(v, { text: v, count: (existing?.count || 0) + 1, type: 'vuln' })
      }
      for (const d of exp.dataset ?? []) {
        const existing = counts.get(d)
        counts.set(d, { text: d, count: (existing?.count || 0) + 1, type: 'dataset' })
      }
    }

    return [...counts.values()]
      .filter(t => t.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 40)
  }, [papers])

  if (tags.length === 0) return null

  const maxCount = Math.max(...tags.map(t => t.count))
  const minCount = Math.min(...tags.map(t => t.count))

  // Shuffle deterministically for visual variety
  const shuffled = useMemo(() => {
    const arr = [...tags]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (i * 7 + 3) % (i + 1)
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [tags])

  return (
    <div className="max-w-5xl mx-auto mb-8">
      <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">
        Research Landscape
      </h3>
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {shuffled.map(tag => {
            const scale = minCount === maxCount ? 1 : 0.7 + ((tag.count - minCount) / (maxCount - minCount)) * 0.8
            const opacity = 0.5 + ((tag.count - minCount) / (Math.max(maxCount - minCount, 1))) * 0.5
            return (
              <button
                key={tag.text}
                onClick={() => onTagClick(tag.text)}
                className="px-2 py-1 rounded-md border border-transparent hover:border-current transition-all cursor-pointer bg-transparent"
                style={{
                  color: typeColors[tag.type],
                  fontSize: `${scale}rem`,
                  opacity,
                }}
                title={`${tag.text} (${tag.count} papers)`}
              >
                {tag.text}
              </button>
            )
          })}
        </div>
        <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-[var(--color-border)]">
          {Object.entries(typeColors).map(([type, color]) => (
            <span key={type} className="flex items-center gap-1 text-xs" style={{ color }}>
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              {type === 'llm' ? 'LLM' : type === 'vuln' ? 'Vulnerability' : type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
