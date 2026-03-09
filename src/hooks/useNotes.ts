import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'o2-paper-notes'

export function useNotes() {
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  const setNote = useCallback((paperId: string, text: string) => {
    setNotes(prev => {
      if (!text.trim()) {
        const next = { ...prev }
        delete next[paperId]
        return next
      }
      return { ...prev, [paperId]: text.trim() }
    })
  }, [])

  const getNote = useCallback((paperId: string) => {
    return notes[paperId] || ''
  }, [notes])

  const hasNote = useCallback((paperId: string) => {
    return !!notes[paperId]
  }, [notes])

  const count = Object.keys(notes).length

  return { notes, setNote, getNote, hasNote, count }
}
