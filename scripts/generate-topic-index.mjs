import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DATA_DIR = path.join(process.cwd(), 'public', 'data')
const INDEX_PATH = path.join(DATA_DIR, 'topics.json')

async function main() {
  const existingOrder = []
  try {
    const raw = await readFile(INDEX_PATH, 'utf8')
    const index = JSON.parse(raw)
    for (const t of index.topics) existingOrder.push(t.id)
  } catch {
    // no existing index — will discover all topics
  }

  const files = await readdir(DATA_DIR)
  const topicFiles = files.filter((f) => f.endsWith('.json') && f !== 'topics.json')

  const topicsById = new Map()
  for (const file of topicFiles) {
    const raw = await readFile(path.join(DATA_DIR, file), 'utf8')
    const topic = JSON.parse(raw)
    topicsById.set(topic.id, {
      id: topic.id,
      title: topic.title,
      subtitle: topic.subtitle,
      icon: topic.icon,
      lastUpdated: topic.lastUpdated,
      factCount: (topic.sections ?? []).length,
      argumentCount: (topic.arguments ?? []).length,
    })
  }

  const ordered = []
  for (const id of existingOrder) {
    if (topicsById.has(id)) {
      ordered.push(topicsById.get(id))
      topicsById.delete(id)
    }
  }
  for (const entry of topicsById.values()) {
    ordered.push(entry)
  }

  await writeFile(INDEX_PATH, JSON.stringify({ topics: ordered }, null, 2) + '\n', 'utf8')
  console.log(`topics.json: ${ordered.length} topics generated`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
