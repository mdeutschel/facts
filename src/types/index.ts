export interface TopicMeta {
  id: string
  title: string
  subtitle: string
  icon: string
  lastUpdated: string
  keyStats?: string[]
}

export interface TopicIndex {
  topics: TopicMeta[]
}

export interface StatItem {
  value: string
  label: string
  sublabel?: string
  color?: string
}

export interface ComparisonItem {
  title: string
  color?: string
  rows: { label: string; value: string }[]
  total?: { label: string; value: string }
}

export interface RangeBarItem {
  label: string
  min: number
  max: number
  unit?: string
  color?: string
}

export interface BarChartItem {
  label: string
  value: number
  highlight?: boolean
}

export interface TimelineStep {
  label: string
  value: string
  sublabel?: string
  highlight?: boolean
}

export type ContentBlock =
  | { type: 'fact'; text: string; highlight?: boolean }
  | { type: 'table'; caption?: string; headers: string[]; rows: string[][] }
  | { type: 'text'; text: string }
  | { type: 'stat_grid'; items: StatItem[] }
  | { type: 'comparison'; caption?: string; items: ComparisonItem[]; savings?: string }
  | { type: 'range_bar'; caption?: string; items: RangeBarItem[]; maxScale?: number; unit?: string }
  | { type: 'bar_chart'; caption?: string; items: BarChartItem[]; unit?: string }
  | { type: 'timeline'; caption?: string; steps: TimelineStep[] }
  | { type: 'progress_stack'; caption?: string; segments: { label: string; value: number; sublabel?: string }[]; total?: string }

export interface Section {
  id: string
  title: string
  content: ContentBlock[]
}

export interface Argument {
  id: string
  claim: string
  response: string
  keywords: string[]
  relatedSections?: string[]
}

export interface Source {
  label: string
  url?: string
}

export interface Topic extends TopicMeta {
  sourceNote: string
  sections: Section[]
  arguments: Argument[]
  sources: Source[]
}

export interface SearchResult {
  topicId: string
  topicTitle: string
  type: 'argument' | 'section'
  id: string
  title: string
  snippet: string
  score: number
}
