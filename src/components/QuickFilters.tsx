interface Props {
  onSearch: (q: string) => void
  currentQuery?: string
}

const quickFilters = [
  { label: 'GPT-4', query: 'GPT-4' },
  { label: 'Smart Contract', query: 'smart contract' },
  { label: 'Harness Gen', query: 'harness generation' },
  { label: 'Patch', query: 'program repair' },
  { label: 'Fuzzing', query: 'fuzzing' },
  { label: 'Privacy', query: 'privacy' },
]

export default function QuickFilters({ onSearch, currentQuery }: Props) {
  return (
    <div className="mb-4 flex flex-wrap gap-1.5">
      {quickFilters.map(f => {
        const isActive = currentQuery?.toLowerCase() === f.query.toLowerCase()
        return (
          <button
            key={f.label}
            onClick={() => onSearch(isActive ? '' : f.query)}
            className="text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer"
            style={{
              background: isActive ? 'rgba(0,255,136,0.1)' : 'transparent',
              borderColor: isActive ? 'var(--color-accent)' : 'var(--color-border)',
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
            }}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}
