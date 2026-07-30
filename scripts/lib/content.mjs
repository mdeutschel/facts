// Shared, dependency-free content primitives for the build scripts.
//
// This module exists so `generate-seo.mjs`, `generate-route-html.mjs` and
// `lib/markdown.mjs` can share one plaintext renderer without importing each
// other in a cycle (`generate-seo.mjs` uses top-level await, so a cycle there
// would deadlock the module graph).

export const SITE_URL = 'https://fakten-stammtisch.de'

export function absoluteUrl(routePath) {
  return `${SITE_URL}${routePath}`
}

export function htmlEscape(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

// Verdict labels for arguments. Kept next to the content renderers because both
// the HTML prerender and the Markdown/plaintext output need the same wording.
export const VERDICT_META = {
  'false': { label: 'Falsch', ratingValue: 1 },
  'mostly-false': { label: 'Überwiegend falsch', ratingValue: 2 },
  'misleading': { label: 'Irreführend', ratingValue: 2 },
  'outdated': { label: 'Überholt', ratingValue: 2 },
  'lacks-context': { label: 'Ohne Kontext irreführend', ratingValue: 2 },
  'partially-true': { label: 'Teilweise wahr', ratingValue: 3 },
  'mostly-true': { label: 'Überwiegend wahr', ratingValue: 4 },
  'true': { label: 'Wahr', ratingValue: 5 },
}

// Renders a ContentBlock as plain text. `lib/markdown.mjs` builds on this and
// only overrides the block types where Markdown syntax adds something.
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
