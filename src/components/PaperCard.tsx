import type { Paper, Language } from '../types'
import type { ReadingStatus } from '../hooks/useReadingProgress'
import type { CustomTag } from '../hooks/useCustomTags'
import ReadingListButton from './ReadingListButton'

const categoryColors: Record<string, string> = {
  'vulnerability-detection': '#ff4444',
  'fuzzing': '#44aaff',
  'fuzzing-harness': '#ffaa44',
  'patching': '#aa66ff',
  'privacy': '#44ff88',
}

const categoryLabels: Record<string, string> = {
  'vulnerability-detection': 'Vulnerability Detection',
  'fuzzing': 'Fuzzing',
  'fuzzing-harness': 'Harness Gen',
  'patching': 'Patching',
  'privacy': 'Privacy',
}

const categoryIcons: Record<string, string> = {
  'vulnerability-detection': '🛡️',
  'fuzzing': '🔧',
  'fuzzing-harness': '🎯',
  'patching': '🩹',
  'privacy': '🔒',
}

function getVenueTier(venue: string): 'top' | 'good' | 'normal' {
  const v = venue.toLowerCase()
  if (v.includes('s&p') || v.includes('oakland') || (v.includes('usenix') && v.includes('security')) || v.includes('ccs') || v.includes('ndss'))
    return 'top'
  if (v.includes('icse') || v.includes('fse') || v.includes('esec') || v.includes('ase') || v.includes('issta'))
    return 'good'
  return 'normal'
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query || query.length < 2) return text
  try {
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} className="bg-[var(--color-accent)]/20 text-[var(--color-accent)] rounded-sm px-0.5">{part}</mark>
        : part
    )
  } catch {
    return text
  }
}

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
  customTags?: CustomTag[]
}

export default function PaperCard({ paper, lang, onClick, isInReadingList, onToggleReadingList, onTagClick, hasNote, searchQuery, readingStatus, customTags }: Props) {
  const rec = paper.recommendation ?? 1
  const summary = lang === 'zh' ? (paper.summary_zh || paper.summary) : paper.summary
  const exp = paper.experiment
  const venueTier = paper.venue ? getVenueTier(paper.venue) : null

  return (
    <article onClick={onClick} className="group cursor-pointer transition-all duration-200">
      <div className="py-5 border-b border-[var(--color-border)] hover:bg-[var(--color-bg-card)]/50 px-4 -mx-4 rounded-lg transition-colors">
        {/* Meta line */}
        <div className="flex items-center gap-2 mb-1.5 text-xs flex-wrap">
          <span className="font-mono font-bold text-[var(--color-accent)]">{paper.year}</span>
          {paper.categories.map(cat => (
            <span key={cat} className="flex items-center gap-0.5" style={{ color: categoryColors[cat] }}>
              <span>{categoryIcons[cat]}</span>
              <span className="font-medium">{categoryLabels[cat]}</span>
            </span>
          ))}
          {paper.venue && (
            <span className="font-medium" style={{
              color: venueTier === 'top' ? '#ffd700' : venueTier === 'good' ? '#44aaff' : 'var(--color-text-muted)',
            }}>
              {paper.venue.length > 30 ? paper.venue.slice(0, 30) + '...' : paper.venue}
              {venueTier === 'top' && ' ★'}
            </span>
          )}
          {rec >= 3 && <span className="text-[#ffd700] font-medium">Top-tier</span>}
          {readingStatus === 'read' && <span className="text-[var(--color-accent)]">✓ Read</span>}
          {readingStatus === 'reading' && <span className="text-[var(--color-orange)]">Reading</span>}
          {hasNote && <span className="text-[var(--color-purple)]">📝</span>}
        </div>

        {/* Title */}
        <h2 className="text-base md:text-lg font-bold text-[var(--color-text-primary)] mb-1.5 leading-snug group-hover:text-[var(--color-accent)] transition-colors">
          {paper.system_name && (
            <span className="text-[var(--color-accent)] font-mono mr-1">[{paper.system_name}]</span>
          )}
          {searchQuery ? highlightText(paper.title, searchQuery) : paper.title}
        </h2>

        {/* Summary - compact excerpt */}
        {summary && (
          <p className="text-sm text-[var(--color-text-secondary)] mb-2 line-clamp-2 leading-relaxed">
            {summary}
          </p>
        )}

        {/* Bottom: tags + actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {exp?.llm?.slice(0, 3).map(l => (
            <span key={l} className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--color-purple)]/10 text-[var(--color-purple)] hover:bg-[var(--color-purple)]/20 transition-colors cursor-pointer"
              onClick={e => { e.stopPropagation(); onTagClick?.(l) }}>
              {l}
            </span>
          ))}
          {customTags?.map(tag => (
            <span key={tag.name} className="text-[11px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${tag.color}20`, color: tag.color }}>
              {tag.name}
            </span>
          ))}

          <span className="flex-1" />

          {paper.paperUrl && (
            <a href={paper.paperUrl} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors no-underline">
              PDF ↗
            </a>
          )}
          {paper.codeUrl && (
            <a href={paper.codeUrl} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors no-underline">
              Code ↗
            </a>
          )}
          <span onClick={e => e.stopPropagation()}>
            {onToggleReadingList && (
              <ReadingListButton isInList={isInReadingList ?? false} onToggle={onToggleReadingList} />
            )}
          </span>
        </div>
      </div>
    </article>
  )
}
