import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'o2-search-history'
const MAX_ITEMS = 10

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

  const add = useCallback((query: string) => {
    const trimmed = query.trim()
    if (!trimmed || trimmed === '__reading_list__') return
    setHistory(prev => {
      const filtered = prev.filter(q => q !== trimmed)
      return [trimmed, ...filtered].slice(0, MAX_ITEMS)
    })
  }, [])

  const remove = useCallback((query: string) => {
    setHistory(prev => prev.filter(q => q !== query))
  }, [])

  const clear = useCallback(() => {
    setHistory([])
  }, [])

  return { history, add, remove, clear }
}
