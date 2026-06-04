import type { Argument } from '../../types'

// FAQPage = publisher-authored question(s) with a single definitive answer each.
// This is the schema-correct type for our content; QAPage requires user-submittable
// answers. FAQ rich results were retired in 2026, but Google and AI systems still
// parse the markup to understand the Q&A structure.
//
// Mirrors buildFaqPage() in scripts/generate-route-html.mjs — keep both in sync.
export function buildFaqPage(pageUrl: string, args: Argument[]): Record<string, unknown> {
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    url: pageUrl,
    inLanguage: 'de',
    mainEntity: args.map((argument) => ({
      '@type': 'Question',
      name: argument.claim,
      acceptedAnswer: {
        '@type': 'Answer',
        text: argument.response.replace(/\s+/g, ' ').trim(),
      },
    })),
  }
}
