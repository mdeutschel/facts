import { useState, useEffect } from 'react'
import type { TopicIndex, Topic } from '../types'
// The topic index is generated at build time (generate-topic-index.mjs) and
// imported statically so the home/related views render their full content on
// first paint. Avoiding a runtime fetch for this small metadata file removes
// the loading-spinner swap that caused cumulative layout shift.
import topicIndexData from '../../public/data/topics.json'

const STATIC_TOPIC_INDEX = (topicIndexData as TopicIndex).topics

const MAX_CACHE_SIZE = 50
const cacheKeys: string[] = []
const cache: Record<string, Topic> = {}

function cacheSet(key: string, value: Topic) {
  if (cache[key]) {
    const idx = cacheKeys.indexOf(key)
    if (idx > -1) cacheKeys.splice(idx, 1)
  } else if (cacheKeys.length >= MAX_CACHE_SIZE) {
    const evicted = cacheKeys.shift()
    if (evicted) delete cache[evicted]
  }
  cacheKeys.push(key)
  cache[key] = value
}

async function fetchWithRetry(url: string, retries = 2): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url)
      return res
    } catch (err) {
      if (attempt === retries) throw err
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
    }
  }
  throw new Error('Fetch failed')
}

export function useTopicIndex() {
  // Served synchronously from the statically imported build-time index, so
  // consumers never render a loading state for the topic list.
  return { topics: STATIC_TOPIC_INDEX, loading: false, error: null }
}

export function useTopic(id: string | undefined) {
  // Track which id the current state belongs to so we can re-sync on id change.
  const [state, setState] = useState<{
    id: string | undefined
    topic: Topic | null
    loading: boolean
    error: string | null
  }>(() => ({
    id,
    topic: id && cache[id] ? cache[id] : null,
    loading: !!id && !cache[id],
    error: null,
  }))

  useEffect(() => {
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ id, topic: null, loading: false, error: null })
      return
    }

    if (cache[id]) {
      setState({ id, topic: cache[id], loading: false, error: null })
      return
    }

    setState({ id, topic: null, loading: true, error: null })

    let cancelled = false
    fetchWithRetry(`${import.meta.env.BASE_URL}data/${id}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Thema "${id}" nicht gefunden`)
        return res.json() as Promise<Topic>
      })
      .then((data) => {
        if (cancelled) return
        cacheSet(id, data)
        setState({ id, topic: data, loading: false, error: null })
      })
      .catch((err) => {
        if (cancelled) return
        setState({ id, topic: null, loading: false, error: err.message })
      })

    return () => {
      cancelled = true
    }
  }, [id])

  // If id changed but the effect hasn't run yet, prefer cache to avoid showing stale topic.
  if (state.id !== id) {
    const cached = id ? cache[id] ?? null : null
    return { topic: cached, loading: !!id && !cached, error: null }
  }

  return { topic: state.topic, loading: state.loading, error: state.error }
}

export function getAllCachedTopics(): Topic[] {
  return Object.values(cache)
}

export async function preloadAllTopics(): Promise<Topic[]> {
  const indexRes = await fetchWithRetry(`${import.meta.env.BASE_URL}data/topics.json`)
  const index: TopicIndex = await indexRes.json()

  const topics = await Promise.all(
    index.topics.map(async (meta) => {
      if (cache[meta.id]) return cache[meta.id]
      const res = await fetchWithRetry(`${import.meta.env.BASE_URL}data/${meta.id}.json`)
      const topic: Topic = await res.json()
      cacheSet(meta.id, topic)
      return topic
    })
  )

  return topics
}
