# Fakten-Stammtisch — Daten und Schnittstelle

Diese Seite beschreibt, wie sich die Inhalte von
[fakten-stammtisch.de](https://fakten-stammtisch.de) programmatisch abrufen
lassen. Zugriffs- und Zitierhinweise stehen in
[/auth.md](https://fakten-stammtisch.de/auth.md), der maschinenlesbare Einstieg
in [/.well-known/api-catalog](https://fakten-stammtisch.de/.well-known/api-catalog).

Formale Beschreibung: [openapi.json](https://fakten-stammtisch.de/api/openapi.json)
(OpenAPI 3.1).

## Grundlagen

- Rein lesend. Es gibt keine Schreiboperationen.
- Keine Authentifizierung, keine Registrierung, keine API-Keys.
- Statisches Hosting: alles sind normale Dateien hinter `GET`. Kein Rate-Limit
  serverseitig, dafür die Bitte um Zurückhaltung (siehe `/auth.md`).
- `Access-Control-Allow-Origin: *` auf allen Datenformaten.
- Kein Versionspräfix im Pfad. Die Struktur ist seit Projektbeginn stabil;
  Änderungen erfolgen additiv. `openapi.json` trägt als `info.version` den
  jüngsten inhaltlichen Stand aller Themen.

## Themen abrufen

Zwei Schritte: Index holen, dann das gewünschte Thema.

```bash
curl -s https://fakten-stammtisch.de/data/topics.json
curl -s https://fakten-stammtisch.de/data/klimawandel.json
```

`topics.json` liefert `{ "topics": TopicMeta[] }`. Ein `TopicMeta` enthält `id`,
`title`, `subtitle`, `icon`, `lastUpdated`, `factCount`, `argumentCount`.

Das Themen-JSON enthält zusätzlich `keyStats`, `sourceNote`, `sections`,
`arguments`, `sources` und `relatedTopicIds`.

## Datenmodell

### `sections[]` — die Faktenbasis

Jede Section hat `id`, `title` und `content: ContentBlock[]`. `ContentBlock` ist
eine diskriminierte Union über das Feld `type`:

`fact`, `text`, `table`, `stat_grid`, `comparison`, `range_bar`, `bar_chart`,
`line_chart`, `timeline`, `progress_stack`, `myth_fact`, `pictograph`,
`target_progress`

Die genauen Felder je Typ stehen in `openapi.json` unter
`components.schemas.ContentBlock`. Wer nur den Text braucht, ist mit den
Markdown- oder Plaintext-Varianten besser bedient als mit dem JSON — dort sind
alle Blocktypen schon zu lesbarem Text abgeflacht.

Blöcke tragen optional `sourceRefs: string[]`, die auf `sources[].id` verweisen.
So lässt sich jede Zahl einer Quelle zuordnen.

### `arguments[]` — die Gesprächsebene

| Feld | Bedeutung |
|---|---|
| `claim` | Die Aussage, wie sie im Gespräch fällt |
| `response` | Die belegte Antwort darauf |
| `verdict` | Bewertung der Aussage (siehe unten), optional |
| `rhetoricalPattern` | Welches Muster hinter der Aussage steckt, optional |
| `counterQuestions` | Rückfragen für das Gespräch, optional |
| `relatedSections` | IDs der Sections, die das Argument belegen |
| `keywords` | Suchbegriffe |

`verdict` ist einer von: `false`, `mostly-false`, `misleading`, `outdated`,
`lacks-context`, `partially-true`, `mostly-true`, `true`.

**Wichtig für die Weiterverwendung:** Das Verdict bewertet eine empirisch
prüfbare Aussage, keine politische Position. Ein `partially-true` oder
`lacks-context` ist keine abgeschwächte Ablehnung, sondern die Aussage selbst —
das Wegkürzen der Nuance verfälscht den Inhalt.

### `sources[]`

`id`, `label` und in der Regel `url`. Ohne `url` sind nur Publikationen, die
nicht online verfügbar sind; dann steht Ausgabe und Jahr im `label`.

## Textformate statt JSON

Für Sprachmodelle meist der bessere Einstieg:

| URL | Inhalt |
|---|---|
| `/llms.txt` | Kurzübersicht mit Links |
| `/llms-full.txt` | Alle Themen komplett als Plaintext |
| `/llms/{topicId}.txt` | Ein Thema |
| `/llms/{topicId}/{argumentId}.txt` | Ein Argument mit seinen Belegen |

## Markdown per Content Negotiation

Jede Inhaltsseite liefert Markdown statt HTML, wenn der Request es anfragt:

```bash
curl -s -H 'Accept: text/markdown' https://fakten-stammtisch.de/thema/klimawandel/
```

Die Antwort trägt `Content-Type: text/markdown; charset=UTF-8` und
`Vary: Accept`. Ohne den Header bleibt HTML die Standardantwort, Browser sind
also nicht betroffen.

Wer keine Negotiation machen will, hängt `index.md` an:

```bash
curl -s https://fakten-stammtisch.de/thema/klimawandel/index.md
```

Beide Wege liefern dieselbe Datei. Markdown-Varianten gibt es für die
Startseite, alle Themenseiten und alle Argument-Detailseiten.

## Kein Health-Endpoint

Der API-Katalog enthält bewusst keine `status`-Relation. Die Seite ist statisch
gehostet; eine Datei, die immer `"ok"` sagt, könnte einen Ausfall nicht melden
und wäre damit eine Scheinauskunft. Ob die Seite erreichbar ist, zeigt jeder
`GET` auf `/data/topics.json`.

## Kein MCP-Server

Es gibt keinen MCP-Transport-Endpunkt und keine Server Card — statisches
Hosting gibt das nicht her. Wer die Daten in einen Agenten einbinden will, nutzt
die JSON- oder Markdown-Pfade oben.

## Kontakt

feedback@fakten-stammtisch.de ·
[Feedback-Formular](https://fakten-stammtisch.de/feedback/) ·
[Quellcode](https://github.com/mdeutschel/facts)
