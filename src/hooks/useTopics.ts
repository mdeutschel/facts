import { useState, useEffect } from 'react'
import type { TopicIndex, TopicMeta, Topic } from '../types'

const cache: Record<string, Topic> = {}

export function useTopicIndex() {
  const [topics, setTopics] = useState<TopicMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/topics.json`)
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
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    if (cache[id]) {
      setTopic(cache[id])
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`${import.meta.env.BASE_URL}data/${id}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Thema "${id}" nicht gefunden`)
        return res.json() as Promise<Topic>
      })
      .then((data) => {
        cache[id] = data
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
  const indexRes = await fetch(`${import.meta.env.BASE_URL}data/topics.json`)
  const index: TopicIndex = await indexRes.json()

  const topics = await Promise.all(
    index.topics.map(async (meta) => {
      if (cache[meta.id]) return cache[meta.id]
      const res = await fetch(`${import.meta.env.BASE_URL}data/${meta.id}.json`)
      const topic: Topic = await res.json()
      cache[meta.id] = topic
      return topic
    })
  )

  return topics
}
