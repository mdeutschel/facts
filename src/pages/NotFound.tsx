import { Link as RouterLink, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import TopicCard from '../components/home/TopicCard'
import PageMeta from '../components/seo/PageMeta'
import { useTopicIndex } from '../hooks/useTopics'

export default function NotFound() {
  const { pathname } = useLocation()
  const { topics, loading } = useTopicIndex()

  return (
    <Box>
      <PageMeta
        title="Seite nicht gefunden"
        description="Diese Seite existiert nicht (oder nicht mehr). Hier geht es zurück zur Themenübersicht oder zur Suche."
        path={pathname}
        noindex
      />
      <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>
        Seite nicht gefunden
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Die Adresse <code>{pathname}</code> führt ins Leere — vielleicht ein Tippfehler, ein veralteter Link oder ein Thema, das es nie gab. Eines der folgenden Themen könnte aber passen.
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        <Button component={RouterLink} to="/" variant="contained" color="primary" size="small">
          Zur Themenübersicht
        </Button>
        <Button component={RouterLink} to="/suche/" variant="outlined" size="small">
          Zur Suche
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
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
      )}
      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Wenn ein interner Link auf diese Seite geführt hat: bitte über{' '}
          <Link component={RouterLink} to="/feedback/" underline="hover">
            Feedback
          </Link>{' '}
          melden.
        </Typography>
      </Box>
    </Box>
  )
}
