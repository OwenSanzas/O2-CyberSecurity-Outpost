import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import Filters from './components/Filters'
import FacetedFilters from './components/FacetedFilters'
import PaperCard from './components/PaperCard'
import PaperModal from './components/PaperModal'
import MatrixRain from './components/MatrixRain'
import Stats from './components/Stats'
import ExportButton from './components/ExportButton'
import QuickFilters from './components/QuickFilters'
import FeaturedPapers from './components/FeaturedPapers'
import PaperTable from './components/PaperTable'
import TimelineView from './components/TimelineView'
import PaperComparison from './components/PaperComparison'
import ReadingListPanel from './components/ReadingListPanel'
import ShareButton from './components/ShareButton'
import KnowledgeGraph from './components/KnowledgeGraph'
import TrendAnalysis from './components/TrendAnalysis'
import Insights from './components/Insights'
import Methodology from './components/Methodology'
import Footer from './components/Footer'
import { useSearch } from './hooks/useSearch'
import { useAggregations } from './hooks/useAggregations'
import { useUrlState } from './hooks/useUrlState'
import { useReadingList } from './hooks/useReadingList'
import { useRelatedPapers } from './hooks/useRelatedPapers'
import { useDebounce } from './hooks/useDebounce'
import papersData from './data/papers.json'
import type { Paper, CategoryFilter, SortBy, Language } from './types'

const papers: Paper[] = papersData as Paper[]
const PAGE_SIZE = 20

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [sortBy, setSortBy] = useState<SortBy>('year-desc')
  const [recommendationFilter, setRecommendationFilter] = useState('all')
  const [lang, setLang] = useState<Language>('en')
  const [facetFilters, setFacetFilters] = useState<Record<string, string[]>>({})
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'card' | 'table' | 'timeline'>('card')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [showGraph, setShowGraph] = useState(false)

  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 200)

  // Sync debounced search to query state
  useEffect(() => {
    setQuery(debouncedSearch)
  }, [debouncedSearch])

  const readingList = useReadingList()

  // Deep link: open paper from URL hash
  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#paper=')) {
      const paperId = decodeURIComponent(hash.slice(7))
      const paper = papers.find(p => p.id === paperId)
      if (paper) setSelectedPaper(paper)
    }
  }, [])

  // Update hash when paper opens/closes
  useEffect(() => {
    if (selectedPaper) {
      window.history.replaceState(null, '', `#paper=${encodeURIComponent(selectedPaper.id)}`)
    } else {
      if (window.location.hash.startsWith('#paper=')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    }
  }, [selectedPaper])

  useUrlState(
    { query, category, yearFilter, sortBy, recommendationFilter, lang },
    { setQuery, setCategory, setYearFilter, setSortBy, setRecommendationFilter, setLang }
  )

  const miniSearch = useSearch(papers)

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement
      const isInput = active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA'

      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !isInput) {
        e.preventDefault()
        document.querySelector<HTMLInputElement>('#search-input')?.focus()
      }
      // R for random paper
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey && !isInput && !selectedPaper) {
        e.preventDefault()
        const randomPaper = papers[Math.floor(Math.random() * papers.length)]
        setSelectedPaper(randomPaper)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedPaper])

  // Back to top visibility
  useEffect(() => {
    const handler = () => setShowBackToTop(window.scrollY > 600)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const years = useMemo(() => {
    const set = new Set(papers.map(p => p.year))
    return [...set].sort((a, b) => b - a)
  }, [])

  const handleFacetChange = useCallback((key: string, values: string[]) => {
    setFacetFilters(prev => ({ ...prev, [key]: values }))
  }, [])

  const filtered = useMemo(() => {
    let result: Paper[]
    if (query.trim()) {
      const searchResults = miniSearch.search(query.trim())
      const idSet = new Set(searchResults.map(r => r.id))
      result = papers.filter(p => idSet.has(p.id))
    } else {
      result = papers
    }

    if (category !== 'all') {
      result = result.filter(p => p.categories.includes(category))
    }

    if (yearFilter !== 'all') {
      result = result.filter(p => p.year === Number(yearFilter))
    }

    if (recommendationFilter !== 'all') {
      result = result.filter(p => (p.recommendation ?? 1) === Number(recommendationFilter))
    }

    for (const [key, values] of Object.entries(facetFilters)) {
      if (!values.length) continue
      result = result.filter(p => {
        const exp = p.experiment
        if (!exp) return false
        if (key === 'fine_tuning') {
          return values.includes(exp.fine_tuning ? 'Yes' : 'No')
        }
        if (key === 'recommendation') {
          return values.includes(String(p.recommendation ?? 1))
        }
        const field = exp[key as keyof typeof exp]
        if (Array.isArray(field)) {
          return values.some(v => field.includes(v))
        }
        return false
      })
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'year-desc') return b.year - a.year || a.title.localeCompare(b.title)
      if (sortBy === 'year-asc') return a.year - b.year || a.title.localeCompare(b.title)
      if (sortBy === 'recommendation') return (b.recommendation ?? 1) - (a.recommendation ?? 1) || b.year - a.year
      return a.title.localeCompare(b.title)
    })
  }, [query, category, yearFilter, sortBy, recommendationFilter, facetFilters, miniSearch])

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [query, category, yearFilter, sortBy, recommendationFilter, facetFilters])

  const aggregations = useAggregations(filtered)
  const relatedPapers = useRelatedPapers(selectedPaper, papers)

  const visiblePapers = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])
  const hasMore = visibleCount < filtered.length

  const toggleCompare = useCallback((id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id)
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
  }, [])

  const comparisonPapers = useMemo(
    () => papers.filter(p => compareIds.includes(p.id)),
    [compareIds]
  )

  // Infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = loadMoreRef.current
    if (!el || !hasMore) return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => prev + PAGE_SIZE)
      }
    }, { rootMargin: '200px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, visibleCount])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of papers) {
      for (const c of p.categories) counts[c] = (counts[c] || 0) + 1
    }
    return counts
  }, [])

  const openRandomPaper = useCallback(() => {
    const randomPaper = papers[Math.floor(Math.random() * papers.length)]
    setSelectedPaper(randomPaper)
  }, [])

  return (
    <div className="min-h-screen relative">
      <MatrixRain />

      <div className="relative z-1">
        <Header paperCount={papers.length} lang={lang} onLangChange={setLang} />

        <main id="papers" className="max-w-7xl mx-auto px-4 py-8" role="main" aria-label="Paper collection">
          <Stats papers={papers} />
          <Insights papers={papers} />
          <FeaturedPapers papers={papers} lang={lang} onPaperClick={setSelectedPaper} />

          {/* Knowledge Graph (collapsible) */}
          <div className="max-w-5xl mx-auto mb-8">
            <button
              onClick={() => setShowGraph(!showGraph)}
              className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider bg-transparent border-none cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
            >
              <span style={{ transform: showGraph ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▶</span>
              Knowledge Graph
              <span className="text-[var(--color-text-muted)] normal-case tracking-normal font-normal">— interactive paper relationship map</span>
            </button>
            {showGraph && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <KnowledgeGraph papers={papers} onPaperClick={setSelectedPaper} />
              </div>
            )}
          </div>

          <TrendAnalysis papers={papers} />

          <SearchBar query={searchInput} onChange={setSearchInput} resultCount={filtered.length} totalCount={papers.length} papers={papers} />
          <QuickFilters onSearch={(q: string) => { setSearchInput(q); setQuery(q) }} currentQuery={query} />
          <Filters
            category={category}
            onCategoryChange={setCategory}
            yearFilter={yearFilter}
            onYearChange={setYearFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            years={years}
            recommendationFilter={recommendationFilter}
            onRecommendationChange={setRecommendationFilter}
            categoryCounts={categoryCounts}
            totalCount={papers.length}
          />

          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <div className="flex gap-2 items-center flex-wrap">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50 transition-all cursor-pointer"
              >
                Filters {Object.values(facetFilters).reduce((s, v) => s + v.length, 0) > 0 && `(${Object.values(facetFilters).reduce((s, v) => s + v.length, 0)})`}
              </button>

              {/* View toggle */}
              <div className="flex gap-0.5 bg-[var(--color-bg-card)] rounded-lg p-0.5 border border-[var(--color-border)]">
                {([
                  { mode: 'card' as const, icon: '\u25A6', label: 'Card view' },
                  { mode: 'table' as const, icon: '\u2630', label: 'Table view' },
                  { mode: 'timeline' as const, icon: '\u2502', label: 'Timeline view' },
                ]).map(v => (
                  <button
                    key={v.mode}
                    onClick={() => setViewMode(v.mode)}
                    className="px-2 py-1 rounded text-xs cursor-pointer border-none transition-all"
                    style={{
                      background: viewMode === v.mode ? 'rgba(255,255,255,0.08)' : 'transparent',
                      color: viewMode === v.mode ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    }}
                    title={v.label}
                  >
                    {v.icon}
                  </button>
                ))}
              </div>

              {/* Random paper */}
              <button
                onClick={openRandomPaper}
                className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition-all cursor-pointer"
                title="Open a random paper (R)"
              >
                Discover
              </button>

              {/* Compare toggle */}
              {compareIds.length > 0 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent)] cursor-pointer hover:bg-[var(--color-accent)]/20 transition-all"
                >
                  Compare ({compareIds.length})
                </button>
              )}
              {compareIds.length > 0 && (
                <button
                  onClick={() => setCompareIds([])}
                  className="text-xs px-2 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-text-secondary)] transition-all bg-transparent"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-text-muted)]">
                {filtered.length} paper{filtered.length !== 1 ? 's' : ''}
              </span>
              <ShareButton />
              <ExportButton papers={filtered} />
            </div>
          </div>

          {/* Mobile filters */}
          {showMobileFilters && (
            <div className="lg:hidden mb-4">
              <FacetedFilters
                aggregations={aggregations}
                activeFilters={facetFilters}
                onFilterChange={handleFacetChange}
              />
            </div>
          )}

          <div className="flex gap-6">
            <aside className="w-72 shrink-0 hidden lg:block">
              <div className="sticky top-4">
                <FacetedFilters
                  aggregations={aggregations}
                  activeFilters={facetFilters}
                  onFilterChange={handleFacetChange}
                />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-[var(--color-text-muted)]">
                  <div className="text-4xl mb-3">?</div>
                  <p>No papers found matching your criteria.</p>
                  <p className="text-xs mt-2">Try adjusting your filters or search query.</p>
                </div>
              ) : viewMode === 'table' ? (
                <PaperTable
                  papers={filtered}
                  lang={lang}
                  onPaperClick={setSelectedPaper}
                  isInReadingList={readingList.has}
                  onToggleReadingList={readingList.toggle}
                />
              ) : viewMode === 'timeline' ? (
                <TimelineView papers={filtered} lang={lang} onPaperClick={setSelectedPaper} />
              ) : (
                <>
                  <div className="grid gap-4">
                    {visiblePapers.map((paper, i) => (
                      <div
                        key={paper.id}
                        className="card-enter"
                        style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
                      >
                        <PaperCard
                          paper={paper}
                          lang={lang}
                          onClick={() => setSelectedPaper(paper)}
                          isInReadingList={readingList.has(paper.id)}
                          onToggleReadingList={() => readingList.toggle(paper.id)}
                          isSelected={compareIds.includes(paper.id)}
                          onSelect={() => toggleCompare(paper.id)}
                        />
                      </div>
                    ))}
                  </div>
                  {hasMore && (
                    <div ref={loadMoreRef} className="text-center mt-6 py-4">
                      <div className="inline-flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                        <span className="w-4 h-4 border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin" />
                        Loading more papers...
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>

        <div className="max-w-7xl mx-auto px-4">
          <Methodology />
        </div>

        <Footer />
      </div>

      {/* Paper detail modal */}
      {selectedPaper && (() => {
        const idx = filtered.findIndex(p => p.id === selectedPaper.id)
        return (
          <PaperModal
            paper={selectedPaper}
            lang={lang}
            onClose={() => setSelectedPaper(null)}
            relatedPapers={relatedPapers}
            onPaperClick={setSelectedPaper}
            isInReadingList={readingList.has(selectedPaper.id)}
            onToggleReadingList={() => readingList.toggle(selectedPaper.id)}
            onPrev={idx > 0 ? () => setSelectedPaper(filtered[idx - 1]) : undefined}
            onNext={idx >= 0 && idx < filtered.length - 1 ? () => setSelectedPaper(filtered[idx + 1]) : undefined}
            currentIndex={idx >= 0 ? idx : undefined}
            totalCount={filtered.length}
          />
        )
      })()}

      {/* Paper comparison */}
      {showComparison && comparisonPapers.length >= 2 && (
        <PaperComparison
          papers={comparisonPapers}
          lang={lang}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Reading list panel */}
      <ReadingListPanel
        papers={papers}
        lang={lang}
        readingListIds={readingList.ids}
        onPaperClick={(p) => setSelectedPaper(p)}
        onRemove={(id) => readingList.toggle(id)}
        onClear={readingList.clear}
      />

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-accent)] flex items-center justify-center cursor-pointer hover:border-[var(--color-accent)]/50 transition-all z-40 shadow-lg"
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          ↑
        </button>
      )}

      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-6 left-6 text-xs text-[var(--color-text-muted)] hidden lg:block z-40">
        <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded text-[var(--color-text-secondary)] font-mono">/</kbd> search
        <span className="mx-1.5 text-[var(--color-border)]">|</span>
        <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded text-[var(--color-text-secondary)] font-mono">R</kbd> random
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default App
