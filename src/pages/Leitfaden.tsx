import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import PageMeta from '../components/seo/PageMeta'
import { PERSON_ID, ORG_ID } from '../components/seo/person'

interface PrincipleProps {
  number: number
  title: string
  body: string
  example?: string
}

function Principle({ number, title, body, example }: PrincipleProps) {
  return (
    <Box>
      <Typography
        variant="subtitle1"
        component="h3"
        sx={{ fontWeight: 600, mb: 0.5 }}
      >
        {number}. {title}
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
        {body}
      </Typography>
      {example && (
        <Box
          sx={{
            mt: 1,
            p: 1.5,
            borderLeft: 3,
            borderColor: 'secondary.main',
            bgcolor: 'action.hover',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
            {example}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

interface SourceProps {
  label: string
  meta: string
  url: string
}

function Source({ label, meta, url }: SourceProps) {
  return (
    <Box component="li" sx={{ mb: 1 }}>
      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
        <Link href={url} target="_blank" rel="noopener" underline="hover">
          {label}
        </Link>
        <Box component="span" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.8rem' }}>
          {meta}
        </Box>
      </Typography>
    </Box>
  )
}

export default function Leitfaden() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://fakten-stammtisch.de/leitfaden/#webpage',
    url: 'https://fakten-stammtisch.de/leitfaden/',
    name: 'Gesprächsleitfaden',
    description:
      'Wie man im Gespräch auf Stammtischparolen reagiert: sechs forschungsbasierte Werkzeuge aus politischer Bildung und Misinformation-Forschung.',
    inLanguage: 'de',
    author: { '@id': PERSON_ID },
    publisher: { '@id': ORG_ID },
  }

  return (
    <Stack spacing={2.5}>
      <PageMeta
        title="Gesprächsleitfaden"
        description="Wie man im Gespräch auf Stammtischparolen reagiert: sechs forschungsbasierte Werkzeuge aus politischer Bildung und Misinformation-Forschung."
        path="/leitfaden"
        jsonLd={jsonLd}
      />

      <Typography variant="h5" component="h1">
        Gesprächsleitfaden
      </Typography>

      <Typography variant="subtitle1" component="p" color="text.secondary" sx={{ mt: -1 }}>
        Was die Forschung zur Argumentation gegen Stammtischparolen empfiehlt
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Warum Fakten allein selten reichen
          </Typography>
          <Typography variant="body2">
            Eine Stammtischparole ist kein Argument, sondern ein fertiges
            Urteil in einem Satz: zugespitzt, vereinfachend, oft
            verallgemeinernd. Wer mit einer Statistik kontert, landet
            schnell in der Defensive — die Parole wirkt griffig, die
            Erklärung wirkt sperrig.
          </Typography>
          <Typography variant="body2">
            Die politische Bildung arbeitet seit den 1990er Jahren an
            diesem Problem (Klaus-Peter Hufer, Bundeszentrale für
            politische Bildung), und auch die Misinformation-Forschung
            der letzten Jahre liefert belastbare Hinweise, was wirkt
            und was nicht. Sechs Werkzeuge lassen sich daraus
            zusammenfassen.
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2.5}>
          <Typography variant="h6" component="h2">
            Sechs Werkzeuge für den Stammtisch
          </Typography>

          <Principle
            number={1}
            title="Mit Gegenfragen statt mit Vorträgen antworten"
            body="Wer mit Fakten dagegenredet, übernimmt die Beweislast für eine Behauptung, die zuerst gar nicht belegt wurde. Sokratische Gegenfragen drehen das um — sie zwingen das Gegenüber, die eigene Aussage zu präzisieren, und decken Lücken auf, ohne belehrend zu wirken."
            example={'„Wie genau meinst du das?“ · „Woher weißt du das?“ · „Hast du das selbst erlebt — oder kennst du jemanden, dem das passiert ist?“'}
          />

          <Principle
            number={2}
            title="Pauschalisierungen konkret machen"
            body={'„Die Ausländer“, „die Politiker“, „die Jugend von heute“ — solche Sammelbegriffe sind die Schwachstelle jeder Parole. Eine konkrete Nachfrage entzieht ihr den Boden.'}
            example={'„Wen meinst du konkret — den polnischen Handwerker, die syrische Ärztin oder den italienischen Wirt um die Ecke?“'}
          />

          <Principle
            number={3}
            title="Beim Thema bleiben — kein Parolen-Springen mitmachen"
            body={'Wer in die Defensive gerät, weicht oft auf ein neues Thema aus („Aber die nehmen uns ja auch die Wohnungen weg“). Wer jedem Sprung folgt, kommt nie zu einer Klärung. Stattdessen freundlich, aber bestimmt zurückführen — und das nächste Thema, wenn es wichtig ist, getrennt behandeln.'}
            example={'„Das ist ein anderes Thema. Bleiben wir kurz beim ersten — du hast gesagt …“'}
          />

          <Principle
            number={4}
            title="Brücken bauen, nicht Zeigefinger heben"
            body="Moralisieren verhärtet die Fronten. Wo eine Parole einen wahren Kern hat (Sorge, Erfahrung, berechtigte Frage), lohnt es sich, diesen ausdrücklich anzuerkennen, bevor eingeordnet wird. Das ist kein Nachgeben — es macht das Gegenüber gesprächsfähig."
            example={'„Dass die Mieten ein Problem sind, sehe ich auch. Nur — die Zahlen zeigen, dass das andere Ursachen hat als …“'}
          />

          <Principle
            number={5}
            title="Mit der Wahrheit anfangen — nicht mit der Lüge"
            body={'Wer eine falsche Aussage zuerst wiederholt („Es stimmt nicht, dass …“), verstärkt sie unbeabsichtigt im Kopf der Zuhörenden. Wirksamer ist, mit der korrekten Aussage zu beginnen, dann kurz zu benennen, was falsch daran war, und am Ende noch einmal die korrekte Aussage zu setzen („Truth Sandwich“).'}
            example={'Statt „Es stimmt nicht, dass die Asylzahlen explodieren“: „Die Asylzahlen sind 2025 gegenüber 2024 um über die Hälfte gesunken — von ‚Explosion’ kann keine Rede sein.“'}
          />

          <Principle
            number={6}
            title="Klare Grenze bei Menschenverachtung"
            body="Nicht jede Parole verdient eine Diskussion. Wo Menschen pauschal entwürdigt werden oder eine Aussage explizit rassistisch, antisemitisch oder volksverhetzend ist, ist Widerspruch wichtig — eine inhaltliche Auseinandersetzung dagegen meist nicht. Position beziehen, nicht in Detaildebatten ziehen lassen."
            example={'„Damit will ich mich nicht auseinandersetzen — das ist nicht meine Welt.“'}
          />
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Was Forschung über das Wirken sagt
          </Typography>
          <Typography variant="body2">
            Die größte aktuelle europäische Studie zu Korrekturen von
            Falschaussagen (Bruns et al., <em>Scientific Reports</em> 2024,
            5.228 Teilnehmende in Deutschland, Griechenland, Irland und
            Polen) zeigt zwei Dinge:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            <Typography component="li" variant="body2">
              <strong>Faktische Richtigstellung wirkt.</strong> Sowohl
              vorbeugende Aufklärung („Prebunking“) als auch
              nachträgliche Richtigstellung („Debunking“) reduzieren
              messbar die Zustimmung zu Falschaussagen und die Bereitschaft,
              sie weiterzuverbreiten.
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Der oft zitierte „Backfire Effect“ — dass
              Korrekturen den Irrglauben sogar verstärken — tritt selten
              und nur unter sehr spezifischen Bedingungen auf.</strong>{' '}
              Korrigieren lohnt sich in den allermeisten Fällen.
            </Typography>
          </Box>
          <Typography variant="body2">
            Das heißt nicht, dass man die parolenschwingende Person
            überzeugt. Aber: am Stammtisch hören meist mehrere Menschen
            zu. Wer ruhig und sachlich widerspricht, sendet an alle
            Zuhörenden ein klares Signal — und Schweigen wird als
            Zustimmung gelesen.
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Wie diese Seite dabei hilft
          </Typography>
          <Typography variant="body2">
            Die einzelnen Argument-Seiten auf Fakten-Stammtisch sind nach
            diesen Prinzipien aufgebaut. Sie enthalten:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            <Typography component="li" variant="body2">
              die <strong>faktische Antwort</strong> mit Quellen,
            </Typography>
            <Typography component="li" variant="body2">
              eine kurze Einordnung dazu, <strong>was hinter der Parole
              steckt</strong> (das Denkmuster),
            </Typography>
            <Typography component="li" variant="body2">
              und — wo sinnvoll — konkrete{' '}
              <strong>Gegenfragen für die Gesprächssituation</strong>.
            </Typography>
          </Box>
          <Typography variant="body2">
            Ein ausgearbeitetes Beispiel:{' '}
            <Link
              component={RouterLink}
              to="/thema/migration/nehmen-jobs-weg/"
              underline="always"
            >
              „Ausländer nehmen uns die guten Jobs weg.“
            </Link>
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            Weiterführende Quellen
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5, listStyle: 'none' }}>
            <Source
              label="Klaus-Peter Hufer: Argumentationstraining gegen Stammtischparolen"
              meta="Wochenschau Verlag, 10. Auflage 2016 — Standardwerk der politischen Bildung, Grundlage zahlreicher Trainings"
              url="https://www.wochenschau-verlag.de/Argumentationstraining-gegen-Stammtischparolen/054"
            />
            <Source
              label="KonterBUNT — Strategieguide gegen Stammtischparolen"
              meta="Niedersächsische Landeszentrale für politische Bildung — 22 konkrete Gesprächsstrategien, kostenfrei online"
              url="https://konterbunt.de/strategieguide/"
            />
            <Source
              label="Friedrich-Ebert-Stiftung — Interview mit Klaus-Peter Hufer"
              meta="Argumentation gegen Stammtischparolen, Reihe der Akademie Management und Politik"
              url="https://www.fes.de/akademie-management-und-politik/veroeffentlichungen/mup-interviews/argumentation-gegen-stammtischparolen"
            />
            <Source
              label="Bundeszentrale für politische Bildung: Widersprechen! Aber wie?"
              meta="Handbuch und Begleitmaterial zum Argumentationstraining (PDF-Vorschau)"
              url="https://www.bpb.de/system/files/dokument_pdf/Vorschau_Handbuch.pdf"
            />
            <Source
              label="Bruns et al.: Source and source trust in prebunks and debunks of misinformation"
              meta="Scientific Reports (Nature) 2024 — n=5.228 in DE/GR/IE/PL, Lead JRC Europäische Kommission"
              url="https://www.nature.com/articles/s41598-024-71599-6"
            />
            <Source
              label="Joint Research Centre der EU-Kommission: Misinformation and disinformation — both prebunking and debunking work"
              meta="Forschungsmitteilung Oktober 2024, Zusammenfassung der Studienergebnisse"
              url="https://joint-research-centre.ec.europa.eu/jrc-news-and-updates/misinformation-and-disinformation-both-prebunking-and-debunking-work-fighting-it-2024-10-25_en"
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            Quellen wurden zum Stand der Veröffentlichung dieser Seite
            abgerufen und auf inhaltliche Passung geprüft. Hinweise auf
            kaputte Links oder bessere Belege gerne über das{' '}
            <Link component={RouterLink} to="/feedback/" underline="always">
              Feedback-Formular
            </Link>
            .
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  )
}
