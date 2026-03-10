import { useMemo } from 'react'
import picks from '../data/dailyPicks'
import type { Paper, Language } from '../types'

interface Props {
  papers: Paper[]
  lang: Language
  onPaperClick: (paper: Paper) => void
}

export default function DailyPick({ papers, lang, onPaperClick }: Props) {
  const pick = useMemo(() => {
    // Rotate daily based on date
    const now = new Date()
    const dayIndex = Math.floor((now.getFullYear() * 366 + now.getMonth() * 31 + now.getDate())) % picks.length
    const today = picks[dayIndex]
    const paper = papers.find(p => p.id === today.paperId)
    return { ...today, paper }
  }, [papers])

  if (!pick.paper) return null

  const zh = lang === 'zh'

  return (
    <div className="mb-6">
      <div
        className="relative overflow-hidden rounded-xl border border-[var(--color-accent)]/20 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent cursor-pointer hover:border-[var(--color-accent)]/40 transition-all group"
        onClick={() => onPaperClick(pick.paper!)}
      >
        <div className="px-5 py-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{pick.emoji}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
              {zh ? '每日推荐' : "Today's Pick"}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)] ml-auto font-mono">
              {pick.paper.year} · {pick.paper.venue.split(/[,(]/)[0].trim()}
            </span>
          </div>

          {/* One-liner */}
          <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
            {pick.title && <span className="text-[var(--color-accent)] font-mono mr-1.5">[{pick.title}]</span>}
            {zh ? pick.oneLiner_zh : pick.oneLiner}
          </p>

          {/* Body */}
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            {zh ? pick.body_zh : pick.body}
          </p>

          {/* Paper title */}
          <p className="text-[11px] text-[var(--color-text-muted)] mt-3 italic truncate">
            — {pick.paper.title}
          </p>
        </div>
      </div>
    </div>
  )
}
