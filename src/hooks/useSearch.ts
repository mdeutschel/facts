import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Topic, SearchResult } from '../types'
import { preloadAllTopics } from './useTopics'

interface SearchEntry {
  topicId: string
  topicTitle: string
  type: 'argument' | 'section'
  id: string
  title: string
  text: string
  weight: number
}

function buildIndex(topics: Topic[]): SearchEntry[] {
  const entries: SearchEntry[] = []

  for (const topic of topics) {
    for (const arg of topic.arguments) {
      entries.push({
        topicId: topic.id,
        topicTitle: topic.title,
        type: 'argument',
        id: arg.id,
        title: arg.claim,
        text: [arg.claim, arg.response, ...arg.keywords].join(' '),
        weight: 3,
      })
    }

    for (const section of topic.sections) {
      const texts = section.content.map((block) => {
        switch (block.type) {
          case 'fact': return [block.text, block.description ?? ''].join(' ')
          case 'text': return block.text
          case 'table': return [block.caption ?? '', ...block.rows.flat()].join(' ')
          case 'stat_grid': return block.items.map((i) => `${i.value} ${i.label} ${i.sublabel ?? ''}`).join(' ')
          case 'comparison': return [block.caption ?? '', block.savings ?? '', ...block.items.flatMap((i) => [i.title, ...i.rows.map((r) => `${r.label} ${r.value}`), i.total ? `${i.total.label} ${i.total.value}` : ''])].join(' ')
          case 'range_bar': return [block.caption ?? '', ...block.items.map((i) => `${i.label} ${i.min}-${i.max}`)].join(' ')
          case 'bar_chart': return [block.caption ?? '', ...block.items.map((i) => `${i.label} ${i.value}`)].join(' ')
          case 'line_chart': return [block.caption ?? '', ...block.items.map((i) => `${i.label} ${i.value}`)].join(' ')
          case 'timeline': return [block.caption ?? '', ...block.steps.map((s) => `${s.label} ${s.value} ${s.sublabel ?? ''}`)].join(' ')
          case 'progress_stack': return [block.caption ?? '', block.total ?? '', ...block.segments.map((s) => `${s.label} ${s.value} ${s.sublabel ?? ''}`)].join(' ')
        }
      })

      entries.push({
        topicId: topic.id,
        topicTitle: topic.title,
        type: 'section',
        id: section.id,
        title: section.title,
        text: [section.title, ...texts].join(' '),
        weight: 1,
      })
    }
  }

  return entries
}

function searchEntries(entries: SearchEntry[], query: string): SearchResult[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []

  const results: SearchResult[] = []

  for (const entry of entries) {
    const lowerText = entry.text.toLowerCase()
    let matchCount = 0

    for (const term of terms) {
      if (lowerText.includes(term)) matchCount++
    }

    if (matchCount === 0) continue

    const score = (matchCount / terms.length) * entry.weight

    const snippetStart = lowerText.indexOf(terms[0])
    const start = Math.max(0, snippetStart - 40)
    const end = Math.min(entry.text.length, snippetStart + terms[0].length + 120)
    const snippet =
      (start > 0 ? '…' : '') +
      entry.text.slice(start, end).trim() +
      (end < entry.text.length ? '…' : '')

    results.push({
      topicId: entry.topicId,
      topicTitle: entry.topicTitle,
      type: entry.type,
      id: entry.id,
      title: entry.title,
      snippet,
      score,
    })
  }

  return results.sort((a, b) => b.score - a.score)
}

// Shared index singleton — built once in background, reused across hook instances
let sharedIndex: SearchEntry[] | null = null
let indexPromise: Promise<SearchEntry[]> | null = null

function getOrBuildIndex(): Promise<SearchEntry[]> {
  if (sharedIndex) return Promise.resolve(sharedIndex)
  if (!indexPromise) {
    indexPromise = preloadAllTopics()
      .then((topics) => {
        sharedIndex = buildIndex(topics)
        return sharedIndex
      })
      .catch((err) => {
        indexPromise = null
        throw err
      })
  }
  return indexPromise
}

// Start building the index eagerly on module load (idle callback or microtask)
if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(() => getOrBuildIndex())
} else {
  setTimeout(() => getOrBuildIndex(), 100)
}

export function useSearch(query: string) {
  const [index, setIndex] = useState<SearchEntry[]>(sharedIndex ?? [])
  const [loading, setLoading] = useState(!sharedIndex)

  useEffect(() => {
    if (sharedIndex) return
    getOrBuildIndex()
      .then((idx) => setIndex(idx))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const debouncedQuery = useDebounce(query, 200)

  const results = useMemo(
    () => searchEntries(index, debouncedQuery),
    [index, debouncedQuery]
  )

  return { results, loading }
}

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

export function useSearchNavigation() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const openSearch = useCallback(() => setOpen(true), [])
  const closeSearch = useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [])

  return { query, setQuery, open, openSearch, closeSearch }
}
