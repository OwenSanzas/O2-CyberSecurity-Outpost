import { useState, useCallback, useEffect, useMemo } from 'react'

export type ReadingStatus = 'unread' | 'reading' | 'read'

const STORAGE_KEY = 'o2_reading_progress'

export function useReadingProgress() {
  const [progress, setProgress] = useState<Record<string, ReadingStatus>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const getStatus = useCallback((paperId: string): ReadingStatus => {
    return progress[paperId] || 'unread'
  }, [progress])

  const setStatus = useCallback((paperId: string, status: ReadingStatus) => {
    setProgress(prev => {
      if (status === 'unread') {
        const next = { ...prev }
        delete next[paperId]
        return next
      }
      return { ...prev, [paperId]: status }
    })
  }, [])

  const counts = useMemo(() => {
    const values = Object.values(progress)
    return {
      read: values.filter(s => s === 'read').length,
      reading: values.filter(s => s === 'reading').length,
      unread: 0, // unread entries are not stored, so this is unknown without total
    }
  }, [progress])

  return { getStatus, setStatus, counts }
}
