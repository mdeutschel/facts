// Markdown renderers for the agent-facing representations of the site.
//
// Single source of truth for every non-HTML rendering of topic content: the
// `.md` twins served via `Accept: text/markdown`, and the `llms*.txt` /
// `llms/**` plaintext exports. Block rendering delegates to
// `flattenContentBlock` from `./content.mjs` and only overrides the block types
// where Markdown syntax carries real information (tables above all), so there
// is no second content renderer to keep in sync.

import { VERDICT_META, absoluteUrl, flattenContentBlock } from './content.mjs'

// Table cells are prose that may itself contain a pipe or a line break, both of
// which would break out of a GFM table row.
function mdCell(value) {
  return String(value).replaceAll('|', '\\|').replace(/\s*\n\s*/g, ' ').trim()
}

export function renderBlockMarkdown(block) {
  if (block.type === 'table') {
    const lines = []
    if (block.caption) lines.push(`_${block.caption}_`, '')
    lines.push(`| ${block.headers.map(mdCell).join(' | ')} |`)
    lines.push(`| ${block.headers.map(() => '---').join(' | ')} |`)
    for (const row of block.rows) {
      lines.push(`| ${row.map(mdCell).join(' | ')} |`)
    }
    return lines.join('\n')
  }

  if (block.type === 'myth_fact') {
    const lines = []
    if (block.caption) lines.push(`_${block.caption}_`, '')
    for (const item of block.items) {
      lines.push(`- **Behauptung:** ${item.myth}`)
      lines.push(`  - **Faktencheck:** ${item.fact}`)
    }
    return lines.join('\n')
  }

  // Every other block type reuses the plaintext renderer. Those emit a caption
  // as a leading `Hinweis: …` line; in Markdown an italic lead-in reads better,
  // so the caption is rendered here and dropped from the delegated block.
  if (block.caption) {
    const { caption, ...rest } = block
    const body = flattenContentBlock(rest)
    return body ? [`_${caption}_`, '', body].join('\n') : `_${caption}_`
  }

  return flattenContentBlock(block)
}

function renderSectionsMarkdown(sections, headingPrefix) {
  return sections
    .map((section) => {
      const blocks = section.content
        .map((block) => renderBlockMarkdown(block))
        .filter(Boolean)
        .join('\n\n')
      return [`${headingPrefix} ${section.title}`, '', blocks].join('\n')
    })
    .join('\n\n')
}

function renderSourcesMarkdown(sources) {
  return sources
    .map((source) => (source.url ? `- [${source.label}](${source.url})` : `- ${source.label}`))
    .join('\n')
}

function verdictLabel(argument) {
  return argument.verdict ? VERDICT_META[argument.verdict]?.label : undefined
}

// Body used by llms.txt / llms-full.txt / llms/{topicId}.txt. Heading levels
// start at `###` because these files nest topics under a `##` heading.
export function buildTopicBodyMarkdown(topicData) {
  const argumentTexts = topicData.arguments
    .map((argument) => [`- Aussage: ${argument.claim}`, `  Antwort: ${argument.response}`].join('\n'))
    .join('\n')

  const summary = topicData.seoDescription ?? topicData.subtitle
  return [
    `${summary} | Stand: ${topicData.lastUpdated}`,
    '',
    '### Fakten',
    '',
    renderSectionsMarkdown(topicData.sections, '####'),
    '',
    '### Argumente',
    '',
    argumentTexts,
    '',
    '### Quellen',
    '',
    renderSourcesMarkdown(topicData.sources),
  ].join('\n')
}

// Standalone `.md` twin of /thema/{topicId}/.
export function buildTopicMarkdown(topicData) {
  const canonical = absoluteUrl(`/thema/${topicData.id}/`)
  const lines = []

  lines.push(`# ${topicData.title}`)
  lines.push('')
  lines.push(`> ${topicData.seoDescription ?? topicData.subtitle}`)
  lines.push('')
  lines.push(`- **URL:** ${canonical}`)
  lines.push(`- **Thema-ID:** \`${topicData.id}\``)
  lines.push(`- **Stand:** ${topicData.lastUpdated}`)
  lines.push(`- **JSON-Daten:** ${absoluteUrl(`/data/${topicData.id}.json`)}`)
  lines.push('')

  if (Array.isArray(topicData.keyStats) && topicData.keyStats.length > 0) {
    lines.push('## Kernzahlen')
    lines.push('')
    for (const stat of topicData.keyStats) {
      lines.push(`- ${stat}`)
    }
    lines.push('')
  }

  lines.push('## Fakten')
  lines.push('')
  lines.push(renderSectionsMarkdown(topicData.sections, '###'))
  lines.push('')

  lines.push('## Argumente')
  lines.push('')
  for (const argument of topicData.arguments) {
    const label = verdictLabel(argument)
    lines.push(`### ${argument.claim}`)
    lines.push('')
    if (label) lines.push(`**Bewertung:** ${label}`, '')
    lines.push(argument.response)
    lines.push('')
    lines.push(`[Detailseite](${absoluteUrl(`/thema/${topicData.id}/${argument.id}/`)})`)
    lines.push('')
  }

  lines.push('## Quellen')
  lines.push('')
  lines.push(renderSourcesMarkdown(topicData.sources))
  lines.push('')
  if (topicData.sourceNote) {
    lines.push(`_${topicData.sourceNote}_`)
    lines.push('')
  }

  return lines.join('\n')
}

// Standalone representation of /thema/{topicId}/{argumentId}/ — served both as
// the `.md` twin and as llms/{topicId}/{argumentId}.txt.
export function buildArgumentMarkdown(topic, argument) {
  const label = verdictLabel(argument)
  const lines = []

  lines.push(`# ${argument.claim}`)
  lines.push('')
  lines.push(`Thema: ${topic.title}`)
  lines.push(`URL: ${absoluteUrl(`/thema/${topic.id}/${argument.id}/`)}`)
  if (label) lines.push(`Bewertung: ${label}`)
  lines.push(`Stand: ${topic.lastUpdated}`)
  lines.push('')
  lines.push('## Antwort')
  lines.push('')
  lines.push(argument.response)
  lines.push('')

  if (argument.rhetoricalPattern) {
    lines.push('## Was hinter der Parole steckt')
    lines.push('')
    lines.push(argument.rhetoricalPattern)
    lines.push('')
  }

  if (argument.counterQuestions && argument.counterQuestions.length > 0) {
    lines.push('## Am Tisch nützlich – Gegenfragen')
    lines.push('')
    for (const question of argument.counterQuestions) {
      lines.push(`- „${question}"`)
    }
    lines.push('')
  }

  const relatedSections = (argument.relatedSections ?? [])
    .map((sectionId) => topic.sections.find((section) => section.id === sectionId))
    .filter(Boolean)

  if (relatedSections.length > 0) {
    lines.push('## Fakten dazu')
    lines.push('')
    lines.push(renderSectionsMarkdown(relatedSections, '###'))
    lines.push('')
  }

  const citedSourceIds = new Set()
  for (const section of relatedSections) {
    for (const block of section.content) {
      if (block.sourceRefs) {
        for (const ref of block.sourceRefs) citedSourceIds.add(ref)
      }
    }
  }
  const citedSources = topic.sources.filter((source) => citedSourceIds.has(source.id))
  if (citedSources.length > 0) {
    lines.push('## Quellen')
    lines.push('')
    lines.push(renderSourcesMarkdown(citedSources))
    lines.push('')
  }

  return lines.join('\n')
}

// Standalone `.md` twin of the home page.
export function buildHomeMarkdown(topics, homeTexts) {
  const lines = []

  lines.push('# Fakten-Stammtisch')
  lines.push('')
  lines.push('> Faktenbasierte Argumente und Quellen zu politischen und gesellschaftlichen')
  lines.push('> Themen in Deutschland. Deutschsprachig, privat, nicht-kommerziell.')
  lines.push('')
  lines.push(`- **URL:** ${absoluteUrl('/')}`)
  lines.push('- **Sprache:** de')
  lines.push(`- **Themen:** ${topics.length}`)
  lines.push('')

  lines.push(`## ${homeTexts.heading}`)
  lines.push('')
  lines.push(homeTexts.intro)
  lines.push('')

  lines.push('## Themen')
  lines.push('')
  for (const topic of topics) {
    const url = absoluteUrl(`/thema/${topic.id}/`)
    lines.push(
      `- [${topic.title}](${url}) — ${topic.subtitle} (${topic.factCount} Fakten, ${topic.argumentCount} Argumente)`,
    )
  }
  lines.push('')

  lines.push(`## ${homeTexts.usageTitle}`)
  lines.push('')
  lines.push(homeTexts.usageP1)
  lines.push('')
  lines.push(homeTexts.usageP2)
  lines.push('')
  lines.push(homeTexts.usageP3)
  lines.push('')

  lines.push('## Formate für Agenten')
  lines.push('')
  lines.push('- Jede Seite auch als Markdown: `Accept: text/markdown` senden, oder `index.md` an die URL anhängen')
  lines.push(`- Plaintext-Übersicht: [llms.txt](${absoluteUrl('/llms.txt')}), [llms-full.txt](${absoluteUrl('/llms-full.txt')})`)
  lines.push(`- JSON-Daten: [topics.json](${absoluteUrl('/data/topics.json')}) und \`/data/{topicId}.json\``)
  lines.push(`- API-Katalog: [/.well-known/api-catalog](${absoluteUrl('/.well-known/api-catalog')})`)
  lines.push(`- Zugriffshinweise: [auth.md](${absoluteUrl('/auth.md')})`)
  lines.push('')

  lines.push('## Projekt')
  lines.push('')
  lines.push(`- [Über das Projekt](${absoluteUrl('/ueber/')})`)
  lines.push(`- [Methodik](${absoluteUrl('/methodik/')})`)
  lines.push(`- [Gesprächsleitfaden](${absoluteUrl('/leitfaden/')})`)
  lines.push(`- [Impressum & Datenschutz](${absoluteUrl('/impressum/')})`)
  lines.push(`- [Feedback](${absoluteUrl('/feedback/')}) · feedback@fakten-stammtisch.de`)
  lines.push('')

  return lines.join('\n')
}
