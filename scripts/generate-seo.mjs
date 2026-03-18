import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT_DIR = process.cwd()
const PUBLIC_DIR = path.join(ROOT_DIR, 'public')
const DATA_DIR = path.join(PUBLIC_DIR, 'data')
const SITE_URL = 'https://fakten-stammtisch.de'

function absoluteUrl(routePath) {
  return `${SITE_URL}${routePath}`
}

function xmlEscape(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function flattenContentBlock(block) {
  if (block.type === 'fact') {
    return `- ${block.text}`
  }

  if (block.type === 'text') {
    return block.text
  }

  if (block.type === 'table') {
    const lines = []
    if (block.caption) lines.push(`Hinweis: ${block.caption}`)
    lines.push(`Spalten: ${block.headers.join(' | ')}`)
    for (const row of block.rows) {
      lines.push(`- ${row.join(' | ')}`)
    }
    return lines.join('\n')
  }

  if (block.type === 'stat_grid') {
    return block.items
      .map((item) => `- ${item.label}: ${item.value}${item.sublabel ? ` (${item.sublabel})` : ''}`)
      .join('\n')
  }

  if (block.type === 'comparison') {
    const lines = []
    if (block.caption) lines.push(`Hinweis: ${block.caption}`)
    for (const item of block.items) {
      lines.push(`- ${item.title}`)
      for (const row of item.rows) {
        lines.push(`  - ${row.label}: ${row.value}`)
      }
      if (item.total) {
        lines.push(`  - ${item.total.label}: ${item.total.value}`)
      }
    }
    if (block.savings) {
      lines.push(`- Ersparnis: ${block.savings}`)
    }
    return lines.join('\n')
  }

  if (block.type === 'range_bar') {
    const unit = block.unit ?? ''
    const lines = []
    if (block.caption) lines.push(`Hinweis: ${block.caption}`)
    for (const item of block.items) {
      lines.push(`- ${item.label}: ${item.min} bis ${item.max}${unit ? ` ${unit}` : ''}`)
    }
    return lines.join('\n')
  }

  if (block.type === 'bar_chart' || block.type === 'line_chart') {
    const unit = block.unit ?? ''
    const lines = []
    if (block.caption) lines.push(`Hinweis: ${block.caption}`)
    for (const item of block.items) {
      lines.push(`- ${item.label}: ${item.value}${unit ? ` ${unit}` : ''}`)
    }
    return lines.join('\n')
  }

  if (block.type === 'timeline') {
    const lines = []
    if (block.caption) lines.push(`Hinweis: ${block.caption}`)
    for (const step of block.steps) {
      lines.push(`- ${step.label}: ${step.value}${step.sublabel ? ` (${step.sublabel})` : ''}`)
    }
    return lines.join('\n')
  }

  if (block.type === 'progress_stack') {
    const lines = []
    if (block.caption) lines.push(`Hinweis: ${block.caption}`)
    for (const segment of block.segments) {
      lines.push(`- ${segment.label}: ${segment.value}%${segment.sublabel ? ` (${segment.sublabel})` : ''}`)
    }
    if (block.total) {
      lines.push(`- Gesamt: ${block.total}`)
    }
    return lines.join('\n')
  }

  return ''
}

function buildSitemap(topics) {
  const staticPaths = ['/', '/impressum', '/feedback', '/suche']
  const topicPaths = topics.map((topic) => `/thema/${topic.id}`)
  const textFiles = ['/llms.txt', '/llms-full.txt']
  const allPaths = [...staticPaths, ...topicPaths, ...textFiles]

  const urlEntries = allPaths
    .map((routePath) => {
      const lastMod = new Date().toISOString().slice(0, 10)
      return [
        '  <url>',
        `    <loc>${xmlEscape(absoluteUrl(routePath))}</loc>`,
        `    <lastmod>${lastMod}</lastmod>`,
        '  </url>',
      ].join('\n')
    })
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    '</urlset>',
    '',
  ].join('\n')
}

function buildLlmsTxt(topics) {
  const topicLinks = topics
    .map((topic) => `- [${topic.title}](${absoluteUrl(`/llms/${topic.id}.txt`)}): ${topic.subtitle}`)
    .join('\n')

  return [
    '# Fakten-Stammtisch',
    '',
    '> Fakten-Stammtisch ist eine deutschsprachige Website mit faktenbasierten',
    '> Argumenten und Quellen zu politischen und gesellschaftlichen Themen in Deutschland.',
    '',
    '## Themen',
    '',
    topicLinks,
    '',
    '## Vollstaendiger Inhalt',
    '',
    `- [Alle Inhalte als Plaintext](${absoluteUrl('/llms-full.txt')}): Vollstaendiger Text aller Themen, Fakten und Argumente`,
    '',
    '## Contact',
    '',
    '- E-Mail: feedback@fakten-stammtisch.de',
    `- [Feedback-Formular](${absoluteUrl('/feedback')})`,
    '',
    '## Optional',
    '',
    `- [Impressum & Datenschutz](${absoluteUrl('/impressum')})`,
    `- [Sitemap](${absoluteUrl('/sitemap.xml')})`,
    '',
  ].join('\n')
}

function buildTopicSection(topicData) {
  const sectionTexts = topicData.sections
    .map((section) => {
      const blocks = section.content
        .map((block) => flattenContentBlock(block))
        .filter(Boolean)
        .join('\n\n')
      return [`### ${section.title}`, '', blocks].join('\n')
    })
    .join('\n\n')

  const argumentTexts = topicData.arguments
    .map((argument) => [`- Aussage: ${argument.claim}`, `  Antwort: ${argument.response}`].join('\n'))
    .join('\n')

  const sourceTexts = topicData.sources
    .map((source) => (source.url ? `- ${source.label} (${source.url})` : `- ${source.label}`))
    .join('\n')

  return [
    `${topicData.subtitle} | Stand: ${topicData.lastUpdated}`,
    '',
    '### Fakten',
    '',
    sectionTexts,
    '',
    '### Argumente',
    '',
    argumentTexts,
    '',
    '### Quellen',
    '',
    sourceTexts,
  ].join('\n')
}

function buildTopicTxt(topicData) {
  return [
    `# ${topicData.title}`,
    '',
    buildTopicSection(topicData),
    '',
  ].join('\n')
}

function buildLlmsFull(topics, topicDataById) {
  const sections = topics.map((topic) => {
    const topicData = topicDataById.get(topic.id)
    if (!topicData) return ''

    return [`## ${topicData.title}`, '', buildTopicSection(topicData)].join('\n')
  })

  return [
    '# Fakten-Stammtisch - Vollstaendiger Inhalt',
    '',
    '> Alle Themen, Fakten und Argumente im Plaintext-Format.',
    '',
    sections.filter(Boolean).join('\n\n---\n\n'),
    '',
  ].join('\n')
}

function htmlEscape(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function buildFallbackHtml(topics, topicDataById) {
  const lines = []
  lines.push('      <h1>Fakten-Stammtisch</h1>')
  lines.push('      <p>Faktenbasierte Argumente und Quellen zu politischen und gesellschaftlichen Themen in Deutschland.</p>')
  lines.push('      <p>Alle Inhalte als Textdatei: <a href="https://fakten-stammtisch.de/llms-full.txt">fakten-stammtisch.de/llms-full.txt</a></p>')
  lines.push('      <h2>Themen</h2>')

  for (const topic of topics) {
    const data = topicDataById.get(topic.id)
    if (!data) continue

    const url = absoluteUrl(`/thema/${topic.id}`)
    lines.push(`      <h3><a href="${htmlEscape(url)}">${htmlEscape(data.title)}</a></h3>`)
    lines.push(`      <p>${htmlEscape(data.subtitle)}</p>`)

    lines.push(`      <p>${topic.factCount} Fakten · ${topic.argumentCount} Argumente</p>`)

    if (data.arguments && data.arguments.length > 0) {
      lines.push('      <details>')
      lines.push(`        <summary>Argumente (${data.arguments.length})</summary>`)
      lines.push('        <dl>')
      for (const arg of data.arguments) {
        lines.push(`          <dt>${htmlEscape(arg.claim)}</dt>`)
        lines.push(`          <dd>${htmlEscape(arg.response)}</dd>`)
      }
      lines.push('        </dl>')
      lines.push('      </details>')
    }
  }

  lines.push('      <h2>Quellen &amp; Transparenz</h2>')
  lines.push('      <p>Alle Aussagen auf dieser Seite werden mit Primärquellen belegt (Studien, amtliche Statistiken, Fachinstitute). Die vollständige Quellenliste ist auf jeder Themenseite einsehbar.</p>')
  lines.push('      <p><a href="https://fakten-stammtisch.de/impressum">Impressum &amp; Datenschutz</a> · <a href="https://fakten-stammtisch.de/feedback">Feedback</a> · E-Mail: feedback@fakten-stammtisch.de</p>')

  return lines.join('\n')
}

async function injectFallback(topics, topicDataById) {
  const indexPath = path.join(ROOT_DIR, 'index.html')
  const html = await readFile(indexPath, 'utf8')
  const fallback = buildFallbackHtml(topics, topicDataById)

  const placeholder = '<!-- FALLBACK_PLACEHOLDER -->'
  if (html.includes(placeholder)) {
    await writeFile(indexPath, html.replace(placeholder, '\n' + fallback + '\n    '), 'utf8')
    return
  }

  // Replace existing fallback content inside <div id="root">
  const rootRegex = /(<div id="root">)[\s\S]*?(<\/div>)/
  if (rootRegex.test(html)) {
    await writeFile(indexPath, html.replace(rootRegex, `$1\n${fallback}\n    $2`), 'utf8')
  }
}

async function main() {
  const indexRaw = await readFile(path.join(DATA_DIR, 'topics.json'), 'utf8')
  const topicIndex = JSON.parse(indexRaw)
  const topics = topicIndex.topics

  const topicDataById = new Map()
  for (const topic of topics) {
    const topicRaw = await readFile(path.join(DATA_DIR, `${topic.id}.json`), 'utf8')
    topicDataById.set(topic.id, JSON.parse(topicRaw))
  }

  await writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), buildSitemap(topics), 'utf8')
  await writeFile(path.join(PUBLIC_DIR, 'llms.txt'), buildLlmsTxt(topics), 'utf8')
  await writeFile(path.join(PUBLIC_DIR, 'llms-full.txt'), buildLlmsFull(topics, topicDataById), 'utf8')

  const llmsDir = path.join(PUBLIC_DIR, 'llms')
  await import('node:fs').then((fs) => fs.mkdirSync(llmsDir, { recursive: true }))
  for (const topic of topics) {
    const topicData = topicDataById.get(topic.id)
    if (!topicData) continue
    await writeFile(path.join(llmsDir, `${topic.id}.txt`), buildTopicTxt(topicData), 'utf8')
  }

  await injectFallback(topics, topicDataById)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
