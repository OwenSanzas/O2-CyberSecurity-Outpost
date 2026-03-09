import type { Paper } from '../types'

export default function ExportButton({ papers }: { papers: Paper[] }) {
  const exportBibtex = () => {
    const bibtex = papers
      .filter(p => p.bibtex)
      .map(p => p.bibtex)
      .join('\n\n')

    if (!bibtex) {
      alert('No BibTeX entries available for the current selection.')
      return
    }

    const blob = new Blob([bibtex], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `o2-outpost-papers-${papers.length}.bib`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportJSON = () => {
    const data = papers.map(p => ({
      id: p.id,
      title: p.title,
      authors: p.authors,
      year: p.year,
      venue: p.venue,
      system_name: p.system_name,
      categories: p.categories,
      paperUrl: p.paperUrl,
      codeUrl: p.codeUrl,
    }))

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `o2-outpost-papers-${papers.length}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={exportBibtex}
        className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
      >
        📋 Export BibTeX ({papers.length})
      </button>
      <button
        onClick={exportJSON}
        className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
      >
        📥 Export JSON
      </button>
    </div>
  )
}
