import { useCallback, useEffect, useMemo } from 'react'
import { useParams, useSearchParams, useLocation } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Alert from '@mui/material/Alert'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import ForumIcon from '@mui/icons-material/Forum'
import FactSection from '../components/topic/FactSection'
import ArgumentCard from '../components/topic/ArgumentCard'
import TopicTrustBox from '../components/topic/TopicTrustBox'
import RelatedTopics from '../components/topic/RelatedTopics'
import ShareButton from '../components/layout/ShareButton'
import PageMeta from '../components/seo/PageMeta'
import { PERSON_ID, ORG_ID } from '../components/seo/person'
import { buildFaqPage } from '../components/seo/jsonLd'
import { useTopic } from '../hooks/useTopics'
import PageSkeleton from '../components/layout/PageSkeleton'

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const { topic, loading, error } = useTopic(topicId)
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const tab = Number(searchParams.get('tab') ?? 0)
  const hash = location.hash.slice(1)

  const expandedSection = useMemo(() => {
    if (hash.startsWith('section-')) return hash.replace('section-', '')
    return null
  }, [hash])

  const setTab = useCallback((value: number) => {
    setSearchParams({ tab: String(value) }, { replace: true })
  }, [setSearchParams])

  useEffect(() => {
    if (!hash) return
    // MUI Accordion expand animation is ~300ms — wait for it to finish before scrolling
    const MUI_ACCORDION_DURATION = 300
    setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, MUI_ACCORDION_DURATION)
  }, [hash, location.key])

  if (loading) {
    return <PageSkeleton blocks={5} />
  }

  if (error || !topic) {
    return <Alert severity="error">{error ?? 'Thema nicht gefunden'}</Alert>
  }

  const topicPath = `/thema/${topic.id}/`
  const topicUrl = `https://fakten-stammtisch.de${topicPath}`
  const seoTitle = topic.seoTitle ?? topic.title
  const seoDescription = topic.seoDescription ?? topic.subtitle
  // Mirror buildTopicJsonLd() in scripts/generate-route-html.mjs — keep both in sync.
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Article',
      '@id': `${topicUrl}#article`,
      url: topicUrl,
      headline: seoTitle,
      description: seoDescription,
      image: `https://fakten-stammtisch.de/og-image.png`,
      inLanguage: 'de',
      datePublished: topic.lastUpdated,
      dateModified: topic.lastUpdated,
      author: { '@id': PERSON_ID },
      publisher: { '@id': ORG_ID },
      mainEntityOfPage: topicUrl,
    },
  ]
  if (topic.arguments.length > 0) {
    graph.push(buildFaqPage(topicUrl, topic.arguments))
  }
  graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Themen', item: 'https://fakten-stammtisch.de/' },
      { '@type': 'ListItem', position: 2, name: topic.title, item: topicUrl },
    ],
  })
  const jsonLd = { '@context': 'https://schema.org', '@graph': graph }

  return (
    <Box>
      <PageMeta
        title={seoTitle}
        description={seoDescription}
        path={topicPath}
        jsonLd={jsonLd}
      />
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>
            {topic.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {topic.subtitle}
          </Typography>
        </Box>
        <Box sx={{ flexShrink: 0, mt: 0.5 }}>
          <ShareButton title={seoTitle} text={seoDescription} url={topicPath} />
        </Box>
      </Box>

      <TopicTrustBox topic={topic} />

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
              sources={topic.sources}
              topicId={topic.id}
            />
          ))}
          {topic.relatedTopicIds && topic.relatedTopicIds.length > 0 && (
            <RelatedTopics ids={topic.relatedTopicIds} currentTopicId={topic.id} />
          )}
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
          {topic.relatedTopicIds && topic.relatedTopicIds.length > 0 && (
            <RelatedTopics ids={topic.relatedTopicIds} currentTopicId={topic.id} />
          )}
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
                        style={{ color: 'inherit', display: 'inline-block', padding: '4px 0' }}
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
