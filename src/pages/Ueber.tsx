import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import PageMeta from '../components/seo/PageMeta'
import { PERSON_ID, PERSON_JSONLD } from '../components/seo/person'

export default function Ueber() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': 'https://fakten-stammtisch.de/ueber/#aboutpage',
        url: 'https://fakten-stammtisch.de/ueber/',
        name: 'Über dieses Projekt',
        inLanguage: 'de',
        about: { '@id': PERSON_ID },
        mainEntity: { '@id': PERSON_ID },
      },
      PERSON_JSONLD,
    ],
  }

  return (
    <Stack spacing={2.5}>
      <PageMeta
        title="Über das Projekt"
        description="Über das private, nicht-kommerzielle Projekt Fakten-Stammtisch von Marcel Deutschel: Hintergrund, Motivation, Verantwortung und wie die Inhalte entstehen."
        path="/ueber"
        jsonLd={jsonLd}
      />
      <Typography variant="h5" component="h1">
        Über dieses Projekt
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Was Fakten-Stammtisch ist
          </Typography>
          <Typography variant="body2">
            Eine Sammlung belastbarer Argumente und Zahlen zu wiederkehrenden
            gesellschaftlichen Streitfragen — Energiewende, Bürgergeld,
            Migration, Gendern, Heizungswechsel, und so weiter. Gedacht für
            den Moment, in dem am Tisch eine steile Behauptung fällt und du
            in zwanzig Sekunden eine geprüfte Gegenrede brauchst, ohne dich
            durch zwölf Tabs zu klicken.
          </Typography>
          <Typography variant="body2">
            Mobil-first, ohne Werbung, ohne Tracker, ohne Anmeldung.
            Nicht-kommerziell.
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Wer dahintersteht
          </Typography>
          <Typography variant="body2">
            Mein Name ist Marcel Deutschel. Ich bin Informatiker und
            experimentiere seit zwei bis drei Jahren intensiv mit großen
            Sprachmodellen — was sie können, was sie eben nicht können, und
            vor allem: wie man sie gegen ihre eigenen Schwächen absichert.
          </Typography>
          <Typography variant="body2">
            Fakten-Stammtisch ist mein privates Projekt, kein Produkt einer
            Firma.
          </Typography>
          <Typography variant="body2">
            Ich bin ausdrücklich <strong>kein</strong> Experte für
            Klimaforschung, Sozialpolitik, Verkehrsplanung oder
            Sprachwissenschaft. Diese Seite gibt nicht vor, dass es anders
            wäre. Was ich beitrage, ist nicht das Fachwissen — sondern die
            fortlaufende Arbeit am Prüfverfahren selbst: an den Skills
            (Anleitungen für die KI), die festlegen, wie eine Quelle
            verifiziert wird, was eine zulässige Argumentationsstruktur
            ausmacht, wo die Grenzen zwischen Fakt und Bewertung verlaufen.
            Diese Verfahren beeinflussen das Ergebnis stark — sie sind im{' '}
            <Link
              href="https://github.com/mdeutschel/facts/tree/main/.claude/skills"
              target="_blank"
              rel="noopener"
              underline="hover"
            >
              Repository einsehbar
            </Link>{' '}
            und entwickeln sich mit jedem Topic weiter.
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Warum es das gibt
          </Typography>
          <Typography variant="body2">
            Falschbehauptungen verbreiten sich schneller als Korrekturen.
            Sprachmodelle beschleunigen das in beide Richtungen — sie können
            Desinformation am Fließband produzieren, aber genauso gut
            helfen, Behauptungen schnell gegen die Datenlage zu prüfen.
            Fakten-Stammtisch ist mein Versuch, zu zeigen, dass die zweite
            Variante machbar ist: AI-Content, der nicht nur plausibel
            klingt, sondern überprüfbar belegt ist.
          </Typography>
          <Typography variant="body2">
            Begonnen hat das als technisches Experiment im privaten Umfeld.
            Inzwischen sind die ersten Themen online, und solange das
            Format seinen Zweck erfüllt, baue ich es weiter aus.
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Wie die Inhalte entstehen
          </Typography>
          <Typography variant="body2">
            Jedes Topic durchläuft denselben Workflow: Recherche,
            strukturierte Aufbereitung, Quellenverifizierung gegen die
            tatsächlich erreichbaren Online-Belege, inhaltliche Prüfung
            gegen sieben Qualitätsdimensionen (Nuance, Quellen-Fit,
            Annahmen-Transparenz, Fakt vs. Bewertung, Gegenargumente,
            sprachliche Präzision, Argument-Claim-Passung).
          </Typography>
          <Typography variant="body2">
            Den vollständigen Prozess beschreibe ich auf der{' '}
            <Link component={RouterLink} to="/methodik/" underline="hover">
              Methodik-Seite
            </Link>
            .
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Was diese Seite nicht ist
          </Typography>
          <Typography variant="body2">
            <strong>Kein Faktencheck-Portal im journalistischen Sinn</strong>{' '}
            — dafür gibt es Correctiv, dpa-Faktencheck und andere mit
            Redaktionen und Presseausweisen.
          </Typography>
          <Typography variant="body2">
            <strong>Kein Wikipedia-Ersatz</strong> — das hier ist explizit
            argumentativ zugespitzt, nicht enzyklopädisch neutral.
          </Typography>
          <Typography variant="body2">
            <strong>Kein Werbe- oder Affiliate-Projekt</strong> — keine
            Einnahmen, keine bezahlten Inhalte, keine Tracking-Cookies.
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Mitmachen
          </Typography>
          <Typography variant="body2">
            Das gesamte Projekt ist Open Source:{' '}
            <Link
              href="https://github.com/mdeutschel/facts"
              target="_blank"
              rel="noopener"
              underline="hover"
            >
              github.com/mdeutschel/facts
            </Link>
          </Typography>
          <Typography variant="body2">Was hilft:</Typography>
          <Typography variant="body2" component="ul" sx={{ m: 0, pl: 2.5 }}>
            <li>
              <strong>Korrekturen</strong> — falsche Zahl, kaputter
              Quellen-Link, schiefe Argumentation: gerne als Issue
            </li>
            <li>
              <strong>Themenvorschläge</strong> — was fehlt, was kommt am
              Stammtisch immer wieder hoch
            </li>
            <li>
              <strong>Quellenhinweise</strong> — bessere oder aktuellere
              Belege zu bestehenden Themen
            </li>
          </Typography>
          <Typography variant="body2">
            Auch per Mail an die{' '}
            <Link component={RouterLink} to="/feedback/" underline="hover">
              Feedback-Adresse
            </Link>
            .
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Verantwortung
          </Typography>
          <Typography variant="body2">
            Verantwortlich für Konzept, Methodik und Veröffentlichung:
            Marcel Deutschel. Anschrift im{' '}
            <Link component={RouterLink} to="/impressum/" underline="hover">
              Impressum
            </Link>
            .
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  )
}
