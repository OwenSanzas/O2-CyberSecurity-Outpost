import type { Paper, Language } from '../types'

const categoryColors: Record<string, string> = {
  'vulnerability-detection': '#ff4444',
  'fuzzing': '#44aaff',
  'privacy': '#44ff88',
}

interface Props {
  papers: Paper[]
  lang: Language
  onClose: () => void
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm text-[var(--color-text-secondary)]">{children}</div>
    </div>
  )
}

export default function PaperComparison({ papers, lang, onClose }: Props) {
  if (papers.length < 2) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 px-4 overflow-y-auto" onClick={onClose}>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-6xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'modalIn 0.2s ease-out' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Comparing {papers.length} Papers
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all border-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${papers.length}, minmax(280px, 1fr))` }}>
            {papers.map(paper => {
              const summary = lang === 'zh' ? (paper.summary_zh || paper.summary) : paper.summary
              const contributions = lang === 'zh' ? (paper.contributions_zh || paper.contributions) : paper.contributions
              const exp = paper.experiment
              const mainCat = paper.categories[0] || 'vulnerability-detection'

              return (
                <div key={paper.id} className="p-5 border-r border-[var(--color-border)] last:border-r-0">
                  {/* Header */}
                  <div className="mb-3 pb-3 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-[var(--color-accent)]">{paper.year}</span>
                      <span className="text-xs">{'⭐'.repeat(paper.recommendation ?? 1)}</span>
                      <span className="w-2 h-2 rounded-full" style={{ background: categoryColors[mainCat] }} />
                    </div>
                    {paper.system_name && (
                      <div className="text-sm font-mono font-bold text-[var(--color-accent)] mb-1">[{paper.system_name}]</div>
                    )}
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)] leading-snug">
                      {paper.title}
                    </h3>
                    {paper.venue && (
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">{paper.venue}</p>
                    )}
                  </div>

                  {/* Summary */}
                  {summary && <Field label="Summary">{summary}</Field>}

                  {/* Contributions */}
                  {contributions && contributions.length > 0 && (
                    <Field label="Contributions">
                      <ul className="space-y-1">
                        {contributions.map((c, i) => (
                          <li key={i} className="flex gap-1.5 text-xs">
                            <span className="text-[var(--color-accent)] shrink-0">▸</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </Field>
                  )}

                  {/* Experiment fields */}
                  {exp && (
                    <>
                      {exp.llm && exp.llm.length > 0 && (
                        <Field label="LLMs">
                          <div className="flex flex-wrap gap-1">
                            {exp.llm.map(l => (
                              <span key={l} className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-purple)]/10 text-[var(--color-purple)]">{l}</span>
                            ))}
                          </div>
                        </Field>
                      )}
                      {exp.language && exp.language.length > 0 && (
                        <Field label="Languages">
                          <div className="flex flex-wrap gap-1">
                            {exp.language.map(l => (
                              <span key={l} className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-blue)]/10 text-[var(--color-blue)]">{l}</span>
                            ))}
                          </div>
                        </Field>
                      )}
                      {exp.vulnerability_type && exp.vulnerability_type.length > 0 && (
                        <Field label="Vulnerability Types">
                          <div className="flex flex-wrap gap-1">
                            {exp.vulnerability_type.map(v => (
                              <span key={v} className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-red)]/10 text-[var(--color-red)]">{v}</span>
                            ))}
                          </div>
                        </Field>
                      )}
                      {exp.key_results && <Field label="Key Results">{exp.key_results}</Field>}
                      {exp.fine_tuning && (
                        <Field label="Fine-tuning">
                          Yes{exp.fine_tuning_method ? ` — ${exp.fine_tuning_method}` : ''}
                        </Field>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
