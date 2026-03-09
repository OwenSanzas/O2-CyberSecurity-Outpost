import type { Paper, Language } from '../types'

const categoryColors: Record<string, string> = {
  'vulnerability-detection': '#ff4444',
  'fuzzing': '#44aaff',
  'privacy': '#44ff88',
}

const recStars = (level: number) => '⭐'.repeat(level)

interface Props {
  papers: Paper[]
  lang: Language
  onPaperClick: (p: Paper) => void
}

export default function PaperTable({ papers, lang, onPaperClick }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left">
            <th className="py-2 px-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Year</th>
            <th className="py-2 px-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Level</th>
            <th className="py-2 px-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">System</th>
            <th className="py-2 px-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Title</th>
            <th className="py-2 px-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">Venue</th>
            <th className="py-2 px-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:table-cell">LLM</th>
            <th className="py-2 px-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:table-cell">Links</th>
          </tr>
        </thead>
        <tbody>
          {papers.map(paper => {
            const rec = paper.recommendation ?? 1
            const mainCat = paper.categories[0] || 'vulnerability-detection'
            const llms = paper.experiment?.llm?.slice(0, 2).join(', ') || ''
            return (
              <tr
                key={paper.id}
                onClick={() => onPaperClick(paper)}
                className="border-b border-[var(--color-border)]/50 hover:bg-white/[0.02] cursor-pointer transition-colors"
              >
                <td className="py-2.5 px-3 font-mono text-[var(--color-accent)] font-bold text-xs">{paper.year}</td>
                <td className="py-2.5 px-3 text-xs">{recStars(rec)}</td>
                <td className="py-2.5 px-3">
                  {paper.system_name ? (
                    <span className="font-mono font-bold text-[var(--color-accent)] text-xs">{paper.system_name}</span>
                  ) : (
                    <span className="text-[var(--color-text-muted)] text-xs">—</span>
                  )}
                </td>
                <td className="py-2.5 px-3 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: categoryColors[mainCat] }} />
                    <span className="text-[var(--color-text-primary)] truncate">
                      {paper.title}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-xs text-[var(--color-text-secondary)] hidden md:table-cell max-w-32 truncate">
                  {paper.venue && (paper.venue.length > 30 ? paper.venue.slice(0, 30) + '...' : paper.venue)}
                </td>
                <td className="py-2.5 px-3 text-xs text-[var(--color-purple)] hidden lg:table-cell">
                  {llms || '—'}
                </td>
                <td className="py-2.5 px-3 hidden lg:table-cell">
                  <div className="flex gap-1">
                    {paper.paperUrl && <span className="text-xs" title="Paper">📄</span>}
                    {paper.codeUrl && <span className="text-xs" title="Code">💻</span>}
                    {paper.slidesUrl && <span className="text-xs" title="Slides">🖥️</span>}
                    {paper.talkUrl && <span className="text-xs" title="Talk">🎥</span>}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
