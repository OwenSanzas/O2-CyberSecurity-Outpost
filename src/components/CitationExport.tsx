import { useState } from 'react'
import type { Paper } from '../types'
import { showToast } from './Toast'

type Format = 'bibtex' | 'apa' | 'ieee' | 'acm' | 'mla' | 'chicago'

interface Props {
  paper: Paper
}

function parseAuthors(authors: string): string[] {
  return authors.split(/, | and /).map(a => a.trim()).filter(Boolean)
}

function formatAPA(paper: Paper): string {
  const authors = parseAuthors(paper.authors)
  const authorStr = authors.length <= 2
    ? authors.join(' & ')
    : authors.length <= 20
      ? authors.slice(0, -1).join(', ') + ', & ' + authors[authors.length - 1]
      : authors.slice(0, 19).join(', ') + ', ... ' + authors[authors.length - 1]
  const venue = paper.venue ? ` ${paper.venue}.` : ''
  return `${authorStr} (${paper.year}). ${paper.title}.${venue}${paper.paperUrl ? ` ${paper.paperUrl}` : ''}`
}

function formatIEEE(paper: Paper): string {
  const authors = parseAuthors(paper.authors)
  const authorStr = authors.length <= 6
    ? authors.map((a, i) => {
        const parts = a.split(' ')
        const last = parts[parts.length - 1]
        const initials = parts.slice(0, -1).map(p => p[0] + '.').join(' ')
        return i === 0 ? `${last}, ${initials}` : `${initials} ${last}`
      }).join(', ')
    : authors.slice(0, 3).map((a, i) => {
        const parts = a.split(' ')
        const last = parts[parts.length - 1]
        const initials = parts.slice(0, -1).map(p => p[0] + '.').join(' ')
        return i === 0 ? `${last}, ${initials}` : `${initials} ${last}`
      }).join(', ') + ' et al.'
  const venue = paper.venue ? `, in ${paper.venue}` : ''
  return `${authorStr}, "${paper.title}"${venue}, ${paper.year}.`
}

function formatACM(paper: Paper): string {
  const authors = parseAuthors(paper.authors)
  const authorStr = authors.length <= 2
    ? authors.join(' and ')
    : authors[0] + ' et al.'
  const venue = paper.venue ? ` In ${paper.venue}.` : '.'
  return `${authorStr}. ${paper.year}. ${paper.title}.${venue}`
}

function formatMLA(paper: Paper): string {
  const authors = parseAuthors(paper.authors)
  let authorStr: string
  if (authors.length === 1) {
    authorStr = authors[0]
  } else if (authors.length === 2) {
    authorStr = `${authors[0]}, and ${authors[1]}`
  } else {
    authorStr = `${authors[0]}, et al.`
  }
  const venue = paper.venue ? ` ${paper.venue},` : ''
  return `${authorStr}. "${paper.title}."${venue} ${paper.year}.`
}

function formatChicago(paper: Paper): string {
  const authors = parseAuthors(paper.authors)
  const authorStr = authors.length <= 3
    ? authors.join(', ')
    : authors[0] + ' et al.'
  const venue = paper.venue ? ` In ${paper.venue}.` : '.'
  return `${authorStr}. "${paper.title}."${venue} ${paper.year}.`
}

const formats: { id: Format; label: string }[] = [
  { id: 'bibtex', label: 'BibTeX' },
  { id: 'apa', label: 'APA' },
  { id: 'ieee', label: 'IEEE' },
  { id: 'acm', label: 'ACM' },
  { id: 'mla', label: 'MLA' },
  { id: 'chicago', label: 'Chicago' },
]

export default function CitationExport({ paper }: Props) {
  const [format, setFormat] = useState<Format>('bibtex')
  const [expanded, setExpanded] = useState(false)

  const getCitation = (): string => {
    switch (format) {
      case 'bibtex': return paper.bibtex || `@article{${paper.id},\n  title={${paper.title}},\n  author={${paper.authors}},\n  year={${paper.year}},\n  venue={${paper.venue || ''}}\n}`
      case 'apa': return formatAPA(paper)
      case 'ieee': return formatIEEE(paper)
      case 'acm': return formatACM(paper)
      case 'mla': return formatMLA(paper)
      case 'chicago': return formatChicago(paper)
    }
  }

  const copyCitation = () => {
    navigator.clipboard.writeText(getCitation())
    showToast(`${formats.find(f => f.id === format)?.label} citation copied!`)
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider bg-transparent border-none cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
      >
        <span style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▶</span>
        Cite This Paper
      </button>

      {expanded && (
        <div className="mt-3" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          {/* Format selector */}
          <div className="flex gap-0.5 bg-[var(--color-bg-card)] rounded-lg p-0.5 border border-[var(--color-border)] mb-3 overflow-x-auto">
            {formats.map(f => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border-none shrink-0"
                style={{
                  background: format === f.id ? 'rgba(0,255,136,0.1)' : 'transparent',
                  color: format === f.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Citation preview */}
          <div className="relative bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] p-3">
            <pre className="text-xs text-[var(--color-text-secondary)] whitespace-pre-wrap font-mono leading-relaxed break-all">
              {getCitation()}
            </pre>
            <button
              onClick={copyCitation}
              className="absolute top-2 right-2 text-xs px-2.5 py-1 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/30 cursor-pointer hover:bg-[var(--color-accent)]/20 transition-all"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
