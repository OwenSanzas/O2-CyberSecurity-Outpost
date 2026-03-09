import { useState, useEffect, useCallback } from 'react'

interface Preferences {
  viewMode: 'card' | 'table' | 'timeline'
  sortBy: string
  dashboardExpanded: boolean
}

const STORAGE_KEY = 'o2-preferences'

const defaults: Preferences = {
  viewMode: 'card',
  sortBy: 'year-desc',
  dashboardExpanded: true,
}

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? { ...defaults, ...JSON.parse(stored) } : defaults
    } catch {
      return defaults
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  }, [prefs])

  const update = useCallback(<K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPrefs(prev => ({ ...prev, [key]: value }))
  }, [])

  return { prefs, update }
}
