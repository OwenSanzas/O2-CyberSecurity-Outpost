import { useEffect, useState } from 'react'
import type { Paper, Language } from '../types'

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

export default function PaperModal({ paper, lang, onClose }: { paper: Paper; lang: Language; onClose: () => void }) {
  const [copiedBib, setCopiedBib] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-12 px-4 overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-3xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{
          borderTopColor: categoryColors[mainCat],
          borderTopWidth: '3px',
          animation: 'modalIn 0.2s ease-out',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-all border-none cursor-pointer text-lg z-10"
        >
          ✕
        </button>

        <div className="p-8">
          {/* Header meta */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
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

          {/* Authors */}
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            {paper.authors}
          </p>

          {/* Language toggle for content */}
          <div className="flex gap-1 mb-4">
            <button
              onClick={() => {}}
              className="text-xs px-2 py-1 rounded border cursor-default"
              style={{
                borderColor: lang === 'en' ? 'var(--color-accent)' : 'var(--color-border)',
                color: lang === 'en' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                background: lang === 'en' ? 'rgba(0,255,136,0.05)' : 'transparent',
              }}
            >
              EN
            </button>
            <button
              onClick={() => {}}
              className="text-xs px-2 py-1 rounded border cursor-default"
              style={{
                borderColor: lang === 'zh' ? 'var(--color-accent)' : 'var(--color-border)',
                color: lang === 'zh' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                background: lang === 'zh' ? 'rgba(0,255,136,0.05)' : 'transparent',
              }}
            >
              中文
            </button>
          </div>

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

          {/* Experiment details */}
          {exp && (
            <div className="mb-5">
              <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Experiment Details</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {exp.llm && exp.llm.length > 0 && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg">
                    <span className="text-xs text-[var(--color-text-muted)]">LLM</span>
                    <div className="text-[var(--color-purple)] font-medium">{exp.llm.join(', ')}</div>
                  </div>
                )}
                {exp.language && exp.language.length > 0 && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg">
                    <span className="text-xs text-[var(--color-text-muted)]">Language</span>
                    <div className="text-[var(--color-blue)] font-medium">{exp.language.join(', ')}</div>
                  </div>
                )}
                {exp.dataset && exp.dataset.length > 0 && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg">
                    <span className="text-xs text-[var(--color-text-muted)]">Dataset</span>
                    <div className="text-[var(--color-green)] font-medium">{exp.dataset.join(', ')}</div>
                  </div>
                )}
                {exp.vulnerability_type && exp.vulnerability_type.length > 0 && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg">
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
                {exp.baselines && exp.baselines.length > 0 && (
                  <div className="bg-white/[0.02] px-3 py-2 rounded-lg">
                    <span className="text-xs text-[var(--color-text-muted)]">Baselines</span>
                    <div className="text-[var(--color-text-secondary)] font-medium">{exp.baselines.join(', ')}</div>
                  </div>
                )}
              </div>
              {exp.key_results && (
                <div className="mt-2 bg-[var(--color-accent)]/5 px-3 py-2 rounded-lg text-sm">
                  <span className="text-[var(--color-accent)] font-semibold">📈 Results: </span>
                  <span className="text-[var(--color-text-secondary)]">{exp.key_results}</span>
                </div>
              )}
              {exp.real_world_impact && (
                <div className="mt-1 bg-[var(--color-red)]/5 px-3 py-2 rounded-lg text-sm">
                  <span className="text-[var(--color-red)] font-semibold">🎯 Impact: </span>
                  <span className="text-[var(--color-text-secondary)]">{exp.real_world_impact}</span>
                </div>
              )}
            </div>
          )}

          {/* Abstract */}
          <div className="mb-5">
            <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Abstract</div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{abstract}</p>
          </div>

          {/* Action links */}
          <div className="flex gap-2 flex-wrap pt-4 border-t border-[var(--color-border)]">
            {paper.paperUrl && (
              <a href={paper.paperUrl} target="_blank" rel="noopener"
                className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-all no-underline">
                📄 Read Paper
              </a>
            )}
            {paper.codeUrl && (
              <a href={paper.codeUrl} target="_blank" rel="noopener"
                className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-all no-underline">
                💻 Source Code
              </a>
            )}
            {paper.slidesUrl && (
              <a href={paper.slidesUrl} target="_blank" rel="noopener"
                className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-all no-underline">
                🖥️ Slides
              </a>
            )}
            {paper.talkUrl && (
              <a href={paper.talkUrl} target="_blank" rel="noopener"
                className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-all no-underline">
                🎥 Talk
              </a>
            )}
            {paper.bibtex && (
              <button
                onClick={copyBibtex}
                className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-all border-none cursor-pointer"
              >
                {copiedBib ? '✅ Copied!' : '📋 Copy BibTeX'}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
