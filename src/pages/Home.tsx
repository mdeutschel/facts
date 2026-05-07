import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { Link as RouterLink } from 'react-router-dom'
import TopicCard from '../components/home/TopicCard'
import PageMeta from '../components/seo/PageMeta'
import { useTopicIndex } from '../hooks/useTopics'
import {
  HOME_HEADING,
  HOME_INTRO,
  HOME_USAGE_TITLE,
  HOME_USAGE_P1,
  HOME_USAGE_P2,
  HOME_USAGE_P3,
  HOME_ABOUT_TITLE,
  HOME_ABOUT_LEAD,
  HOME_METHOD_TITLE,
  HOME_METHOD_LEAD,
  HOME_TRANSPARENCY_TITLE,
  HOME_TRANSPARENCY_TEXT,
} from '../content/homeTexts'

export default function Home() {
  const { topics, loading, error } = useTopicIndex()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">Fehler beim Laden: {error}</Alert>
  }

  return (
    <Box>
      <PageMeta
        title="Faktenbasierte Argumente zu deutschen Streitthemen"
        description="Kompakte Antworten, geprüfte Quellen und schlagfertige Argumente zu Bürgergeld, Energiewende, Migration, Heizungswechsel, Gendern und weiteren Streitthemen in Deutschland. Mobil-first, werbefrei, transparent."
        path="/"
      />
      <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>
        {HOME_HEADING}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {HOME_INTRO}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
          {HOME_USAGE_TITLE}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {HOME_USAGE_P1}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {HOME_USAGE_P2}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {HOME_USAGE_P3}
        </Typography>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
          {HOME_ABOUT_TITLE}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {HOME_ABOUT_LEAD}{' '}
          <Link component={RouterLink} to="/ueber/" underline="hover">
            Über-Seite
          </Link>{' '}
          beschrieben.
        </Typography>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
          {HOME_METHOD_TITLE}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {HOME_METHOD_LEAD}{' '}
          <Link component={RouterLink} to="/methodik/" underline="hover">
            Methodik-Seite
          </Link>
          .
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 4,
          p: 2,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'action.hover',
        }}
      >
        <Typography variant="subtitle2" component="h2" sx={{ mb: 1, fontWeight: 600 }}>
          {HOME_TRANSPARENCY_TITLE}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {HOME_TRANSPARENCY_TEXT}
        </Typography>
      </Box>
    </Box>
  )
}
