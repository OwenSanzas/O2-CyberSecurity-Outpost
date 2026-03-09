import { useMemo } from 'react'
import type { Paper } from '../types'

export interface Aggregation {
  key: string
  label: string
  buckets: { value: string; count: number }[]
}

export function useAggregations(papers: Paper[]): Aggregation[] {
  return useMemo(() => {
    const aggs: { key: string; label: string; extract: (p: Paper) => string[] }[] = [
      { key: 'llm', label: 'LLM Used', extract: p => p.experiment?.llm ?? [] },
      { key: 'model_family', label: 'Model Family', extract: p => p.experiment?.model_family ?? [] },
      { key: 'fine_tuning', label: 'Fine-tuning', extract: p => [p.experiment?.fine_tuning ? 'Yes' : 'No'] },
      { key: 'language', label: 'Language', extract: p => p.experiment?.language ?? [] },
      { key: 'target_domain', label: 'Target Domain', extract: p => p.experiment?.target_domain ?? [] },
      { key: 'vulnerability_type', label: 'Vulnerability Type', extract: p => p.experiment?.vulnerability_type ?? [] },
      { key: 'dataset', label: 'Dataset', extract: p => p.experiment?.dataset ?? [] },
      { key: 'fuzzer', label: 'Fuzzer', extract: p => p.experiment?.fuzzer ?? [] },
      { key: 'static_tool', label: 'Static Tool', extract: p => p.experiment?.static_tool ?? [] },
      { key: 'recommendation', label: 'Recommendation', extract: p => [String(p.recommendation ?? 1)] },
    ]

    return aggs.map(({ key, label, extract }) => {
      const counts: Record<string, number> = {}
      for (const p of papers) {
        for (const val of extract(p)) {
          if (val) counts[val] = (counts[val] || 0) + 1
        }
      }
      const buckets = Object.entries(counts)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count)
      return { key, label, buckets }
    }).filter(a => a.buckets.length > 0)
  }, [papers])
}
