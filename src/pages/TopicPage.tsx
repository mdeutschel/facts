import { useCallback, useEffect, useMemo } from 'react'
import { useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import ForumIcon from '@mui/icons-material/Forum'
import FactSection from '../components/topic/FactSection'
import ArgumentCard from '../components/topic/ArgumentCard'
import PageMeta from '../components/seo/PageMeta'
import { useTopic } from '../hooks/useTopics'
import { formatGermanDate } from '../theme'

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const { topic, loading, error } = useTopic(topicId)
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const tab = Number(searchParams.get('tab') ?? 0)
  const hash = location.hash.slice(1)

  const expandedSection = useMemo(() => {
    if (hash.startsWith('section-')) return hash.replace('section-', '')
    return null
  }, [hash])

  const setTab = useCallback((value: number) => {
    setSearchParams({ tab: String(value) }, { replace: true })
  }, [setSearchParams])

  const handleNavigateToSection = useCallback((sectionId: string) => {
    navigate(`?tab=1#section-${sectionId}`)
  }, [navigate])

  useEffect(() => {
    if (!hash) return
    // MUI Accordion expand animation is ~300ms — wait for it to finish before scrolling
    const MUI_ACCORDION_DURATION = 300
    setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, MUI_ACCORDION_DURATION)
  }, [hash, location.key])

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

  const topicPath = `/thema/${topic.id}`
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: topic.arguments.map((argument) => ({
      '@type': 'Question',
      name: argument.claim,
      acceptedAnswer: {
        '@type': 'Answer',
        text: argument.response,
      },
    })),
  }

  return (
    <Box>
      <PageMeta
        title={topic.title}
        description={topic.subtitle}
        path={topicPath}
        jsonLd={faqJsonLd}
      />
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>
          {topic.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {topic.subtitle}
        </Typography>
        <Chip
          label={`Stand: ${formatGermanDate(topic.lastUpdated)}`}
          size="small"
          sx={{ mt: 1, fontSize: '0.7rem' }}
        />
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v: number) => setTab(v)}
        variant="fullWidth"
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab
          icon={<ForumIcon />}
          iconPosition="start"
          label={`Argumente (${topic.arguments.length})`}
        />
        <Tab icon={<FactCheckIcon />} iconPosition="start" label="Fakten" />
      </Tabs>

      {tab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Aussagen und faktenbasierte Antworten:
          </Typography>
          {topic.arguments.map((arg) => (
            <ArgumentCard
              key={arg.id}
              argument={arg}
              sections={topic.sections}
              onNavigateToSection={handleNavigateToSection}
            />
          ))}
        </Box>
      )}

      {tab === 1 && (
        <Box>
          {topic.sections.map((section) => (
            <FactSection
              key={section.id === expandedSection ? `${section.id}-target` : section.id}
              section={section}
              defaultExpanded={section.id === expandedSection}
              sources={topic.sources}
            />
          ))}
          {topic.sources.length > 0 && (
            <Box id="quellen" sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Quellen
              </Typography>
              <Box component="ol" sx={{ pl: 2.5, mt: 0.5, mb: 0 }}>
                {topic.sources.map((src, i) => (
                  <Typography
                    component="li"
                    variant="caption"
                    color="text.secondary"
                    key={src.id}
                    id={`quelle-${src.id}`}
                    sx={{ fontSize: '0.65rem' }}
                  >
                    {src.url ? (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'inherit' }}
                      >
                        [{i + 1}] {src.label}
                      </a>
                    ) : (
                      <>
                        [{i + 1}] {src.label}
                      </>
                    )}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
