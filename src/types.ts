export interface Experiment {
  language: string[]
  platform: string[]
  target_domain: string[]
  llm: string[]
  model_family: string[]
  model_size: string[]
  fine_tuning: boolean
  fine_tuning_method: string
  fuzzer: string[]
  static_tool: string[]
  dataset: string[]
  benchmark_size: string
  baselines: string[]
  vulnerability_type: string[]
  key_results: string
  real_world_impact: string
  open_source: boolean
  cost: string
}

export interface Paper {
  id: string
  title: string
  authors: string
  year: number
  venue: string
  abstract: string
  abstract_zh?: string
  summary?: string
  summary_zh?: string
  contributions?: string[]
  contributions_zh?: string[]
  research_questions?: string[]
  research_questions_zh?: string[]
  conclusions?: string[]
  conclusions_zh?: string[]
  system_name?: string
  paperUrl: string
  codeUrl: string
  slidesUrl: string
  talkUrl: string
  categories: string[]
  subcategories: string[]
  experiment?: Experiment
  recommendation?: number
  bibtex?: string
}

export type CategoryFilter = 'all' | 'vulnerability-detection' | 'fuzzing' | 'fuzzing-harness' | 'patching' | 'privacy'
export type SortBy = 'year-desc' | 'year-asc' | 'title' | 'recommendation'
export type Language = 'en' | 'zh'
