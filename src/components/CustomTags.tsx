import { useState } from 'react'
import type { CustomTag } from '../hooks/useCustomTags'

interface Props {
  paperTags: CustomTag[]
  allTags: CustomTag[]
  onToggleTag: (tagName: string) => void
  onCreateTag: (name: string) => void
  onDeleteTag: (name: string) => void
  compact?: boolean
}

export default function CustomTags({ paperTags, allTags, onToggleTag, onCreateTag, onDeleteTag, compact }: Props) {
  const [showPicker, setShowPicker] = useState(false)
  const [newTagName, setNewTagName] = useState('')

  const handleCreate = () => {
    const trimmed = newTagName.trim()
    if (!trimmed) return
    onCreateTag(trimmed)
    onToggleTag(trimmed.toLowerCase())
    setNewTagName('')
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {paperTags.map(tag => (
          <span
            key={tag.name}
            className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
            style={{ background: `${tag.color}20`, color: tag.color, border: `1px solid ${tag.color}40` }}
          >
            {tag.name}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Tags</span>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="text-xs px-2 py-0.5 rounded-lg bg-white/5 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] border border-[var(--color-border)] cursor-pointer transition-all"
        >
          {showPicker ? 'Done' : '+ Edit'}
        </button>
      </div>

      {/* Current tags */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {paperTags.length === 0 && !showPicker && (
          <span className="text-xs text-[var(--color-text-muted)]">No tags yet</span>
        )}
        {paperTags.map(tag => (
          <span
            key={tag.name}
            className="text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer transition-all hover:opacity-80"
            style={{ background: `${tag.color}20`, color: tag.color, border: `1px solid ${tag.color}40` }}
            onClick={() => onToggleTag(tag.name)}
            title="Click to remove"
          >
            {tag.name} ×
          </span>
        ))}
      </div>

      {/* Tag picker */}
      {showPicker && (
        <div className="bg-white/[0.02] rounded-lg p-3 border border-[var(--color-border)]" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          {/* Existing tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {allTags.map(tag => {
                const active = paperTags.some(t => t.name === tag.name)
                return (
                  <button
                    key={tag.name}
                    onClick={() => onToggleTag(tag.name)}
                    className="text-xs px-2 py-1 rounded-full border cursor-pointer transition-all flex items-center gap-1"
                    style={{
                      background: active ? `${tag.color}20` : 'transparent',
                      color: active ? tag.color : 'var(--color-text-muted)',
                      borderColor: active ? `${tag.color}60` : 'var(--color-border)',
                    }}
                  >
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: tag.color }} />
                    {tag.name}
                    <span
                      className="ml-0.5 hover:text-[var(--color-red)] transition-colors"
                      onClick={e => { e.stopPropagation(); onDeleteTag(tag.name) }}
                      title="Delete tag"
                    >
                      ×
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Create new tag */}
          <div className="flex gap-1.5">
            <input
              type="text"
              value={newTagName}
              onChange={e => setNewTagName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCreate() }}
              placeholder="New tag name..."
              className="text-xs px-2 py-1.5 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] flex-1 outline-none focus:border-[var(--color-accent)]/50"
              maxLength={20}
            />
            <button
              onClick={handleCreate}
              disabled={!newTagName.trim()}
              className="text-xs px-3 py-1.5 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/30 cursor-pointer hover:bg-[var(--color-accent)]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
