interface Props {
  onSearch: (q: string) => void
  currentQuery?: string
}

const quickFilters = [
  { label: 'GPT-4', query: 'GPT-4' },
  { label: 'Fine-tuning', query: 'fine-tuning' },
  { label: 'Solidity', query: 'solidity' },
  { label: 'CodeLlama', query: 'CodeLlama' },
  { label: 'Smart Contract', query: 'smart contract' },
  { label: 'Zero-day', query: 'zero-day' },
  { label: 'Protocol Fuzzing', query: 'protocol fuzzing' },
  { label: 'RAG', query: 'retrieval augmented' },
  { label: 'Static Analysis', query: 'static analysis' },
  { label: 'ChatGPT', query: 'ChatGPT' },
  { label: 'IoT', query: 'IoT' },
  { label: 'Privacy', query: 'privacy' },
]

export default function QuickFilters({ onSearch, currentQuery }: Props) {
  return (
    <div className="max-w-3xl mx-auto mb-4 flex flex-wrap gap-1.5 justify-center">
      <span className="text-xs text-[var(--color-text-muted)] self-center mr-1">Quick:</span>
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
