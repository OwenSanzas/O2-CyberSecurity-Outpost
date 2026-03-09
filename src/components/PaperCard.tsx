import { useState } from 'react'
import type { Paper } from '../types'

const categoryColors: Record<string, string> = {
  'vulnerability-detection': '#ff4444',
  'fuzzing': '#44aaff',
  'privacy': '#44ff88',
}

const subcategoryLabels: Record<string, string> = {
  'fine-tuning': 'Fine-tuning',
  'llm-sast': 'LLM+SAST',
  'semantic': 'Semantic',
  'solidity': 'Solidity',
  'java': 'Java',
  'c-cpp': 'C/C++',
  'other': 'Other',
}

const categoryLabels: Record<string, string> = {
  'vulnerability-detection': 'Vuln Detection',
  'fuzzing': 'Fuzzing',
  'privacy': 'Privacy',
}

export default function PaperCard({ paper }: { paper: Paper }) {
  const [expanded, setExpanded] = useState(false)

  const mainCategory = paper.categories[0] || 'vulnerability-detection'
  const color = categoryColors[mainCategory] || '#888'

  return (
    <div
      className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-5 transition-all duration-200 hover:border-[var(--color-border-hover)] hover:translate-y-[-1px]"
      style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
    >
      {/* Top row: year + categories */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs font-mono font-bold text-[var(--color-accent)]">{paper.year}</span>
        {paper.venue && (
          <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)]">
            {paper.venue.length > 40 ? paper.venue.slice(0, 40) + '...' : paper.venue}
          </span>
        )}
        {paper.categories.map(cat => (
          <span key={cat} className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${categoryColors[cat]}15`, color: categoryColors[cat] }}>
            {categoryLabels[cat] || cat}
          </span>
        ))}
        {paper.subcategories.map(sub => (
          <span key={sub} className="text-xs px-1.5 py-0.5 rounded text-[var(--color-text-muted)] bg-white/5">
            {subcategoryLabels[sub] || sub}
          </span>
        ))}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold leading-snug mb-1.5 text-[var(--color-text-primary)]">
        {paper.title}
      </h3>

      {/* Authors */}
      {paper.authors && (
        <p className="text-xs text-[var(--color-text-secondary)] mb-3 leading-relaxed">
          {paper.authors}
        </p>
      )}

      {/* Abstract */}
      {paper.abstract && (
        <div className="mb-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-dim)] cursor-pointer bg-transparent border-none font-medium transition-colors"
          >
            {expanded ? '▾ Hide Abstract' : '▸ Show Abstract'}
          </button>
          {expanded && (
            <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed border-l-2 border-[var(--color-border)] pl-3">
              {paper.abstract}
            </p>
          )}
        </div>
      )}

      {/* Links */}
      <div className="flex gap-2 flex-wrap">
        {paper.paperUrl && (
          <a href={paper.paperUrl} target="_blank" rel="noopener"
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-all no-underline">
            📄 Paper
          </a>
        )}
        {paper.codeUrl && (
          <a href={paper.codeUrl} target="_blank" rel="noopener"
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-all no-underline">
            💻 Code
          </a>
        )}
        {paper.slidesUrl && (
          <a href={paper.slidesUrl} target="_blank" rel="noopener"
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-all no-underline">
            🖥️ Slides
          </a>
        )}
        {paper.talkUrl && (
          <a href={paper.talkUrl} target="_blank" rel="noopener"
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-all no-underline">
            🎥 Talk
          </a>
        )}
      </div>
    </div>
  )
}
