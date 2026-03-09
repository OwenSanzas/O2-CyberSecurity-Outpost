import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'o2-recently-viewed'
const MAX_ITEMS = 8

export function useRecentlyViewed() {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }, [ids])

  const add = useCallback((id: string) => {
    setIds(prev => {
      const filtered = prev.filter(i => i !== id)
      return [id, ...filtered].slice(0, MAX_ITEMS)
    })
  }, [])

  return { ids, add }
}
