import type { Paper, Language } from '../types'
import type { ReadingStatus } from '../hooks/useReadingProgress'
import ReadingListButton from './ReadingListButton'
import { showToast } from './Toast'

const categoryColors: Record<string, string> = {
  'vulnerability-detection': '#ff4444',
  'fuzzing': '#44aaff',
  'privacy': '#44ff88',
}

const categoryLabels: Record<string, string> = {
  'vulnerability-detection': 'Vuln Detection',
  'fuzzing': 'Fuzzing',
  'privacy': 'Privacy',
}

const recStars = (level: number) => '⭐'.repeat(level)

interface Props {
  paper: Paper
  lang: Language
  onClick: () => void
  isInReadingList?: boolean
  onToggleReadingList?: () => void
  isSelected?: boolean
  onSelect?: () => void
  onTagClick?: (query: string) => void
  hasNote?: boolean
  searchQuery?: string
  readingStatus?: ReadingStatus
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query || query.length < 2) return text
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-[var(--color-accent)]/20 text-[var(--color-accent)] rounded-sm px-0.5">{part}</mark>
      : part
  )
}

export default function PaperCard({ paper, lang, onClick, isInReadingList, onToggleReadingList, isSelected, onSelect, onTagClick, hasNote, searchQuery, readingStatus }: Props) {
  const mainCategory = paper.categories[0] || 'vulnerability-detection'
  const color = categoryColors[mainCategory] || '#888'
  const rec = paper.recommendation ?? 1
  const summary = lang === 'zh' ? (paper.summary_zh || paper.summary) : paper.summary
  const exp = paper.experiment

  return (
    <div
      onClick={onClick}
      className="bg-[var(--color-bg-card)] border rounded-xl p-5 transition-all duration-200 hover:border-[var(--color-border-hover)] hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20 cursor-pointer group"
      style={{
        borderLeftColor: color,
        borderLeftWidth: '3px',
        borderColor: isSelected ? 'var(--color-accent)' : undefined,
        boxShadow: isSelected ? '0 0 0 1px var(--color-accent)' : undefined,
      }}
    >
      {/* Top row */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {onSelect && (
          <label className="flex items-center" onClick={e => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="w-3.5 h-3.5 accent-[var(--color-accent)] cursor-pointer"
            />
          </label>
        )}
        <span className="text-xs font-mono font-bold text-[var(--color-accent)]">{paper.year}</span>
        {paper.year >= new Date().getFullYear() - 1 && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-accent)]/15 text-[var(--color-accent)] font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>NEW</span>
        )}
        <span className="text-xs" title={`Recommendation Level ${rec}`}>{recStars(rec)}</span>
        {paper.venue && (
          <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)]">
            {paper.venue.length > 50 ? paper.venue.slice(0, 50) + '...' : paper.venue}
          </span>
        )}
        {paper.categories.map(cat => (
          <span key={cat} className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${categoryColors[cat]}15`, color: categoryColors[cat] }}>
            {categoryLabels[cat] || cat}
          </span>
        ))}
        {exp?.open_source && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
            Open Source
          </span>
        )}
        {/* Actions */}
        <span className="ml-auto flex items-center gap-1">
          {readingStatus === 'read' && (
            <span className="text-xs text-[var(--color-accent)]" title="Read">read</span>
          )}
          {readingStatus === 'reading' && (
            <span className="text-xs text-[var(--color-orange)]" title="Currently reading">reading</span>
          )}
          {hasNote && (
            <span className="text-xs text-[var(--color-orange)]" title="Has personal note">
              notes
            </span>
          )}
          {onToggleReadingList && (
            <ReadingListButton
              isInList={isInReadingList ?? false}
              onToggle={onToggleReadingList}
            />
          )}
          <button
            onClick={e => {
              e.stopPropagation()
              const url = `${window.location.origin}${window.location.pathname}#paper=${encodeURIComponent(paper.id)}`
              navigator.clipboard.writeText(url)
              showToast('Link copied!')
            }}
            className="text-xs text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer hover:text-[var(--color-accent)]"
            title="Copy link to paper"
          >
            link
          </button>
        </span>
      </div>

      {/* System name + Title */}
      <div className="mb-1.5">
        {paper.system_name && (
          <span className="text-sm font-mono font-bold text-[var(--color-accent)] mr-2">
            [{paper.system_name}]
          </span>
        )}
        <h3 className="text-base font-semibold leading-snug text-[var(--color-text-primary)] inline group-hover:text-white transition-colors">
          {searchQuery ? highlightText(paper.title, searchQuery) : paper.title}
        </h3>
      </div>

      {/* Authors */}
      {paper.authors && (
        <p className="text-xs text-[var(--color-text-secondary)] mb-2">
          {paper.authors}
        </p>
      )}

      {/* Summary */}
      {summary && (
        <p className="text-sm text-[var(--color-text-primary)] mb-3 bg-white/[0.03] px-3 py-2 rounded-lg border-l-2 border-[var(--color-accent)]/30">
          {summary}
        </p>
      )}

      {/* Experiment tags (compact, clickable) */}
      {exp && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {exp.llm?.map(l => (
            <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-purple)]/10 text-[var(--color-purple)] hover:bg-[var(--color-purple)]/20 transition-colors cursor-pointer"
              onClick={e => { e.stopPropagation(); onTagClick?.(l) }}
              title={`Search for "${l}"`}>
              {l}
            </span>
          ))}
          {exp.language?.map(l => (
            <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-blue)]/10 text-[var(--color-blue)] hover:bg-[var(--color-blue)]/20 transition-colors cursor-pointer"
              onClick={e => { e.stopPropagation(); onTagClick?.(l) }}
              title={`Search for "${l}"`}>
              {l}
            </span>
          ))}
          {exp.fine_tuning && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-orange)]/10 text-[var(--color-orange)]">
              Fine-tuned
            </span>
          )}
          {exp.dataset?.slice(0, 3).map(d => (
            <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-green)]/10 text-[var(--color-green)] hover:bg-[var(--color-green)]/20 transition-colors cursor-pointer"
              onClick={e => { e.stopPropagation(); onTagClick?.(d) }}
              title={`Search for "${d}"`}>
              {d}
            </span>
          ))}
        </div>
      )}

      {/* Key results one-liner */}
      {exp?.key_results && (
        <div className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
          {exp.key_results}
        </div>
      )}

      {/* Quick links row */}
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--color-border)]/50">
        {paper.paperUrl && (
          <a
            href={paper.paperUrl}
            target="_blank"
            rel="noopener"
            onClick={e => e.stopPropagation()}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors no-underline"
          >
            PDF
          </a>
        )}
        {paper.codeUrl && (
          <a
            href={paper.codeUrl}
            target="_blank"
            rel="noopener"
            onClick={e => e.stopPropagation()}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors no-underline"
          >
            Code
          </a>
        )}
      </div>
    </div>
  )
}
