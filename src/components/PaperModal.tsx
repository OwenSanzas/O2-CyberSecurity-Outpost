import { useEffect, useState, useRef } from 'react'
import type { Paper, Language } from '../types'
import ReadingListButton from './ReadingListButton'
import PaperNotes from './PaperNotes'

const categoryColors: Record<string, string> = {
  'vulnerability-detection': '#ff4444',
  'fuzzing': '#44aaff',
  'privacy': '#44ff88',
}

const categoryLabels: Record<string, string> = {
  'vulnerability-detection': 'Vulnerability Detection',
  'fuzzing': 'LLM Fuzzing',
  'privacy': 'Data Privacy',
}

const recLabel = (level: number) => {
  if (level === 3) return { text: 'TOP-TIER', color: '#ffd700' }
  if (level === 2) return { text: 'QUALITY', color: '#c0c0c0' }
  return { text: 'STANDARD', color: '#888' }
}

interface Props {
  paper: Paper
  lang: Language
  onClose: () => void
  relatedPapers?: Paper[]
  onPaperClick?: (p: Paper) => void
  isInReadingList?: boolean
  onToggleReadingList?: () => void
  onPrev?: () => void
  onNext?: () => void
  currentIndex?: number
  totalCount?: number
  note?: string
  onNoteSave?: (paperId: string, text: string) => void
  onAuthorClick?: (author: string) => void
}

export default function PaperModal({ paper, lang, onClose, relatedPapers, onPaperClick, isInReadingList, onToggleReadingList, onPrev, onNext, currentIndex, totalCount, note, onNoteSave, onAuthorClick }: Props) {
  const [copiedBib, setCopiedBib] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'experiment' | 'abstract'>('overview')
  const touchStartRef = useRef<number>(0)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
      if (e.key === 'ArrowRight' && onNext) onNext()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  useEffect(() => {
    setActiveTab('overview')
    setCopiedBib(false)
    // Scroll modal content to top when paper changes
    const modalContent = document.querySelector('[data-modal-content]')
    if (modalContent) modalContent.scrollTop = 0
  }, [paper.id])

  const summary = lang === 'zh' ? (paper.summary_zh || paper.summary) : paper.summary
  const contributions = lang === 'zh' ? (paper.contributions_zh || paper.contributions) : paper.contributions
  const abstract = lang === 'zh' ? (paper.abstract_zh || paper.abstract) : paper.abstract
  const exp = paper.experiment
  const rec = paper.recommendation ?? 1
  const recInfo = recLabel(rec)
  const mainCat = paper.categories[0] || 'vulnerability-detection'

  const copyBibtex = () => {
    if (paper.bibtex) {
      navigator.clipboard.writeText(paper.bibtex)
      setCopiedBib(true)
      setTimeout(() => setCopiedBib(false), 2000)
    }
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'experiment' as const, label: 'Experiment', show: !!exp },
    { id: 'abstract' as const, label: 'Abstract' },
  ].filter(t => t.show !== false)

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 px-4 overflow-y-auto"
      onClick={onClose}
      data-modal-content
      onTouchStart={e => { touchStartRef.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        const diff = e.changedTouches[0].clientX - touchStartRef.current
        if (Math.abs(diff) > 80) {
          if (diff > 0 && onPrev) onPrev()
          if (diff < 0 && onNext) onNext()
        }
      }}
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-3xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{
          borderTopColor: categoryColors[mainCat],
          borderTopWidth: '3px',
          animation: 'modalIn 0.25s ease-out',
        }}
      >
        {/* Navigation + Close + Reading List */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          {onPrev && (
            <button onClick={onPrev} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-all border-none cursor-pointer" title="Previous (←)">
              ←
            </button>
          )}
          {currentIndex !== undefined && totalCount !== undefined && (
            <span className="text-xs text-[var(--color-text-muted)] font-mono">{currentIndex + 1}/{totalCount}</span>
          )}
          {onNext && (
            <button onClick={onNext} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-all border-none cursor-pointer" title="Next (→)">
              →
            </button>
          )}
        </div>
        <div className="absolute top-14 right-4 flex items-center gap-2 z-10">
          {onToggleReadingList && (
            <ReadingListButton
              isInList={isInReadingList ?? false}
              onToggle={onToggleReadingList}
              size="md"
            />
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-all border-none cursor-pointer text-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-6 md:p-8">
          {/* Header meta */}
          <div className="flex items-center gap-2 mb-3 flex-wrap pr-20">
            <span className="text-xs font-mono font-bold text-[var(--color-accent)]">{paper.year}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
              style={{ border: `1px solid ${recInfo.color}`, color: recInfo.color }}
            >
              {'⭐'.repeat(rec)} {recInfo.text}
            </span>
            {paper.venue && (
              <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                {paper.venue}
              </span>
            )}
            {paper.categories.map(cat => (
              <span key={cat} className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: `${categoryColors[cat]}15`, color: categoryColors[cat] }}>
                {categoryLabels[cat] || cat}
              </span>
            ))}
          </div>

          {/* System name + Title */}
          <div className="mb-3">
            {paper.system_name && (
              <span className="text-lg font-mono font-bold text-[var(--color-accent)] mr-2">
                [{paper.system_name}]
              </span>
            )}
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] inline leading-snug">
              {paper.title}
            </h2>
          </div>

          {/* Authors (clickable) */}
          <p className="text-sm text-[var(--color-text-secondary)] mb-2">
            {paper.authors.split(/, | and /).map((author, i, arr) => (
              <span key={i}>
                <span
                  className="hover:text-[var(--color-accent)] cursor-pointer transition-colors"
                  onClick={() => onAuthorClick?.(author.trim())}
                  title={`Search for "${author.trim()}"`}
                >
                  {author.trim()}
                </span>
                {i < arr.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>

          {/* Quick info chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {paper.codeUrl && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                Open Source
              </span>
            )}
            {paper.slidesUrl && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-blue)]/10 text-[var(--color-blue)]">
                Slides Available
              </span>
            )}
            {paper.talkUrl && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-purple)]/10 text-[var(--color-purple)]">
                Talk Video
              </span>
            )}
          </div>

          {/* Tab navigation */}
          <div className="flex gap-0.5 bg-[var(--color-bg-card)] rounded-lg p-0.5 border border-[var(--color-border)] mb-5 w-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border-none"
                style={{
                  background: activeTab === tab.id ? 'rgba(0,255,136,0.1)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && (
            <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
              {/* Summary */}
              {summary && (
                <div className="mb-5 bg-white/[0.03] px-4 py-3 rounded-lg border-l-3 border-[var(--color-accent)]/40">
                  <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">TL;DR</div>
                  <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">{summary}</p>
                </div>
              )}

              {/* Contributions */}
              {contributions && contributions.length > 0 && (
                <div className="mb-5">
                  <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Key Contributions</div>
                  <ul className="space-y-2">
                    {contributions.map((c, i) => (
                      <li key={i} className="text-sm text-[var(--color-text-secondary)] flex gap-2 leading-relaxed">
                        <span className="text-[var(--color-accent)] shrink-0 mt-0.5">▸</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick experiment summary */}
              {exp && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {exp.llm?.map(l => (
                    <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-purple)]/10 text-[var(--color-purple)]">
                      {l}
                    </span>
                  ))}
                  {exp.language?.map(l => (
                    <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-blue)]/10 text-[var(--color-blue)]">
                      {l}
                    </span>
                  ))}
                  {exp.fine_tuning && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-orange)]/10 text-[var(--color-orange)]">
                      Fine-tuned
                    </span>
                  )}
                </div>
              )}

              {exp?.key_results && (
                <div className="bg-[var(--color-accent)]/5 px-3 py-2 rounded-lg text-sm mb-3">
                  <span className="text-[var(--color-accent)] font-semibold">Key Results: </span>
                  <span className="text-[var(--color-text-secondary)]">{exp.key_results}</span>
                </div>
              )}
              {exp?.real_world_impact && (
                <div className="bg-[var(--color-red)]/5 px-3 py-2 rounded-lg text-sm">
                  <span className="text-[var(--color-red)] font-semibold">Real-World Impact: </span>
                  <span className="text-[var(--color-text-secondary)]">{exp.real_world_impact}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'experiment' && exp && (
            <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {exp.llm && exp.llm.length > 0 && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg">
                    <span className="text-xs text-[var(--color-text-muted)]">LLM</span>
                    <div className="text-[var(--color-purple)] font-medium">{exp.llm.join(', ')}</div>
                  </div>
                )}
                {exp.model_family && exp.model_family.length > 0 && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg">
                    <span className="text-xs text-[var(--color-text-muted)]">Model Family</span>
                    <div className="text-[var(--color-purple)] font-medium">{exp.model_family.join(', ')}</div>
                  </div>
                )}
                {exp.language && exp.language.length > 0 && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg">
                    <span className="text-xs text-[var(--color-text-muted)]">Language</span>
                    <div className="text-[var(--color-blue)] font-medium">{exp.language.join(', ')}</div>
                  </div>
                )}
                {exp.platform && exp.platform.length > 0 && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg">
                    <span className="text-xs text-[var(--color-text-muted)]">Platform</span>
                    <div className="text-[var(--color-text-secondary)] font-medium">{exp.platform.join(', ')}</div>
                  </div>
                )}
                {exp.target_domain && exp.target_domain.length > 0 && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg">
                    <span className="text-xs text-[var(--color-text-muted)]">Target Domain</span>
                    <div className="text-[var(--color-text-secondary)] font-medium">{exp.target_domain.join(', ')}</div>
                  </div>
                )}
                {exp.dataset && exp.dataset.length > 0 && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg">
                    <span className="text-xs text-[var(--color-text-muted)]">Dataset</span>
                    <div className="text-[var(--color-green)] font-medium">{exp.dataset.join(', ')}</div>
                  </div>
                )}
                {exp.vulnerability_type && exp.vulnerability_type.length > 0 && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg col-span-2">
                    <span className="text-xs text-[var(--color-text-muted)]">Vulnerability Types</span>
                    <div className="text-[var(--color-red)] font-medium">{exp.vulnerability_type.join(', ')}</div>
                  </div>
                )}
                {exp.fine_tuning && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg">
                    <span className="text-xs text-[var(--color-text-muted)]">Fine-tuning</span>
                    <div className="text-[var(--color-orange)] font-medium">Yes{exp.fine_tuning_method ? ` (${exp.fine_tuning_method})` : ''}</div>
                  </div>
                )}
                {exp.model_size && exp.model_size.length > 0 && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg">
                    <span className="text-xs text-[var(--color-text-muted)]">Model Size</span>
                    <div className="text-[var(--color-text-secondary)] font-medium">{exp.model_size.join(', ')}</div>
                  </div>
                )}
                {exp.fuzzer && exp.fuzzer.length > 0 && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg">
                    <span className="text-xs text-[var(--color-text-muted)]">Fuzzer</span>
                    <div className="text-[var(--color-text-secondary)] font-medium">{exp.fuzzer.join(', ')}</div>
                  </div>
                )}
                {exp.static_tool && exp.static_tool.length > 0 && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg">
                    <span className="text-xs text-[var(--color-text-muted)]">Static Tools</span>
                    <div className="text-[var(--color-text-secondary)] font-medium">{exp.static_tool.join(', ')}</div>
                  </div>
                )}
                {exp.baselines && exp.baselines.length > 0 && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg col-span-2">
                    <span className="text-xs text-[var(--color-text-muted)]">Baselines</span>
                    <div className="text-[var(--color-text-secondary)] font-medium">{exp.baselines.join(', ')}</div>
                  </div>
                )}
                {exp.benchmark_size && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg">
                    <span className="text-xs text-[var(--color-text-muted)]">Benchmark Size</span>
                    <div className="text-[var(--color-text-secondary)] font-medium">{exp.benchmark_size}</div>
                  </div>
                )}
                {exp.cost && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg">
                    <span className="text-xs text-[var(--color-text-muted)]">Cost</span>
                    <div className="text-[var(--color-text-secondary)] font-medium">{exp.cost}</div>
                  </div>
                )}
              </div>
              {exp.key_results && (
                <div className="mt-3 bg-[var(--color-accent)]/5 px-3 py-2 rounded-lg text-sm">
                  <span className="text-[var(--color-accent)] font-semibold">Key Results: </span>
                  <span className="text-[var(--color-text-secondary)]">{exp.key_results}</span>
                </div>
              )}
              {exp.real_world_impact && (
                <div className="mt-2 bg-[var(--color-red)]/5 px-3 py-2 rounded-lg text-sm">
                  <span className="text-[var(--color-red)] font-semibold">Real-World Impact: </span>
                  <span className="text-[var(--color-text-secondary)]">{exp.real_world_impact}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'abstract' && (
            <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{abstract}</p>
            </div>
          )}

          {/* Action links */}
          <div className="flex gap-2 flex-wrap pt-5 mt-5 border-t border-[var(--color-border)]">
            {paper.paperUrl && (
              <a href={paper.paperUrl} target="_blank" rel="noopener"
                className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 transition-all no-underline font-medium">
                Read Paper
              </a>
            )}
            {paper.codeUrl && (
              <a href={paper.codeUrl} target="_blank" rel="noopener"
                className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-all no-underline">
                Source Code
              </a>
            )}
            {paper.slidesUrl && (
              <a href={paper.slidesUrl} target="_blank" rel="noopener"
                className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-all no-underline">
                Slides
              </a>
            )}
            {paper.talkUrl && (
              <a href={paper.talkUrl} target="_blank" rel="noopener"
                className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-all no-underline">
                Talk
              </a>
            )}
            {paper.bibtex && (
              <button
                onClick={copyBibtex}
                className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-all border-none cursor-pointer"
              >
                {copiedBib ? 'Copied!' : 'Copy BibTeX'}
              </button>
            )}
            <a
              href={`https://github.com/OwenSanzas/O2-CyberSecurity-Outpost/issues/new?title=${encodeURIComponent(`[Paper] ${paper.title}`)}&body=${encodeURIComponent(`Paper: ${paper.title}\nID: ${paper.id}\n\nIssue description:\n`)}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-white/5 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-white/10 transition-all no-underline"
            >
              Report Issue
            </a>
          </div>

          {/* Personal notes */}
          {onNoteSave && (
            <div className="mt-5 pt-5 border-t border-[var(--color-border)]">
              <PaperNotes paperId={paper.id} note={note || ''} onSave={onNoteSave} />
            </div>
          )}

          {/* Related papers */}
          {relatedPapers && relatedPapers.length > 0 && (
            <div className="mt-5 pt-5 border-t border-[var(--color-border)]">
              <h4 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Related Papers</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {relatedPapers.map(rp => (
                  <div
                    key={rp.id}
                    onClick={() => onPaperClick?.(rp)}
                    className="bg-white/[0.02] rounded-lg p-3 cursor-pointer hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-[var(--color-accent)]">{rp.year}</span>
                      {rp.system_name && (
                        <span className="text-xs font-mono font-bold text-[var(--color-accent)]">[{rp.system_name}]</span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors line-clamp-2">
                      {rp.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
