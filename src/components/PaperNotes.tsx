import { useState, useEffect, useRef } from 'react'

interface Props {
  paperId: string
  note: string
  onSave: (paperId: string, text: string) => void
}

export default function PaperNotes({ paperId, note, onSave }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(note)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setDraft(note)
    setEditing(false)
  }, [paperId, note])

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.selectionStart = textareaRef.current.value.length
    }
  }, [editing])

  const save = () => {
    onSave(paperId, draft)
    setEditing(false)
  }

  if (!editing && !note) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] bg-transparent border border-dashed border-[var(--color-border)] rounded-lg px-3 py-2 cursor-pointer transition-colors w-full text-left"
      >
        + Add personal note...
      </button>
    )
  }

  if (!editing) {
    return (
      <div
        onClick={() => setEditing(true)}
        className="bg-[var(--color-orange)]/5 border border-[var(--color-orange)]/20 rounded-lg px-3 py-2 cursor-pointer hover:border-[var(--color-orange)]/40 transition-colors"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-[var(--color-orange)]">My Notes</span>
          <span className="text-xs text-[var(--color-text-muted)]">click to edit</span>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap">{note}</p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-orange)]/5 border border-[var(--color-orange)]/30 rounded-lg p-3">
      <div className="text-xs font-semibold text-[var(--color-orange)] mb-2">My Notes</div>
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) save()
          if (e.key === 'Escape') { setDraft(note); setEditing(false) }
        }}
        rows={3}
        className="w-full bg-transparent border border-[var(--color-border)] rounded px-2 py-1.5 text-sm text-[var(--color-text-primary)] resize-y focus:outline-none focus:border-[var(--color-orange)]/50"
        placeholder="Write your notes about this paper..."
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-[var(--color-text-muted)]">Cmd+Enter to save, Esc to cancel</span>
        <div className="flex gap-2">
          {note && (
            <button
              onClick={() => { onSave(paperId, ''); setEditing(false) }}
              className="text-xs px-2 py-1 rounded bg-transparent border border-[var(--color-border)] text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-red)] hover:border-[var(--color-red)]/30 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={() => { setDraft(note); setEditing(false) }}
            className="text-xs px-2 py-1 rounded bg-transparent border border-[var(--color-border)] text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-text-secondary)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="text-xs px-3 py-1 rounded bg-[var(--color-orange)]/10 border border-[var(--color-orange)]/30 text-[var(--color-orange)] cursor-pointer hover:bg-[var(--color-orange)]/20 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
