import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import TopicCard from '../components/home/TopicCard'
import { useTopicIndex } from '../hooks/useTopics'

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
      <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>
        Themen
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Kennst du das? Am Stammtisch, beim Grillen oder im Familiengruppenchat
        fällt ein steiler Spruch&nbsp;— und du weißt, dass es so nicht stimmt,
        aber dir fehlen im Moment die Zahlen. Genau dafür ist diese Seite:
        kompakte, quellenbasierte Fakten und fertige Argumente zu den Themen,
        die in Deutschland immer wieder hochkochen. Kein Belehren, kein
        Besserwissen&nbsp;— einfach vorbereitet sein, wenn&apos;s drauf
        ankommt.
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
    </Box>
  )
}
