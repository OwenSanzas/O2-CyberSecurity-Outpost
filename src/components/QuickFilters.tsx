interface Props {
  onSearch: (q: string) => void
  currentQuery?: string
}

const quickFilters = [
  { label: 'GPT-4', query: 'GPT-4' },
  { label: 'ChatGPT', query: 'ChatGPT' },
  { label: 'CodeLlama', query: 'CodeLlama' },
  { label: 'Fine-tuning', query: 'fine-tuning' },
  { label: 'Smart Contract', query: 'smart contract' },
  { label: 'Solidity', query: 'solidity' },
  { label: 'Zero-day', query: 'zero-day' },
  { label: 'Protocol Fuzzing', query: 'protocol fuzzing' },
  { label: 'RAG', query: 'retrieval augmented' },
  { label: 'Static Analysis', query: 'static analysis' },
  { label: 'IoT', query: 'IoT' },
  { label: 'Privacy', query: 'privacy' },
  { label: 'C/C++', query: 'C/C++' },
  { label: 'Java', query: 'Java' },
]

export default function QuickFilters({ onSearch, currentQuery }: Props) {
  return (
    <div className="mb-4 flex flex-wrap gap-1.5">
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
