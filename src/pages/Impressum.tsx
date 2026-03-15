import { useCallback, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import PageMeta from '../components/seo/PageMeta'

export default function Impressum() {
  const email = useMemo(
    () => String.fromCharCode(102, 101, 101, 100, 98, 97, 99, 107, 64, 102, 97, 107, 116, 101, 110, 45, 115, 116, 97, 109, 109, 116, 105, 115, 99, 104, 46, 100, 101),
    []
  )
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [email])

  return (
    <Stack spacing={2.5}>
      <PageMeta
        title="Impressum und Datenschutz"
        description="Impressum, Datenschutz und Kontaktinformationen von Fakten-Stammtisch."
        path="/impressum"
      />
      <Typography variant="h5" component="h1">
        Impressum & Datenschutz
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1}>
          <Typography variant="h6" component="h2">
            Impressum (Angaben gemäß DDG)
          </Typography>
          <Typography variant="body2">
            Repository-Version
            <br />
            Anschrift wird nicht im Repository gespeichert
            <br />
            Live-Deployment ergänzt diese Angabe getrennt
          </Typography>
          <Typography variant="body2">
            Kontakt:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body2">
              E-Mail: {email}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
              onClick={handleCopy}
              sx={{ minWidth: 0, py: 0.25, px: 1, fontSize: '0.75rem' }}
            >
              {copied ? 'Kopiert' : 'Kopieren'}
            </Button>
          </Box>
          <Typography variant="body2">
            Weitere Kontaktmöglichkeit:{' '}
            <Link component={RouterLink} to="/feedback" underline="hover">
              Feedback-Formular
            </Link>
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Datenschutzhinweise
          </Typography>
          <Typography variant="body2">
            Verantwortlich für diese Website ist:
            <br />
            Repository-Version, Anschrift wird nicht im Repository gespeichert, Live-Deployment ergänzt diese Angabe getrennt, E-Mail wie im Impressum.
          </Typography>
          <Divider />
          <Typography variant="subtitle2">1. Hosting und Server-Logs</Typography>
          <Typography variant="body2">
            Beim Aufruf der Website verarbeitet der Hosting-Anbieter technisch notwendige Daten
            (z.B. IP-Adresse, Zeitpunkt, aufgerufene URL, Browser-Informationen), um den Betrieb
            und die Sicherheit der Website sicherzustellen.
          </Typography>
          <Typography variant="subtitle2">2. Keine Cookies und kein Tracking</Typography>
          <Typography variant="body2">
            Diese Website verwendet keine Tracking-Tools, keine Analyse-Dienste und keine
            Marketing-Cookies.
          </Typography>
          <Typography variant="subtitle2">3. Feedback-Formular</Typography>
          <Typography variant="body2">
            Wenn du das Feedback-Formular nutzt, werden die von dir eingegebenen Daten zur
            Bearbeitung deiner Anfrage per E-Mail an den Betreiber übermittelt (z.B. Vorschlag,
            optional Name und E-Mail für Rückfragen).
          </Typography>
          <Typography variant="subtitle2">4. Weitergabe und Speicherdauer</Typography>
          <Typography variant="body2">
            Eine Weitergabe deiner Angaben an Dritte erfolgt nicht, außer es besteht eine
            gesetzliche Verpflichtung. Daten werden nur so lange gespeichert, wie es für die
            Bearbeitung erforderlich ist.
          </Typography>
          <Typography variant="subtitle2">5. Deine Rechte</Typography>
          <Typography variant="body2">
            Du hast im Rahmen der gesetzlichen Vorgaben insbesondere das Recht auf Auskunft,
            Berichtigung, Löschung, Einschränkung der Verarbeitung sowie Widerspruch.
          </Typography>
          <Typography variant="subtitle2">6. Beschwerderecht</Typography>
          <Typography variant="body2">
            Du kannst dich bei einer Datenschutz-Aufsichtsbehörde beschweren, wenn du der Ansicht
            bist, dass die Verarbeitung deiner personenbezogenen Daten nicht rechtmäßig erfolgt.
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  )
}
