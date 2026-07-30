import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { absoluteUrl, htmlEscape } from './lib/content.mjs'
import { buildTopicBodyMarkdown } from './lib/markdown.mjs'

const ROOT_DIR = process.cwd()
const PUBLIC_DIR = path.join(ROOT_DIR, 'public')
const DATA_DIR = path.join(PUBLIC_DIR, 'data')

const HOME_TEXTS_PATH = path.join(ROOT_DIR, 'src/content/homeTexts.json')
const homeTexts = JSON.parse(await readFile(HOME_TEXTS_PATH, 'utf8'))

function xmlEscape(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
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
    '## Formate fuer Agenten',
    '',
    '- Markdown: jede Seite liefert eine Markdown-Variante, wenn der Request `Accept: text/markdown` sendet',
    '- Markdown direkt: `index.md` an eine Seiten-URL anhaengen, z. B. /thema/{topicId}/index.md',
    `- JSON-Daten: [topics.json](${absoluteUrl('/data/topics.json')}) und /data/{topicId}.json`,
    `- [API-Katalog](${absoluteUrl('/.well-known/api-catalog')}): maschinenlesbarer Einstieg (RFC 9727)`,
    `- [OpenAPI-Beschreibung](${absoluteUrl('/api/openapi.json')}) und [Doku](${absoluteUrl('/api/README.md')})`,
    `- [auth.md](${absoluteUrl('/auth.md')}): Zugriff, faire Nutzung, Zitierhinweise (keine Anmeldung notwendig)`,
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

function buildTopicTxt(topicData) {
  return [
    `# ${topicData.title}`,
    '',
    buildTopicBodyMarkdown(topicData),
    '',
  ].join('\n')
}

function buildLlmsFull(topics, topicDataById) {
  const sections = topics.map((topic) => {
    const topicData = topicDataById.get(topic.id)
    if (!topicData) return ''

    return [`## ${topicData.title}`, '', buildTopicBodyMarkdown(topicData)].join('\n')
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
