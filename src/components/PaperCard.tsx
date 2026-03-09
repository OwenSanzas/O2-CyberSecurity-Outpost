import type { Paper, Language } from '../types'
import type { ReadingStatus } from '../hooks/useReadingProgress'
import type { CustomTag } from '../hooks/useCustomTags'
import ReadingListButton from './ReadingListButton'
import { showToast } from './Toast'

const categoryColors: Record<string, string> = {
  'vulnerability-detection': '#ff4444',
  'fuzzing': '#44aaff',
  'privacy': '#44ff88',
}

const categoryLabels: Record<string, string> = {
  'vulnerability-detection': 'Vulnerability Detection',
  'fuzzing': 'Fuzzing',
  'privacy': 'Privacy',
}

const categoryIcons: Record<string, string> = {
  'vulnerability-detection': '🛡️',
  'fuzzing': '🔧',
  'privacy': '🔒',
}

function getVenueLabel(venue: string): { label: string; tier: 'top' | 'good' | 'normal' } {
  const v = venue.toLowerCase()
  if (v.includes('s&p') || v.includes('oakland') || v.includes('usenix') && v.includes('security') || v.includes('ccs') || v.includes('ndss'))
    return { label: venue.length > 40 ? venue.slice(0, 40) + '...' : venue, tier: 'top' }
  if (v.includes('icse') || v.includes('fse') || v.includes('esec') || v.includes('ase') || v.includes('issta'))
    return { label: venue.length > 40 ? venue.slice(0, 40) + '...' : venue, tier: 'good' }
  return { label: venue.length > 40 ? venue.slice(0, 40) + '...' : venue, tier: 'normal' }
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

export default function PaperCard({ paper, lang, onClick, isInReadingList, onToggleReadingList, isSelected, onSelect, onTagClick, hasNote, searchQuery, readingStatus, customTags }: Props) {
  const mainCategory = paper.categories[0] || 'vulnerability-detection'
  const rec = paper.recommendation ?? 1
  const summary = lang === 'zh' ? (paper.summary_zh || paper.summary) : paper.summary
  const exp = paper.experiment

  const venueInfo = paper.venue ? getVenueLabel(paper.venue) : null
  const isNew = paper.year >= new Date().getFullYear() - 1

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer transition-all duration-200"
    >
      {/* Blog-style entry */}
      <div className="py-6 border-b border-[var(--color-border)] hover:bg-[var(--color-bg-card)]/50 px-4 -mx-4 rounded-lg transition-colors">
        {/* Meta line */}
        <div className="flex items-center gap-2 mb-2 text-xs flex-wrap">
          <span className="font-mono font-bold text-[var(--color-accent)]">{paper.year}</span>
          <span className="text-[var(--color-border)]">·</span>
          {paper.categories.map(cat => (
            <span key={cat} className="flex items-center gap-1" style={{ color: categoryColors[cat] }}>
              <span>{categoryIcons[cat]}</span>
              <span className="font-medium">{categoryLabels[cat] || cat}</span>
            </span>
          ))}
          {venueInfo && (
            <>
              <span className="text-[var(--color-border)]">·</span>
              <span
                className="font-medium"
                style={{
                  color: venueInfo.tier === 'top' ? '#ffd700' : venueInfo.tier === 'good' ? '#44aaff' : 'var(--color-text-muted)',
                }}
              >
                {venueInfo.label}
                {venueInfo.tier === 'top' && ' ★'}
              </span>
            </>
          )}
          {isNew && (
            <>
              <span className="text-[var(--color-border)]">·</span>
              <span className="badge-new text-[var(--color-accent)] font-bold uppercase" style={{ fontSize: '10px' }}>NEW</span>
            </>
          )}
          {rec >= 3 && (
            <>
              <span className="text-[var(--color-border)]">·</span>
              <span className="text-[#ffd700] font-medium">Top-tier</span>
            </>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg md:text-xl font-bold text-[var(--color-text-primary)] mb-2 leading-snug group-hover:text-[var(--color-accent)] transition-colors">
          {paper.system_name && (
            <span className="text-[var(--color-accent)] font-mono mr-1.5">[{paper.system_name}]</span>
          )}
          {searchQuery ? highlightText(paper.title, searchQuery) : paper.title}
        </h2>

        {/* Authors */}
        <p className="text-sm text-[var(--color-text-secondary)] mb-3">
          {paper.authors}
        </p>

        {/* Summary (blog excerpt) */}
        {summary && (
          <p className="text-sm text-[var(--color-text-primary)] leading-relaxed mb-3 opacity-80">
            {summary}
          </p>
        )}

        {/* Key results */}
        {exp?.key_results && (
          <p className="text-xs text-[var(--color-text-secondary)] mb-3 pl-3 border-l-2 border-[var(--color-accent)]/30 italic">
            {exp.key_results}
          </p>
        )}

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* LLMs */}
          {exp?.llm?.map(l => (
            <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-purple)]/10 text-[var(--color-purple)] hover:bg-[var(--color-purple)]/20 transition-colors cursor-pointer"
              onClick={e => { e.stopPropagation(); onTagClick?.(l) }}>
              {l}
            </span>
          ))}
          {/* Languages */}
          {exp?.language?.map(l => (
            <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-blue)]/10 text-[var(--color-blue)] hover:bg-[var(--color-blue)]/20 transition-colors cursor-pointer"
              onClick={e => { e.stopPropagation(); onTagClick?.(l) }}>
              {l}
            </span>
          ))}
          {exp?.fine_tuning && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-orange)]/10 text-[var(--color-orange)]">
              Fine-tuned
            </span>
          )}
          {exp?.open_source && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
              Open Source
            </span>
          )}
          {customTags?.map(tag => (
            <span
              key={tag.name}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${tag.color}20`, color: tag.color }}
            >
              {tag.name}
            </span>
          ))}

          {/* Spacer */}
          <span className="flex-1" />

          {/* Status & Actions */}
          {readingStatus === 'read' && (
            <span className="text-xs text-[var(--color-accent)] font-medium">✓ Read</span>
          )}
          {readingStatus === 'reading' && (
            <span className="text-xs text-[var(--color-orange)] font-medium">Reading</span>
          )}
          {hasNote && (
            <span className="text-xs text-[var(--color-purple)]">📝</span>
          )}

          {/* Quick links */}
          {paper.paperUrl && (
            <a
              href={paper.paperUrl}
              target="_blank"
              rel="noopener"
              onClick={e => e.stopPropagation()}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors no-underline font-medium"
            >
              PDF ↗
            </a>
          )}
          {paper.codeUrl && (
            <a
              href={paper.codeUrl}
              target="_blank"
              rel="noopener"
              onClick={e => e.stopPropagation()}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors no-underline font-medium"
            >
              Code ↗
            </a>
          )}
          <span onClick={e => e.stopPropagation()} className="flex items-center gap-1">
            {onToggleReadingList && (
              <ReadingListButton
                isInList={isInReadingList ?? false}
                onToggle={onToggleReadingList}
              />
            )}
            {onSelect && (
              <label className="flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={onSelect}
                  className="w-3.5 h-3.5 accent-[var(--color-accent)] cursor-pointer"
                  title="Select for comparison"
                />
              </label>
            )}
          </span>
          <button
            onClick={e => {
              e.stopPropagation()
              const url = `${window.location.origin}${window.location.pathname}#paper=${encodeURIComponent(paper.id)}`
              navigator.clipboard.writeText(url)
              showToast('Link copied!')
            }}
            className="text-xs text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer hover:text-[var(--color-accent)]"
            title="Copy link"
          >
            🔗
          </button>
        </div>
      </div>
    </article>
  )
}
