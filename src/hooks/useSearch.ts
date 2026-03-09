import { useMemo } from 'react'
import MiniSearch from 'minisearch'
import type { Paper } from '../types'

export function useSearch(papers: Paper[]) {
  const miniSearch = useMemo(() => {
    const ms = new MiniSearch<Paper>({
      fields: ['title', 'authors', 'abstract', 'venue', 'system_name', '_llm', '_dataset', '_vuln_type', '_language', '_contributions', 'summary'],
      storeFields: ['id'],
      extractField: (doc, fieldName) => {
        if (fieldName === '_llm') return doc.experiment?.llm?.join(' ') ?? ''
        if (fieldName === '_dataset') return doc.experiment?.dataset?.join(' ') ?? ''
        if (fieldName === '_vuln_type') return doc.experiment?.vulnerability_type?.join(' ') ?? ''
        if (fieldName === '_language') return doc.experiment?.language?.join(' ') ?? ''
        if (fieldName === '_contributions') return doc.contributions?.join(' ') ?? ''
        return (doc as Record<string, unknown>)[fieldName] as string ?? ''
      },
      searchOptions: {
        boost: { title: 3, system_name: 3, authors: 2, _llm: 2, _contributions: 1.5, summary: 1.5 },
        fuzzy: 0.2,
        prefix: true,
      },
    })
    ms.addAll(papers)
    return ms
  }, [papers])

  return miniSearch
}
