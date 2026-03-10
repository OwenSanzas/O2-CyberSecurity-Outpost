import { useState, useMemo } from 'react'
import type { Paper, Language } from '../types'

const categoryColors: Record<string, string> = {
  'vulnerability-detection': '#ff4444',
  'fuzzing': '#44aaff',
  'fuzzing-harness': '#ffaa44',
  'patching': '#aa66ff',
  'privacy': '#44ff88',
}

const categoryLabels: Record<string, string> = {
  'vulnerability-detection': 'Vulnerability Detection',
  'fuzzing': 'LLM Fuzzing',
  'fuzzing-harness': 'Harness Generation',
  'patching': 'LLM Patching',
  'privacy': 'Data Privacy',
}

interface Props {
  papers: Paper[]
  lang: Language
  readingListIds: string[]
  onPaperClick: (p: Paper) => void
  onRemove: (id: string) => void
  onClear: () => void
  notes?: Record<string, string>
}

export default function ReadingListPanel({ papers, lang, readingListIds, onPaperClick, onRemove, onClear, notes }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const items = papers.filter(p => readingListIds.includes(p.id))

  const groupedItems = useMemo(() => {
    const groups: Record<string, Paper[]> = {}
    for (const paper of items) {
      const cat = paper.categories[0] || 'other'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(paper)
    }
    // Sort groups: known categories first (by label), then unknown ones
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const la = categoryLabels[a] || a
      const lb = categoryLabels[b] || b
      return la.localeCompare(lb)
    })
    return sortedKeys.map(key => ({ category: key, papers: groups[key] }))
  }, [items])

  if (readingListIds.length === 0) return null

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-accent)]/30 text-[var(--color-accent)] cursor-pointer shadow-lg shadow-black/30 hover:border-[var(--color-accent)]/60 transition-all"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      >
        <span>🔖</span>
        <span className="text-sm font-medium">Reading List ({readingListIds.length})</span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setIsOpen(false)}>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md h-full bg-[var(--color-bg-primary)] border-l border-[var(--color-border)] overflow-y-auto"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'slideInRight 0.3s ease-out' }}
          >
            <div className="sticky top-0 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)] p-4 flex items-center justify-between z-10">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                🔖 Reading List ({items.length})
              </h3>
              <div className="flex gap-2">
                {items.length > 0 && (
                  <button
                    onClick={() => {
                      const bibtex = items.filter(p => p.bibtex).map(p => p.bibtex).join('\n\n')
                      if (!bibtex) return
                      const blob = new Blob([bibtex], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `reading-list-${items.length}.bib`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="text-xs text-[var(--color-accent)] bg-transparent border-none cursor-pointer hover:underline"
                  >
                    Export BibTeX
                  </button>
                )}
                {items.length > 0 && notes && Object.keys(notes).some(id => readingListIds.includes(id)) && (
                  <button
                    onClick={() => {
                      const lines = items.map(p => {
                        const note = notes[p.id]
                        return `## ${p.title}\n${p.authors} (${p.year})\n${p.paperUrl ? p.paperUrl : ''}${note ? `\n\n**My Notes:** ${note}` : ''}\n\n---\n`
                      })
                      const md = `# Reading List with Notes\n\n${lines.join('\n')}`
                      const blob = new Blob([md], { type: 'text/markdown' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `reading-list-notes-${items.length}.md`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="text-xs text-[var(--color-orange)] bg-transparent border-none cursor-pointer hover:underline"
                  >
                    Export Notes
                  </button>
                )}
                {items.length > 0 && (
                  <button
                    onClick={onClear}
                    className="text-xs text-[var(--color-red)] bg-transparent border-none cursor-pointer hover:underline"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] bg-transparent border-none cursor-pointer text-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
                  Your reading list is empty. Click the bookmark icon on papers to add them.
                </p>
              ) : (
                groupedItems.map(({ category, papers: groupPapers }) => {
                  const color = categoryColors[category] || '#888'
                  const label = categoryLabels[category] || category
                  return (
                    <div key={category} className="mb-4">
                      {/* Category group header */}
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: color }}
                        />
                        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                          {label}
                        </span>
                        <span
                          className="text-[10px] font-bold leading-none px-1.5 py-0.5 rounded-full"
                          style={{ background: `${color}20`, color }}
                        >
                          {groupPapers.length}
                        </span>
                      </div>
                      {/* Papers in this category */}
                      <div className="space-y-2">
                        {groupPapers.map(paper => {
                          const summary = lang === 'zh' ? (paper.summary_zh || paper.summary) : paper.summary
                          return (
                            <div
                              key={paper.id}
                              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-3 cursor-pointer hover:border-[var(--color-border-hover)] transition-all group"
                              style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex-1 min-w-0" onClick={() => { onPaperClick(paper); setIsOpen(false) }}>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono text-[var(--color-accent)]">{paper.year}</span>
                                    {paper.system_name && (
                                      <span className="text-xs font-mono font-bold text-[var(--color-accent)]">[{paper.system_name}]</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-[var(--color-text-primary)] font-medium truncate group-hover:text-white transition-colors">
                                    {paper.title}
                                  </p>
                                  {summary && (
                                    <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">{summary}</p>
                                  )}
                                  {notes?.[paper.id] && (
                                    <p className="text-xs text-[var(--color-orange)] mt-1 line-clamp-1">Note: {notes[paper.id]}</p>
                                  )}
                                </div>
                                <button
                                  onClick={() => onRemove(paper.id)}
                                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-red)] bg-transparent border-none cursor-pointer shrink-0 p-1"
                                  title="Remove"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}
