interface Props {
  query: string
  onChange: (q: string) => void
  resultCount: number
}

export default function SearchBar({ query, onChange, resultCount }: Props) {
  return (
    <div className="relative max-w-2xl mx-auto mb-6">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => onChange(e.target.value)}
          placeholder="Search papers by title, author, or keyword..."
          className="w-full pl-12 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]/50 transition-colors text-sm"
        />
        {query && (
          <button
            onClick={() => onChange('')}
            className="absolute right-14 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors bg-transparent border-none cursor-pointer text-lg"
          >
            ✕
          </button>
        )}
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)]">
          {resultCount} results
        </span>
      </div>
    </div>
  )
}
