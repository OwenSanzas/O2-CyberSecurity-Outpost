import { useState, useCallback, useEffect } from 'react'
import type { CategoryFilter, SortBy } from '../types'

export interface FilterPreset {
  id: string
  name: string
  createdAt: number
  filters: {
    category: CategoryFilter
    yearFilter: string
    sortBy: SortBy
    recommendationFilter: string
    venueFilter: string
    facetFilters: Record<string, string[]>
  }
}

const STORAGE_KEY = 'o2-filter-presets'

export function useFilterPresets() {
  const [presets, setPresets] = useState<FilterPreset[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
  }, [presets])

  const savePreset = useCallback((name: string, filters: FilterPreset['filters']) => {
    const preset: FilterPreset = {
      id: Date.now().toString(36),
      name: name.trim(),
      createdAt: Date.now(),
      filters,
    }
    setPresets(prev => [...prev, preset])
    return preset
  }, [])

  const deletePreset = useCallback((id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id))
  }, [])

  const renamePreset = useCallback((id: string, name: string) => {
    setPresets(prev => prev.map(p => p.id === id ? { ...p, name: name.trim() } : p))
  }, [])

  return { presets, savePreset, deletePreset, renamePreset }
}
