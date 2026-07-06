import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DATA_DIR = path.join(process.cwd(), 'public', 'data')
const INDEX_PATH = path.join(DATA_DIR, 'topics.json')

// Explicit thematic ordering of the home page topic cards — the single source
// of truth for the list order. Topics are grouped into four thematic blocks and
// run from foundational to specific within each block. Add new topics here at
// the desired position; any topic JSON missing from this list is appended at
// the end (in filesystem order) with a warning.
const TOPIC_ORDER = [
  // Block 1 — Klima, Energie & Mobilität
  'klimawandel',
  'energiewende',
  'heizung',
  'emobilitaet',
  'verkehrswende',
  'vegane-ernaehrung',
  // Block 2 — Arbeit, Wirtschaft & Verteilung
  'fachkraeftemangel',
  'teilzeit',
  'ki-arbeitsmarkt',
  'buergergeld',
  'verteilung',
  'vermoegenssteuer',
  // Block 3 — Gesellschaft & Zusammenleben
  'wohnen',
  'migration',
  'innere-sicherheit',
  'gleichberechtigung',
  'gendern',
  // Block 4 — Staat, Bildung, Wissen & Außenpolitik
  'bildung',
  'gesundheit',
  'wissenschaftsskepsis',
  'russland-ukraine-sanktionen',
]

async function main() {
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
  for (const id of TOPIC_ORDER) {
    if (topicsById.has(id)) {
      ordered.push(topicsById.get(id))
      topicsById.delete(id)
    }
  }
  for (const entry of topicsById.values()) {
    console.warn(`topics.json: "${entry.id}" not in TOPIC_ORDER — appended at end`)
    ordered.push(entry)
  }

  await writeFile(INDEX_PATH, JSON.stringify({ topics: ordered }, null, 2) + '\n', 'utf8')
  console.log(`topics.json: ${ordered.length} topics generated`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
