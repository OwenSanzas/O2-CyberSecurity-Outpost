import { useState, useMemo, useCallback, useEffect, useRef, lazy, Suspense } from 'react'
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
const KnowledgeGraph = lazy(() => import('./components/KnowledgeGraph'))
const TrendAnalysis = lazy(() => import('./components/TrendAnalysis'))
const ResearchHeatmap = lazy(() => import('./components/ResearchHeatmap'))
import Insights from './components/Insights'
import KeyboardHelp from './components/KeyboardHelp'
import RecentlyViewed from './components/RecentlyViewed'
import TagCloud from './components/TagCloud'
import PaperOfTheDay from './components/PaperOfTheDay'
import FilterSummary from './components/FilterSummary'
const AuthorNetwork = lazy(() => import('./components/AuthorNetwork'))
const ResearchGaps = lazy(() => import('./components/ResearchGaps'))
const DataExplorer = lazy(() => import('./components/DataExplorer'))
import ToastContainer, { showToast } from './components/Toast'
import Methodology from './components/Methodology'
import Footer from './components/Footer'
import { useSearch } from './hooks/useSearch'
import { useAggregations } from './hooks/useAggregations'
import { useUrlState } from './hooks/useUrlState'
import { useReadingList } from './hooks/useReadingList'
import { useRelatedPapers } from './hooks/useRelatedPapers'
import { useDebounce } from './hooks/useDebounce'
import { useRecentlyViewed } from './hooks/useRecentlyViewed'
import { useSearchHistory } from './hooks/useSearchHistory'
import { useNotes } from './hooks/useNotes'
import { usePreferences } from './hooks/usePreferences'
import papersData from './data/papers.json'
import type { Paper, CategoryFilter, SortBy, Language } from './types'

const papers: Paper[] = papersData as Paper[]
const PAGE_SIZE = 20

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [sortBy, setSortByState] = useState<SortBy>(() => (prefs.sortBy as SortBy) || 'year-desc')
  const [recommendationFilter, setRecommendationFilter] = useState('all')
  const [lang, setLang] = useState<Language>('en')
  const [facetFilters, setFacetFilters] = useState<Record<string, string[]>>({})
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [viewMode, setViewModeState] = useState<'card' | 'table' | 'timeline'>(prefs.viewMode)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [showGraph, setShowGraph] = useState(false)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  const [venueFilter, setVenueFilter] = useState('all')

  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 200)

  // Sync debounced search to query state + track history
  useEffect(() => {
    setQuery(debouncedSearch)
    if (debouncedSearch.trim()) searchHistory.add(debouncedSearch.trim())
  }, [debouncedSearch])

  const readingList = useReadingList()
  const recentlyViewed = useRecentlyViewed()
  const searchHistory = useSearchHistory()
  const paperNotes = useNotes()
  const { prefs, update: updatePref } = usePreferences()

  const setSortBy = useCallback((s: SortBy) => {
    setSortByState(s)
    updatePref('sortBy', s)
  }, [updatePref])

  const setViewMode = useCallback((m: 'card' | 'table' | 'timeline') => {
    setViewModeState(m)
    updatePref('viewMode', m)
  }, [updatePref])

  // Deep link: open paper from URL hash
  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#paper=')) {
      const paperId = decodeURIComponent(hash.slice(7))
      const paper = papers.find(p => p.id === paperId)
      if (paper) setSelectedPaper(paper)
    }
  }, [])

  // Update hash when paper opens/closes + track recently viewed
  useEffect(() => {
    if (selectedPaper) {
      recentlyViewed.add(selectedPaper.id)
      const currentHash = `#paper=${encodeURIComponent(selectedPaper.id)}`
      if (window.location.hash !== currentHash) {
        window.history.pushState({ paper: selectedPaper.id }, '', currentHash)
      }
    } else {
      if (window.location.hash.startsWith('#paper=')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    }
  }, [selectedPaper])

  // Handle browser back button to close modal
  useEffect(() => {
    const handler = (e: PopStateEvent) => {
      if (e.state?.paper) {
        const paper = papers.find(p => p.id === e.state.paper)
        if (paper) setSelectedPaper(paper)
      } else {
        setSelectedPaper(null)
      }
    }
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

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
      // ? for keyboard help
      if (e.key === '?' && !isInput) {
        e.preventDefault()
        setShowKeyboardHelp(prev => !prev)
      }
      // R for random paper
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey && !isInput && !selectedPaper) {
        e.preventDefault()
        const randomPaper = papers[Math.floor(Math.random() * papers.length)]
        setSelectedPaper(randomPaper)
      }
      // G for knowledge graph
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey && !isInput && !selectedPaper) {
        e.preventDefault()
        setShowGraph(prev => !prev)
      }
      // 1/2/3 for view modes
      if (['1', '2', '3'].includes(e.key) && !isInput && !selectedPaper) {
        e.preventDefault()
        const modes: ('card' | 'table' | 'timeline')[] = ['card', 'table', 'timeline']
        setViewMode(modes[Number(e.key) - 1])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedPaper])

  const [scrollProgress, setScrollProgress] = useState(0)

  // Back to top visibility + scroll progress
  useEffect(() => {
    const handler = () => {
      setShowBackToTop(window.scrollY > 600)
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const years = useMemo(() => {
    const set = new Set(papers.map(p => p.year))
    return [...set].sort((a, b) => b - a)
  }, [])

  const venues = useMemo(() => {
    const venueCount = new Map<string, number>()
    for (const p of papers) {
      if (p.venue) venueCount.set(p.venue, (venueCount.get(p.venue) || 0) + 1)
    }
    return [...venueCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([v]) => v)
  }, [])

  const handleFacetChange = useCallback((key: string, values: string[]) => {
    setFacetFilters(prev => ({ ...prev, [key]: values }))
  }, [])

  const filtered = useMemo(() => {
    let result: Paper[]
    if (query === '__reading_list__') {
      result = papers.filter(p => readingList.ids.includes(p.id))
    } else if (query.trim()) {
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

    if (venueFilter !== 'all') {
      result = result.filter(p => p.venue === venueFilter)
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
  }, [query, category, yearFilter, sortBy, recommendationFilter, venueFilter, facetFilters, miniSearch, readingList.ids])

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [query, category, yearFilter, sortBy, recommendationFilter, venueFilter, facetFilters])

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

  const handleTagClick = useCallback((tag: string) => {
    setSearchInput(tag)
    setQuery(tag)
  }, [])

  return (
    <div className="min-h-screen relative">
      {/* Skip navigation for accessibility */}
      <a href="#papers" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[var(--color-accent)] focus:text-[var(--color-bg-primary)] focus:rounded-lg focus:font-semibold focus:text-sm">
        Skip to papers
      </a>

      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

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
                <Suspense fallback={<div className="text-center py-8 text-xs text-[var(--color-text-muted)]">Loading graph...</div>}>
                <KnowledgeGraph papers={papers} onPaperClick={setSelectedPaper} />
                </Suspense>
              </div>
            )}
          </div>

          <TagCloud papers={papers} onTagClick={handleTagClick} />
          <Suspense fallback={null}>
            <TrendAnalysis papers={papers} />
            <ResearchHeatmap papers={papers} />
            <AuthorNetwork papers={papers} onAuthorClick={handleTagClick} />
            <ResearchGaps papers={papers} onSearch={handleTagClick} />
            <DataExplorer papers={papers} onSearch={handleTagClick} />
          </Suspense>

          <PaperOfTheDay papers={papers} onPaperClick={setSelectedPaper} />
          <RecentlyViewed papers={papers} recentIds={recentlyViewed.ids} onPaperClick={setSelectedPaper} />
          <div className="sticky-search">
          <SearchBar query={searchInput} onChange={setSearchInput} resultCount={filtered.length} totalCount={papers.length} papers={papers} searchHistory={searchHistory.history} onHistoryRemove={searchHistory.remove} onHistoryClear={searchHistory.clear} />
          <QuickFilters onSearch={(q: string) => { setSearchInput(q); setQuery(q) }} currentQuery={query} />
          </div>
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
            venues={venues}
            venueFilter={venueFilter}
            onVenueChange={setVenueFilter}
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

              {/* Reading list filter */}
              {readingList.count > 0 && (
                <button
                  onClick={() => {
                    if (query === '__reading_list__') {
                      setSearchInput(''); setQuery('')
                    } else {
                      setSearchInput(''); setQuery('__reading_list__')
                    }
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer"
                  style={{
                    background: query === '__reading_list__' ? 'rgba(0,255,136,0.1)' : 'var(--color-bg-card)',
                    borderColor: query === '__reading_list__' ? 'var(--color-accent)' : 'var(--color-border)',
                    color: query === '__reading_list__' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  }}
                >
                  Bookmarked ({readingList.count})
                </button>
              )}

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
                  onClick={() => { compareIds.forEach(id => { if (!readingList.has(id)) readingList.toggle(id) }); showToast(`${compareIds.length} papers bookmarked`) }}
                  className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] cursor-pointer hover:border-[var(--color-accent)]/30 hover:text-[var(--color-accent)] transition-all bg-transparent"
                  title="Bookmark all selected papers"
                >
                  Bookmark All
                </button>
              )}
              {compareIds.length > 0 && (
                <button
                  onClick={() => {
                    const bibtex = comparisonPapers.filter(p => p.bibtex).map(p => p.bibtex).join('\n\n')
                    if (bibtex) { navigator.clipboard.writeText(bibtex); showToast('BibTeX copied!') }
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] cursor-pointer hover:border-[var(--color-accent)]/30 hover:text-[var(--color-accent)] transition-all bg-transparent"
                  title="Copy BibTeX for selected papers"
                >
                  Copy BibTeX
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
              <FilterSummary
                papers={filtered}
                totalCount={papers.length}
                query={query}
                hasFilters={category !== 'all' || yearFilter !== 'all' || recommendationFilter !== 'all' || venueFilter !== 'all' || Object.values(facetFilters).some(v => v.length > 0)}
              />
              {filtered.length === 0 ? (
                <div className="text-center py-20 text-[var(--color-text-muted)]">
                  <div className="text-6xl mb-4 opacity-30">{'{ }'}</div>
                  <p className="text-lg mb-1">No papers found</p>
                  <p className="text-sm mb-4">Try adjusting your filters or search query.</p>
                  <div className="flex gap-2 justify-center mb-6">
                    <button
                      onClick={() => { setSearchInput(''); setQuery(''); setCategory('all'); setYearFilter('all'); setRecommendationFilter('all'); setVenueFilter('all'); setFacetFilters({}) }}
                      className="text-xs px-4 py-2 rounded-lg border border-[var(--color-accent)]/30 text-[var(--color-accent)] bg-transparent cursor-pointer hover:bg-[var(--color-accent)]/5 transition-all"
                    >
                      Reset all filters
                    </button>
                    <button
                      onClick={openRandomPaper}
                      className="text-xs px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] bg-transparent cursor-pointer hover:border-[var(--color-accent)]/30 transition-all"
                    >
                      Discover a random paper
                    </button>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-2">Try searching for:</p>
                  <div className="flex gap-1.5 justify-center flex-wrap">
                    {['GPT-4', 'fuzzing', 'smart contract', 'CodeLlama', 'privacy'].map(q => (
                      <button key={q} onClick={() => handleTagClick(q)}
                        className="text-xs px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] bg-transparent cursor-pointer hover:border-[var(--color-accent)]/30 transition-all">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : viewMode === 'table' ? (
                <PaperTable
                  papers={filtered}
                  lang={lang}
                  onPaperClick={setSelectedPaper}
                  isInReadingList={readingList.has}
                  onToggleReadingList={readingList.toggle}
                  compareIds={compareIds}
                  onToggleCompare={toggleCompare}
                />
              ) : viewMode === 'timeline' ? (
                <TimelineView
                  papers={filtered}
                  lang={lang}
                  onPaperClick={setSelectedPaper}
                  isInReadingList={readingList.has}
                  onToggleReadingList={readingList.toggle}
                />
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
                          onTagClick={handleTagClick}
                          hasNote={paperNotes.hasNote(paper.id)}
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
            note={paperNotes.getNote(selectedPaper.id)}
            onNoteSave={paperNotes.setNote}
            onAuthorClick={(author) => { setSelectedPaper(null); handleTagClick(author) }}
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
        notes={paperNotes.notes}
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

      {/* Toast notifications */}
      <ToastContainer />

      {/* Keyboard help */}
      {showKeyboardHelp && (
        <KeyboardHelp onClose={() => setShowKeyboardHelp(false)} />
      )}

      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-6 left-6 text-xs text-[var(--color-text-muted)] hidden lg:block z-40">
        <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded text-[var(--color-text-secondary)] font-mono">/</kbd> search
        <span className="mx-1.5 text-[var(--color-border)]">|</span>
        <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded text-[var(--color-text-secondary)] font-mono">R</kbd> random
        <span className="mx-1.5 text-[var(--color-border)]">|</span>
        <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded text-[var(--color-text-secondary)] font-mono">?</kbd> help
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
