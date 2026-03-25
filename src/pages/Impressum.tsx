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
            Impressum (Angaben gemäß § 5 DDG)
          </Typography>
          <Typography variant="body2">
            Marcel Deutschel
            <br />
            August-Bebel-Str. 41
            <br />
            06108 Halle (Saale)
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
            Datenschutzerklärung
          </Typography>
          <Typography variant="body2">
            Verantwortlicher im Sinne der DSGVO:
            <br />
            Marcel Deutschel, August-Bebel-Str. 41, 06108 Halle (Saale)
            <br />
            E-Mail: {email}
          </Typography>

          <Divider />
          <Typography variant="subtitle2">1. SSL-/TLS-Verschlüsselung</Typography>
          <Typography variant="body2">
            Diese Website nutzt aus Sicherheitsgründen eine SSL-/TLS-Verschlüsselung.
            Eine verschlüsselte Verbindung erkennst du an dem Schloss-Symbol in der
            Adresszeile deines Browsers.
          </Typography>

          <Typography variant="subtitle2">2. Hosting und Server-Log-Dateien</Typography>
          <Typography variant="body2">
            Diese Website wird bei ALL-INKL.COM – Neue Medien Münnich, Inhaber
            René Münnich, Hauptstraße 68, 02742 Friedersdorf (
            <Link href="https://all-inkl.com" target="_blank" rel="noopener" underline="hover">
              all-inkl.com
            </Link>
            ) gehostet. Beim Aufruf der Website werden automatisch Server-Log-Dateien
            erstellt, die folgende Daten enthalten: anonymisierte IP-Adresse, Datum und
            Uhrzeit des Zugriffs, aufgerufene URL, Referrer-URL, verwendeter Browser
            und Betriebssystem. IP-Adressen werden dabei vollständig anonymisiert
            (z. B. 0.0.0.0), sodass kein Personenbezug herstellbar ist.
          </Typography>
          <Typography variant="body2">
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
            einem sicheren und funktionsfähigen Betrieb). Die Server-Log-Dateien werden
            nach 14 Tagen automatisch gelöscht. Eine Statistikauswertung der Zugriffsdaten
            findet nicht statt.
          </Typography>

          <Typography variant="subtitle2">3. Keine Cookies und kein Tracking</Typography>
          <Typography variant="body2">
            Diese Website verwendet keine Cookies, keine Tracking-Tools und keine
            Analyse-Dienste.
          </Typography>

          <Typography variant="subtitle2">4. Feedback-Formular</Typography>
          <Typography variant="body2">
            Wenn du das{' '}
            <Link component={RouterLink} to="/feedback" underline="hover">
              Feedback-Formular
            </Link>
            {' '}nutzt, werden die von dir eingegebenen Daten (Vorschlag, optional Name
            und E-Mail-Adresse) serverseitig verarbeitet und per E-Mail an den Betreiber
            übermittelt. Pflichtangabe ist nur der Vorschlagstext; Name und E-Mail sind
            freiwillig und dienen ausschließlich einer möglichen Rückfrage.
          </Typography>
          <Typography variant="body2">
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
            der Bearbeitung von Nutzerfeedback). Die Daten werden nach Abschluss der
            Bearbeitung gelöscht, sofern keine gesetzliche Aufbewahrungspflicht besteht.
          </Typography>

          <Typography variant="subtitle2">5. Weitergabe an Dritte</Typography>
          <Typography variant="body2">
            Eine Weitergabe personenbezogener Daten an Dritte erfolgt nicht, sofern
            keine gesetzliche Verpflichtung dazu besteht. Der Hosting-Anbieter
            ALL-INKL.COM hat als Auftragsverarbeiter gemäß Art. 28 DSGVO Zugriff auf
            die Server-Log-Dateien.
          </Typography>

          <Typography variant="subtitle2">6. Deine Rechte</Typography>
          <Typography variant="body2">
            Du hast gegenüber dem Verantwortlichen folgende Rechte hinsichtlich deiner
            personenbezogenen Daten:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            <Typography component="li" variant="body2">Auskunft (Art. 15 DSGVO)</Typography>
            <Typography component="li" variant="body2">Berichtigung (Art. 16 DSGVO)</Typography>
            <Typography component="li" variant="body2">Löschung (Art. 17 DSGVO)</Typography>
            <Typography component="li" variant="body2">Einschränkung der Verarbeitung (Art. 18 DSGVO)</Typography>
            <Typography component="li" variant="body2">Datenübertragbarkeit (Art. 20 DSGVO)</Typography>
            <Typography component="li" variant="body2">Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</Typography>
          </Box>
          <Typography variant="body2">
            Zur Ausübung deiner Rechte genügt eine E-Mail an die oben genannte Adresse.
          </Typography>

          <Typography variant="subtitle2">7. Beschwerderecht bei einer Aufsichtsbehörde</Typography>
          <Typography variant="body2">
            Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren,
            wenn du der Ansicht bist, dass die Verarbeitung deiner personenbezogenen Daten
            nicht rechtmäßig erfolgt. Die für den Betreiber zuständige Aufsichtsbehörde ist:
          </Typography>
          <Typography variant="body2">
            Landesbeauftragter für den Datenschutz Sachsen-Anhalt
            <br />
            Leiterstraße 9, 39104 Magdeburg
            <br />
            Telefon: +49 391 81803-0
            <br />
            E-Mail: poststelle@lfd.sachsen-anhalt.de
            <br />
            <Link href="https://datenschutz.sachsen-anhalt.de" target="_blank" rel="noopener" underline="hover">
              datenschutz.sachsen-anhalt.de
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  )
}
