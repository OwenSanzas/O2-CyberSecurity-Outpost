import { useState, useRef, useEffect, useMemo } from 'react'
import type { Paper } from '../types'

interface Props {
  query: string
  onChange: (q: string) => void
  resultCount: number
  totalCount: number
  papers?: Paper[]
  searchHistory?: string[]
  onHistoryRemove?: (q: string) => void
  onHistoryClear?: () => void
}

export default function SearchBar({ query, onChange, resultCount, totalCount, papers, searchHistory, onHistoryRemove, onHistoryClear }: Props) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [focusedIdx, setFocusedIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Generate suggestions from paper data
  const suggestions = useMemo(() => {
    if (!papers || !query.trim() || query.trim().length < 2) return []

    const q = query.toLowerCase()
    const matches: { type: string; value: string; count: number }[] = []

    // System names
    const systemNames = new Map<string, number>()
    const llmNames = new Map<string, number>()
    const vulnTypes = new Map<string, number>()

    for (const p of papers) {
      if (p.system_name) {
        const key = p.system_name
        if (key.toLowerCase().includes(q)) {
          systemNames.set(key, (systemNames.get(key) || 0) + 1)
        }
      }
      for (const l of p.experiment?.llm ?? []) {
        if (l.toLowerCase().includes(q)) {
          llmNames.set(l, (llmNames.get(l) || 0) + 1)
        }
      }
      for (const v of p.experiment?.vulnerability_type ?? []) {
        if (v.toLowerCase().includes(q)) {
          vulnTypes.set(v, (vulnTypes.get(v) || 0) + 1)
        }
      }
    }

    for (const [name, count] of systemNames) matches.push({ type: 'System', value: name, count })
    for (const [name, count] of llmNames) matches.push({ type: 'LLM', value: name, count })
    for (const [name, count] of vulnTypes) matches.push({ type: 'Vuln', value: name, count })

    return matches.sort((a, b) => b.count - a.count).slice(0, 6)
  }, [query, papers])

  useEffect(() => {
    setFocusedIdx(-1)
  }, [query])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIdx(prev => (prev + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIdx(prev => prev <= 0 ? suggestions.length - 1 : prev - 1)
    } else if (e.key === 'Enter' && focusedIdx >= 0) {
      e.preventDefault()
      onChange(suggestions[focusedIdx].value)
      setShowSuggestions(false)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="relative mb-6">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm font-mono">&gt;_</span>
        <input
          ref={inputRef}
          id="search-input"
          type="text"
          value={query}
          onChange={e => { onChange(e.target.value); setShowSuggestions(true) }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search papers... (/ or Cmd+K)"
          className="w-full pl-12 pr-28 py-3.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]/50 focus:shadow-[0_0_20px_rgba(0,255,136,0.05)] transition-all text-sm font-mono"
        />
        {query && (
          <button
            onClick={() => { onChange(''); setShowSuggestions(false) }}
            className="absolute right-20 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors bg-transparent border-none cursor-pointer"
          >
            ✕
          </button>
        )}
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)] font-mono">
          {resultCount}/{totalCount}
        </span>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (suggestions.length > 0 || !query.trim()) && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg overflow-hidden z-20 shadow-xl shadow-black/30"
          style={{ animation: 'fadeIn 0.15s ease-out' }}
        >
          {suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <button
                key={`${s.type}-${s.value}`}
                onClick={() => { onChange(s.value); setShowSuggestions(false) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left border-none cursor-pointer transition-colors"
                style={{
                  background: focusedIdx === i ? 'rgba(0,255,136,0.05)' : 'transparent',
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={() => setFocusedIdx(i)}
              >
                <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-[var(--color-text-muted)] font-mono shrink-0 w-14 text-center">
                  {s.type}
                </span>
                <span className="flex-1 truncate">{s.value}</span>
                <span className="text-xs text-[var(--color-text-muted)]">{s.count}</span>
              </button>
            ))
          ) : searchHistory && searchHistory.length > 0 ? (
            /* Search history when no query */
            <>
              <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)]">
                <span className="text-xs text-[var(--color-text-muted)]">Recent Searches</span>
                {onHistoryClear && (
                  <button
                    onClick={() => { onHistoryClear(); setShowSuggestions(false) }}
                    className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] bg-transparent border-none cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              {searchHistory.map(q => (
                <div key={q} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
                  <button
                    onClick={() => { onChange(q); setShowSuggestions(false) }}
                    className="flex-1 text-sm text-left text-[var(--color-text-secondary)] truncate bg-transparent border-none cursor-pointer"
                  >
                    {q}
                  </button>
                  {onHistoryRemove && (
                    <button
                      onClick={() => onHistoryRemove(q)}
                      className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] bg-transparent border-none cursor-pointer shrink-0"
                    >
                      remove
                    </button>
                  )}
                </div>
              ))}
            </>
          ) : (
            /* Search tips when no query and no history */
            <div className="px-4 py-3">
              <span className="text-xs text-[var(--color-text-muted)] font-mono">Search tips:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {['GPT-4', 'fuzzing', 'smart contract', 'privacy', 'fine-tuning'].map(tip => (
                  <button
                    key={tip}
                    onClick={() => { onChange(tip); setShowSuggestions(false) }}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-[var(--color-text-secondary)] hover:bg-[rgba(0,255,136,0.08)] hover:text-[var(--color-accent)] border border-[var(--color-border)] cursor-pointer transition-colors font-mono"
                  >
                    {tip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
