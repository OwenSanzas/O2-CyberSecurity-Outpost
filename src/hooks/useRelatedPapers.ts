import { useMemo } from 'react'
import type { Paper } from '../types'

function similarity(a: Paper, b: Paper): number {
  if (a.id === b.id) return -1
  let score = 0

  // Category overlap
  const catOverlap = a.categories.filter(c => b.categories.includes(c)).length
  score += catOverlap * 3

  // LLM overlap
  const aLLM = a.experiment?.llm ?? []
  const bLLM = b.experiment?.llm ?? []
  score += aLLM.filter(l => bLLM.includes(l)).length * 2

  // Language overlap
  const aLang = a.experiment?.language ?? []
  const bLang = b.experiment?.language ?? []
  score += aLang.filter(l => bLang.includes(l)).length * 1.5

  // Vulnerability type overlap
  const aVuln = a.experiment?.vulnerability_type ?? []
  const bVuln = b.experiment?.vulnerability_type ?? []
  score += aVuln.filter(v => bVuln.includes(v)).length * 2

  // Dataset overlap
  const aDs = a.experiment?.dataset ?? []
  const bDs = b.experiment?.dataset ?? []
  score += aDs.filter(d => bDs.includes(d)).length * 1.5

  // Same year bonus
  if (a.year === b.year) score += 1

  // Both fine-tuned
  if (a.experiment?.fine_tuning && b.experiment?.fine_tuning) score += 1

  return score
}

export function useRelatedPapers(paper: Paper | null, allPapers: Paper[], count = 4): Paper[] {
  return useMemo(() => {
    if (!paper) return []
    return allPapers
      .map(p => ({ paper: p, score: similarity(paper, p) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(r => r.paper)
  }, [paper, allPapers, count])
}
