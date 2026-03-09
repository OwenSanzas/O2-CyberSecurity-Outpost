import { useMemo, useState } from 'react'
import type { Paper } from '../types'

interface Props {
  papers: Paper[]
  onAuthorClick: (author: string) => void
}

interface AuthorInfo {
  name: string
  count: number
  papers: string[]
  coauthors: Map<string, number>
  years: number[]
  categories: string[]
}

export default function AuthorNetwork({ papers, onAuthorClick }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [minPapers, setMinPapers] = useState(2)

  const authors = useMemo(() => {
    const authorMap = new Map<string, AuthorInfo>()

    for (const p of papers) {
      const authorNames = p.authors
        .split(/,\s*/)
        .map(a => a.trim())
        .filter(a => a.length > 0 && a !== 'et al.' && a !== 'et al')

      for (const name of authorNames) {
        if (!authorMap.has(name)) {
          authorMap.set(name, {
            name,
            count: 0,
            papers: [],
            coauthors: new Map(),
            years: [],
            categories: [],
          })
        }
        const info = authorMap.get(name)!
        info.count++
        info.papers.push(p.title)
        info.years.push(p.year)
        info.categories.push(...p.categories)

        // Track co-authorship
        for (const coauthor of authorNames) {
          if (coauthor !== name) {
            info.coauthors.set(coauthor, (info.coauthors.get(coauthor) || 0) + 1)
          }
        }
      }
    }

    return [...authorMap.values()]
      .filter(a => a.count >= minPapers)
      .sort((a, b) => b.count - a.count)
  }, [papers, minPapers])

  if (authors.length === 0) return null

  return (
    <div className="mb-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider bg-transparent border-none cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
      >
        <span style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▶</span>
        Author Network
        <span className="text-[var(--color-text-muted)] normal-case tracking-normal font-normal">— {authors.length} researchers with {minPapers}+ papers</span>
      </button>

      {expanded && (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-5" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div className="flex items-center gap-3 mb-4">
            <label className="text-xs text-[var(--color-text-muted)]">Min papers:</label>
            <div className="flex gap-1">
              {[2, 3, 4].map(n => (
                <button
                  key={n}
                  onClick={() => setMinPapers(n)}
                  className="text-xs px-2 py-0.5 rounded border cursor-pointer transition-all"
                  style={{
                    background: minPapers === n ? 'rgba(0,255,136,0.1)' : 'transparent',
                    borderColor: minPapers === n ? 'var(--color-accent)' : 'var(--color-border)',
                    color: minPapers === n ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  }}
                >
                  {n}+
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {authors.slice(0, 12).map(author => {
              const topCoauthors = [...author.coauthors.entries()]
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
              const yearRange = `${Math.min(...author.years)}–${Math.max(...author.years)}`
              const uniqueCats = [...new Set(author.categories)]

              return (
                <div
                  key={author.name}
                  className="bg-white/[0.02] rounded-lg p-3 hover:bg-white/[0.04] transition-colors cursor-pointer"
                  onClick={() => onAuthorClick(author.name)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors truncate mr-2">
                      {author.name}
                    </span>
                    <span className="text-xs font-mono text-[var(--color-accent)] shrink-0">
                      {author.count} papers
                    </span>
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)] mb-1.5">
                    Years: {yearRange}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {uniqueCats.map(cat => {
                      const catColors: Record<string, string> = {
                        'vulnerability-detection': '#ff4444',
                        'fuzzing': '#44aaff',
                        'privacy': '#44ff88',
                      }
                      return (
                        <span key={cat} className="w-2 h-2 rounded-full" style={{ background: catColors[cat] || '#888' }} title={cat} />
                      )
                    })}
                  </div>
                  {topCoauthors.length > 0 && (
                    <div className="text-xs text-[var(--color-text-muted)]">
                      Collaborators: {topCoauthors.map(([name, count]) => (
                        <span key={name} className="text-[var(--color-text-secondary)]">
                          {name.split(' ').pop()} ({count})
                          {', '}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  )
}
