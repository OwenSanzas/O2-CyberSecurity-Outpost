import { useEffect, useCallback } from 'react'
import type { CategoryFilter, SortBy } from '../types'

interface UrlState {
  q?: string
  cat?: CategoryFilter
  year?: string
  sort?: SortBy
  rec?: string
  lang?: 'en' | 'zh'
}

export function useUrlState(
  state: {
    query: string
    category: CategoryFilter
    yearFilter: string
    sortBy: SortBy
    recommendationFilter: string
    lang: 'en' | 'zh'
  },
  setters: {
    setQuery: (q: string) => void
    setCategory: (c: CategoryFilter) => void
    setYearFilter: (y: string) => void
    setSortBy: (s: SortBy) => void
    setRecommendationFilter: (r: string) => void
    setLang: (l: 'en' | 'zh') => void
  }
) {
  // Read from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    const cat = params.get('cat') as CategoryFilter | null
    const year = params.get('year')
    const sort = params.get('sort') as SortBy | null
    const rec = params.get('rec')
    const lang = params.get('lang') as 'en' | 'zh' | null

    if (q) setters.setQuery(q)
    if (cat) setters.setCategory(cat)
    if (year) setters.setYearFilter(year)
    if (sort) setters.setSortBy(sort)
    if (rec) setters.setRecommendationFilter(rec)
    if (lang) setters.setLang(lang)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Write to URL on state change
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (state.query) params.set('q', state.query)
    if (state.category !== 'all') params.set('cat', state.category)
    if (state.yearFilter !== 'all') params.set('year', state.yearFilter)
    if (state.sortBy !== 'year-desc') params.set('sort', state.sortBy)
    if (state.recommendationFilter !== 'all') params.set('rec', state.recommendationFilter)
    if (state.lang !== 'en') params.set('lang', state.lang)

    const str = params.toString()
    const url = str ? `?${str}` : window.location.pathname
    window.history.replaceState(null, '', url)
  }, [state])

  useEffect(() => {
    updateUrl()
  }, [updateUrl])
}
