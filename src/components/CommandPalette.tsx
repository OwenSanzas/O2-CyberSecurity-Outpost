import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import type { Paper } from '../types'

interface CommandItem {
  id: string
  type: 'command'
  label: string
  shortcut?: string
}

interface PaperItem {
  type: 'paper'
  paper: Paper
}

type ResultItem = CommandItem | PaperItem

const commands: CommandItem[] = [
  { id: 'toggle-theme', type: 'command', label: 'Toggle dark/light theme', shortcut: 'T' },
  { id: 'toggle-focus', type: 'command', label: 'Toggle focus mode', shortcut: 'F' },
  { id: 'toggle-graph', type: 'command', label: 'Toggle knowledge graph', shortcut: 'G' },
  { id: 'random-paper', type: 'command', label: 'Open random paper', shortcut: 'R' },
  { id: 'keyboard-help', type: 'command', label: 'Show keyboard shortcuts', shortcut: '?' },
  { id: 'export-bibtex', type: 'command', label: 'Export papers as BibTeX' },
]

function fuzzyMatch(text: string, query: string): number {
  const lower = text.toLowerCase()
  const q = query.toLowerCase()

  // Exact substring match gets highest score
  if (lower.includes(q)) {
    // Bonus for match at start
    if (lower.startsWith(q)) return 100
    return 80
  }

  // Fuzzy: check if all query chars appear in order
  let qi = 0
  let consecutiveBonus = 0
  let lastMatchIdx = -2

  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) {
      if (i === lastMatchIdx + 1) consecutiveBonus += 10
      lastMatchIdx = i
      qi++
    }
  }

  if (qi === q.length) {
    // All chars matched, base score + consecutive bonus
    return 30 + consecutiveBonus + Math.max(0, 20 - (text.length - q.length))
  }

  return 0
}

interface Props {
  papers: Paper[]
  onClose: () => void
  onPaperClick: (p: Paper) => void
  onCommand: (cmd: string) => void
}

export default function CommandPalette({ papers, onClose, onPaperClick, onCommand }: Props) {
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Focus input on mount and lock body scroll
  useEffect(() => {
    inputRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const results = useMemo<ResultItem[]>(() => {
    const q = query.trim()

    if (!q) {
      // Show all commands when empty
      return commands.map(c => ({ ...c }))
    }

    const scored: { item: ResultItem; score: number }[] = []

    // Score commands
    for (const cmd of commands) {
      const score = fuzzyMatch(cmd.label, q)
      if (score > 0) scored.push({ item: cmd, score: score + 5 }) // slight boost for commands
    }

    // Score papers
    for (const paper of papers) {
      let best = 0
      best = Math.max(best, fuzzyMatch(paper.title, q))
      if (paper.system_name) best = Math.max(best, fuzzyMatch(paper.system_name, q))
      best = Math.max(best, fuzzyMatch(paper.authors, q))

      if (best > 0) {
        scored.push({ item: { type: 'paper', paper }, score: best })
      }
    }

    scored.sort((a, b) => b.score - a.score)
    return scored.slice(0, 10).map(s => s.item)
  }, [query, papers])

  // Reset selection when results change
  useEffect(() => {
    setSelectedIdx(0)
  }, [results])

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.children[selectedIdx] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIdx])

  const handleSelect = useCallback((item: ResultItem) => {
    if (item.type === 'command') {
      onCommand(item.id)
    } else {
      onPaperClick(item.paper)
    }
    onClose()
  }, [onCommand, onPaperClick, onClose])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx(prev => (prev + 1) % Math.max(results.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx(prev => prev <= 0 ? Math.max(results.length - 1, 0) : prev - 1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[selectedIdx]) handleSelect(results[selectedIdx])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }, [results, selectedIdx, handleSelect, onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'cmdPaletteIn 0.15s ease-out' }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]">
          <span className="text-[var(--color-accent)] text-sm font-mono shrink-0">&gt;_</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search papers or type a command..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] font-mono"
          />
          <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded text-[10px] text-[var(--color-text-muted)] font-mono shrink-0">
            Esc
          </kbd>
        </div>

        {/* Results list */}
        <div ref={listRef} className="max-h-[360px] overflow-y-auto py-1">
          {results.length === 0 && query.trim() && (
            <div className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
              No results found
            </div>
          )}

          {results.map((item, i) => (
            <button
              key={item.type === 'command' ? item.id : item.paper.id}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setSelectedIdx(i)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left border-none cursor-pointer transition-colors"
              style={{
                background: selectedIdx === i ? 'rgba(0,255,136,0.06)' : 'transparent',
              }}
            >
              {item.type === 'command' ? (
                <>
                  <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-sm shrink-0">
                    {item.id === 'toggle-theme' ? '\u263E' :
                     item.id === 'toggle-focus' ? '\u25CE' :
                     item.id === 'toggle-graph' ? '\u2B53' :
                     item.id === 'random-paper' ? '\u2684' :
                     item.id === 'keyboard-help' ? '?' :
                     item.id === 'export-bibtex' ? '\u21E9' : '\u25B8'}
                  </span>
                  <span className="flex-1 text-sm text-[var(--color-text-secondary)]" style={{
                    color: selectedIdx === i ? 'var(--color-text-primary)' : undefined,
                  }}>
                    {item.label}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[var(--color-text-muted)] font-mono uppercase tracking-wider shrink-0">
                    Command
                  </span>
                  {item.shortcut && (
                    <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded text-[10px] text-[var(--color-text-muted)] font-mono shrink-0">
                      {item.shortcut}
                    </kbd>
                  )}
                </>
              ) : (
                <>
                  <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--color-blue)]/10 text-[var(--color-blue)] text-xs font-mono font-bold shrink-0">
                    {item.paper.year.toString().slice(-2)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {item.paper.system_name && (
                        <span className="text-xs font-mono font-bold text-[var(--color-accent)] shrink-0">
                          [{item.paper.system_name}]
                        </span>
                      )}
                      <span className="text-sm truncate" style={{
                        color: selectedIdx === i ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      }}>
                        {item.paper.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--color-text-muted)] truncate mt-0.5">
                      {item.paper.authors.split(',').slice(0, 2).join(',').trim()}
                      {item.paper.authors.split(',').length > 2 ? ' et al.' : ''}
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[var(--color-text-muted)] font-mono uppercase tracking-wider shrink-0">
                    Paper
                  </span>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-3 px-4 py-2 border-t border-[var(--color-border)] text-[10px] text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded font-mono">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded font-mono">↵</kbd>
            select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded font-mono">esc</kbd>
            close
          </span>
        </div>
      </div>

      <style>{`
        @keyframes cmdPaletteIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
