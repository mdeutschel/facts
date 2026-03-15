import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
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
import { useTopic } from '../hooks/useTopics'

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const { topic, loading, error } = useTopic(topicId)
  const [tab, setTab] = useState(0)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const handleNavigateToSection = useCallback((sectionId: string) => {
    setTab(1)
    setExpandedSection(sectionId)
    setTimeout(() => {
      document.getElementById(`section-${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }, [])

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

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>
          {topic.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {topic.subtitle}
        </Typography>
        <Chip
          label={`Stand: ${topic.lastUpdated}`}
          size="small"
          sx={{ mt: 1, fontSize: '0.7rem' }}
        />
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
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
              key={section.id}
              section={section}
              defaultExpanded={section.id === expandedSection}
            />
          ))}
          {topic.sources.length > 0 && (
            <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Quellen
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 0.5, mb: 0 }}>
                {topic.sources.map((src, i) => (
                  <Typography component="li" variant="caption" color="text.secondary" key={i}>
                    {src.url ? (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'inherit' }}
                      >
                        {src.label}
                      </a>
                    ) : (
                      src.label
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
