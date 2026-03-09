import { useState } from 'react'
import type { Paper } from '../types'
import TrendAnalysis from './TrendAnalysis'
import ResearchHeatmap from './ResearchHeatmap'
import AuthorNetwork from './AuthorNetwork'
import ResearchGaps from './ResearchGaps'
import DataExplorer from './DataExplorer'

interface Props {
  papers: Paper[]
  onSearch: (q: string) => void
}

const tabs = [
  { id: 'trends', label: 'Trends' },
  { id: 'heatmap', label: 'Heatmap' },
  { id: 'authors', label: 'Authors' },
  { id: 'gaps', label: 'Research Gaps' },
  { id: 'explorer', label: 'Data Explorer' },
] as const

type TabId = typeof tabs[number]['id']

export default function AnalyticsTabs({ papers, onSearch }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('trends')

  return (
    <div className="max-w-5xl mx-auto mb-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider bg-transparent border-none cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
      >
        <span style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▶</span>
        Analytics & Insights
        <span className="text-[var(--color-text-muted)] normal-case tracking-normal font-normal">— trends, authors, research gaps</span>
      </button>

      {expanded && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          {/* Tab navigation */}
          <div className="flex gap-0.5 bg-[var(--color-bg-card)] rounded-lg p-0.5 border border-[var(--color-border)] mb-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2 rounded-md text-xs font-medium transition-all cursor-pointer border-none shrink-0"
                style={{
                  background: activeTab === tab.id ? 'rgba(0,255,136,0.1)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'trends' && <TrendAnalysis papers={papers} />}
          {activeTab === 'heatmap' && <ResearchHeatmap papers={papers} />}
          {activeTab === 'authors' && <AuthorNetwork papers={papers} onAuthorClick={onSearch} />}
          {activeTab === 'gaps' && <ResearchGaps papers={papers} onSearch={onSearch} />}
          {activeTab === 'explorer' && <DataExplorer papers={papers} onSearch={onSearch} />}
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
