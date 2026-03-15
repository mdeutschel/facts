import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export default function Impressum() {
  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>
          Impressum & Datenschutz
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Bitte ersetze die Platzhalter vor der Veröffentlichung mit deinen echten Angaben.
        </Typography>
      </Box>

      <Alert severity="warning">
        Dieses Muster ist eine praktische Orientierung, aber keine Rechtsberatung.
      </Alert>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1}>
          <Typography variant="h6" component="h2">
            Impressum (Angaben gemäß DDG)
          </Typography>
          <Typography variant="body2">
            TODO Vor- und Nachname
            <br />
            TODO Straße und Hausnummer
            <br />
            TODO PLZ Ort
          </Typography>
          <Typography variant="body2">
            Kontakt:
            <br />
            E-Mail: TODO email@example.de
            <br />
            Telefon: TODO +49 ...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Falls vorhanden ergänzen: Umsatzsteuer-ID, Registereintrag, zuständige Aufsichtsbehörde.
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Datenschutzhinweise (Kurzfassung)
          </Typography>
          <Typography variant="body2">
            Verantwortlich für diese Website ist:
            <br />
            TODO Vor- und Nachname, Anschrift, E-Mail (wie im Impressum).
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
