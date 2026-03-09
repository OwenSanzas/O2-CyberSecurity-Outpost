import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'o2-reading-list'

export function useReadingList() {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }, [ids])

  const toggle = useCallback((id: string) => {
    setIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }, [])

  const has = useCallback((id: string) => ids.includes(id), [ids])

  const clear = useCallback(() => setIds([]), [])

  return { ids, toggle, has, clear, count: ids.length }
}
