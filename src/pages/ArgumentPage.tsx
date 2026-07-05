import { useMemo } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Chip from '@mui/material/Chip'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ForumIcon from '@mui/icons-material/Forum'
import FactSection from '../components/topic/FactSection'
import ShareButton from '../components/layout/ShareButton'
import RelatedTopics from '../components/topic/RelatedTopics'
import PageMeta from '../components/seo/PageMeta'
import { PERSON_ID, ORG_ID } from '../components/seo/person'
import { buildFaqPage } from '../components/seo/jsonLd'
import {
  VERDICT_META,
  VERDICT_RATING_BEST,
  VERDICT_RATING_WORST,
} from '../components/seo/verdict'
import { useTopic } from '../hooks/useTopics'
import PageSkeleton from '../components/layout/PageSkeleton'
import { formatGermanDate } from '../theme'

const DESCRIPTION_MAX = 155

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  const sliced = text.slice(0, max - 1)
  const lastSpace = sliced.lastIndexOf(' ')
  return (lastSpace > max * 0.6 ? sliced.slice(0, lastSpace) : sliced) + '…'
}

export default function ArgumentPage() {
  const { topicId, argumentId } = useParams<{ topicId: string; argumentId: string }>()
  const { topic, loading, error } = useTopic(topicId)

  const argument = useMemo(
    () => topic?.arguments.find((a) => a.id === argumentId),
    [topic, argumentId],
  )

  const relatedSections = useMemo(() => {
    if (!topic || !argument?.relatedSections) return []
    return argument.relatedSections
      .map((sid) => topic.sections.find((s) => s.id === sid))
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
  }, [topic, argument])

  const otherArguments = useMemo(() => {
    if (!topic || !argument) return []
    return topic.arguments.filter((a) => a.id !== argument.id)
  }, [topic, argument])

  const citedSources = useMemo(() => {
    if (!topic) return []
    const refs = new Set<string>()
    for (const section of relatedSections) {
      for (const block of section.content) {
        if ('sourceRefs' in block && block.sourceRefs) {
          for (const ref of block.sourceRefs) refs.add(ref)
        }
      }
    }
    return topic.sources
      .map((src, idx) => ({ src, num: idx + 1 }))
      .filter(({ src }) => refs.has(src.id))
  }, [topic, relatedSections])

  if (loading) {
    return <PageSkeleton blocks={5} />
  }

  if (error || !topic) {
    return <Alert severity="error">{error ?? 'Thema nicht gefunden'}</Alert>
  }

  if (!argument) {
    return <Alert severity="error">Argument nicht gefunden</Alert>
  }

  const argumentPath = `/thema/${topic.id}/${argument.id}/`
  const argumentUrl = `https://fakten-stammtisch.de${argumentPath}`
  const topicUrl = `https://fakten-stammtisch.de/thema/${topic.id}/`
  const seoTitle = truncate(argument.claim, 65)
  const seoDescription = truncate(argument.response.replace(/\s+/g, ' ').trim(), DESCRIPTION_MAX)
  const verdictMeta = argument.verdict ? VERDICT_META[argument.verdict] : null

  // Mirror buildArgumentJsonLd() in scripts/generate-route-html.mjs — keep both in sync.
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Article',
      '@id': `${argumentUrl}#article`,
      url: argumentUrl,
      headline: seoTitle,
      description: seoDescription,
      articleBody: argument.response.replace(/\s+/g, ' ').trim(),
      image: `https://fakten-stammtisch.de/og-image.png`,
      inLanguage: 'de',
      datePublished: topic.lastUpdated,
      dateModified: topic.lastUpdated,
      author: { '@id': PERSON_ID },
      publisher: { '@id': ORG_ID },
      mainEntityOfPage: argumentUrl,
      isPartOf: {
        '@type': 'Article',
        '@id': `${topicUrl}#article`,
        name: topic.title,
        url: topicUrl,
      },
    },
    buildFaqPage(argumentUrl, [argument]),
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

  graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Themen', item: 'https://fakten-stammtisch.de/' },
      { '@type': 'ListItem', position: 2, name: topic.title, item: topicUrl },
      { '@type': 'ListItem', position: 3, name: truncate(argument.claim, 65), item: argumentUrl },
    ],
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': graph,
  }

  return (
    <Box>
      <PageMeta
        title={seoTitle}
        description={seoDescription}
        path={argumentPath}
        jsonLd={jsonLd}
      />

      <Breadcrumbs sx={{ mb: 2, fontSize: '0.8rem' }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Themen
        </Link>
        <Link component={RouterLink} to={`/thema/${topic.id}/`} underline="hover" color="inherit">
          {topic.title}
        </Link>
        <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.8rem' }}>
          Argument
        </Typography>
      </Breadcrumbs>

      <Stack spacing={2.5}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Chip
              icon={<ForumIcon sx={{ fontSize: 16 }} />}
              label={`Aussage zum Thema ${topic.title}`}
              size="small"
              sx={{ mb: 1.5, fontSize: '0.7rem' }}
            />
            <Typography variant="h5" component="h1" sx={{ lineHeight: 1.3, mb: 0.5 }}>
              „{argument.claim}"
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
              {verdictMeta && (
                <Chip
                  label={`Bewertung: ${verdictMeta.label}`}
                  size="small"
                  color={verdictMeta.color}
                  sx={{ fontSize: '0.7rem', fontWeight: 600 }}
                />
              )}
              <Chip
                label={`Stand: ${formatGermanDate(topic.lastUpdated)}`}
                size="small"
                sx={{ fontSize: '0.7rem' }}
              />
            </Box>
          </Box>
          <Box sx={{ flexShrink: 0, mt: 0.5 }}>
            <ShareButton title={seoTitle} text={argument.claim} url={argumentPath} />
          </Box>
        </Box>

        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="body1"
            sx={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}
          >
            {argument.response}
          </Typography>

          {argument.rhetoricalPattern && (
            <Box
              sx={{
                mt: 2.5,
                pt: 2,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 600, letterSpacing: 0.6, display: 'block', mb: 0.75 }}
              >
                Was hinter der Parole steckt
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                {argument.rhetoricalPattern}
              </Typography>
            </Box>
          )}

          {argument.counterQuestions && argument.counterQuestions.length > 0 && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderLeft: 3,
                borderColor: 'secondary.main',
                bgcolor: 'action.hover',
                borderRadius: 1,
              }}
            >
              <Typography
                variant="overline"
                color="secondary.main"
                sx={{ fontWeight: 600, letterSpacing: 0.6, display: 'block', mb: 1 }}
              >
                Am Tisch nützlich · Gegenfragen
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, m: 0, '& li': { mb: 0.75, lineHeight: 1.6 } }}>
                {argument.counterQuestions.map((q) => (
                  <Typography component="li" variant="body2" key={q}>
                    „{q}"
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {argument.keywords.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2.5, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              {argument.keywords.map((kw) => (
                <Chip key={kw} label={kw} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
              ))}
            </Box>
          )}
        </Paper>

        {relatedSections.length > 0 && (
          <Box>
            <Typography variant="subtitle2" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
              Fakten dazu
            </Typography>
            <Box>
              {relatedSections.map((s) => (
                <FactSection
                  key={s.id}
                  section={s}
                  defaultExpanded
                  sources={topic.sources}
                  titleComponent="h3"
                />
              ))}
            </Box>
            {citedSources.length > 0 && (
              <Box id="quellen" sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Quellen
                </Typography>
                <Box component="ol" sx={{ pl: 2.5, mt: 0.5, mb: 0 }}>
                  {citedSources.map(({ src, num }) => (
                    <Typography
                      component="li"
                      variant="caption"
                      color="text.secondary"
                      key={src.id}
                      id={`quelle-${src.id}`}
                      sx={{ fontSize: '0.65rem', listStyle: 'none' }}
                    >
                      {src.url ? (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', display: 'inline-block', padding: '4px 0' }}
                        >
                          [{num}] {src.label}
                        </a>
                      ) : (
                        <>
                          [{num}] {src.label}
                        </>
                      )}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}

        {otherArguments.length > 0 && (
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="subtitle2" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
              Weitere Aussagen zum Thema {topic.title}
            </Typography>
            <Stack spacing={0.5}>
              {otherArguments.map((a) => (
                <Link
                  key={a.id}
                  component={RouterLink}
                  to={`/thema/${topic.id}/${a.id}/`}
                  underline="hover"
                  sx={{ fontSize: '0.85rem', color: 'text.primary' }}
                >
                  „{a.claim}"
                </Link>
              ))}
            </Stack>
          </Paper>
        )}

        {topic.relatedTopicIds && topic.relatedTopicIds.length > 0 && (
          <RelatedTopics ids={topic.relatedTopicIds} currentTopicId={topic.id} />
        )}

        <Box>
          <Button
            component={RouterLink}
            to={`/thema/${topic.id}/`}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            size="small"
          >
            Zurück zur Übersicht: {topic.title}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
