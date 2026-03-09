interface Props {
  onSearch: (q: string) => void
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
]

export default function QuickFilters({ onSearch }: Props) {
  return (
    <div className="max-w-3xl mx-auto mb-4 flex flex-wrap gap-1.5 justify-center">
      <span className="text-xs text-[var(--color-text-muted)] self-center mr-1">Quick:</span>
      {quickFilters.map(f => (
        <button
          key={f.label}
          onClick={() => onSearch(f.query)}
          className="text-xs px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] transition-all cursor-pointer bg-transparent"
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
