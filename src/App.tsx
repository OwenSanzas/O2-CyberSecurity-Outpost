import { useState, useMemo, useCallback, useEffect, useRef, lazy, Suspense } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import Filters from './components/Filters'
import PaperCard from './components/PaperCard'
import PaperDetail from './components/PaperDetail'
import MatrixRain from './components/MatrixRain'
import ExportButton from './components/ExportButton'
import QuickFilters from './components/QuickFilters'
import PaperTable from './components/PaperTable'
import TimelineView from './components/TimelineView'
import PaperComparison from './components/PaperComparison'
const KnowledgeGraph = lazy(() => import('./components/KnowledgeGraph'))
import Insights from './components/Insights'
import KeyboardHelp from './components/KeyboardHelp'
import RecentlyViewed from './components/RecentlyViewed'
import TagCloud from './components/TagCloud'
import AnalyticsTabs from './components/AnalyticsTabs'
import ToastContainer from './components/Toast'
import MobileNav from './components/MobileNav'
import CommandPalette from './components/CommandPalette'
import Footer from './components/Footer'
import { useSearch } from './hooks/useSearch'
// import { useAggregations } from './hooks/useAggregations'
import { useUrlState } from './hooks/useUrlState'
import { useReadingList } from './hooks/useReadingList'
import { useRelatedPapers } from './hooks/useRelatedPapers'
import { useDebounce } from './hooks/useDebounce'
import { useRecentlyViewed } from './hooks/useRecentlyViewed'
import { useSearchHistory } from './hooks/useSearchHistory'
import { useNotes } from './hooks/useNotes'
import { usePreferences } from './hooks/usePreferences'
import { useReadingProgress } from './hooks/useReadingProgress'
import { useTheme } from './hooks/useTheme'
import { useCustomTags } from './hooks/useCustomTags'
import papersData from './data/papers.json'
import type { Paper, CategoryFilter, SortBy, Language } from './types'

const papers: Paper[] = papersData as Paper[]
const PAGE_SIZE = 20

function App() {
  const { prefs, update: updatePref } = usePreferences()
  const readingList = useReadingList()
  const recentlyViewed = useRecentlyViewed()
  const searchHistory = useSearchHistory()
  const paperNotes = useNotes()
  const readingProgress = useReadingProgress()
  const { theme, toggle: toggleTheme } = useTheme()
  const customTags = useCustomTags()


  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [sortBy, setSortByState] = useState<SortBy>(() => (prefs.sortBy as SortBy) || 'year-desc')
  const [recommendationFilter, setRecommendationFilter] = useState('all')
  const [lang, setLang] = useState<Language>('en')
  const [facetFilters, setFacetFilters] = useState<Record<string, string[]>>({})
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [viewMode, setViewModeState] = useState<'card' | 'table' | 'timeline'>(prefs.viewMode)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  const [venueFilter, setVenueFilter] = useState('all')
  const [focusMode, setFocusMode] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)

  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 200)

  useEffect(() => {
    setQuery(debouncedSearch)
    if (debouncedSearch.trim()) searchHistory.add(debouncedSearch.trim())
  }, [debouncedSearch])

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

      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setShowCommandPalette(prev => !prev)
      }
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !isInput) {
        e.preventDefault()
        document.querySelector<HTMLInputElement>('#search-input')?.focus()
      }
      if (e.key === '?' && !isInput) {
        e.preventDefault()
        setShowKeyboardHelp(prev => !prev)
      }
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey && !isInput && !selectedPaper) {
        e.preventDefault()
        const randomPaper = papers[Math.floor(Math.random() * papers.length)]
        setSelectedPaper(randomPaper)
      }
      if (e.key === 'f' && !e.ctrlKey && !e.metaKey && !isInput && !selectedPaper) {
        e.preventDefault()
        setFocusMode(prev => !prev)
      }
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
      if (yearFilter.includes('-')) {
        const [endYear, startYear] = yearFilter.split('-').map(Number)
        result = result.filter(p => p.year >= startYear && p.year <= endYear)
      } else {
        result = result.filter(p => p.year === Number(yearFilter))
      }
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
    const papersTop = document.getElementById('paper-list')?.offsetTop ?? 0
    if (window.scrollY > papersTop) {
      window.scrollTo({ top: papersTop, behavior: 'smooth' })
    }
  }, [query, category, yearFilter, sortBy, recommendationFilter, venueFilter, facetFilters])

  // j/k navigation when modal is open
  useEffect(() => {
    if (!selectedPaper) return
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement
      const isInput = active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA'
      if (isInput) return
      const idx = filtered.findIndex(p => p.id === selectedPaper.id)
      if (e.key === 'j' && idx < filtered.length - 1) {
        e.preventDefault()
        setSelectedPaper(filtered[idx + 1])
      }
      if (e.key === 'k' && idx > 0) {
        e.preventDefault()
        setSelectedPaper(filtered[idx - 1])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedPaper, filtered])

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

  const headerStats = useMemo(() => {
    const categoryCount = Object.keys(categoryCounts).length
    const venueCount = new Set(papers.map(p => p.venue).filter(Boolean)).size
    const yearsAll = papers.map(p => p.year)
    const minYear = Math.min(...yearsAll)
    const maxYear = Math.max(...yearsAll)
    const yearRange = `${minYear}-${maxYear}`
    return { categoryCount, venueCount, yearRange }
  }, [categoryCounts])

  const openRandomPaper = useCallback(() => {
    const randomPaper = papers[Math.floor(Math.random() * papers.length)]
    setSelectedPaper(randomPaper)
  }, [])

  const handleTagClick = useCallback((tag: string) => {
    setSearchInput(tag)
    setQuery(tag)
  }, [])

  return (
    <div className={`min-h-screen relative ${focusMode ? 'focus-mode' : ''}`}>
      {/* Skip navigation */}
      <a href="#paper-list" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[var(--color-accent)] focus:text-[var(--color-bg-primary)] focus:rounded-lg focus:font-semibold focus:text-sm">
        Skip to papers
      </a>

      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {theme === 'dark' && <MatrixRain />}

      <div className="relative z-10">
        <Header paperCount={papers.length} categoryCount={headerStats.categoryCount} venueCount={headerStats.venueCount} yearRange={headerStats.yearRange} lang={lang} onLangChange={setLang} theme={theme} onThemeToggle={toggleTheme} />

        {selectedPaper ? (
          /* ===== FULL-PAGE PAPER DETAIL ===== */
          (() => {
            const idx = filtered.findIndex(p => p.id === selectedPaper.id)
            return (
              <main role="main" aria-label="Paper detail">
                <PaperDetail
                  paper={selectedPaper}
                  lang={lang}
                  onBack={() => setSelectedPaper(null)}
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
                  readingStatus={readingProgress.getStatus(selectedPaper.id)}
                  onReadingStatusChange={readingProgress.setStatus}
                  customTags={customTags.getPaperTags(selectedPaper.id)}
                  allTags={customTags.tagDefs}
                  onToggleTag={(tagName) => customTags.toggleTag(selectedPaper.id, tagName)}
                  onCreateTag={customTags.createTag}
                  onDeleteTag={customTags.deleteTag}
                />
              </main>
            )
          })()
        ) : (
          /* ===== PAPER LIST VIEW ===== */
          <>
            <main id="papers" className="max-w-5xl mx-auto px-4 pb-8" role="main" aria-label="Paper collection">
              {/* ===== SEARCH AREA ===== */}
              <div className="sticky-search">
                <SearchBar query={searchInput} onChange={setSearchInput} resultCount={filtered.length} totalCount={papers.length} papers={papers} searchHistory={searchHistory.history} onHistoryRemove={searchHistory.remove} onHistoryClear={searchHistory.clear} />
                <QuickFilters onSearch={(q: string) => { setSearchInput(q); setQuery(q) }} currentQuery={query} />
              </div>

              {/* Recently viewed */}
              <RecentlyViewed papers={papers} recentIds={recentlyViewed.ids} onPaperClick={setSelectedPaper} />

              {/* ===== FILTERS ===== */}
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

              {/* Result count + actions */}
              <div className="flex justify-between items-center mb-3 text-xs text-[var(--color-text-muted)]">
                <span>{filtered.length} paper{filtered.length !== 1 ? 's' : ''}</span>
                <div className="flex items-center gap-2">
                  {/* View mode toggle */}
                  <div className="hidden md:flex items-center border border-[var(--color-border)] rounded-lg overflow-hidden">
                    {(['card', 'table', 'timeline'] as const).map(mode => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className="px-2 py-1 text-xs transition-colors cursor-pointer border-none"
                        style={{
                          background: viewMode === mode ? 'var(--color-accent)' : 'transparent',
                          color: viewMode === mode ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
                        }}
                        title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view (${mode === 'card' ? '1' : mode === 'table' ? '2' : '3'})`}
                      >
                        {mode === 'card' ? '▦' : mode === 'table' ? '☰' : '⊡'}
                      </button>
                    ))}
                  </div>
                  {readingList.count > 0 && (
                    <button
                      onClick={() => {
                        if (query === '__reading_list__') {
                          setSearchInput(''); setQuery('')
                        } else {
                          setSearchInput(''); setQuery('__reading_list__')
                        }
                      }}
                      className="hover:text-[var(--color-accent)] transition-colors bg-transparent border-none cursor-pointer text-xs"
                      style={{ color: query === '__reading_list__' ? 'var(--color-accent)' : undefined }}
                    >
                      Bookmarked ({readingList.count})
                    </button>
                  )}
                  <button
                    onClick={openRandomPaper}
                    className="hover:text-[var(--color-accent)] transition-colors bg-transparent border-none cursor-pointer text-xs"
                  >
                    Discover
                  </button>
                  <ExportButton papers={filtered} />
                </div>
              </div>

              {/* ===== PAPER LIST ===== */}
              <div id="paper-list">
                {filtered.length === 0 ? (
                  <div className="text-center py-16 text-[var(--color-text-muted)]">
                    <p className="text-sm mb-3">No papers match your search.</p>
                    <button
                      onClick={() => { setSearchInput(''); setQuery(''); setCategory('all'); setYearFilter('all'); setRecommendationFilter('all'); setVenueFilter('all'); setFacetFilters({}) }}
                      className="text-xs px-4 py-2 rounded-lg border border-[var(--color-accent)]/30 text-[var(--color-accent)] bg-transparent cursor-pointer hover:bg-[var(--color-accent)]/5 transition-all"
                    >
                      Reset filters
                    </button>
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
                    <div>
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
                            onTagClick={handleTagClick}
                            hasNote={paperNotes.hasNote(paper.id)}
                            searchQuery={query !== '__reading_list__' ? query : ''}
                            readingStatus={readingProgress.getStatus(paper.id)}
                            customTags={customTags.getPaperTags(paper.id)}
                          />
                        </div>
                      ))}
                    </div>
                    {hasMore ? (
                      <div ref={loadMoreRef} className="text-center mt-6 py-4">
                        <div className="inline-flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                          <span className="w-4 h-4 border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin" />
                          Loading more ({visibleCount} of {filtered.length})...
                        </div>
                      </div>
                    ) : filtered.length > PAGE_SIZE && (
                      <div className="text-center mt-6 py-4 text-xs text-[var(--color-text-muted)]">
                        Showing all {filtered.length} papers
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* ===== ANALYTICS (collapsed by default) ===== */}
              <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] mb-4 bg-transparent border-none cursor-pointer hover:text-[var(--color-text-primary)] transition-colors w-full"
                >
                  <span style={{ transform: showAnalytics ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▶</span>
                  Analytics & Exploration
                </button>

                {showAnalytics && (
                  <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <Insights papers={papers} />
                    <div className="mb-8">
                      <Suspense fallback={<div className="text-center py-8 text-xs text-[var(--color-text-muted)]">Loading graph...</div>}>
                        <KnowledgeGraph papers={papers} onPaperClick={setSelectedPaper} />
                      </Suspense>
                    </div>
                    <TagCloud papers={papers} onTagClick={handleTagClick} />
                    <AnalyticsTabs papers={papers} onSearch={handleTagClick} />
                  </div>
                )}
              </div>
            </main>

            <Footer paperCount={papers.length} readProgress={readingProgress.counts} />
          </>
        )}
      </div>

      {/* Paper comparison */}
      {showComparison && comparisonPapers.length >= 2 && (
        <PaperComparison
          papers={comparisonPapers}
          lang={lang}
          onClose={() => setShowComparison(false)}
        />
      )}

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

      {/* Command palette */}
      {showCommandPalette && (
        <CommandPalette
          papers={papers}
          onClose={() => setShowCommandPalette(false)}
          onPaperClick={(p) => { setShowCommandPalette(false); setSelectedPaper(p) }}
          onCommand={(cmd) => {
            setShowCommandPalette(false)
            if (cmd === 'toggle-theme') toggleTheme()
            else if (cmd === 'toggle-focus') setFocusMode(prev => !prev)
            else if (cmd === 'random-paper') openRandomPaper()
            else if (cmd === 'keyboard-help') setShowKeyboardHelp(true)
          }}
        />
      )}

      {/* Mobile navigation */}
      <MobileNav
        viewMode={viewMode}
        onViewChange={setViewMode}
        readingListCount={readingList.count}
        onReadingListClick={() => { }}
        onRandomClick={openRandomPaper}
        onSearchFocus={() => document.querySelector<HTMLInputElement>('#search-input')?.focus()}
        theme={theme}
        onThemeToggle={toggleTheme}
      />

    </div>
  )
}

export default App
