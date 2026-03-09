import { useState, useMemo } from 'react'
import type { Paper, Language } from '../types'
import ReadingListButton from './ReadingListButton'

const categoryColors: Record<string, string> = {
  'vulnerability-detection': '#ff4444',
  'fuzzing': '#44aaff',
  'privacy': '#44ff88',
}

type SortKey = 'year' | 'title' | 'venue' | 'recommendation'
type SortDir = 'asc' | 'desc'

interface Props {
  papers: Paper[]
  lang: Language
  onPaperClick: (p: Paper) => void
  isInReadingList?: (id: string) => boolean
  onToggleReadingList?: (id: string) => void
}

export default function PaperTable({ papers, lang, onPaperClick, isInReadingList, onToggleReadingList }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('year')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const sorted = useMemo(() => {
    return [...papers].sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'year': cmp = a.year - b.year; break
        case 'title': cmp = a.title.localeCompare(b.title); break
        case 'venue': cmp = (a.venue || '').localeCompare(b.venue || ''); break
        case 'recommendation': cmp = (a.recommendation ?? 1) - (b.recommendation ?? 1); break
      }
      return sortDir === 'desc' ? -cmp : cmp
    })
  }, [papers, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return ''
    return sortDir === 'desc' ? ' ↓' : ' ↑'
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
            <th onClick={() => handleSort('year')} className="py-2.5 px-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-text-secondary)] transition-colors text-left select-none">
              Year{sortIcon('year')}
            </th>
            <th onClick={() => handleSort('recommendation')} className="py-2.5 px-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-text-secondary)] transition-colors text-left select-none">
              Level{sortIcon('recommendation')}
            </th>
            <th className="py-2.5 px-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-left">System</th>
            <th onClick={() => handleSort('title')} className="py-2.5 px-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-text-secondary)] transition-colors text-left select-none">
              Title{sortIcon('title')}
            </th>
            <th onClick={() => handleSort('venue')} className="py-2.5 px-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-text-secondary)] transition-colors hidden md:table-cell text-left select-none">
              Venue{sortIcon('venue')}
            </th>
            <th className="py-2.5 px-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:table-cell text-left">LLM</th>
            <th className="py-2.5 px-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:table-cell text-left">Links</th>
            <th className="py-2.5 px-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider w-8"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(paper => {
            const rec = paper.recommendation ?? 1
            const mainCat = paper.categories[0] || 'vulnerability-detection'
            const llms = paper.experiment?.llm?.slice(0, 2).join(', ') || ''
            return (
              <tr
                key={paper.id}
                onClick={() => onPaperClick(paper)}
                className="border-b border-[var(--color-border)]/50 hover:bg-white/[0.02] cursor-pointer transition-colors"
                style={{
                  background: isInReadingList?.(paper.id) ? 'rgba(0,255,136,0.02)' : undefined,
                }}
              >
                <td className="py-2.5 px-3 font-mono text-[var(--color-accent)] font-bold text-xs">{paper.year}</td>
                <td className="py-2.5 px-3 text-xs">{'⭐'.repeat(rec)}</td>
                <td className="py-2.5 px-3">
                  {paper.system_name ? (
                    <span className="font-mono font-bold text-[var(--color-accent)] text-xs">{paper.system_name}</span>
                  ) : (
                    <span className="text-[var(--color-text-muted)] text-xs">—</span>
                  )}
                </td>
                <td className="py-2.5 px-3 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: categoryColors[mainCat] }} />
                    <span className="text-[var(--color-text-primary)] truncate">
                      {paper.title}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-xs text-[var(--color-text-secondary)] hidden md:table-cell max-w-32 truncate">
                  {paper.venue && (paper.venue.length > 30 ? paper.venue.slice(0, 30) + '...' : paper.venue)}
                </td>
                <td className="py-2.5 px-3 text-xs text-[var(--color-purple)] hidden lg:table-cell">
                  {llms || '—'}
                </td>
                <td className="py-2.5 px-3 hidden lg:table-cell">
                  <div className="flex gap-1.5">
                    {paper.paperUrl && <span className="text-xs opacity-60 hover:opacity-100" title="Paper">PDF</span>}
                    {paper.codeUrl && <span className="text-xs opacity-60 hover:opacity-100" title="Code">Code</span>}
                  </div>
                </td>
                <td className="py-2.5 px-3" onClick={e => e.stopPropagation()}>
                  {onToggleReadingList && (
                    <ReadingListButton
                      isInList={isInReadingList?.(paper.id) ?? false}
                      onToggle={() => onToggleReadingList(paper.id)}
                    />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
