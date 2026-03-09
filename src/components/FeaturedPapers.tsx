import { useState, useEffect } from 'react'
import type { Paper, Language } from '../types'

interface Props {
  papers: Paper[]
  lang: Language
  onPaperClick: (p: Paper) => void
}

const categoryColors: Record<string, string> = {
  'vulnerability-detection': '#ff4444',
  'fuzzing': '#44aaff',
  'privacy': '#44ff88',
}

export default function FeaturedPapers({ papers, lang, onPaperClick }: Props) {
  const [activeIdx, setActiveIdx] = useState(0)

  const featured = papers
    .filter(p => (p.recommendation ?? 1) >= 3)
    .sort((a, b) => b.year - a.year)
    .slice(0, 6)

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (featured.length <= 1) return
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % featured.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [featured.length])

  if (featured.length === 0) return null

  const activePaper = featured[activeIdx]
  const summary = lang === 'zh' ? (activePaper.summary_zh || activePaper.summary) : activePaper.summary
  const mainCat = activePaper.categories[0] || 'vulnerability-detection'

  return (
    <div className="mb-10">
      <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider flex items-center gap-2">
        Featured Top-Tier Papers
      </h3>

      {/* Hero featured paper */}
      <div
        className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6 cursor-pointer hover:border-[var(--color-border-hover)] transition-all mb-4 group"
        style={{ borderTopColor: categoryColors[mainCat], borderTopWidth: '2px', animation: 'fadeIn 0.3s ease-out' }}
        onClick={() => onPaperClick(activePaper)}
        key={activePaper.id}
      >
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs font-mono font-bold text-[var(--color-accent)]">{activePaper.year}</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{ border: '1px solid #ffd700', color: '#ffd700' }}>
            TOP-TIER
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)]">
            {activePaper.venue && activePaper.venue.length > 40 ? activePaper.venue.slice(0, 40) + '...' : activePaper.venue}
          </span>
          <span className="ml-auto text-xs text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
            Click to read more
          </span>
        </div>
        <div className="mb-2">
          {activePaper.system_name && (
            <span className="text-base font-mono font-bold text-[var(--color-accent)] mr-2">[{activePaper.system_name}]</span>
          )}
          <span className="text-base font-semibold text-[var(--color-text-primary)] group-hover:text-white transition-colors">
            {activePaper.title}
          </span>
        </div>
        {summary && (
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">{summary}</p>
        )}
        {activePaper.experiment?.llm && activePaper.experiment.llm.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {activePaper.experiment.llm.map(l => (
              <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-purple)]/10 text-[var(--color-purple)]">{l}</span>
            ))}
            {activePaper.experiment.language?.map(l => (
              <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-blue)]/10 text-[var(--color-blue)]">{l}</span>
            ))}
          </div>
        )}
      </div>

      {/* Dots indicator + mini cards */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {featured.map((paper, i) => (
          <button
            key={paper.id}
            onClick={() => setActiveIdx(i)}
            className="shrink-0 text-left px-3 py-2 rounded-lg border transition-all cursor-pointer min-w-[200px]"
            style={{
              background: i === activeIdx ? 'rgba(0,255,136,0.05)' : 'var(--color-bg-card)',
              borderColor: i === activeIdx ? 'var(--color-accent)' : 'var(--color-border)',
            }}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs font-mono text-[var(--color-accent)]">{paper.year}</span>
              {paper.system_name && (
                <span className="text-xs font-mono font-bold text-[var(--color-accent)]">{paper.system_name}</span>
              )}
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] truncate">
              {paper.title}
            </p>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
