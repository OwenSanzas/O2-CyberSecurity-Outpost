import { useMemo } from 'react'
import type { Paper } from '../types'

interface Props {
  papers: Paper[]
  readingListIds: string[]
  readProgress: { read: number; reading: number }
  notesCount: number
  customTagCount: number
}

export default function ReadingStats({ papers, readingListIds, readProgress, notesCount, customTagCount }: Props) {
  const stats = useMemo(() => {
    const bookmarked = readingListIds.length
    const total = papers.length
    const readPercent = total > 0 ? Math.round((readProgress.read / total) * 100) : 0

    // Bookmarked papers breakdown
    const bookmarkedPapers = papers.filter(p => readingListIds.includes(p.id))
    const topCategories = new Map<string, number>()
    const topLLMs = new Map<string, number>()
    for (const p of bookmarkedPapers) {
      for (const c of p.categories) topCategories.set(c, (topCategories.get(c) || 0) + 1)
      for (const l of p.experiment?.llm || []) topLLMs.set(l, (topLLMs.get(l) || 0) + 1)
    }

    const favoriteCategory = [...topCategories.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
    const favoriteLLM = [...topLLMs.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]

    return {
      bookmarked,
      total,
      readCount: readProgress.read,
      readingCount: readProgress.reading,
      readPercent,
      notesCount,
      customTagCount,
      favoriteCategory,
      favoriteLLM,
    }
  }, [papers, readingListIds, readProgress, notesCount, customTagCount])

  if (stats.bookmarked === 0 && stats.readCount === 0) return null

  const categoryLabels: Record<string, string> = {
    'vulnerability-detection': 'Vuln Detection',
    'fuzzing': 'Fuzzing',
    'fuzzing-harness': 'Harness Gen',
    'patching': 'Patching',
    'privacy': 'Privacy',
  }

  return (
    <div className="mb-8">
      <div className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
        Your Reading Stats
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Bookmarked */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-[var(--color-accent)] font-mono">{stats.bookmarked}</div>
          <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Bookmarked</div>
        </div>

        {/* Read */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-[var(--color-green)] font-mono">{stats.readCount}</div>
          <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Read</div>
        </div>

        {/* Reading */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-[var(--color-orange)] font-mono">{stats.readingCount}</div>
          <div className="text-xs text-[var(--color-text-muted)] mt-0.5">In Progress</div>
        </div>

        {/* Notes */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-[var(--color-purple)] font-mono">{stats.notesCount}</div>
          <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Notes</div>
        </div>

        {/* Tags */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-[var(--color-blue)] font-mono">{stats.customTagCount}</div>
          <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Custom Tags</div>
        </div>

        {/* Progress */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-[var(--color-accent)] font-mono">{stats.readPercent}%</div>
          <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Collection Read</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[var(--color-text-muted)]">Reading progress</span>
          <span className="text-xs font-mono text-[var(--color-text-secondary)]">
            {stats.readCount + stats.readingCount} / {stats.total}
          </span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-[var(--color-green)] transition-all duration-500"
            style={{ width: `${(stats.readCount / stats.total) * 100}%` }}
            title={`${stats.readCount} read`}
          />
          <div
            className="h-full bg-[var(--color-orange)] transition-all duration-500"
            style={{ width: `${(stats.readingCount / stats.total) * 100}%` }}
            title={`${stats.readingCount} in progress`}
          />
        </div>
        {/* Insights */}
        {(stats.favoriteCategory || stats.favoriteLLM) && (
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-[var(--color-text-muted)]">
            {stats.favoriteCategory && (
              <span>Top interest: <span className="text-[var(--color-accent)]">{categoryLabels[stats.favoriteCategory] || stats.favoriteCategory}</span></span>
            )}
            {stats.favoriteLLM && (
              <span>Favorite LLM: <span className="text-[var(--color-purple)]">{stats.favoriteLLM}</span></span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
