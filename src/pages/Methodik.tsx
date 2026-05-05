import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import PageMeta from '../components/seo/PageMeta'

export default function Methodik() {
  return (
    <Stack spacing={2.5}>
      <PageMeta
        title="Methodik"
        description="Wie Inhalte auf Fakten-Stammtisch entstehen: KI-gestützter Workflow mit Quellenverifizierung, sieben Qualitätsdimensionen und transparenter Aktualität."
        path="/methodik"
      />
      <Typography variant="h5" component="h1">
        Methodik
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="body2">
          Alle Inhalte auf Fakten-Stammtisch werden mit Hilfe von
          KI-Systemen erstellt. Damit das nicht in beliebigem
          Plausibilitäts-Text mündet, durchläuft jedes Topic einen festen
          Prüfprozess. Diese Seite beschreibt ihn.
        </Typography>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Der Workflow im Überblick
          </Typography>
          <Typography variant="body2">
            Jedes Topic-Factsheet durchläuft folgende Phasen:
          </Typography>
          <Box component="ol" sx={{ m: 0, pl: 2.5 }}>
            <Typography component="li" variant="body2">
              <strong>Recherche</strong> — Zusammentragen relevanter Daten,
              Studien, amtlicher Statistiken
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Strukturierte Aufbereitung</strong> — Überführung in
              das einheitliche Topic-Schema (Fakten, Visualisierungen,
              Argumente, Quellen)
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Quellenverifizierung</strong> — automatisierter
              Abgleich aller Zahlen gegen die tatsächlich erreichbaren
              Online-Belege
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Inhaltliche Prüfung</strong> — Kontrolle gegen sieben
              Qualitätsdimensionen (siehe unten)
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Veröffentlichung</strong> mit sichtbarem Datum der
              letzten Bearbeitung
            </Typography>
          </Box>
          <Typography variant="body2">
            Nach Phase 3 und 4 sichte ich die Befunde und entscheide, was
            vor der Veröffentlichung korrigiert wird. Dieser finale Schritt
            ist menschlich — kein Automatismus erzwingt, dass jeder Hinweis
            behoben wird, bevor ein Topic erscheint. Die Vollständigkeit
            der Korrekturen liegt in meiner Verantwortung. Mehr dazu unter
            „Grenzen dieser Methodik".
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Quellenverifizierung
          </Typography>
          <Typography variant="body2">
            Jede Behauptung mit Zahl, Datum oder konkretem Sachverhalt
            verweist auf eine Quelle aus dem Quellenverzeichnis des
            jeweiligen Topics.
          </Typography>
          <Typography variant="body2">
            Im Verifizierungslauf wird für jede dieser Quellen:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            <Typography component="li" variant="body2">
              die URL tatsächlich abgerufen
            </Typography>
            <Typography component="li" variant="body2">
              jede konkrete Zahl, jedes Datum aus dem Beleg extrahiert
            </Typography>
            <Typography component="li" variant="body2">
              gegen die Behauptung im Topic abgeglichen
            </Typography>
            <Typography component="li" variant="body2">
              als ✓ verifiziert, ⚠ abweichend, ❓ nicht auffindbar oder ✗
              widersprochen klassifiziert
            </Typography>
          </Box>
          <Typography variant="body2">
            Behauptungen ohne tragfähigen Beleg werden entweder mit
            besserer Quelle ersetzt, abgeschwächt oder entfernt. Quellen
            werden nicht erfunden — eine URL, die nicht existiert oder die
            behauptete Information nicht enthält, wird nicht akzeptiert,
            auch nicht als „nahe genug".
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Inhaltliche Prüfung — sieben Dimensionen
          </Typography>
          <Typography variant="body2">
            Datenrichtigkeit allein macht einen Inhalt noch nicht redlich.
            Jedes Argument und jeder Inhaltsblock wird zusätzlich auf
            folgende Punkte geprüft:
          </Typography>
          <Box component="ol" sx={{ m: 0, pl: 2.5 }}>
            <Typography component="li" variant="body2">
              <strong>Nuance &amp; Teilwahrheiten</strong> —
              Stammtisch-Behauptungen haben oft einen wahren Kern. Der
              wird ausdrücklich anerkannt, bevor eingeordnet oder widerlegt
              wird.
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Claim-Source-Fit</strong> — Eine Quelle muss genau
              das stützen, wofür sie zitiert wird. Überinterpretation ist
              der häufigste Fehler und wird konsequent korrigiert.
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Annahmen-Transparenz</strong> — Kosten- und
              Projektionsrechnungen legen ihre Prämissen offen
              (Energiepreis, Region, Nutzung). Best-Case-Szenarien werden
              als solche gekennzeichnet.
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Fakt vs. Bewertung</strong> — Datenblöcke enthalten
              nur überprüfbare Zahlen ohne Adjektive. Interpretationen
              sind klar als solche erkennbar.
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Gegenargumente einbeziehen</strong> — Jede
              Argumentation benennt die stärkste gegnerische Position. Wo
              sich ein Gegenargument nicht mit Daten widerlegen lässt,
              wird das offen gesagt.
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Sprachliche Präzision</strong> — Absolutismen wie
              „beweist", „widerlegt endgültig", „die Medien verschweigen"
              werden vermieden. Stattdessen: „die Daten zeigen", „nach
              aktueller Studienlage".
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Argument-Claim-Passung</strong> — Die Antwort muss
              die Behauptung tatsächlich adressieren — nicht ein
              verwandtes, aber anderes Thema.
            </Typography>
          </Box>
          <Typography variant="body2">
            Die vollständigen Prüfregeln sind im Repository einsehbar (
            <Link
              href="https://github.com/mdeutschel/facts/blob/main/.claude/skills/review-content/SKILL.md"
              target="_blank"
              rel="noopener"
              underline="hover"
            >
              review-content
            </Link>
            ,{' '}
            <Link
              href="https://github.com/mdeutschel/facts/blob/main/.claude/skills/verify-sources/SKILL.md"
              target="_blank"
              rel="noopener"
              underline="hover"
            >
              verify-sources
            </Link>
            ).
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Aktualität — radikale Transparenz statt Versprechen
          </Typography>
          <Typography variant="body2">
            Daten veralten. Gesetze ändern sich, Statistiken werden neu
            erhoben, Argumente verschieben sich. Statt zu versprechen,
            dass jeder Inhalt immer aktuell ist (was niemand seriös
            garantieren kann), wird das Datum der letzten Bearbeitung an
            jedem Topic sichtbar mitgeführt.
          </Typography>
          <Typography variant="body2">
            Das Urteil über die Aktualität liegt damit transparent beim
            Leser.
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Grenzen dieser Methodik
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            <Typography component="li" variant="body2">
              <strong>KI-Systeme können halluzinieren.</strong> Genau
              deshalb existiert die Quellenverifizierung — aber sie kann
              Fehler nicht vollständig ausschließen. Wer einen findet:
              bitte melden.
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Die Quellenauswahl ist nicht neutral.</strong>{' '}
              Welche Studien, welche Behördenstatistiken zitiert werden,
              ist eine inhaltliche Entscheidung. Die Quellenliste pro
              Topic ist offen einsehbar; die Auswahl lässt sich
              nachvollziehen und kritisieren.
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Argumentative Zuspitzung ist gewollt.</strong>{' '}
              Diese Seite ist nicht enzyklopädisch neutral, sondern als
              Argumentationshilfe gebaut. Wo Position bezogen wird,
              geschieht das auf Basis der Datenlage — aber es bleibt eine
              Position.
            </Typography>
            <Typography component="li" variant="body2">
              <strong>
                Die finale Bewertung der Befunde ist menschlich und damit
                fehlbar.
              </strong>{' '}
              Die automatisierten Prüfungen erzeugen Hinweise, aber ob ein
              Hinweis blockierend, kosmetisch oder akzeptabel ist,
              entscheide ich. In der Praxis heißt das: wo eine strengere
              Bewertung noch hätte korrigieren lassen, winke ich
              gelegentlich auch durch. Wer beim Lesen einen Punkt findet,
              der schärfer hätte angefasst werden müssen — Korrekturhinweis
              ist willkommen.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Korrekturen
          </Typography>
          <Typography variant="body2">
            Fehler, kaputte Links, veraltete Zahlen, schiefe
            Argumentationen:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            <Typography component="li" variant="body2">
              als Issue im Repository:{' '}
              <Link
                href="https://github.com/mdeutschel/facts/issues"
                target="_blank"
                rel="noopener"
                underline="hover"
              >
                github.com/mdeutschel/facts/issues
              </Link>
            </Typography>
            <Typography component="li" variant="body2">
              per Mail:{' '}
              <Link component={RouterLink} to="/feedback" underline="hover">
                Feedback-Formular
              </Link>
            </Typography>
          </Box>
          <Typography variant="body2">
            Korrekturen werden geprüft und bei Bestätigung eingearbeitet —
            mit aktualisiertem Bearbeitungsdatum am betroffenen Topic.
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  )
}
