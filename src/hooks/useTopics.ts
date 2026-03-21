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
  const [topic, setTopic] = useState<Topic | null>(id && cache[id] ? cache[id] : null)
  const [loading, setLoading] = useState<boolean>(!!id && !cache[id])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || cache[id]) {
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    fetchWithRetry(`${import.meta.env.BASE_URL}data/${id}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Thema "${id}" nicht gefunden`)
        return res.json() as Promise<Topic>
      })
      .then((data) => {
        cacheSet(id, data)
        setTopic(data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  return { topic, loading, error }
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
