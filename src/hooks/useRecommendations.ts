import { useMemo } from 'react'
import type { Paper } from '../types'

interface RecommendedPaper {
  paper: Paper
  score: number
  reasons: string[]
}

export function useRecommendations(
  allPapers: Paper[],
  readingListIds: string[],
  recentIds: string[],
  readProgress: Record<string, string>,
  count = 6
): RecommendedPaper[] {
  return useMemo(() => {
    // Build a profile from user's reading list + recently viewed + read papers
    const interactedIds = new Set([
      ...readingListIds,
      ...recentIds,
      ...Object.keys(readProgress),
    ])

    if (interactedIds.size === 0) return []

    const interacted = allPapers.filter(p => interactedIds.has(p.id))
    if (interacted.length === 0) return []

    // Build frequency profiles
    const llmFreq = new Map<string, number>()
    const vulnFreq = new Map<string, number>()
    const langFreq = new Map<string, number>()
    const catFreq = new Map<string, number>()
    const domainFreq = new Map<string, number>()
    const datasetFreq = new Map<string, number>()

    for (const p of interacted) {
      const weight = readingListIds.includes(p.id) ? 3 : 1
      for (const c of p.categories) catFreq.set(c, (catFreq.get(c) || 0) + weight)
      if (p.experiment) {
        for (const l of p.experiment.llm || []) llmFreq.set(l, (llmFreq.get(l) || 0) + weight)
        for (const v of p.experiment.vulnerability_type || []) vulnFreq.set(v, (vulnFreq.get(v) || 0) + weight)
        for (const l of p.experiment.language || []) langFreq.set(l, (langFreq.get(l) || 0) + weight)
        for (const d of p.experiment.target_domain || []) domainFreq.set(d, (domainFreq.get(d) || 0) + weight)
        for (const d of p.experiment.dataset || []) datasetFreq.set(d, (datasetFreq.get(d) || 0) + weight)
      }
    }

    // Score candidate papers
    const candidates = allPapers.filter(p => !interactedIds.has(p.id))

    const scored: RecommendedPaper[] = candidates.map(p => {
      let score = 0
      const reasons: string[] = []

      // Category match
      for (const c of p.categories) {
        const freq = catFreq.get(c) || 0
        if (freq > 0) {
          score += freq * 2
          if (reasons.length < 3) reasons.push(`Similar category`)
        }
      }

      if (p.experiment) {
        // LLM match
        for (const l of p.experiment.llm || []) {
          const freq = llmFreq.get(l) || 0
          if (freq > 0) {
            score += freq * 3
            if (!reasons.includes(`Uses ${l}`) && reasons.length < 3) reasons.push(`Uses ${l}`)
          }
        }

        // Vulnerability type match
        for (const v of p.experiment.vulnerability_type || []) {
          const freq = vulnFreq.get(v) || 0
          if (freq > 0) {
            score += freq * 2.5
            if (!reasons.some(r => r.startsWith('Studies')) && reasons.length < 3) reasons.push(`Studies ${v}`)
          }
        }

        // Language match
        for (const l of p.experiment.language || []) {
          const freq = langFreq.get(l) || 0
          if (freq > 0) {
            score += freq * 1.5
          }
        }

        // Domain match
        for (const d of p.experiment.target_domain || []) {
          const freq = domainFreq.get(d) || 0
          if (freq > 0) {
            score += freq * 2
          }
        }

        // Dataset overlap
        for (const d of p.experiment.dataset || []) {
          const freq = datasetFreq.get(d) || 0
          if (freq > 0) {
            score += freq * 1.5
            if (!reasons.some(r => r.startsWith('Shared dataset')) && reasons.length < 3) reasons.push(`Shared dataset`)
          }
        }
      }

      // Recommendation level bonus
      score += (p.recommendation ?? 1) * 1.5

      // Recency bonus
      if (p.year >= new Date().getFullYear() - 1) score += 2

      // Deduplicate reasons
      const uniqueReasons = [...new Set(reasons)]

      return { paper: p, score, reasons: uniqueReasons }
    })

    return scored
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
  }, [allPapers, readingListIds, recentIds, readProgress, count])
}
