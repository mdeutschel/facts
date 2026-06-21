import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT_DIR = process.cwd()
const PUBLIC_DIR = path.join(ROOT_DIR, 'public')
const DATA_DIR = path.join(PUBLIC_DIR, 'data')
const SITE_URL = 'https://fakten-stammtisch.de'

const HOME_TEXTS_PATH = path.join(ROOT_DIR, 'src/content/homeTexts.json')
const homeTexts = JSON.parse(await readFile(HOME_TEXTS_PATH, 'utf8'))

export const SITE_URL_EXPORT = SITE_URL

export function absoluteUrl(routePath) {
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

export function flattenContentBlock(block) {
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

  if (block.type === 'myth_fact') {
    const lines = []
    if (block.caption) lines.push(`Hinweis: ${block.caption}`)
    for (const item of block.items) {
      lines.push(`- Behauptung: ${item.myth}`)
      lines.push(`  Faktencheck: ${item.fact}`)
    }
    return lines.join('\n')
  }

  if (block.type === 'pictograph') {
    const lines = []
    if (block.caption) lines.push(`Hinweis: ${block.caption}`)
    lines.push(`- ${block.filled} von ${block.total}: ${block.label}`)
    return lines.join('\n')
  }

  if (block.type === 'target_progress') {
    const unit = block.unit ?? ''
    const lines = []
    if (block.caption) lines.push(`Hinweis: ${block.caption}`)
    for (const item of block.items) {
      const itemUnit = item.unit ?? unit
      const suffix = itemUnit ? ` ${itemUnit}` : ''
      lines.push(`- ${item.label}: aktuell ${item.current}${suffix}, Ziel ${item.target}${suffix}`)
    }
    return lines.join('\n')
  }

  return ''
}

function buildSitemap(topics, topicDataById) {
  // Trailing slashes match Apache's served URLs (DirectorySlash) and avoid
  // 301 redirects that would otherwise show up as "Page with redirect" in GSC.
  const staticPaths = ['/', '/ueber/', '/methodik/', '/leitfaden/', '/impressum/', '/feedback/', '/suche/']
  const today = new Date().toISOString().slice(0, 10)

  const entries = []
  for (const routePath of staticPaths) {
    entries.push({ path: routePath, lastMod: today })
  }
  for (const topic of topics) {
    const data = topicDataById.get(topic.id)
    const lastMod = data?.lastUpdated ?? today
    entries.push({ path: `/thema/${topic.id}/`, lastMod })
    if (data?.arguments) {
      for (const arg of data.arguments) {
        entries.push({ path: `/thema/${topic.id}/${arg.id}/`, lastMod })
      }
    }
  }
  for (const tf of ['/llms.txt', '/llms-full.txt']) {
    entries.push({ path: tf, lastMod: today })
  }

  const urlEntries = entries
    .map(({ path: routePath, lastMod }) => {
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
    `- [Feedback-Formular](${absoluteUrl('/feedback/')})`,
    '',
    '## Optional',
    '',
    `- [Über das Projekt](${absoluteUrl('/ueber/')})`,
    `- [Methodik](${absoluteUrl('/methodik/')})`,
    `- [Gesprächsleitfaden](${absoluteUrl('/leitfaden/')})`,
    `- [Impressum & Datenschutz](${absoluteUrl('/impressum/')})`,
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

  const summary = topicData.seoDescription ?? topicData.subtitle
  return [
    `${summary} | Stand: ${topicData.lastUpdated}`,
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

export function htmlEscape(value) {
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
  lines.push(`      <h2>${htmlEscape(homeTexts.heading)}</h2>`)
  lines.push(`      <p>${htmlEscape(homeTexts.intro)}</p>`)
  lines.push('      <p>Alle Inhalte als Textdatei: <a href="https://fakten-stammtisch.de/llms-full.txt">fakten-stammtisch.de/llms-full.txt</a></p>')
  lines.push('      <h2>Themen</h2>')

  for (const topic of topics) {
    const data = topicDataById.get(topic.id)
    if (!data) continue

    const url = absoluteUrl(`/thema/${topic.id}/`)
    const headline = data.seoTitle ?? data.title
    const summary = data.seoDescription ?? data.subtitle
    lines.push(`      <h3><a href="${htmlEscape(url)}">${htmlEscape(headline)}</a></h3>`)
    lines.push(`      <p>${htmlEscape(summary)}</p>`)

    lines.push(`      <p>${topic.factCount} Fakten · ${topic.argumentCount} Argumente</p>`)

    if (data.arguments && data.arguments.length > 0) {
      lines.push('      <details>')
      lines.push(`        <summary>Argumente (${data.arguments.length})</summary>`)
      lines.push('        <dl>')
      for (const arg of data.arguments) {
        const argUrl = absoluteUrl(`/thema/${topic.id}/${arg.id}/`)
        lines.push(`          <dt><a href="${htmlEscape(argUrl)}">${htmlEscape(arg.claim)}</a></dt>`)
        lines.push(`          <dd>${htmlEscape(arg.response)}</dd>`)
      }
      lines.push('        </dl>')
      lines.push('      </details>')
    }
  }

  lines.push(`      <h2>${htmlEscape(homeTexts.usageTitle)}</h2>`)
  lines.push(`      <p>${htmlEscape(homeTexts.usageP1)}</p>`)
  lines.push(`      <p>${htmlEscape(homeTexts.usageP2)}</p>`)
  lines.push(`      <p>${htmlEscape(homeTexts.usageP3)}</p>`)
  lines.push(`      <h2>${htmlEscape(homeTexts.aboutTitle)}</h2>`)
  lines.push(`      <p>${htmlEscape(homeTexts.aboutLead)} <a href="${absoluteUrl('/ueber/')}">Über-Seite</a> beschrieben.</p>`)
  lines.push(`      <h2>${htmlEscape(homeTexts.methodTitle)}</h2>`)
  lines.push(`      <p>${htmlEscape(homeTexts.methodLead)} <a href="${absoluteUrl('/methodik/')}">Methodik-Seite</a>. Praktische Tipps für die Gesprächssituation: <a href="${absoluteUrl('/leitfaden/')}">Gesprächsleitfaden</a>.</p>`)
  lines.push(`      <h2>${htmlEscape(homeTexts.transparencyTitle)}</h2>`)
  lines.push(`      <p>${htmlEscape(homeTexts.transparencyText)}</p>`)
  lines.push('      <h2>Quellen &amp; Transparenz</h2>')
  lines.push('      <p>Alle Aussagen auf dieser Seite werden mit Primärquellen belegt (Studien, amtliche Statistiken, Fachinstitute). Die vollständige Quellenliste ist auf jeder Themenseite einsehbar.</p>')
  lines.push('      <p><a href="https://fakten-stammtisch.de/impressum/">Impressum &amp; Datenschutz</a> · <a href="https://fakten-stammtisch.de/feedback/">Feedback</a> · E-Mail: feedback@fakten-stammtisch.de</p>')

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

  // Move fallback into <noscript> and keep <div id="root"> empty
  let updated = html
  const rootRegex = /(<div id="root">)[\s\S]*?(<\/div>)/
  if (rootRegex.test(updated)) {
    updated = updated.replace(rootRegex, '<div id="root"></div>')
  }
  const noscriptRegex = /(<noscript>)[\s\S]*?(<\/noscript>)/
  if (noscriptRegex.test(updated)) {
    updated = updated.replace(noscriptRegex, `$1\n${fallback}\n    $2`)
    await writeFile(indexPath, updated, 'utf8')
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

  await writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), buildSitemap(topics, topicDataById), 'utf8')
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

const isDirectRun = import.meta.url === `file://${process.argv[1]}`
if (isDirectRun) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
