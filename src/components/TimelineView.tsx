import type { Paper, Language } from '../types'
import ReadingListButton from './ReadingListButton'

const categoryColors: Record<string, string> = {
  'vulnerability-detection': '#ff4444',
  'fuzzing': '#44aaff',
  'fuzzing-harness': '#ffaa44',
  'patching': '#aa66ff',
  'privacy': '#44ff88',
}

interface Props {
  papers: Paper[]
  lang: Language
  onPaperClick: (p: Paper) => void
  isInReadingList?: (id: string) => boolean
  onToggleReadingList?: (id: string) => void
}

export default function TimelineView({ papers, lang, onPaperClick, isInReadingList, onToggleReadingList }: Props) {
  // Group by year
  const grouped = papers.reduce<Record<number, Paper[]>>((acc, p) => {
    ;(acc[p.year] = acc[p.year] || []).push(p)
    return acc
  }, {})

  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a)

  return (
    <div className="relative">
      {/* Center line */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-[var(--color-border)]" />

      {years.map((year) => (
        <div key={year} className="mb-8">
          {/* Year marker */}
          <div className="relative flex items-center mb-4">
            <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[var(--color-bg-primary)] border-2 border-[var(--color-accent)] flex items-center justify-center z-10">
              <span className="text-xs font-mono font-bold text-[var(--color-accent)]">{year}</span>
            </div>
            <div className="ml-20 md:ml-0 md:text-center w-full">
              <span className="text-sm text-[var(--color-text-muted)]">
                {grouped[year].length} paper{grouped[year].length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Papers */}
          <div className="space-y-3">
            {grouped[year].map((paper, pi) => {
              const isLeft = pi % 2 === 0
              const mainCat = paper.categories[0] || 'vulnerability-detection'
              const summary = lang === 'zh' ? (paper.summary_zh || paper.summary) : paper.summary

              return (
                <div
                  key={paper.id}
                  className={`relative flex ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Connector dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 w-3 h-3 rounded-full z-10"
                    style={{ background: categoryColors[mainCat] || '#888' }} />

                  {/* Spacer */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Card */}
                  <div
                    className={`ml-14 md:ml-0 ${isLeft ? 'md:pl-8' : 'md:pr-8'} md:w-1/2`}
                  >
                    <div
                      onClick={() => onPaperClick(paper)}
                      className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4 cursor-pointer hover:border-[var(--color-border-hover)] hover:translate-y-[-1px] transition-all group"
                      style={{ borderLeftColor: categoryColors[mainCat], borderLeftWidth: '3px' }}
                    >
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {paper.system_name && (
                          <span className="text-xs font-mono font-bold text-[var(--color-accent)]">[{paper.system_name}]</span>
                        )}
                        <span className="text-xs">{'⭐'.repeat(paper.recommendation ?? 1)}</span>
                        {paper.venue && (
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {paper.venue.length > 25 ? paper.venue.slice(0, 25) + '...' : paper.venue}
                          </span>
                        )}
                        {onToggleReadingList && (
                          <span className="ml-auto" onClick={e => e.stopPropagation()}>
                            <ReadingListButton
                              isInList={isInReadingList?.(paper.id) ?? false}
                              onToggle={() => onToggleReadingList(paper.id)}
                            />
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-white transition-colors mb-1">
                        {paper.title.length > 100 ? paper.title.slice(0, 100) + '...' : paper.title}
                      </p>
                      {summary && (
                        <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">{summary}</p>
                      )}
                      {paper.experiment?.llm && paper.experiment.llm.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {paper.experiment.llm.slice(0, 3).map(l => (
                            <span key={l} className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-purple)]/10 text-[var(--color-purple)]">
                              {l}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
