import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { absoluteUrl, flattenContentBlock, htmlEscape } from './generate-seo.mjs'

const ROOT_DIR = process.cwd()
const DIST_DIR = path.join(ROOT_DIR, 'dist')
const DATA_DIR = path.join(DIST_DIR, 'data')
const SITE_URL = 'https://fakten-stammtisch.de'
const SITE_NAME = 'Fakten-Stammtisch'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`
const PERSON_ID = 'https://fakten-stammtisch.de/ueber/#person'
const DESCRIPTION_MAX = 155
const TITLE_MAX = 65

const VERDICT_RATING_BEST = 5
const VERDICT_RATING_WORST = 1
const VERDICT_META = {
  'false': { label: 'Falsch', ratingValue: 1 },
  'mostly-false': { label: 'Überwiegend falsch', ratingValue: 2 },
  'misleading': { label: 'Irreführend', ratingValue: 2 },
  'outdated': { label: 'Überholt', ratingValue: 2 },
  'lacks-context': { label: 'Ohne Kontext irreführend', ratingValue: 2 },
  'partially-true': { label: 'Teilweise wahr', ratingValue: 3 },
  'mostly-true': { label: 'Überwiegend wahr', ratingValue: 4 },
}

function truncate(text, max) {
  if (text.length <= max) return text
  const sliced = text.slice(0, max - 1)
  const lastSpace = sliced.lastIndexOf(' ')
  return (lastSpace > max * 0.6 ? sliced.slice(0, lastSpace) : sliced) + '…'
}

function attrEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function jsonLdScript(payload) {
  // Embedding JSON inside <script>: escape `<` to prevent premature script close.
  const json = JSON.stringify(payload).replaceAll('<', '\\u003c')
  return `<script type="application/ld+json" data-prerendered="route">${json}</script>`
}

function buildBreadcrumbList(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

function getRelatedTopics(topic, topicsById) {
  if (!topic.relatedTopicIds || topic.relatedTopicIds.length === 0) return []
  return topic.relatedTopicIds
    .map((relatedId) => topicsById.get(relatedId))
    .filter(Boolean)
}

function buildRelatedTopicsNoscript(topic, topicsById) {
  const relatedTopics = getRelatedTopics(topic, topicsById)
  if (relatedTopics.length === 0) return ""

  const items = relatedTopics
    .map((relatedTopic) => `<li><a href="${attrEscape(absoluteUrl(`/thema/${relatedTopic.id}/`))}">${htmlEscape(relatedTopic.title)}</a></li>`)
    .join("")

  return `<section><h2>Verwandte Themen</h2><ul>${items}</ul></section>`
}

function buildTopicJsonLd(topic, topicsById) {
  const topicUrl = absoluteUrl(`/thema/${topic.id}/`)
  const seoTitle = topic.seoTitle ?? topic.title
  const seoDescription = topic.seoDescription ?? topic.subtitle

  const relatedTopics = getRelatedTopics(topic, topicsById)

  const article = {
    '@type': 'Article',
    '@id': `${topicUrl}#article`,
    url: topicUrl,
    headline: seoTitle,
    description: seoDescription,
    inLanguage: 'de',
    datePublished: topic.lastUpdated,
    dateModified: topic.lastUpdated,
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    mainEntityOfPage: topicUrl,
    relatedLink: relatedTopics.map((relatedTopic) => absoluteUrl(`/thema/${relatedTopic.id}/`)),
  }

  const breadcrumb = buildBreadcrumbList([
    { name: 'Themen', url: SITE_URL + '/' },
    { name: topic.title, url: topicUrl },
  ])

  return {
    '@context': 'https://schema.org',
    '@graph': [article, breadcrumb],
  }
}

function buildArgumentJsonLd(topic, argument) {
  const argumentUrl = absoluteUrl(`/thema/${topic.id}/${argument.id}/`)
  const topicUrl = absoluteUrl(`/thema/${topic.id}/`)
  const seoDescription = truncate(argument.response.replace(/\s+/g, ' ').trim(), DESCRIPTION_MAX)
  const verdictMeta = argument.verdict ? VERDICT_META[argument.verdict] : null

  const graph = [
    {
      '@type': 'QAPage',
      '@id': `${argumentUrl}#qapage`,
      url: argumentUrl,
      name: argument.claim,
      description: seoDescription,
      inLanguage: 'de',
      dateModified: topic.lastUpdated,
      author: { '@id': PERSON_ID },
      publisher: { '@id': PERSON_ID },
      isPartOf: {
        '@type': 'Article',
        '@id': `${topicUrl}#article`,
        name: topic.title,
        url: topicUrl,
      },
      mainEntity: {
        '@type': 'Question',
        name: argument.claim,
        text: argument.claim,
        answerCount: 1,
        acceptedAnswer: {
          '@type': 'Answer',
          text: argument.response,
          author: { '@id': PERSON_ID },
        },
      },
    },
  ]

  if (verdictMeta) {
    graph.push({
      '@type': 'ClaimReview',
      '@id': `${argumentUrl}#claimreview`,
      url: argumentUrl,
      datePublished: topic.lastUpdated,
      claimReviewed: argument.claim,
      author: { '@id': PERSON_ID },
      itemReviewed: {
        '@type': 'Claim',
        text: argument.claim,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: verdictMeta.ratingValue,
        bestRating: VERDICT_RATING_BEST,
        worstRating: VERDICT_RATING_WORST,
        alternateName: verdictMeta.label,
      },
    })
  }

  graph.push(
    buildBreadcrumbList([
      { name: 'Themen', url: SITE_URL + '/' },
      { name: topic.title, url: topicUrl },
      { name: truncate(argument.claim, TITLE_MAX), url: argumentUrl },
    ]),
  )

  return { '@context': 'https://schema.org', '@graph': graph }
}

function renderContentBlockHtml(block) {
  if (block.type === 'fact') {
    return `<li>${htmlEscape(block.text)}</li>`
  }
  if (block.type === 'text') {
    return `<p>${htmlEscape(block.text)}</p>`
  }
  if (block.type === 'table') {
    const lines = []
    if (block.caption) lines.push(`<p><em>${htmlEscape(block.caption)}</em></p>`)
    lines.push('<table>')
    lines.push('<tr>' + block.headers.map((h) => `<th>${htmlEscape(h)}</th>`).join('') + '</tr>')
    for (const row of block.rows) {
      lines.push('<tr>' + row.map((cell) => `<td>${htmlEscape(cell)}</td>`).join('') + '</tr>')
    }
    lines.push('</table>')
    return lines.join('')
  }
  // For all chart/grid/comparison types we re-use the plaintext flattener and wrap as a <pre>.
  const flat = flattenContentBlock(block)
  if (!flat) return ''
  return `<pre>${htmlEscape(flat)}</pre>`
}

function renderSectionsHtml(sections) {
  const out = []
  for (const section of sections) {
    out.push(`<section><h3>${htmlEscape(section.title)}</h3>`)
    let inFactList = false
    for (const block of section.content) {
      const isFact = block.type === 'fact'
      if (isFact && !inFactList) {
        out.push('<ul>')
        inFactList = true
      } else if (!isFact && inFactList) {
        out.push('</ul>')
        inFactList = false
      }
      out.push(renderContentBlockHtml(block))
    }
    if (inFactList) out.push('</ul>')
    out.push('</section>')
  }
  return out.join('\n')
}

function renderSourcesHtml(sources) {
  if (!sources || sources.length === 0) return ''
  const items = sources
    .map((src) => {
      const label = htmlEscape(src.label)
      return src.url
        ? `<li>${label} — <a href="${attrEscape(src.url)}" rel="nofollow noopener">${attrEscape(src.url)}</a></li>`
        : `<li>${label}</li>`
    })
    .join('')
  return `<section><h2>Quellen</h2><ol>${items}</ol></section>`
}

function buildTopicNoscript(topic, topicsById) {
  const headline = topic.seoTitle ?? topic.title
  const summary = topic.seoDescription ?? topic.subtitle
  const lines = []
  lines.push('<article>')
  lines.push(`<nav aria-label="Breadcrumb"><a href="${SITE_URL}/">Themen</a> › ${htmlEscape(topic.title)}</nav>`)
  lines.push(`<h1>${htmlEscape(headline)}</h1>`)
  lines.push(`<p>${htmlEscape(summary)}</p>`)
  lines.push(
    `<p><small>Stand: ${htmlEscape(topic.lastUpdated)} · ${topic.sources.length} Quellen · ${topic.arguments.length} Argumente · ${topic.sections.length} Faktenabschnitte · <a href="${SITE_URL}/methodik/">Wie geprüft wird</a> · <a href="${SITE_URL}/feedback/">Fehler melden</a></small></p>`,
  )

  if (topic.arguments && topic.arguments.length > 0) {
    lines.push('<section><h2>Argumente</h2><dl>')
    for (const arg of topic.arguments) {
      const argUrl = absoluteUrl(`/thema/${topic.id}/${arg.id}/`)
      const verdict = arg.verdict ? ` <em>(Bewertung: ${htmlEscape(VERDICT_META[arg.verdict]?.label ?? arg.verdict)})</em>` : ''
      lines.push(`<dt><a href="${attrEscape(argUrl)}">${htmlEscape(arg.claim)}</a>${verdict}</dt>`)
      lines.push(`<dd>${htmlEscape(arg.response)}</dd>`)
    }
    lines.push('</dl></section>')
  }

  if (topic.sections && topic.sections.length > 0) {
    lines.push('<section><h2>Fakten</h2>')
    lines.push(renderSectionsHtml(topic.sections))
    lines.push('</section>')
  }

  lines.push(buildRelatedTopicsNoscript(topic, topicsById))

  lines.push(renderSourcesHtml(topic.sources))

  if (topic.sourceNote) {
    lines.push(`<p><small>${htmlEscape(topic.sourceNote)}</small></p>`)
  }

  lines.push(`<p><a href="${SITE_URL}/">Zurück zur Themenübersicht</a></p>`)
  lines.push('</article>')
  return lines.join('\n')
}

function buildArgumentNoscript(topic, argument, topicsById) {
  const verdictMeta = argument.verdict ? VERDICT_META[argument.verdict] : null
  const argumentUrl = absoluteUrl(`/thema/${topic.id}/${argument.id}/`)
  const topicUrl = absoluteUrl(`/thema/${topic.id}/`)

  const relatedSections = (argument.relatedSections ?? [])
    .map((sid) => topic.sections.find((s) => s.id === sid))
    .filter(Boolean)

  const citedSourceIds = new Set()
  for (const section of relatedSections) {
    for (const block of section.content) {
      if (block.sourceRefs) {
        for (const ref of block.sourceRefs) citedSourceIds.add(ref)
      }
    }
  }
  const citedSources = topic.sources
    .map((src, idx) => ({ src, num: idx + 1 }))
    .filter(({ src }) => citedSourceIds.has(src.id))

  const otherArguments = topic.arguments.filter((a) => a.id !== argument.id)

  const lines = []
  lines.push('<article>')
  lines.push(
    `<nav aria-label="Breadcrumb"><a href="${SITE_URL}/">Themen</a> › <a href="${attrEscape(topicUrl)}">${htmlEscape(topic.title)}</a> › Argument</nav>`,
  )
  lines.push(`<p><small>Aussage zum Thema ${htmlEscape(topic.title)} · Stand: ${htmlEscape(topic.lastUpdated)}</small></p>`)
  lines.push(`<h1>„${htmlEscape(argument.claim)}"</h1>`)
  if (verdictMeta) {
    lines.push(`<p><strong>Bewertung: ${htmlEscape(verdictMeta.label)}</strong></p>`)
  }
  lines.push('<section>')
  // Convert linebreaks to <br/> to mirror the React `whiteSpace: pre-line` rendering.
  const responseHtml = htmlEscape(argument.response).replaceAll('\n', '<br/>')
  lines.push(`<p>${responseHtml}</p>`)
  if (argument.keywords && argument.keywords.length > 0) {
    lines.push(
      `<p><small>Stichworte: ${argument.keywords.map((kw) => htmlEscape(kw)).join(', ')}</small></p>`,
    )
  }
  lines.push('</section>')

  if (relatedSections.length > 0) {
    lines.push('<section><h2>Fakten dazu</h2>')
    lines.push(renderSectionsHtml(relatedSections))
    lines.push('</section>')
  }

  if (citedSources.length > 0) {
    const items = citedSources
      .map(({ src, num }) => {
        const label = htmlEscape(src.label)
        return src.url
          ? `<li value="${num}">${label} — <a href="${attrEscape(src.url)}" rel="nofollow noopener">${attrEscape(src.url)}</a></li>`
          : `<li value="${num}">${label}</li>`
      })
      .join('')
    lines.push(`<section><h2>Zitierte Quellen</h2><ol>${items}</ol></section>`)
  }

  if (otherArguments.length > 0) {
    lines.push('<section><h2>Weitere Aussagen zum Thema</h2><ul>')
    for (const a of otherArguments) {
      const url = absoluteUrl(`/thema/${topic.id}/${a.id}/`)
      lines.push(`<li><a href="${attrEscape(url)}">„${htmlEscape(a.claim)}"</a></li>`)
    }
    lines.push('</ul></section>')
  }

  lines.push(buildRelatedTopicsNoscript(topic, topicsById))

  lines.push(`<p><a href="${attrEscape(topicUrl)}">Zurück zur Übersicht: ${htmlEscape(topic.title)}</a></p>`)
  lines.push('</article>')
  return lines.join('\n')
}

function buildArgumentTxt(topic, argument) {
  const verdictMeta = argument.verdict ? VERDICT_META[argument.verdict] : null
  const lines = []
  lines.push(`# ${argument.claim}`)
  lines.push('')
  lines.push(`Thema: ${topic.title}`)
  lines.push(`URL: ${absoluteUrl(`/thema/${topic.id}/${argument.id}/`)}`)
  if (verdictMeta) lines.push(`Bewertung: ${verdictMeta.label}`)
  lines.push(`Stand: ${topic.lastUpdated}`)
  lines.push('')
  lines.push('## Antwort')
  lines.push('')
  lines.push(argument.response)
  lines.push('')

  const relatedSections = (argument.relatedSections ?? [])
    .map((sid) => topic.sections.find((s) => s.id === sid))
    .filter(Boolean)

  if (relatedSections.length > 0) {
    lines.push('## Fakten dazu')
    lines.push('')
    for (const section of relatedSections) {
      lines.push(`### ${section.title}`)
      lines.push('')
      for (const block of section.content) {
        const text = flattenContentBlock(block)
        if (text) lines.push(text)
      }
      lines.push('')
    }
  }

  const citedSourceIds = new Set()
  for (const section of relatedSections) {
    for (const block of section.content) {
      if (block.sourceRefs) {
        for (const ref of block.sourceRefs) citedSourceIds.add(ref)
      }
    }
  }
  const citedSources = topic.sources.filter((src) => citedSourceIds.has(src.id))
  if (citedSources.length > 0) {
    lines.push('## Quellen')
    lines.push('')
    for (const src of citedSources) {
      lines.push(src.url ? `- ${src.label} (${src.url})` : `- ${src.label}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

const META_TAGS = [
  { selector: /<title>[\s\S]*?<\/title>/, build: (v) => `<title>${htmlEscape(v.fullTitle)}</title>` },
  { selector: /<meta name="description"[^>]*>/, build: (v) => `<meta name="description" content="${attrEscape(v.description)}" />` },
  { selector: /<link rel="canonical"[^>]*>/, build: (v) => `<link rel="canonical" href="${attrEscape(v.canonical)}" />`, optional: true },
  { selector: /<meta property="og:title"[^>]*>/, build: (v) => `<meta property="og:title" content="${attrEscape(v.title)}" />` },
  { selector: /<meta property="og:description"[^>]*>/, build: (v) => `<meta property="og:description" content="${attrEscape(v.description)}" />` },
  { selector: /<meta property="og:url"[^>]*>/, build: (v) => `<meta property="og:url" content="${attrEscape(v.canonical)}" />` },
  { selector: /<meta name="twitter:title"[^>]*>/, build: (v) => `<meta name="twitter:title" content="${attrEscape(v.title)}" />` },
  { selector: /<meta name="twitter:description"[^>]*>/, build: (v) => `<meta name="twitter:description" content="${attrEscape(v.description)}" />` },
]

function rewriteHead(html, values) {
  let updated = html
  for (const { selector, build, optional } of META_TAGS) {
    const replacement = build(values)
    if (selector.test(updated)) {
      updated = updated.replace(selector, replacement)
    } else if (!optional) {
      // Inject before </head> if the tag doesn't exist (canonical is optional in the source).
      updated = updated.replace('</head>', `    ${replacement}\n  </head>`)
    } else {
      updated = updated.replace('</head>', `    ${replacement}\n  </head>`)
    }
  }
  return updated
}

function injectJsonLd(html, jsonLdPayload) {
  if (!jsonLdPayload) return html
  const tag = jsonLdScript(jsonLdPayload)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function replaceNoscript(html, noscriptHtml) {
  const re = /<noscript>[\s\S]*?<\/noscript>/
  const replacement = `<noscript>\n${noscriptHtml}\n    </noscript>`
  if (re.test(html)) {
    return html.replace(re, replacement)
  }
  // Fallback: insert just before </body>.
  return html.replace('</body>', `${replacement}\n  </body>`)
}

function buildRouteHtml(template, opts) {
  const fullTitle = `${opts.title} | ${SITE_NAME}`
  let updated = rewriteHead(template, {
    fullTitle,
    title: opts.title,
    description: opts.description,
    canonical: opts.canonical,
  })
  updated = injectJsonLd(updated, opts.jsonLd)
  updated = replaceNoscript(updated, opts.noscript)
  // Make sure og:image is set (fallback if missing in template).
  if (!/og:image"\s/.test(updated)) {
    const tag = `<meta property="og:image" content="${DEFAULT_IMAGE}" />`
    updated = updated.replace('</head>', `    ${tag}\n  </head>`)
  }
  if (opts.noindex) {
    const tag = '<meta name="robots" content="noindex, follow" />'
    updated = updated.replace('</head>', `    ${tag}\n  </head>`)
  }
  return updated
}

async function writeRouteHtml(routePath, html) {
  const dir = path.join(DIST_DIR, routePath)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, 'index.html'), html, 'utf8')
}

// --- Static routes (Über, Methodik, Impressum, Feedback, Suche) -----------
// Each entry mirrors the runtime PageMeta + JSON-LD of the matching React page,
// plus a curated noscript summary that links into the live SPA.
const STATIC_ROUTES = [
  {
    path: '/ueber',
    title: 'Über das Projekt',
    description:
      'Über das private, nicht-kommerzielle Projekt Fakten-Stammtisch von Marcel Deutschel: Hintergrund, Motivation, Verantwortung und wie die Inhalte entstehen.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'AboutPage',
          '@id': `${SITE_URL}/ueber/#aboutpage`,
          url: `${SITE_URL}/ueber/`,
          name: 'Über dieses Projekt',
          inLanguage: 'de',
          about: { '@id': PERSON_ID },
          mainEntity: { '@id': PERSON_ID },
        },
        {
          '@type': 'Person',
          '@id': PERSON_ID,
          name: 'Marcel Deutschel',
          jobTitle: 'Informatiker',
          description:
            'Informatiker mit langjähriger Auseinandersetzung mit großen Sprachmodellen. Verantwortlich für Konzept und Methodik von Fakten-Stammtisch.',
          url: `${SITE_URL}/ueber/`,
          sameAs: ['https://github.com/mdeutschel'],
          knowsAbout: [
            'KI-gestützte Inhaltsverifikation',
            'Quellenverifizierung',
            'Argumentationsanalyse',
            'Informatik',
          ],
        },
      ],
    },
    noscript: `
<article>
<nav aria-label="Breadcrumb"><a href="${SITE_URL}/">Themen</a> › Über</nav>
<h1>Über dieses Projekt</h1>
<p>Fakten-Stammtisch ist eine Sammlung belastbarer Argumente und Zahlen zu wiederkehrenden gesellschaftlichen Streitfragen — Energiewende, Bürgergeld, Migration, Gendern, Heizungswechsel und mehr. Mobil-first, ohne Werbung, ohne Tracker, ohne Anmeldung. Nicht-kommerziell.</p>
<h2>Wer dahintersteht</h2>
<p>Marcel Deutschel, Informatiker, beschäftigt sich seit Jahren intensiv mit großen Sprachmodellen — was sie können, was nicht, und wie man sie gegen ihre eigenen Schwächen absichert. Fakten-Stammtisch ist sein privates Projekt.</p>
<p>Er ist ausdrücklich kein Experte für Klimaforschung, Sozialpolitik, Verkehrsplanung oder Sprachwissenschaft. Sein Beitrag liegt in der Arbeit am Prüfverfahren selbst — den Skills im <a href="https://github.com/mdeutschel/facts/tree/main/.claude/skills" rel="noopener">Open-Source-Repository</a>.</p>
<h2>Wie die Inhalte entstehen</h2>
<p>Jedes Topic durchläuft denselben Workflow: Recherche, strukturierte Aufbereitung, Quellenverifizierung gegen erreichbare Online-Belege, inhaltliche Prüfung gegen sieben Qualitätsdimensionen (Nuance, Quellen-Fit, Annahmen-Transparenz, Fakt vs. Bewertung, Gegenargumente, sprachliche Präzision, Argument-Claim-Passung). Details auf der <a href="${SITE_URL}/methodik/">Methodik-Seite</a>.</p>
<h2>Was diese Seite nicht ist</h2>
<ul>
<li>Kein Faktencheck-Portal im journalistischen Sinn (dafür gibt es Correctiv, dpa-Faktencheck und andere).</li>
<li>Kein Wikipedia-Ersatz — das hier ist explizit argumentativ zugespitzt.</li>
<li>Kein Werbe- oder Affiliate-Projekt — keine Einnahmen, keine bezahlten Inhalte, keine Tracking-Cookies.</li>
</ul>
<p><a href="${SITE_URL}/feedback/">Feedback &amp; Kontakt</a> · <a href="${SITE_URL}/impressum/">Impressum</a></p>
</article>`.trim(),
  },
  {
    path: '/methodik',
    title: 'Methodik',
    description:
      'Wie Inhalte auf Fakten-Stammtisch entstehen: KI-gestützter Workflow mit Quellenverifizierung, sieben Qualitätsdimensionen und transparenter Aktualität.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_URL}/methodik/#webpage`,
      url: `${SITE_URL}/methodik/`,
      name: 'Methodik',
      description:
        'Wie Inhalte auf Fakten-Stammtisch entstehen: KI-gestützter Workflow mit Quellenverifizierung, sieben Qualitätsdimensionen und transparenter Aktualität.',
      inLanguage: 'de',
      author: { '@id': PERSON_ID },
      publisher: { '@id': PERSON_ID },
    },
    noscript: `
<article>
<nav aria-label="Breadcrumb"><a href="${SITE_URL}/">Themen</a> › Methodik</nav>
<h1>Methodik</h1>
<p>Alle Inhalte auf Fakten-Stammtisch werden mit Hilfe von KI-Systemen erstellt. Damit das nicht in beliebigem Plausibilitäts-Text mündet, durchläuft jedes Topic einen festen Prüfprozess.</p>
<h2>Der Workflow im Überblick</h2>
<ol>
<li><strong>Recherche &amp; Quellensammlung</strong> — Primärquellen (Studien, amtliche Statistiken, Fachinstitute) werden gezielt gesucht und dokumentiert.</li>
<li><strong>Strukturierte Aufbereitung</strong> — Fakten und Argumente werden in einem festen JSON-Schema erfasst (Sections, Arguments mit Claim/Response, Sources).</li>
<li><strong>Quellenverifizierung</strong> — jede Quelle wird gegen die tatsächlich erreichbare Online-Quelle geprüft (URL erreichbar, Daten stimmen mit dem Beleg überein).</li>
<li><strong>Inhaltliche Qualitätsprüfung</strong> — entlang sieben Dimensionen: Nuance &amp; Teilwahrheiten, Claim-Source-Fit, Annahmen-Transparenz, Fakt vs. Bewertung, Gegenargumente einbeziehen, sprachliche Präzision, Argument-Claim-Passung.</li>
<li><strong>Veröffentlichung</strong> — mit Stand-Datum (lastUpdated), das transparent macht, wann zuletzt aktualisiert wurde.</li>
</ol>
<h2>Transparenz</h2>
<p>Das gesamte Verfahren — inklusive der Skills, die der KI vorgeben, wie eine Quelle verifiziert oder ein Argument geprüft wird — ist im <a href="https://github.com/mdeutschel/facts/tree/main/.claude/skills" rel="noopener">Open-Source-Repository einsehbar</a>.</p>
<p>Korrekturhinweise und bessere Belege willkommen — siehe <a href="${SITE_URL}/feedback/">Feedback</a>.</p>
</article>`.trim(),
  },
  {
    path: '/impressum',
    title: 'Impressum und Datenschutz',
    description: 'Impressum, Datenschutz und Kontaktinformationen von Fakten-Stammtisch.',
    noscript: `
<article>
<nav aria-label="Breadcrumb"><a href="${SITE_URL}/">Themen</a> › Impressum</nav>
<h1>Impressum &amp; Datenschutz</h1>
<p>Verantwortlich für Konzept, Methodik und Veröffentlichung: Marcel Deutschel. Vollständige Anschrift und Kontaktdaten in der <a href="${SITE_URL}/impressum/">Impressum-Ansicht der App</a>.</p>
<p>Fakten-Stammtisch ist ein privates, nicht-kommerzielles Projekt. Keine Werbung, keine Tracking-Cookies, keine personenbezogenen Auswertungen über das technisch Notwendige hinaus.</p>
</article>`.trim(),
  },
  {
    path: '/feedback',
    title: 'Feedback',
    description:
      'Feedback, neue Themen und Argumentvorschläge direkt an Fakten-Stammtisch senden.',
    noscript: `
<article>
<nav aria-label="Breadcrumb"><a href="${SITE_URL}/">Themen</a> › Feedback</nav>
<h1>Feedback</h1>
<p>Korrekturen, Themenvorschläge und Quellenhinweise sind willkommen. Bitte das <a href="${SITE_URL}/feedback/">Feedback-Formular der App</a> verwenden — es funktioniert nur mit aktiviertem JavaScript. Alternativ per E-Mail an feedback@fakten-stammtisch.de oder als Issue im <a href="https://github.com/mdeutschel/facts" rel="noopener">GitHub-Repository</a>.</p>
</article>`.trim(),
  },
  {
    path: '/suche',
    title: 'Suche',
    description:
      'Themen, Fakten und Argumente auf Fakten-Stammtisch durchsuchen — Volltextsuche über alle Topics.',
    noscript: `
<article>
<nav aria-label="Breadcrumb"><a href="${SITE_URL}/">Themen</a> › Suche</nav>
<h1>Suche</h1>
<p>Die Volltextsuche durchsucht alle Topics, Argumente und Quellen. Sie funktioniert nur mit aktiviertem JavaScript. Für Crawler und Lesezugriff empfiehlt sich der Einstieg über die <a href="${SITE_URL}/">Themenübersicht</a> oder die kompakte Plaintext-Variante <a href="${SITE_URL}/llms-full.txt">llms-full.txt</a> mit allen Inhalten.</p>
</article>`.trim(),
  },
]

function buildNotFoundNoscript(topics) {
  const lines = []
  lines.push('<article>')
  lines.push(`<nav aria-label="Breadcrumb"><a href="${SITE_URL}/">Themen</a> › Nicht gefunden</nav>`)
  lines.push('<h1>Seite nicht gefunden</h1>')
  lines.push(
    '<p>Diese Seite existiert nicht (oder nicht mehr). Vielleicht hilft eines der folgenden Themen weiter:</p>',
  )
  lines.push('<ul>')
  for (const topic of topics) {
    const url = `${SITE_URL}/thema/${topic.id}/`
    lines.push(
      `<li><a href="${attrEscape(url)}">${htmlEscape(topic.title)}</a> — ${htmlEscape(topic.subtitle)}</li>`,
    )
  }
  lines.push('</ul>')
  lines.push(`<p><a href="${SITE_URL}/">Zur Themenübersicht</a> · <a href="${SITE_URL}/suche/">Zur Suche</a> · <a href="${SITE_URL}/feedback/">Fehler melden</a></p>`)
  lines.push('</article>')
  return lines.join('\n')
}

async function generateNotFoundPage(template, topics) {
  const html = buildRouteHtml(template, {
    title: 'Seite nicht gefunden',
    description:
      'Diese Seite existiert nicht (oder nicht mehr). Hier geht es zurück zur Themenübersicht oder zur Suche.',
    canonical: `${SITE_URL}/`,
    noscript: buildNotFoundNoscript(topics),
    noindex: true,
  })
  // Apache serves this via `ErrorDocument 404 /404.html`, so it must sit flat
  // in dist/ — not under dist/404/index.html.
  await writeFile(path.join(DIST_DIR, '404.html'), html, 'utf8')
}

async function generateStaticRoutes(template) {
  for (const route of STATIC_ROUTES) {
    // Canonical includes a trailing slash so it matches the URL Apache serves
    // directly (DirectorySlash redirects /ueber → /ueber/).
    const canonical = `${SITE_URL}${route.path}/`
    const html = buildRouteHtml(template, {
      title: route.title,
      description: route.description,
      canonical,
      jsonLd: route.jsonLd,
      noscript: route.noscript,
    })
    const routePath = route.path.replace(/^\//, '')
    await writeRouteHtml(routePath, html)
  }
  return STATIC_ROUTES.length
}

function buildHomeJsonLd(topics) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/#collectionpage`,
        url: `${SITE_URL}/`,
        name: 'Fakten-Stammtisch — Themenübersicht',
        description:
          'Faktenbasierte Argumente und Quellen zu politischen und gesellschaftlichen Themen in Deutschland — Bürgergeld, Energiewende, Migration, Heizungswechsel, Gendern und mehr.',
        inLanguage: 'de',
        author: { '@id': PERSON_ID },
        publisher: { '@id': PERSON_ID },
        hasPart: topics.map((topic) => ({
          '@type': 'WebPage',
          name: topic.title,
          url: `${SITE_URL}/thema/${topic.id}/`,
          description: topic.subtitle,
        })),
      },
    ],
  }
}

function injectHomeJsonLd(html, payload) {
  // Add the CollectionPage JSON-LD without removing the existing WebSite block.
  const tag = jsonLdScript(payload)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function buildAndWriteHomeJsonLd(template, topics) {
  // The home noscript is already populated by generate-seo.mjs via the
  // <!-- FALLBACK_PLACEHOLDER --> mechanism. Here we only enrich the JSON-LD
  // by appending a CollectionPage graph alongside the existing WebSite entry.
  const payload = buildHomeJsonLd(topics)
  return injectHomeJsonLd(template, payload)
}

async function main() {
  const indexHtmlPath = path.join(DIST_DIR, 'index.html')
  const template = await readFile(indexHtmlPath, 'utf8')

  const topicsRaw = await readFile(path.join(DATA_DIR, 'topics.json'), 'utf8')
  const topicIndex = JSON.parse(topicsRaw)
  const topics = topicIndex.topics
  const topicsById = new Map(topics.map((topicMeta) => [topicMeta.id, topicMeta]))

  // Enrich the home page with a CollectionPage JSON-LD pointing at all topics.
  const enrichedHome = buildAndWriteHomeJsonLd(template, topics)
  await writeFile(indexHtmlPath, enrichedHome, 'utf8')

  let topicCount = 0
  let argumentCount = 0

  for (const topicMeta of topics) {
    const topicRaw = await readFile(path.join(DATA_DIR, `${topicMeta.id}.json`), 'utf8')
    const topic = JSON.parse(topicRaw)

    const topicTitle = topic.seoTitle ?? topic.title
    const topicDescription = topic.seoDescription ?? topic.subtitle
    const topicCanonical = absoluteUrl(`/thema/${topic.id}/`)

    const topicHtml = buildRouteHtml(template, {
      title: topicTitle,
      description: topicDescription,
      canonical: topicCanonical,
      jsonLd: buildTopicJsonLd(topic, topicsById),
      noscript: buildTopicNoscript(topic, topicsById),
    })
    await writeRouteHtml(`thema/${topic.id}`, topicHtml)
    topicCount += 1

    // Per-argument plaintext lands directly in dist/ (build artifact, not source).
    const distLlmsDir = path.join(DIST_DIR, 'llms', topic.id)
    await mkdir(distLlmsDir, { recursive: true })

    for (const argument of topic.arguments) {
      const argTitle = truncate(argument.claim, TITLE_MAX)
      const argDescription = truncate(argument.response.replace(/\s+/g, ' ').trim(), DESCRIPTION_MAX)
      const argCanonical = absoluteUrl(`/thema/${topic.id}/${argument.id}/`)

      const argHtml = buildRouteHtml(template, {
        title: argTitle,
        description: argDescription,
        canonical: argCanonical,
        jsonLd: buildArgumentJsonLd(topic, argument),
        noscript: buildArgumentNoscript(topic, argument, topicsById),
      })
      await writeRouteHtml(`thema/${topic.id}/${argument.id}`, argHtml)
      argumentCount += 1

      const txt = buildArgumentTxt(topic, argument)
      await writeFile(path.join(distLlmsDir, `${argument.id}.txt`), txt, 'utf8')
    }
  }

  const staticCount = await generateStaticRoutes(template)
  await generateNotFoundPage(template, topics)

  console.log(
    `[generate-route-html] Wrote ${topicCount} topic + ${argumentCount} argument + ${staticCount} static HTML files + 1 404 page (and matching llms/*.txt).`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
