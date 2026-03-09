import { useState } from 'react'
import type { Paper } from '../types'

export default function ExportButton({ papers }: { papers: Paper[] }) {
  const [showMenu, setShowMenu] = useState(false)

  const download = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    setShowMenu(false)
  }

  const exportBibtex = () => {
    const bibtex = papers.filter(p => p.bibtex).map(p => p.bibtex).join('\n\n')
    if (!bibtex) { alert('No BibTeX entries available.'); return }
    download(bibtex, `o2-outpost-${papers.length}.bib`, 'text/plain')
  }

  const exportJSON = () => {
    const data = papers.map(p => ({
      id: p.id, title: p.title, authors: p.authors, year: p.year,
      venue: p.venue, system_name: p.system_name, categories: p.categories,
      paperUrl: p.paperUrl, codeUrl: p.codeUrl, recommendation: p.recommendation,
    }))
    download(JSON.stringify(data, null, 2), `o2-outpost-${papers.length}.json`, 'application/json')
  }

  const exportCSV = () => {
    const escape = (s: string) => `"${(s || '').replace(/"/g, '""')}"`
    const headers = ['Title', 'Authors', 'Year', 'Venue', 'System Name', 'Category', 'LLMs', 'Recommendation', 'Paper URL', 'Code URL']
    const rows = papers.map(p => [
      escape(p.title), escape(p.authors), String(p.year), escape(p.venue),
      escape(p.system_name || ''), escape(p.categories.join('; ')),
      escape((p.experiment?.llm || []).join('; ')), String(p.recommendation ?? 1),
      escape(p.paperUrl), escape(p.codeUrl),
    ].join(','))
    download([headers.join(','), ...rows].join('\n'), `o2-outpost-${papers.length}.csv`, 'text/csv')
  }

  const exportMarkdown = () => {
    const lines = papers.map(p => {
      const rec = '⭐'.repeat(p.recommendation ?? 1)
      const sys = p.system_name ? ` [${p.system_name}]` : ''
      const llms = p.experiment?.llm?.join(', ') || ''
      return [
        `### ${p.title}${sys}`,
        `**${p.authors}** | ${p.year} | ${p.venue || 'N/A'} | ${rec}`,
        p.summary ? `\n> ${p.summary}` : '',
        llms ? `\nLLMs: ${llms}` : '',
        p.paperUrl ? `\n[Paper](${p.paperUrl})` + (p.codeUrl ? ` | [Code](${p.codeUrl})` : '') : '',
        '\n---\n',
      ].filter(Boolean).join('\n')
    })
    download(
      `# O2 CyberSecurity Outpost — ${papers.length} Papers\n\n` + lines.join('\n'),
      `o2-outpost-${papers.length}.md`,
      'text/markdown'
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
      >
        Export ({papers.length})
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-xl z-20 overflow-hidden min-w-[140px]"
            style={{ animation: 'fadeIn 0.15s ease-out' }}>
            <button onClick={exportBibtex} className="w-full text-left px-4 py-2 text-xs text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)] transition-colors border-none cursor-pointer bg-transparent">
              BibTeX (.bib)
            </button>
            <button onClick={exportJSON} className="w-full text-left px-4 py-2 text-xs text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)] transition-colors border-none cursor-pointer bg-transparent">
              JSON (.json)
            </button>
            <button onClick={exportCSV} className="w-full text-left px-4 py-2 text-xs text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)] transition-colors border-none cursor-pointer bg-transparent">
              CSV (.csv)
            </button>
            <button onClick={exportMarkdown} className="w-full text-left px-4 py-2 text-xs text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)] transition-colors border-none cursor-pointer bg-transparent">
              Markdown (.md)
            </button>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
