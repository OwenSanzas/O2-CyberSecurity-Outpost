import { useEffect, useRef, useCallback } from 'react'

interface Props {
  onClose: () => void
}

const shortcuts = [
  { key: '/', description: 'Focus search bar' },
  { key: 'R', description: 'Open random paper' },
  { key: 'G', description: 'Toggle knowledge graph' },
  { key: 'F', description: 'Toggle focus mode' },
  { key: '1/2/3', description: 'Switch view (card/table/timeline)' },
  { key: '←/K', description: 'Previous paper (in modal)' },
  { key: '→/J', description: 'Next paper (in modal)' },
  { key: 'Esc', description: 'Close modal / panel' },
  { key: 'Cmd+K', description: 'Focus search bar (alt)' },
  { key: '?', description: 'Show this help' },
]

export default function KeyboardHelp({ onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Focus trap: keep focus inside the dialog
  const handleFocusTrap = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !dialogRef.current) return
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.addEventListener('keydown', handleFocusTrap)
    // Auto-focus close button on mount
    closeButtonRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', handler)
      document.removeEventListener('keydown', handleFocusTrap)
    }
  }, [onClose, handleFocusTrap])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        className="relative bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-6 max-w-sm w-full"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'modalIn 0.2s ease-out' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-help-title"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 id="keyboard-help-title" className="text-sm font-semibold text-[var(--color-text-primary)]">Keyboard Shortcuts</h3>
          <button ref={closeButtonRef} onClick={onClose} aria-label="Close keyboard shortcuts" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] bg-transparent border-none cursor-pointer">✕</button>
        </div>
        <div className="space-y-3">
          {shortcuts.map(s => (
            <div key={s.key} className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">{s.description}</span>
              <kbd className="px-2 py-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded text-xs text-[var(--color-accent)] font-mono min-w-[2rem] text-center">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-4 text-center">
          Press Esc or click outside to close
        </p>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
