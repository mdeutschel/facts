export interface TopicMeta {
  id: string
  title: string
  subtitle: string
  icon: string
  lastUpdated: string
  factCount: number
  argumentCount: number
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

export interface LineChartItem {
  label: string
  value: number
}

export type SourceRef = string

export type ContentBlock =
  | { type: 'fact'; text: string; description?: string; highlight?: boolean; sourceRefs?: SourceRef[] }
  | { type: 'table'; caption?: string; headers: string[]; rows: string[][]; sourceRefs?: SourceRef[] }
  | { type: 'text'; text: string; sourceRefs?: SourceRef[] }
  | { type: 'stat_grid'; items: StatItem[]; sourceRefs?: SourceRef[] }
  | { type: 'comparison'; caption?: string; items: ComparisonItem[]; savings?: string; sourceRefs?: SourceRef[] }
  | { type: 'range_bar'; caption?: string; items: RangeBarItem[]; maxScale?: number; unit?: string; sourceRefs?: SourceRef[] }
  | { type: 'bar_chart'; caption?: string; items: BarChartItem[]; unit?: string; sourceRefs?: SourceRef[] }
  | { type: 'line_chart'; caption?: string; items: LineChartItem[]; unit?: string; color?: string; sourceRefs?: SourceRef[] }
  | { type: 'timeline'; caption?: string; steps: TimelineStep[]; sourceRefs?: SourceRef[] }
  | { type: 'progress_stack'; caption?: string; segments: { label: string; value: number; sublabel?: string }[]; total?: string; sourceRefs?: SourceRef[] }

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
  id: string
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
