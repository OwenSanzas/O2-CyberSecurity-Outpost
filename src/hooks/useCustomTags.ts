import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'o2-custom-tags'

export interface CustomTag {
  name: string
  color: string
}

const TAG_COLORS = [
  '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff',
  '#9b59b6', '#e17055', '#00cec9', '#fd79a8',
  '#a29bfe', '#fdcb6e', '#55efc4', '#74b9ff',
]

export function useCustomTags() {
  const [tags, setTags] = useState<Record<string, string[]>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  const [tagDefs, setTagDefs] = useState<CustomTag[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '-defs')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags))
  }, [tags])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '-defs', JSON.stringify(tagDefs))
  }, [tagDefs])

  const createTag = useCallback((name: string) => {
    const trimmed = name.trim().toLowerCase()
    if (!trimmed || tagDefs.some(t => t.name === trimmed)) return
    const colorIndex = tagDefs.length % TAG_COLORS.length
    setTagDefs(prev => [...prev, { name: trimmed, color: TAG_COLORS[colorIndex] }])
  }, [tagDefs])

  const deleteTag = useCallback((name: string) => {
    setTagDefs(prev => prev.filter(t => t.name !== name))
    setTags(prev => {
      const next = { ...prev }
      for (const paperId of Object.keys(next)) {
        next[paperId] = next[paperId].filter(t => t !== name)
        if (next[paperId].length === 0) delete next[paperId]
      }
      return next
    })
  }, [])

  const toggleTag = useCallback((paperId: string, tagName: string) => {
    setTags(prev => {
      const current = prev[paperId] || []
      const next = current.includes(tagName)
        ? current.filter(t => t !== tagName)
        : [...current, tagName]
      if (next.length === 0) {
        const result = { ...prev }
        delete result[paperId]
        return result
      }
      return { ...prev, [paperId]: next }
    })
  }, [])

  const getPaperTags = useCallback((paperId: string): CustomTag[] => {
    const paperTagNames = tags[paperId] || []
    return tagDefs.filter(t => paperTagNames.includes(t.name))
  }, [tags, tagDefs])

  const hasTags = useCallback((paperId: string) => {
    return (tags[paperId]?.length ?? 0) > 0
  }, [tags])

  const getPapersByTag = useCallback((tagName: string): string[] => {
    return Object.entries(tags)
      .filter(([, t]) => t.includes(tagName))
      .map(([id]) => id)
  }, [tags])

  const getTagColor = useCallback((tagName: string): string => {
    return tagDefs.find(t => t.name === tagName)?.color || '#888'
  }, [tagDefs])

  return {
    tags,
    tagDefs,
    createTag,
    deleteTag,
    toggleTag,
    getPaperTags,
    hasTags,
    getPapersByTag,
    getTagColor,
  }
}
