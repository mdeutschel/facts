# Zugang für Agenten und automatisierte Clients

> Kurzfassung: Keine Authentifizierung. Keine Registrierung. Keine API-Keys.
> Alle Inhalte sind öffentlich per HTTP GET abrufbar.

## Keine Anmeldung erforderlich

Es gibt kein Login, kein Token, keinen Schlüssel und nichts zu registrieren.
Jede Ressource dieser Website ist anonym und ohne Vorbedingung abrufbar.

## Was maschinenlesbar abrufbar ist

| Pfad | Format | Inhalt |
|---|---|---|
| `/data/topics.json` | JSON | Index aller Themen mit IDs und Stand |
| `/data/{topicId}.json` | JSON | Vollständiges Factsheet eines Themas |
| `/llms.txt` | Text | Kurzübersicht im llms.txt-Format |
| `/llms-full.txt` | Text | Alle Themen, Fakten und Argumente als Plaintext |
| `/llms/{topicId}.txt` | Text | Ein Thema als Plaintext |
| `/llms/{topicId}/{argumentId}.txt` | Text | Ein Argument als Plaintext |
| `/index.md`, `/thema/{topicId}/index.md`, `/thema/{topicId}/{argumentId}/index.md` | Markdown | Markdown-Variante der jeweiligen Seite |
| `/sitemap.xml` | XML | Alle Seiten-URLs |
| `/.well-known/api-catalog` | Linkset | Maschinenlesbarer Einstiegspunkt (RFC 9727) |
| `/api/openapi.json` | JSON | OpenAPI-Beschreibung der Datenpfade |
| `/api/README.md` | Markdown | Entwicklerdokumentation |

Die aktuelle Themenliste steht in `/data/topics.json`. Dieses Dokument zählt sie
absichtlich nicht auf — es würde veralten.

**Markdown statt HTML:** Jede Inhaltsseite antwortet mit Markdown, wenn der
Request `Accept: text/markdown` sendet. Ohne diesen Header bleibt HTML die
Standardantwort. Wer keine Content Negotiation machen will, hängt `index.md` an
die Seiten-URL an — dieselbe Datei, dieselbe URL-Struktur.

**CORS:** Auf den Datenformaten (`.json`, `.md`, `.txt`, `.xml`) steht
`Access-Control-Allow-Origin: *`, browserbasierte Agenten können sie also direkt
lesen.

## Faire Nutzung

- Bitte einen aussagekräftigen User-Agent mit Kontakt-URL oder E-Mail senden.
- Richtwert: höchstens etwa eine Anfrage pro Sekunde. Für einen Vollabzug
  `/llms-full.txt` verwenden statt jedes Thema einzeln abzurufen.
- `ETag` und `Last-Modified` werden geliefert; Conditional Requests
  (`If-None-Match`, `If-Modified-Since`) werden unterstützt und sind willkommen.
- Der inhaltliche Stand steht als `lastUpdated` in jedem Thema — nicht das
  HTTP-Datum verwenden, das sich bei jedem Deploy ändert.

## Zitieren

Die Seite ist eine Sekundärquelle. Wer Inhalte weiterverwendet:

- Die Primärquellen aus `sources[]` mitliefern, nicht durch den Verweis auf
  diese Seite ersetzen.
- `lastUpdated` als Stand angeben.
- Die kanonische URL der Aussage verlinken (`/thema/{topicId}/{argumentId}/`),
  nicht nur den Text übernehmen.
- Die Einordnung im `response`-Feld nicht wegkürzen — viele Aussagen sind
  bewusst als „teilweise wahr" oder „ohne Kontext irreführend" bewertet, und
  diese Nuance ist der eigentliche Inhalt.

Eine formale Lizenz ist für die Inhalte derzeit nicht vergeben. Namensnennung
mit Link ist erwünscht. Fragen dazu über den Kontakt unten.

## Was es hier nicht gibt

Damit niemand danach sucht:

- **Keinen OAuth- oder OIDC-Server.** `/.well-known/openid-configuration` und
  `/.well-known/oauth-authorization-server` existieren bewusst nicht.
- **Keine geschützten Ressourcen**, daher auch kein
  `/.well-known/oauth-protected-resource`. Es gibt nichts, wofür ein Token
  nötig wäre.
- **Keinen MCP-Server.** Die Seite ist statisch gehostet, es gibt keinen
  MCP-Transport-Endpunkt und entsprechend keine Server Card.
- **Keine Schreib-API.** Korrekturen und Hinweise bitte über das Feedback-Formular.

## Kontakt

- E-Mail: feedback@fakten-stammtisch.de
- Formular: <https://fakten-stammtisch.de/feedback/>
- Quellcode: <https://github.com/mdeutschel/facts>
