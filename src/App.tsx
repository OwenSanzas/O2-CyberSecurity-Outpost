import { useState, useMemo } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import Filters from './components/Filters'
import PaperCard from './components/PaperCard'
import Stats from './components/Stats'
import Footer from './components/Footer'
import papersData from './data/papers.json'
import type { Paper, CategoryFilter, SortBy } from './types'

const papers: Paper[] = papersData as Paper[]

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [sortBy, setSortBy] = useState<SortBy>('year-desc')

  const years = useMemo(() => {
    const set = new Set(papers.map(p => p.year))
    return [...set].sort((a, b) => b - a)
  }, [])

  const filtered = useMemo(() => {
    let result = papers

    if (category !== 'all') {
      result = result.filter(p => p.categories.includes(category))
    }

    if (yearFilter !== 'all') {
      result = result.filter(p => p.year === Number(yearFilter))
    }

    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        p.abstract.toLowerCase().includes(q) ||
        p.venue.toLowerCase().includes(q) ||
        p.subcategories.some(s => s.toLowerCase().includes(q))
      )
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'year-desc') return b.year - a.year || a.title.localeCompare(b.title)
      if (sortBy === 'year-asc') return a.year - b.year || a.title.localeCompare(b.title)
      return a.title.localeCompare(b.title)
    })
  }, [query, category, yearFilter, sortBy])

  return (
    <div className="min-h-screen">
      <Header paperCount={papers.length} />

      <main id="papers" className="max-w-5xl mx-auto px-4 py-8">
        <Stats papers={papers} />
        <SearchBar query={query} onChange={setQuery} resultCount={filtered.length} />
        <Filters
          category={category}
          onCategoryChange={setCategory}
          yearFilter={yearFilter}
          onYearChange={setYearFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          years={years}
        />

        <div className="grid gap-4">
          {filtered.map(paper => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-[var(--color-text-muted)]">
              <div className="text-4xl mb-3">🔍</div>
              <p>No papers found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
