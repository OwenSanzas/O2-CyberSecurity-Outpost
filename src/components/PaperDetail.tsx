import { useEffect, useState } from 'react'
import type { Paper, Language } from '../types'
import type { ReadingStatus } from '../hooks/useReadingProgress'
import type { RelatedPaper } from '../hooks/useRelatedPapers'
import type { CustomTag } from '../hooks/useCustomTags'
import ReadingListButton from './ReadingListButton'
import PaperNotes from './PaperNotes'
import CitationExport from './CitationExport'
import CustomTags from './CustomTags'
import { showToast } from './Toast'

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

const categoryIcons: Record<string, string> = {
  'vulnerability-detection': '🛡️',
  'fuzzing': '🔧',
  'fuzzing-harness': '🎯',
  'patching': '🩹',
  'privacy': '🔒',
}

const recLabel = (level: number) => {
  if (level === 3) return { text: 'TOP-TIER', color: '#ffd700' }
  if (level === 2) return { text: 'QUALITY', color: '#c0c0c0' }
  return { text: 'STANDARD', color: '#888' }
}

interface Props {
  paper: Paper
  lang: Language
  onBack: () => void
  relatedPapers?: RelatedPaper[]
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
  readingStatus?: ReadingStatus
  onReadingStatusChange?: (paperId: string, status: ReadingStatus) => void
  customTags?: CustomTag[]
  allTags?: CustomTag[]
  onToggleTag?: (tagName: string) => void
  onCreateTag?: (name: string) => void
  onDeleteTag?: (name: string) => void
}

export default function PaperDetail({ paper, lang, onBack, relatedPapers, onPaperClick, isInReadingList, onToggleReadingList, onPrev, onNext, currentIndex, totalCount, note, onNoteSave, onAuthorClick, readingStatus, onReadingStatusChange, customTags, allTags, onToggleTag, onCreateTag, onDeleteTag }: Props) {
  const [copiedBib, setCopiedBib] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [paper.id])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isInput = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA'
      if (isInput) return
      if (e.key === 'Escape') onBack()
      if (e.key === 'ArrowLeft' && onPrev) { e.preventDefault(); onPrev() }
      if (e.key === 'ArrowRight' && onNext) { e.preventDefault(); onNext() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onBack, onPrev, onNext])

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
      showToast('BibTeX copied!')
      setTimeout(() => setCopiedBib(false), 2000)
    }
  }

  return (
    <article className="max-w-3xl mx-auto px-4 pt-6 pb-16">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors bg-transparent border-none cursor-pointer"
        >
          ← Back to papers
        </button>
        <div className="flex items-center gap-2">
          {onReadingStatusChange && (
            <select
              value={readingStatus || 'unread'}
              onChange={e => onReadingStatusChange(paper.id, e.target.value as ReadingStatus)}
              className="text-xs px-2 py-1 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] cursor-pointer"
              style={{ color: readingStatus === 'read' ? 'var(--color-accent)' : readingStatus === 'reading' ? 'var(--color-orange)' : 'var(--color-text-muted)' }}
            >
              <option value="unread">Unread</option>
              <option value="reading">Reading</option>
              <option value="read">Read</option>
            </select>
          )}
          {onToggleReadingList && (
            <ReadingListButton isInList={isInReadingList ?? false} onToggle={onToggleReadingList} size="md" />
          )}
          {onPrev && (
            <button onClick={onPrev} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/30 transition-all cursor-pointer" title="Previous (←)">←</button>
          )}
          {currentIndex !== undefined && totalCount !== undefined && (
            <span className="text-xs text-[var(--color-text-muted)] font-mono">{currentIndex + 1}/{totalCount}</span>
          )}
          {onNext && (
            <button onClick={onNext} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/30 transition-all cursor-pointer" title="Next (→)">→</button>
          )}
        </div>
      </div>

      {/* Category + meta */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {paper.categories.map(cat => (
          <span key={cat} className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: `${categoryColors[cat]}15`, color: categoryColors[cat] }}>
            {categoryIcons[cat]} {categoryLabels[cat] || cat}
          </span>
        ))}
        <span className="text-xs font-mono font-bold text-[var(--color-accent)]">{paper.year}</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
          style={{ border: `1px solid ${recInfo.color}`, color: recInfo.color }}>
          {'⭐'.repeat(rec)} {recInfo.text}
        </span>
        {paper.venue && (
          <span className="text-xs px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)]">{paper.venue}</span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] leading-snug mb-4"
        style={{ borderLeft: `4px solid ${categoryColors[mainCat]}`, paddingLeft: '16px' }}>
        {paper.system_name && <span className="text-[var(--color-accent)] font-mono mr-2">[{paper.system_name}]</span>}
        {paper.title}
      </h1>

      {/* Authors */}
      <p className="text-sm text-[var(--color-text-secondary)] mb-6 pl-5">
        {paper.authors.split(/, | and /).map((author, i, arr) => (
          <span key={i}>
            <span className="hover:text-[var(--color-accent)] cursor-pointer transition-colors underline decoration-dotted decoration-[var(--color-border)] underline-offset-2"
              onClick={() => onAuthorClick?.(author.trim())} title={`Search for "${author.trim()}"`}>
              {author.trim()}
            </span>
            {i < arr.length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>

      {/* Resource chips */}
      {(paper.codeUrl || paper.slidesUrl || paper.talkUrl || exp?.fine_tuning) && (
        <div className="flex flex-wrap gap-1.5 mb-8 pl-5">
          {paper.codeUrl && <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">Open Source</span>}
          {paper.slidesUrl && <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-blue)]/10 text-[var(--color-blue)]">Slides</span>}
          {paper.talkUrl && <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-purple)]/10 text-[var(--color-purple)]">Talk Video</span>}
          {exp?.fine_tuning && <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-orange)]/10 text-[var(--color-orange)]">Fine-tuned</span>}
        </div>
      )}

      {/* TL;DR */}
      {summary && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">TL;DR</h2>
          <div className="bg-[var(--color-bg-card)] px-5 py-4 rounded-xl border-l-3 border-[var(--color-accent)]/50">
            <p className="text-base text-[var(--color-text-primary)] leading-relaxed">{summary}</p>
          </div>
        </section>
      )}

      {/* Key Contributions */}
      {contributions && contributions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Key Contributions</h2>
          <ul className="space-y-3">
            {contributions.map((c, i) => (
              <li key={i} className="text-sm text-[var(--color-text-secondary)] flex gap-3 leading-relaxed">
                <span className="text-[var(--color-accent)] shrink-0 mt-0.5 font-bold">{i + 1}.</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Key Results */}
      {exp?.key_results && (
        <section className="mb-8">
          <div className="bg-[var(--color-accent)]/5 px-5 py-4 rounded-xl border border-[var(--color-accent)]/10">
            <h2 className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wider mb-2">Key Results</h2>
            <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">{exp.key_results}</p>
          </div>
        </section>
      )}

      {/* Real-World Impact */}
      {exp?.real_world_impact && (
        <section className="mb-8">
          <div className="bg-[var(--color-red)]/5 px-5 py-4 rounded-xl border border-[var(--color-red)]/10">
            <h2 className="text-xs font-semibold text-[var(--color-red)] uppercase tracking-wider mb-2">Real-World Impact</h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{exp.real_world_impact}</p>
          </div>
        </section>
      )}

      {/* Experiment Details */}
      {exp && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Experiment Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {exp.llm && exp.llm.length > 0 && (
              <div className="bg-[var(--color-bg-card)] px-4 py-3 rounded-xl">
                <div className="text-xs text-[var(--color-text-muted)] mb-1">LLM</div>
                <div className="text-sm text-[var(--color-purple)] font-medium">{exp.llm.join(', ')}</div>
              </div>
            )}
            {exp.model_family && exp.model_family.length > 0 && (
              <div className="bg-[var(--color-bg-card)] px-4 py-3 rounded-xl">
                <div className="text-xs text-[var(--color-text-muted)] mb-1">Model Family</div>
                <div className="text-sm text-[var(--color-purple)] font-medium">{exp.model_family.join(', ')}</div>
              </div>
            )}
            {exp.language && exp.language.length > 0 && (
              <div className="bg-[var(--color-bg-card)] px-4 py-3 rounded-xl">
                <div className="text-xs text-[var(--color-text-muted)] mb-1">Language</div>
                <div className="text-sm text-[var(--color-blue)] font-medium">{exp.language.join(', ')}</div>
              </div>
            )}
            {exp.platform && exp.platform.length > 0 && (
              <div className="bg-[var(--color-bg-card)] px-4 py-3 rounded-xl">
                <div className="text-xs text-[var(--color-text-muted)] mb-1">Platform</div>
                <div className="text-sm text-[var(--color-text-secondary)] font-medium">{exp.platform.join(', ')}</div>
              </div>
            )}
            {exp.target_domain && exp.target_domain.length > 0 && (
              <div className="bg-[var(--color-bg-card)] px-4 py-3 rounded-xl">
                <div className="text-xs text-[var(--color-text-muted)] mb-1">Target Domain</div>
                <div className="text-sm text-[var(--color-text-secondary)] font-medium">{exp.target_domain.join(', ')}</div>
              </div>
            )}
            {exp.dataset && exp.dataset.length > 0 && (
              <div className="bg-[var(--color-bg-card)] px-4 py-3 rounded-xl">
                <div className="text-xs text-[var(--color-text-muted)] mb-1">Dataset</div>
                <div className="text-sm text-[var(--color-green)] font-medium">{exp.dataset.join(', ')}</div>
              </div>
            )}
            {exp.vulnerability_type && exp.vulnerability_type.length > 0 && (
              <div className="bg-[var(--color-bg-card)] px-4 py-3 rounded-xl col-span-2 md:col-span-3">
                <div className="text-xs text-[var(--color-text-muted)] mb-1">Vulnerability Types</div>
                <div className="text-sm text-[var(--color-red)] font-medium">{exp.vulnerability_type.join(', ')}</div>
              </div>
            )}
            {exp.fine_tuning && (
              <div className="bg-[var(--color-bg-card)] px-4 py-3 rounded-xl">
                <div className="text-xs text-[var(--color-text-muted)] mb-1">Fine-tuning</div>
                <div className="text-sm text-[var(--color-orange)] font-medium">Yes{exp.fine_tuning_method ? ` (${exp.fine_tuning_method})` : ''}</div>
              </div>
            )}
            {exp.model_size && exp.model_size.length > 0 && (
              <div className="bg-[var(--color-bg-card)] px-4 py-3 rounded-xl">
                <div className="text-xs text-[var(--color-text-muted)] mb-1">Model Size</div>
                <div className="text-sm text-[var(--color-text-secondary)] font-medium">{exp.model_size.join(', ')}</div>
              </div>
            )}
            {exp.baselines && exp.baselines.length > 0 && (
              <div className="bg-[var(--color-bg-card)] px-4 py-3 rounded-xl col-span-2 md:col-span-3">
                <div className="text-xs text-[var(--color-text-muted)] mb-1">Baselines</div>
                <div className="text-sm text-[var(--color-text-secondary)] font-medium">{exp.baselines.join(', ')}</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Abstract */}
      {abstract && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Abstract</h2>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{abstract}</p>
        </section>
      )}

      {/* Action links */}
      <section className="mb-8 pt-6 border-t border-[var(--color-border)]">
        <div className="flex gap-2 flex-wrap">
          {paper.paperUrl && (
            <a href={paper.paperUrl} target="_blank" rel="noopener"
              className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 transition-all no-underline font-medium">
              Read Paper ↗
            </a>
          )}
          {paper.codeUrl && (
            <a href={paper.codeUrl} target="_blank" rel="noopener"
              className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/30 transition-all no-underline">
              Source Code ↗
            </a>
          )}
          {paper.slidesUrl && (
            <a href={paper.slidesUrl} target="_blank" rel="noopener"
              className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/30 transition-all no-underline">
              Slides ↗
            </a>
          )}
          {paper.talkUrl && (
            <a href={paper.talkUrl} target="_blank" rel="noopener"
              className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/30 transition-all no-underline">
              Talk ↗
            </a>
          )}
          {paper.bibtex && (
            <button onClick={copyBibtex}
              className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/30 transition-all cursor-pointer">
              {copiedBib ? 'Copied!' : 'Copy BibTeX'}
            </button>
          )}
          <button
            onClick={() => {
              const url = `${window.location.origin}${window.location.pathname}#paper=${encodeURIComponent(paper.id)}`
              navigator.clipboard.writeText(url)
              showToast('Paper link copied!')
            }}
            className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/30 transition-all cursor-pointer">
            Share Link
          </button>
        </div>
      </section>

      {/* Custom Tags */}
      {onToggleTag && onCreateTag && onDeleteTag && (
        <section className="mb-8 pt-6 border-t border-[var(--color-border)]">
          <CustomTags paperTags={customTags || []} allTags={allTags || []} onToggleTag={onToggleTag} onCreateTag={onCreateTag} onDeleteTag={onDeleteTag} />
        </section>
      )}

      {/* Citation Export */}
      <section className="mb-8 pt-6 border-t border-[var(--color-border)]">
        <CitationExport paper={paper} />
      </section>

      {/* Personal notes */}
      {onNoteSave && (
        <section className="mb-8 pt-6 border-t border-[var(--color-border)]">
          <PaperNotes paperId={paper.id} note={note || ''} onSave={onNoteSave} />
        </section>
      )}

      {/* Related papers */}
      {relatedPapers && relatedPapers.length > 0 && (
        <section className="mb-8 pt-6 border-t border-[var(--color-border)]">
          <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Related Papers</h2>
          <div className="space-y-3">
            {relatedPapers.map(({ paper: rp, score }) => (
              <div key={rp.id} onClick={() => onPaperClick?.(rp)}
                className="bg-[var(--color-bg-card)] rounded-xl p-4 cursor-pointer hover:border-[var(--color-accent)]/30 transition-all group border border-[var(--color-border)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[var(--color-accent)]">{rp.year}</span>
                  {rp.categories.map(cat => (
                    <span key={cat} className="text-xs" style={{ color: categoryColors[cat] }}>{categoryIcons[cat]} {categoryLabels[cat]}</span>
                  ))}
                  <span className="ml-auto text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                    style={{
                      background: score >= 80 ? 'rgba(0,255,136,0.15)' : score >= 50 ? 'rgba(255,170,0,0.15)' : 'rgba(255,255,255,0.06)',
                      color: score >= 80 ? 'var(--color-accent)' : score >= 50 ? 'var(--color-orange)' : 'var(--color-text-muted)',
                    }}>
                    {score}% match
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors leading-relaxed">
                  {rp.system_name && <span className="font-mono font-bold text-[var(--color-accent)] mr-1">[{rp.system_name}]</span>}
                  {rp.title}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom nav */}
      <div className="flex items-center justify-between pt-8 border-t border-[var(--color-border)]">
        <button onClick={onBack} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors bg-transparent border-none cursor-pointer">
          ← Back to papers
        </button>
        <div className="flex items-center gap-3">
          {onPrev && <button onClick={onPrev} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors bg-transparent border-none cursor-pointer">← Previous</button>}
          {onNext && <button onClick={onNext} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors bg-transparent border-none cursor-pointer">Next →</button>}
        </div>
      </div>
    </article>
  )
}
