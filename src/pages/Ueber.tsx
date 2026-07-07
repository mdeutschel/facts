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
            Wie die Inhalte entstehen
          </Typography>
          <Typography variant="body2">
            Jedes Topic durchläuft denselben Workflow: Recherche,
            strukturierte Aufbereitung, automatisierte Quellenverifizierung
            gegen die tatsächlich erreichbaren Online-Belege, inhaltliche
            Prüfung gegen neun Qualitätsdimensionen (Nuance, Quellen-Fit
            &amp; -Unabhängigkeit, Annahmen-Transparenz, Fakt vs.
            Bewertung, Gegenargumente, sprachliche Präzision,
            Argument-Claim-Passung, Gesprächstauglichkeit, politische
            Neutralität).
          </Typography>
          <Typography variant="body2">
            Recherche, Strukturierung und Erstellung der Texte erfolgen mit
            Sprachmodellen. Eine redaktionelle Vollprüfung jeder einzelnen
            Aussage findet bewusst nicht statt — die Qualität soll vom
            Workflow getragen werden: verlinkte Primärquellen zu jeder Zahl,
            automatisierte Skills für Quellenverifizierung und
            argumentative Prüfung, ein offener Korrekturweg über Feedback
            und Issues. Den vollständigen Prozess beschreibt die{' '}
            <Link component={RouterLink} to="/methodik/" underline="always">
              Methodik-Seite
            </Link>
            .
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
            Fakten-Stammtisch ist mein privates Projekt, kein Produkt einer
            Firma.
          </Typography>
          <Typography variant="body2">
            Mein Beitrag liegt im Prüfverfahren selbst: in den Skills
            (Anleitungen für die KI), die festlegen, wie eine Quelle
            verifiziert wird, was eine zulässige Argumentationsstruktur
            ausmacht, wo die Grenzen zwischen Fakt und Bewertung verlaufen.
            Diese Skills sind im{' '}
            <Link
              href="https://github.com/mdeutschel/facts/tree/main/.claude/skills"
              target="_blank"
              rel="noopener"
              underline="always"
            >
              Repository einsehbar
            </Link>{' '}
            und entwickeln sich mit jedem Topic weiter.
          </Typography>
          <Typography variant="body2">
            Fachexpertise zu Klimaforschung, Sozialpolitik, Verkehrsplanung
            oder Sprachwissenschaft liegt bei den verlinkten Primärquellen
            — nicht bei mir. Diese Seite ersetzt keine Fachstelle und tritt
            nicht als solche auf.
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
            Variante machbar ist: KI-gestützte Inhalte, die nicht nur
            plausibel klingen, sondern überprüfbar belegt sind.
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
              underline="always"
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
            <Link component={RouterLink} to="/feedback/" underline="always">
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
            <Link component={RouterLink} to="/impressum/" underline="always">
              Impressum
            </Link>
            .
          </Typography>
          <Typography variant="body2">
            Eigene stichprobenartige Kontrolle ergänzt die automatisierten
            Prüfungen, ersetzt aber keine redaktionelle Vollprüfung. Der
            primäre Korrekturweg führt über Issues im{' '}
            <Link
              href="https://github.com/mdeutschel/facts/issues"
              target="_blank"
              rel="noopener"
              underline="always"
            >
              GitHub-Repository
            </Link>{' '}
            und das{' '}
            <Link component={RouterLink} to="/feedback/" underline="always">
              Feedback-Formular
            </Link>
            . Hinweise zu falschen Zahlen, kaputten Quellen-Links oder
            schiefen Argumentationen werden geprüft und — wenn berechtigt —
            in der nächsten Aktualisierung des Topics berücksichtigt.
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  )
}
