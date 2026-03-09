import { useMemo } from 'react'
import type { Paper } from '../types'

interface Props {
  papers: Paper[]
  onSearch: (q: string) => void
}

interface Gap {
  area: string
  detail: string
  strength: 'low' | 'medium'
}

export default function ResearchGaps({ papers, onSearch }: Props) {
  const gaps = useMemo(() => {
    const result: Gap[] = []

    // Analyze language coverage
    const langCounts = new Map<string, number>()
    const llmCounts = new Map<string, number>()
    const vulnCounts = new Map<string, number>()
    const catCounts = new Map<string, number>()
    let fineTuned = 0
    let notFineTuned = 0
    let withCode = 0

    for (const p of papers) {
      for (const c of p.categories) catCounts.set(c, (catCounts.get(c) || 0) + 1)
      if (p.codeUrl) withCode++
      const exp = p.experiment
      if (!exp) continue
      for (const l of exp.language ?? []) langCounts.set(l, (langCounts.get(l) || 0) + 1)
      for (const l of exp.llm ?? []) llmCounts.set(l, (llmCounts.get(l) || 0) + 1)
      for (const v of exp.vulnerability_type ?? []) vulnCounts.set(v, (vulnCounts.get(v) || 0) + 1)
      if (exp.fine_tuning) fineTuned++
      else notFineTuned++
    }

    // Check category coverage
    const privacyCount = catCounts.get('privacy') || 0

    if (privacyCount < papers.length * 0.15) {
      result.push({
        area: 'Data Privacy',
        detail: `Only ${privacyCount} papers (${Math.round(privacyCount / papers.length * 100)}%) cover privacy — an increasingly important area`,
        strength: privacyCount < 5 ? 'low' : 'medium',
      })
    }

    // Check fine-tuning adoption
    const ftRatio = fineTuned / (fineTuned + notFineTuned || 1)
    if (ftRatio < 0.3) {
      result.push({
        area: 'Fine-tuning',
        detail: `Only ${Math.round(ftRatio * 100)}% of papers use fine-tuning — most rely on prompting or zero-shot approaches`,
        strength: ftRatio < 0.15 ? 'low' : 'medium',
      })
    }

    // Check code availability
    const codeRatio = withCode / papers.length
    if (codeRatio < 0.5) {
      result.push({
        area: 'Reproducibility',
        detail: `Only ${Math.round(codeRatio * 100)}% (${withCode}/${papers.length}) papers share source code`,
        strength: codeRatio < 0.3 ? 'low' : 'medium',
      })
    }

    // Check language diversity
    const topLangs = [...langCounts.entries()].sort((a, b) => b[1] - a[1])
    if (topLangs.length > 0) {
      const topLangPct = topLangs[0][1] / papers.length
      if (topLangPct > 0.4) {
        result.push({
          area: 'Language Diversity',
          detail: `${topLangs[0][0]} dominates with ${topLangs[0][1]} papers — emerging languages like Rust, Go, and Kotlin are underexplored`,
          strength: 'medium',
        })
      }
    }

    // Check for model diversity
    const topLLMs = [...llmCounts.entries()].sort((a, b) => b[1] - a[1])
    const gptFamily = topLLMs.filter(([name]) => name.toLowerCase().includes('gpt'))
    const gptTotal = gptFamily.reduce((s, [, c]) => s + c, 0)
    const totalLLMUsage = topLLMs.reduce((s, [, c]) => s + c, 0)
    if (totalLLMUsage > 0 && gptTotal / totalLLMUsage > 0.4) {
      result.push({
        area: 'Model Diversity',
        detail: `GPT family accounts for ${Math.round(gptTotal / totalLLMUsage * 100)}% of usage — open-source models are underrepresented`,
        strength: 'medium',
      })
    }

    return result
  }, [papers])

  if (gaps.length === 0) return null

  return (
    <div className="max-w-5xl mx-auto mb-8">
      <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">
        Research Gaps & Opportunities
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {gaps.map(gap => (
          <div
            key={gap.area}
            className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-border-hover)] transition-all cursor-pointer"
            onClick={() => onSearch(gap.area.toLowerCase())}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${gap.strength === 'low' ? 'bg-[var(--color-red)]' : 'bg-[var(--color-orange)]'}`} />
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">{gap.area}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${gap.strength === 'low' ? 'bg-[var(--color-red)]/10 text-[var(--color-red)]' : 'bg-[var(--color-orange)]/10 text-[var(--color-orange)]'}`}>
                {gap.strength === 'low' ? 'Underexplored' : 'Room for Growth'}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{gap.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
