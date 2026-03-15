const SITE_NAME = 'Fakten-Stammtisch'
const BASE_URL = 'https://fakten-stammtisch.de'
const DEFAULT_IMAGE_URL = `${BASE_URL}/og-image.png`

interface PageMetaProps {
  title: string
  description: string
  path: string
  jsonLd?: Record<string, unknown>
}

export default function PageMeta({ title, description, path, jsonLd }: PageMetaProps) {
  const fullTitle = `${title} | ${SITE_NAME}`
  const canonicalUrl = `${BASE_URL}${path}`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="de_DE" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={DEFAULT_IMAGE_URL} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE_URL} />
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
    </>
  )
}
