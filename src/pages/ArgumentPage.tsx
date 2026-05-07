import { useMemo } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Chip from '@mui/material/Chip'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ForumIcon from '@mui/icons-material/Forum'
import FactSection from '../components/topic/FactSection'
import PageMeta from '../components/seo/PageMeta'
import { PERSON_ID } from '../components/seo/person'
import {
  VERDICT_META,
  VERDICT_RATING_BEST,
  VERDICT_RATING_WORST,
} from '../components/seo/verdict'
import { useTopic } from '../hooks/useTopics'
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
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !topic) {
    return <Alert severity="error">{error ?? 'Thema nicht gefunden'}</Alert>
  }

  if (!argument) {
    return <Alert severity="error">Argument nicht gefunden</Alert>
  }

  const argumentPath = `/thema/${topic.id}/${argument.id}/`
  const argumentUrl = `https://fakten-stammtisch.de${argumentPath}`
  const seoTitle = truncate(argument.claim, 65)
  const seoDescription = truncate(argument.response.replace(/\s+/g, ' ').trim(), DESCRIPTION_MAX)
  const verdictMeta = argument.verdict ? VERDICT_META[argument.verdict] : null

  const graph: Record<string, unknown>[] = [
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
        '@type': 'WebPage',
        '@id': `https://fakten-stammtisch.de/thema/${topic.id}/#faqpage`,
        name: topic.title,
        url: `https://fakten-stammtisch.de/thema/${topic.id}/`,
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
        <Box>
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

        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="body1"
            sx={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}
          >
            {argument.response}
          </Typography>

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
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Fakten dazu
            </Typography>
            <Box>
              {relatedSections.map((s) => (
                <FactSection
                  key={s.id}
                  section={s}
                  defaultExpanded
                  sources={topic.sources}
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
                          style={{ color: 'inherit' }}
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
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
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
