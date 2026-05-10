import { useState, useEffect } from 'react'
import type { TopicIndex, TopicMeta, Topic } from '../types'

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
  const [topics, setTopics] = useState<TopicMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWithRetry(`${import.meta.env.BASE_URL}data/topics.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<TopicIndex>
      })
      .then((data) => setTopics(data.topics))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { topics, loading, error }
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
