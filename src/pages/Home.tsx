import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import TopicCard from '../components/home/TopicCard'
import PageMeta from '../components/seo/PageMeta'
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
      <PageMeta
        title="Themenuebersicht"
        description="Faktenbasierte Argumente und Quellen zu aktuellen gesellschaftlichen Themen in Deutschland."
        path="/"
      />
      <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>
        Themen fuer den Stammtisch
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
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
          So nutzt du die Fakten am effektivsten
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Jede Themenseite folgt einem einfachen Prinzip: erst der typische
          Spruch, dann die kurze, quellenbasierte Antwort. Dadurch kannst du in
          Gespraechen schnell reagieren, ohne lange suchen zu muessen. Wenn du
          tiefer einsteigen willst, findest du darunter die Faktenstruktur mit
          Zahlen, Einordnungen und Quellen. So entscheidest du selbst, ob du
          nur eine kurze Replik brauchst oder ein Thema detailliert erklaeren
          moechtest.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Die Inhalte sind bewusst auf Deutschland ausgerichtet und in klarer
          Alltagssprache formuliert. Es geht nicht um parteipolitische
          Parolen, sondern um belastbare Informationen, die du in Diskussionen
          sauber verwenden kannst. Zu jedem Thema werden Quellen angegeben, damit
          die Aussagen nachvollziehbar bleiben und du bei Rueckfragen direkt
          belegen kannst, woher eine Zahl oder ein Befund stammt.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fuer die Praxis bedeutet das: Du musst dir nicht hunderte Seiten
          Studienmaterial merken. Nutze die Suchfunktion, oeffne ein Thema,
          starte mit den kompakten Antworten und springe bei Bedarf in den
          Fakten-Tab. So bleibst du sachlich, kannst Behauptungen einordnen und
          auf wiederkehrende Stammtischfragen vorbereitet reagieren.
        </Typography>
      </Box>
    </Box>
  )
}
