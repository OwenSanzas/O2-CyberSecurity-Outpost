import { useState } from 'react'

export default function Methodology() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="mb-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider bg-transparent border-none cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
      >
        <span style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▶</span>
        About This Collection
      </button>

      {expanded && (
        <div className="mt-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Methodology & Scope</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            <div>
              <h4 className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wider mb-2">Paper Selection</h4>
              <p className="mb-3">
                Papers are curated from top security venues (IEEE S&P, USENIX Security, CCS, NDSS),
                software engineering venues (ICSE, FSE, ASE, ISSTA), and relevant arXiv preprints.
                Each paper must use LLMs as a core component of its security approach.
              </p>

              <h4 className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wider mb-2">Categories</h4>
              <ul className="space-y-1">
                <li className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-red)] mt-1.5 shrink-0" />
                  <span><strong>Vulnerability Detection</strong> — Using LLMs to find bugs, vulnerabilities, and security flaws in source code</span>
                </li>
                <li className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-blue)] mt-1.5 shrink-0" />
                  <span><strong>Fuzzing</strong> — LLM-guided or LLM-enhanced fuzz testing for software and protocols</span>
                </li>
                <li className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-green)] mt-1.5 shrink-0" />
                  <span><strong>Data Privacy</strong> — Privacy attacks, defenses, and analysis related to LLMs and data</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wider mb-2">Recommendation Levels</h4>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="shrink-0">⭐⭐⭐</span>
                  <span><strong>Top-Tier</strong> — Published at top-4 security or top-tier SE venues (S&P, CCS, USENIX Security, NDSS, ICSE, FSE, ISSTA, SOSP)</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0">⭐⭐</span>
                  <span><strong>Quality</strong> — Published at good journals or conferences (TOSEM, TSE, APSEC, ESORICS, etc.)</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0">⭐</span>
                  <span><strong>Standard</strong> — arXiv preprints, workshops, or less established venues</span>
                </li>
              </ul>

              <h4 className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wider mt-4 mb-2">Contributing</h4>
              <p>
                Use the <code className="text-xs px-1.5 py-0.5 bg-white/5 rounded">/add-paper</code> skill
                in Claude Code to submit new papers. Papers are automatically enriched with metadata,
                categorized, and assigned recommendation levels.
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
