export interface Paper {
  id: string
  title: string
  authors: string
  year: number
  venue: string
  abstract: string
  paperUrl: string
  codeUrl: string
  slidesUrl: string
  talkUrl: string
  categories: string[]
  subcategories: string[]
}

export type CategoryFilter = 'all' | 'vulnerability-detection' | 'fuzzing' | 'privacy'
export type SortBy = 'year-desc' | 'year-asc' | 'title'
