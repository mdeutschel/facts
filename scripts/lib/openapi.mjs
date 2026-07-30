// Builders for the machine-readable API description of the read-only data
// endpoints under /data/, plus the RFC 9727 API catalog that points at them.
//
// The topic JSONs have always been a stable public interface; these artifacts
// only make that explicit. Everything here is generated so the topic-id enum
// and the block-type list cannot drift away from the actual data.

import { SITE_URL, absoluteUrl } from './content.mjs'

const OPENAPI_URL = absoluteUrl('/api/openapi.json')
const API_DOC_URL = absoluteUrl('/api/README.md')
const AUTH_URL = absoluteUrl('/auth.md')

// RFC 9727 / RFC 9264. One anchor — there is one API here.
// `status` is deliberately absent: there is no health endpoint, and a static
// file that always says "ok" could not report an outage.
export function buildApiCatalog() {
  return {
    linkset: [
      {
        anchor: absoluteUrl('/data/'),
        'service-desc': [
          {
            href: OPENAPI_URL,
            type: 'application/json',
            title: 'OpenAPI-Beschreibung der Fakten-Stammtisch-Datenschnittstelle',
          },
        ],
        'service-doc': [
          { href: API_DOC_URL, type: 'text/markdown', title: 'Entwicklerdokumentation (deutsch)' },
        ],
        describedby: [
          { href: AUTH_URL, type: 'text/markdown', title: 'Zugriff, faire Nutzung, Zitierhinweise' },
        ],
        author: [{ href: absoluteUrl('/ueber/'), title: 'Marcel Deutschel' }],
      },
    ],
  }
}

const STRING = { type: 'string' }
const NUMBER = { type: 'number' }
const BOOLEAN = { type: 'boolean' }

function object(properties, required) {
  return { type: 'object', properties, required }
}

function arrayOf(items) {
  return { type: 'array', items }
}

const LABEL_VALUE = object({ label: STRING, value: STRING }, ['label', 'value'])

const ITEM_SCHEMAS = {
  StatItem: object({ value: STRING, label: STRING, sublabel: STRING, color: STRING }, ['value', 'label']),
  ComparisonItem: object(
    { title: STRING, color: STRING, rows: arrayOf(LABEL_VALUE), total: LABEL_VALUE },
    ['title', 'rows'],
  ),
  RangeBarItem: object({ label: STRING, min: NUMBER, max: NUMBER, unit: STRING, color: STRING }, [
    'label',
    'min',
    'max',
  ]),
  BarChartItem: object({ label: STRING, value: NUMBER, highlight: BOOLEAN }, ['label', 'value']),
  LineChartItem: object({ label: STRING, value: NUMBER }, ['label', 'value']),
  TimelineStep: object({ label: STRING, value: STRING, sublabel: STRING, highlight: BOOLEAN }, [
    'label',
    'value',
  ]),
  ProgressSegment: object({ label: STRING, value: NUMBER, sublabel: STRING }, ['label', 'value']),
  MythFactItem: object({ myth: STRING, fact: STRING }, ['myth', 'fact']),
  TargetProgressItem: object(
    { label: STRING, current: NUMBER, target: NUMBER, unit: STRING, color: STRING },
    ['label', 'current', 'target'],
  ),
}

function ref(name) {
  return { $ref: `#/components/schemas/${name}` }
}

// Every block carries a literal `type` plus the optional sourceRefs pointing
// into the topic's `sources[]`.
function block(type, properties, required) {
  return object(
    {
      type: { const: type },
      caption: STRING,
      sourceRefs: arrayOf(STRING),
      ...properties,
    },
    ['type', ...required],
  )
}

// Mirrors the ContentBlock union in src/types/index.ts. The build asserts that
// no topic uses a type missing from this table (see assertKnownBlockTypes).
const CONTENT_BLOCK_SCHEMAS = {
  fact: block('fact', { text: STRING, description: STRING, highlight: BOOLEAN }, ['text']),
  text: block('text', { text: STRING }, ['text']),
  table: block('table', { headers: arrayOf(STRING), rows: arrayOf(arrayOf(STRING)) }, ['headers', 'rows']),
  stat_grid: block('stat_grid', { items: arrayOf(ref('StatItem')) }, ['items']),
  comparison: block('comparison', { items: arrayOf(ref('ComparisonItem')), savings: STRING }, ['items']),
  range_bar: block('range_bar', { items: arrayOf(ref('RangeBarItem')), maxScale: NUMBER, unit: STRING }, [
    'items',
  ]),
  bar_chart: block('bar_chart', { items: arrayOf(ref('BarChartItem')), unit: STRING }, ['items']),
  line_chart: block('line_chart', { items: arrayOf(ref('LineChartItem')), unit: STRING, color: STRING }, [
    'items',
  ]),
  timeline: block('timeline', { steps: arrayOf(ref('TimelineStep')) }, ['steps']),
  progress_stack: block('progress_stack', { segments: arrayOf(ref('ProgressSegment')), total: STRING }, [
    'segments',
  ]),
  myth_fact: block('myth_fact', { items: arrayOf(ref('MythFactItem')) }, ['items']),
  pictograph: block(
    'pictograph',
    { filled: NUMBER, total: NUMBER, label: STRING, icon: STRING, color: STRING },
    ['filled', 'total', 'label'],
  ),
  target_progress: block(
    'target_progress',
    { items: arrayOf(ref('TargetProgressItem')), maxScale: NUMBER, unit: STRING },
    ['items'],
  ),
}

const VERDICT_VALUES = [
  'false',
  'mostly-false',
  'misleading',
  'outdated',
  'lacks-context',
  'partially-true',
  'mostly-true',
  'true',
]

// A new ContentBlock type must be described here, not silently omitted — an
// incomplete schema is worse than none, because agents would treat it as
// normative. Fail the build instead.
function assertKnownBlockTypes(topicDataById) {
  const declared = new Set(Object.keys(CONTENT_BLOCK_SCHEMAS))
  const missing = new Set()
  for (const topicData of topicDataById.values()) {
    for (const section of topicData.sections) {
      for (const contentBlock of section.content) {
        if (!declared.has(contentBlock.type)) missing.add(contentBlock.type)
      }
    }
  }
  if (missing.size > 0) {
    throw new Error(
      `[openapi] ContentBlock type(s) ${[...missing].join(', ')} are used in public/data but missing ` +
        'from CONTENT_BLOCK_SCHEMAS in scripts/lib/openapi.mjs — add them there.',
    )
  }
}

const MARKDOWN_NEGOTIATION_DESCRIPTION =
  'HTML ist die Standardrepraesentation. Mit `Accept: text/markdown` liefert dieselbe URL eine ' +
  'Markdown-Variante; alternativ kann `index.md` direkt an die URL angehaengt werden.'

function negotiatedPage(summary, parameters) {
  return {
    get: {
      summary,
      description: MARKDOWN_NEGOTIATION_DESCRIPTION,
      parameters: [
        ...parameters,
        {
          name: 'Accept',
          in: 'header',
          required: false,
          description: 'Gewuenschte Repraesentation.',
          schema: { type: 'string', enum: ['text/html', 'text/markdown'] },
        },
      ],
      responses: {
        200: {
          description: 'Seite als HTML oder Markdown, je nach Accept-Header.',
          content: {
            'text/html': { schema: STRING },
            'text/markdown': { schema: STRING },
          },
        },
      },
    },
  }
}

function textFile(summary, parameters = []) {
  return {
    get: {
      summary,
      parameters,
      responses: {
        200: { description: summary, content: { 'text/plain': { schema: STRING } } },
      },
    },
  }
}

function topicIdParam(topicIds) {
  return {
    name: 'topicId',
    in: 'path',
    required: true,
    description: 'ID eines Themas, siehe /data/topics.json.',
    schema: { type: 'string', enum: topicIds },
  }
}

export function buildOpenApiDocument(topics, topicDataById) {
  assertKnownBlockTypes(topicDataById)

  const topicIds = topics.map((topic) => topic.id)
  // Version = neuester inhaltlicher Stand, nicht der Build-Zeitpunkt: so bleibt
  // das Artefakt bei unveraenderten Daten byte-identisch.
  const version = topics.map((topic) => topic.lastUpdated).sort().at(-1) ?? '0000-00-00'

  return {
    openapi: '3.1.0',
    info: {
      title: 'Fakten-Stammtisch — Daten und Inhalte',
      version,
      summary: 'Oeffentliche, rein lesende Schnittstelle zu den Themen-Factsheets.',
      description: [
        'Alle Inhalte von fakten-stammtisch.de sind ohne Authentifizierung per HTTP GET abrufbar.',
        'Es gibt keine Schreiboperationen, keine API-Keys und keine Registrierung; Details unter /auth.md.',
        '',
        'Die Themen-JSONs sind eine statische Auslieferung derselben Daten, aus denen die Website',
        'gebaut wird. `lastUpdated` je Thema gibt den inhaltlichen Stand an.',
      ].join('\n'),
      contact: { name: 'Fakten-Stammtisch', email: 'feedback@fakten-stammtisch.de', url: `${SITE_URL}/feedback/` },
    },
    servers: [{ url: SITE_URL }],
    externalDocs: { description: 'Entwicklerdokumentation', url: API_DOC_URL },
    paths: {
      '/data/topics.json': {
        get: {
          summary: 'Index aller Themen.',
          responses: {
            200: {
              description: 'Themenindex.',
              content: { 'application/json': { schema: ref('TopicIndex') } },
            },
          },
        },
      },
      '/data/{topicId}.json': {
        get: {
          summary: 'Vollstaendiges Factsheet eines Themas.',
          parameters: [topicIdParam(topicIds)],
          responses: {
            200: { description: 'Themendaten.', content: { 'application/json': { schema: ref('Topic') } } },
            404: { description: 'Unbekannte Themen-ID.' },
          },
        },
      },
      '/llms.txt': textFile('Kurzuebersicht im llms.txt-Format.'),
      '/llms-full.txt': textFile('Alle Themen, Fakten und Argumente als Plaintext.'),
      '/llms/{topicId}.txt': textFile('Ein Thema als Plaintext.', [topicIdParam(topicIds)]),
      '/auth.md': {
        get: {
          summary: 'Zugriffs-, Nutzungs- und Zitierhinweise fuer Agenten.',
          responses: {
            200: { description: 'Markdown-Dokument.', content: { 'text/markdown': { schema: STRING } } },
          },
        },
      },
      '/.well-known/api-catalog': {
        get: {
          summary: 'API-Katalog nach RFC 9727.',
          responses: {
            200: {
              description: 'Linkset.',
              content: { 'application/linkset+json': { schema: { type: 'object' } } },
            },
          },
        },
      },
      '/': negotiatedPage('Themenuebersicht.', []),
      '/thema/{topicId}/': negotiatedPage('Themenseite.', [topicIdParam(topicIds)]),
      '/thema/{topicId}/{argumentId}/': negotiatedPage('Argument-Detailseite.', [
        topicIdParam(topicIds),
        {
          name: 'argumentId',
          in: 'path',
          required: true,
          description: 'ID eines Arguments innerhalb des Themas.',
          schema: STRING,
        },
      ]),
    },
    components: {
      schemas: {
        TopicIndex: object({ topics: arrayOf(ref('TopicMeta')) }, ['topics']),
        TopicMeta: object(
          {
            id: STRING,
            title: STRING,
            subtitle: STRING,
            icon: { type: 'string', description: 'Name eines MUI-Icons.' },
            lastUpdated: { type: 'string', format: 'date' },
            factCount: { type: 'integer' },
            argumentCount: { type: 'integer' },
          },
          ['id', 'title', 'subtitle', 'icon', 'lastUpdated', 'factCount', 'argumentCount'],
        ),
        Topic: object(
          {
            id: STRING,
            title: STRING,
            subtitle: STRING,
            seoTitle: STRING,
            seoDescription: STRING,
            icon: STRING,
            lastUpdated: { type: 'string', format: 'date' },
            keyStats: arrayOf(STRING),
            sourceNote: STRING,
            relatedTopicIds: arrayOf(STRING),
            sections: arrayOf(ref('Section')),
            arguments: arrayOf(ref('Argument')),
            sources: arrayOf(ref('Source')),
          },
          ['id', 'title', 'subtitle', 'icon', 'lastUpdated', 'sourceNote', 'sections', 'arguments', 'sources'],
        ),
        Section: object({ id: STRING, title: STRING, content: arrayOf(ref('ContentBlock')) }, [
          'id',
          'title',
          'content',
        ]),
        Argument: object(
          {
            id: STRING,
            claim: { type: 'string', description: 'Die geprüfte Aussage, wie sie im Gespraech faellt.' },
            response: STRING,
            keywords: arrayOf(STRING),
            relatedSections: arrayOf(STRING),
            verdict: {
              type: 'string',
              enum: VERDICT_VALUES,
              description: 'Bewertung der empirisch pruefbaren Aussage, nicht einer politischen Position.',
            },
            rhetoricalPattern: STRING,
            counterQuestions: arrayOf(STRING),
          },
          ['id', 'claim', 'response', 'keywords'],
        ),
        Source: object({ id: STRING, label: STRING, url: { type: 'string', format: 'uri' } }, ['id', 'label']),
        ContentBlock: {
          description: 'Diskriminierte Union; `type` bestimmt die uebrigen Felder.',
          oneOf: Object.values(CONTENT_BLOCK_SCHEMAS),
          discriminator: { propertyName: 'type' },
        },
        ...ITEM_SCHEMAS,
      },
    },
  }
}
