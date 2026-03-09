import { useState } from 'react'
import type { FilterPreset } from '../hooks/useFilterPresets'
import { showToast } from './Toast'

interface Props {
  presets: FilterPreset[]
  onSave: (name: string) => void
  onLoad: (preset: FilterPreset) => void
  onDelete: (id: string) => void
}

export default function FilterPresets({ presets, onSave, onLoad, onDelete }: Props) {
  const [showSave, setShowSave] = useState(false)
  const [name, setName] = useState('')

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onSave(trimmed)
    setName('')
    setShowSave(false)
    showToast(`Filter preset "${trimmed}" saved!`)
  }

  if (presets.length === 0 && !showSave) {
    return (
      <button
        onClick={() => setShowSave(true)}
        className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition-all cursor-pointer"
        title="Save current filters as a preset"
      >
        Save Preset
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* Existing presets */}
      {presets.map(preset => (
        <div key={preset.id} className="flex items-center gap-0 group/preset">
          <button
            onClick={() => { onLoad(preset); showToast(`Loaded "${preset.name}"`) }}
            className="text-xs px-2.5 py-1.5 rounded-l-lg border border-r-0 border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition-all cursor-pointer"
            title={`Load preset "${preset.name}"`}
          >
            {preset.name}
          </button>
          <button
            onClick={() => { onDelete(preset.id); showToast('Preset deleted') }}
            className="text-xs px-1.5 py-1.5 rounded-r-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:text-[var(--color-red)] transition-all cursor-pointer opacity-0 group-hover/preset:opacity-100"
            title="Delete preset"
          >
            ×
          </button>
        </div>
      ))}

      {/* Save new */}
      {showSave ? (
        <div className="flex gap-1">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setShowSave(false) }}
            placeholder="Preset name..."
            className="text-xs px-2 py-1.5 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]/50 w-28"
            autoFocus
            maxLength={20}
          />
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="text-xs px-2 py-1.5 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/30 cursor-pointer hover:bg-[var(--color-accent)]/20 transition-all disabled:opacity-30"
          >
            Save
          </button>
          <button
            onClick={() => { setShowSave(false); setName('') }}
            className="text-xs px-2 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-text-secondary)] transition-all bg-transparent"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowSave(true)}
          className="text-xs px-2 py-1.5 rounded-lg border border-dashed border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition-all cursor-pointer bg-transparent"
          title="Save current filters"
        >
          + Save
        </button>
      )}
    </div>
  )
}
