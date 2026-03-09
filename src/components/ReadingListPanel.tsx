import { useState } from 'react'
import type { Paper, Language } from '../types'

interface Props {
  papers: Paper[]
  lang: Language
  readingListIds: string[]
  onPaperClick: (p: Paper) => void
  onRemove: (id: string) => void
  onClear: () => void
}

export default function ReadingListPanel({ papers, lang, readingListIds, onPaperClick, onRemove, onClear }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const items = papers.filter(p => readingListIds.includes(p.id))

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
                items.map(paper => {
                  const summary = lang === 'zh' ? (paper.summary_zh || paper.summary) : paper.summary
                  return (
                    <div
                      key={paper.id}
                      className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-3 cursor-pointer hover:border-[var(--color-border-hover)] transition-all group"
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
