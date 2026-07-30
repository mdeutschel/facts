# Fakten-Stammtisch — Agent-Anweisungen

## Projektübersicht

Deutschsprachige statische React-SPA mit faktenbasierten Argumenten für informelle Diskussionen.
Mobile-first, kein Backend, JSON-Daten werden zur Laufzeit geladen.

## Tech-Stack

| Paket | Version | Zweck |
|-------|---------|-------|
| React + ReactDOM | 19.x | UI-Framework |
| MUI Material + Icons | 9.x | Komponentenbibliothek |
| Emotion | 11.x | Styling (MUI-Abhängigkeit) |
| react-router-dom | 7.x | Client-seitiges Routing |
| Recharts | 3.x | Diagramme (lazy-loaded) |
| Vite | 8.x | Build-Tool |
| TypeScript | 6.x | Sprache (strict mode) |
| ESLint | 10.x | Linting (Flat-Config) |

## Technische Hinweise

- MUI v9 hat deprecated System-Props (`alignItems`, `justifyContent`, `fontWeight` etc.) von `Box`/`Grid`/`Stack`/`Typography` entfernt — diese gehören in `sx`; deprecated Slot-Props (`primaryTypographyProps`, `inputProps` auf TextField etc.) wurden durch `slotProps` ersetzt
- React 19 Actions, `use()`, `useOptimistic()` sind verfügbar
- Vite 8 nutzt natives ESM — keine CommonJS-Importe
- Recharts wird lazy geladen (`React.lazy`)

## Befehle

- Installieren: `npm ci`
- Cursor-Rules einrichten: `bash scripts/setup-cursor-rules.sh` (Symlinks `.cursor/rules/` → `.claude/rules/`)
- Dev-Server: `npm run dev`
- Build: `npm run build` (führt `generate-topic-index.mjs && generate-seo.mjs && tsc -b && vite build && generate-route-html.mjs && cp .htaccess dist/` aus)
- Lint: `npm run lint`
- Vorschau: `npm run preview`
- Agent-Discovery prüfen: `bash scripts/verify-agent-discovery.sh [base-url]` (Default: Produktion) — prüft Link-Header, Markdown-Negotiation, MIME-Typen, CORS und die Well-known-Artefakte per curl. **`npm run preview` kann davon nichts prüfen**, weil Vites Server keine `.htaccess` liest; für einen lokalen Test braucht es ein echtes Apache über HTTPS mit `AllowOverride All` (Details im Skript-Header)

## Projektstruktur

```
src/
  main.tsx              # Einstiegspunkt
  App.tsx               # Router-Setup
  theme.ts              # MUI-Theme (primary #37474f, secondary #00897b)
  types/index.ts        # Alle TypeScript-Interfaces (zentral)
  hooks/                # Custom Hooks (useTopics, useSearch)
  pages/                # Seitenkomponenten (Home, TopicPage, SearchPage)
  components/
    layout/             # AppShell, SearchBar
    home/               # TopicCard
    topic/              # FactSection, ArgumentCard
    search/             # SearchResults
    visualizations/     # StatGrid, ComparisonView, RangeBarChart, etc.
public/data/            # JSON-Factsheets, zur Laufzeit geladen
input/                  # Quell-Markdown (Referenzmaterial, wird nicht deployed)
```

## Routing

| Route | Komponente | Zweck |
|-------|------------|-------|
| `/` | Home | Themenkarten-Übersicht |
| `/thema/:topicId` | TopicPage | Themendetail (Fakten + Argumente Tabs) |
| `/thema/:topicId/:argumentId` | ArgumentPage | Argument-Detailseite (Claim, Verdict, Antwort, Fakten) |
| `/suche?q=...` | SearchPage | Suchergebnisse |
| `/ueber`, `/methodik`, `/impressum`, `/feedback` | Statische Seiten | Projekt-Infos |

## Datenarchitektur

- Themen-Index: `public/data/topics.json` (auto-generiert beim Build aus allen Topic-JSONs)
- Themen-Daten: `public/data/{topicId}.json`
- Neues Thema hinzufügen = neue JSON-Datei anlegen, `npm run build` generiert den Index automatisch
- **Reihenfolge auf der Startseite**: Die Kartenreihenfolge ist in der `TOPIC_ORDER`-Liste in `scripts/generate-topic-index.mjs` festgelegt (thematische Blöcke, Single Source of Truth). Neue Themen müssen dort an der passenden thematischen Position eingetragen werden — sonst werden sie mit einer Build-Warnung ans Ende gehängt.
- Schema definiert in `src/types/index.ts` — ContentBlock nutzt Discriminated Unions (`type`-Feld)
- ContentBlock-Typen: `fact`, `text`, `table`, `stat_grid`, `comparison`, `range_bar`, `bar_chart`, `line_chart`, `timeline`, `progress_stack`, `myth_fact`, `pictograph`, `target_progress`
- Client-seitiger Suchindex wird zur Laufzeit aus allen Topic-JSONs aufgebaut
- `id`-Felder: kebab-case, `icon`: MUI-Icon-Name, `lastUpdated`: `YYYY-MM-DD`
- Quellen: `label` und `url` Pflicht — jede Quelle muss online verifizierbar sein. Einzige Ausnahme: nicht online verfügbare Publikationen (Print), dann Ausgabe/Jahr im `label` vermerken
- Zentrale Datenpunkte (highlight-Fakten, `keyStats`, Kernzahlen in Argumenten) nicht allein auf interessengebundene Quellen (Verbände, Stiftungen, Auftragsstudien) stützen — unabhängige Zweitquelle oder Herkunftsvermerk im Text (siehe Unabhängigkeitsregel in `.claude/skills/create-topic/SKILL.md`)
- Argumente: `keywords` für Suchmatching, `relatedSections` verlinkt zu Section-IDs

## Auto-generierte Dateien

Folgende Dateien werden beim Build erzeugt und sollten nicht manuell gepflegt werden:

- `public/data/topics.json` — Topic-Index, generiert von `scripts/generate-topic-index.mjs` aus allen `public/data/*.json`; die Reihenfolge folgt der `TOPIC_ORDER`-Liste in diesem Skript
- SEO-Basisdateien — generiert von `scripts/generate-seo.mjs` vor `vite build`:
  - `public/sitemap.xml` (inkl. aller Topic- und Argument-URLs)
  - `public/llms.txt`, `public/llms-full.txt`, `public/llms/{topicId}.txt`
  - `<noscript>`-Block in `index.html` (Home-Fallback mit Topic-Liste)
- Pre-rendered Route-HTML — generiert von `scripts/generate-route-html.mjs` nach `vite build`:
  - `dist/thema/{topicId}/index.html` (Topic, mit Article + FAQPage (alle Argumente) + BreadcrumbList JSON-LD und Topic-spezifischem noscript)
  - `dist/thema/{topicId}/{argumentId}/index.html` (Argument, mit Article + FAQPage (eine Frage) + ggf. ClaimReview + BreadcrumbList JSON-LD und Argument-spezifischem noscript)
  - `dist/{ueber,methodik,impressum,feedback,suche}/index.html` (statische Seiten mit eigenen Meta-Tags und JSON-LD)
  - Zusätzliches `CollectionPage`-JSON-LD in `dist/index.html`
  - Sitewide `WebSite` + `Organization` + `Person` JSON-LD-Graph liegt statisch in `index.html` und erscheint via Template auf allen Routen; `author`/`publisher` referenzieren diese Knoten per `@id` (`#person` bzw. `#organization`). FAQPage wird genutzt, weil QAPage von Google nutzer-einreichbare Antworten verlangt; FAQ-Rich-Results sind seit Mai 2026 abgeschaltet, das Markup bleibt aber für Verständnis und KI-Nutzung relevant.
  - `public/llms/{topicId}/{argumentId}.txt` (per-Argument Plaintext)
  - Markdown-Zwillinge: `dist/index.md`, `dist/thema/{topicId}/index.md`, `dist/thema/{topicId}/{argumentId}/index.md` — werden bei `Accept: text/markdown` ausgeliefert und sind zusätzlich direkt per URL abrufbar. Die 6 statischen Routen haben bewusst **keinen** Zwilling (ihre Prosa lebt in den React-Komponenten und würde dupliziert); die Rewrite-Regel ist per `-f`-Test abgesichert, sie bleiben also bei HTML
  - `dist/.well-known/api-catalog` (API-Katalog nach RFC 9727, `application/linkset+json`) und `dist/api/openapi.json` (OpenAPI-Beschreibung der `/data/`-Pfade) — beide aus den Topic-Daten generiert, damit die `topicId`-Enum nicht veraltet
- Nicht-HTML-Rendering von Content liegt in `scripts/lib/`: `content.mjs` (`flattenContentBlock`, `absoluteUrl`, `VERDICT_META`) und `markdown.mjs` (Markdown-Builder). `markdown.mjs` delegiert an `flattenContentBlock` und überschreibt nur die Blocktypen, bei denen Markdown-Syntax etwas trägt (Tabellen als GFM-Tabelle, Captions kursiv, `myth_fact` mit Bold-Labels). `llms*.txt` und die `.md`-Zwillinge nutzen denselben Code-Pfad — **keinen weiteren Content-Renderer anlegen**, es gibt schon drei (React-Komponenten, `flattenContentBlock`, PHP `renderContentBlock` in `og.php`)
- Ein neuer ContentBlock-Typ muss in `CONTENT_BLOCK_SCHEMAS` in `scripts/lib/openapi.mjs` beschrieben werden — der Build bricht sonst mit einer klaren Meldung ab, statt eine unvollständige Spec auszuliefern
- `/api/README.md` und `/auth.md` sind **handgepflegte** Quelldateien unter `public/` (Prosa, nicht abgeleitet) und stehen nicht in `.gitignore`
- `/api/` ist absichtlich **keine** React-Route. Eine Prerender-only-HTML-Seite funktioniert hier nicht, weil `buildRouteHtml` die SPA-Shell mit den Vite-Bundle-Tags erzeugt — React würde booten und die Seite sofort durch `NotFound` ersetzen. Die API-Doku ist deshalb Markdown
- JSON-LD wird an **zwei** Stellen erzeugt, die identisch bleiben müssen: die Prerender-Builder in `scripts/generate-route-html.mjs` (Crawler sehen diese in den `dist/.../index.html`) und die Runtime-Builder in den React-Pages (`TopicPage.tsx`, `ArgumentPage.tsx`, statische Seiten) für SPA-Navigation. Der gemeinsame FAQPage-Builder liegt in `src/components/seo/jsonLd.ts`, IDs/Verdict-Mapping in `src/components/seo/`. Bei neuen statischen Routen oder Argumentstrukturen `STATIC_ROUTES`, die Builder in `generate-route-html.mjs` und die React-Pages synchron halten.

## Code-Konventionen

Detaillierte Konventionen sind in den Rule-Dateien unter `.claude/rules/` definiert (Single Source of Truth):

| Rule-Datei | Scope | Inhalt |
|------------|-------|--------|
| `typescript.md` | `src/**/*.{ts,tsx}` | Strict Mode, kein `any`, Interfaces, Assertions, Caching |
| `react-components.md` | `src/components/**`, `src/pages/**` | Komponentenstruktur, MUI-Imports, `sx`-Styling, Mobile-first |
| `visualizations.md` | `src/components/visualizations/**` | Präsentationale Muster, Recharts lazy-loading, Komponenten-Mapping |
| `data-schema.md` | `public/data/**/*.json`, `input/**` | ContentBlock-Typen, ID-/Quellen-Konventionen |

### Benennung
- Komponenten/Seiten: `PascalCase.tsx`
- Hooks: `use*.ts` mit Named Export
- Types: `PascalCase` (kein `I`-Prefix)
- Funktionen/Variablen: `camelCase`

## Deployment

- CI: GitHub Actions bei Push auf `main` → Build → FTP-Deploy via lftp
- Hosting: Apache mit `.htaccess` SPA-Fallback
- Keine Source Maps in Produktion

## Grenzen — NICHT tun

- Kein Backend oder SSR hinzufügen — das ist eine statische SPA
- Keine Abhängigkeiten hinzufügen ohne vorherige Absprache
- `public/data/*.json`-Struktur nicht ändern ohne `src/types/index.ts` anzupassen
- Kein `any` verwenden — stattdessen `unknown` mit Type Narrowing
- Keinen Force-Push oder Git-History umschreiben
- Keine `.env`, Zugangsdaten oder Secrets committen
- Keine Tests hinzufügen, es sei denn explizit gewünscht (kein Test-Framework konfiguriert)
- Keine Discovery-Metadaten veröffentlichen, für die es keine Funktion gibt — kein OAuth-/OIDC-Dokument ohne Authorization Server, keine MCP Server Card ohne MCP-Endpunkt, keine `status`-Relation ohne Health-Check. `/auth.md` benennt diese Nicht-Funktionen ausdrücklich, damit Agenten nicht danach suchen
- Keine Lizenz für die Inhalte behaupten — es ist keine vergeben (siehe „Offener Punkt" unten)

## Agent-Discovery

Die maschinenlesbare Oberfläche für KI-Agenten:

| Ressource | Zweck |
|---|---|
| `Link`-Response-Header auf allen HTML-Routen | RFC 8288, verweist auf llms.txt, auth.md, API-Katalog, OpenAPI, API-Doku |
| `Accept: text/markdown` | Liefert die Markdown-Variante derselben URL; HTML bleibt Default |
| `/auth.md` | Zugriff, faire Nutzung, Zitierhinweise, und was es bewusst nicht gibt |
| `/.well-known/api-catalog` | RFC 9727 Linkset |
| `/api/openapi.json`, `/api/README.md` | Formale und menschenlesbare Beschreibung der `/data/`-Pfade |
| `Content-Signal` in `robots.txt` | Nutzungspräferenzen (aktuell alle drei erlaubt) |

Zwei Fallen, die schon zugeschlagen haben:

- Der `Link`-Header ist über `<FilesMatch "index\.html$">` gescoped, **nicht** über `expr=%{REQUEST_URI}`. mod_dir schreibt bei DirectoryIndex intern auf `.../index.html` um, bevor mod_headers die Bedingung auswertet — eine `^/$`-Bedingung matcht die Startseite deshalb nie.
- `Content-Signal` ist ein Gruppen-Record wie `Allow`: ein Crawler wertet nur die eine Gruppe aus, die auf ihn passt. Das Signal muss deshalb in *jeder* Gruppe stehen, sonst sehen genau die KI-Crawler mit eigener Gruppe es nicht.

Offener Punkt: Für die Inhalte ist keine Lizenz vergeben. `auth.md` und `api/README.md` bitten daher nur um Namensnennung und behaupten keine Lizenz; ein `rel="license"`-Link entfällt. Wird eine Lizenz beschlossen, kommen Lizenzangabe, `rel="license"` im Link-Header und ein Absatz im Impressum dazu.

## Bei Blockaden

- Wenn der Build nach 2 Versuchen fehlschlägt: stoppen und den vollständigen Fehler-Output melden
- Bei unklaren Type-Fehlern: zuerst `src/types/index.ts` prüfen
- Bei unerwartetem MUI-Komponentenverhalten: MUI-v9-Docs prüfen (Breaking Changes gegenüber v7/v8)

## Projekt-Skills: autonome Abarbeitung

Alle Projekt-Skills (`create-topic`, `update-topic`, `review-content`, `verify-sources`, `audit-freshness`) laufen standardmäßig **vollständig autonom** durch: Zwischenberichte dokumentieren Entscheidungen, sind aber keine Freigabe-Gates. Angehalten wird nur bei echten Blockern (fehlende Datenbasis für ein ganzes Thema, mehrdeutiger Auftrag mit gegensätzlichen Ergebnissen, Build-Fehler nach 2 Versuchen) oder wenn der Nutzer ausdrücklich um Rücksprache gebeten hat.

## Thema erstellen

Um ein komplett neues Thema von Grund auf zu erstellen, `/create-topic {topicId} {topicTitle}` verwenden. Der Skill orchestriert Recherche mit integrierter Quellenverifizierung, JSON-Erstellung und beide Quality Gates (`review-content`, `verify-sources`) in einem 6-Phasen-Workflow. Vollständige Anleitung in `.claude/skills/create-topic/SKILL.md`.

## Quellenverifizierung

Topic-JSON-Quellen MÜSSEN online verifizierbar sein. `/verify-sources {topicId}` verwenden — vollständige Anleitung in `.claude/skills/verify-sources/SKILL.md`.

## Inhaltliche Qualitätsprüfung

Topic-Inhalte müssen argumentativ stichhaltig, ausgewogen und schwer angreifbar sein. `/review-content {topicId}` verwenden, um Framing, Nuancierung und intellektuelle Redlichkeit zu prüfen. Beim Erstellen oder Erweitern von Topic-Inhalten die Autor-Modus-Leitplanken aus `.claude/skills/review-content/SKILL.md` anwenden.

Zentrale Qualitätsdimensionen: Nuance & Teilwahrheiten, Claim-Source-Fit & Quellen-Unabhängigkeit, Annahmen-Transparenz, Fakt vs. Bewertung, Gegenargumente einbeziehen, sprachliche Präzision, Argument-Claim-Passung, Gesprächstauglichkeit (Truth-Sandwich-Einstieg, `rhetoricalPattern`, `counterQuestions` — siehe Leitfaden unter `/leitfaden/`), politische Neutralität (Verdict nur auf empirisch prüfbare Claims — zutreffende Claims bekommen `true` —, kein Plädoyer, gleicher Maßstab und ausgewogene Claim-Auswahl über alle politischen Richtungen).

## Thema bearbeiten

Zum Aktualisieren oder Erweitern bestehender Topic-JSONs `/update-topic {topicId} {Änderungsauftrag}` verwenden. Der Skill orchestriert Recherche mit Inline-Verifizierung, Autor-Leitplanken, einen Darstellungs-Check (Blocktyp-Vielfalt, UX, Datenverständnis — bei Darstellungsaufträgen für das ganze Topic), beide Quality Gates und den Build. Vollständige Anleitung in `.claude/skills/update-topic/SKILL.md`.

## Datenpflege

Um systematisch zu finden, welche Themen veraltete Daten enthalten, `/audit-freshness` verwenden (read-only, priorisiert nach `lastUpdated` und zeitgebundenen Angaben). Die Umsetzung der Befunde erfolgt per `/update-topic`. Vollständige Anleitung in `.claude/skills/audit-freshness/SKILL.md`.

## Definition of Done

### Code-Änderungen

1. `npm run lint` mit Exit-Code 0 durchläuft
2. `npm run build` mit Exit-Code 0 durchläuft
3. Keine `any`-Types eingeführt wurden
4. Änderungen den dokumentierten Code-Patterns folgen (siehe `.claude/rules/`)

### Inhaltsänderungen an Topic-JSONs

1. `npm run build` mit Exit-Code 0 durchläuft
2. `review-content` durchlaufen — keine ✗ PROBLEM-Befunde offen
3. `verify-sources` durchlaufen — keine ✗ FALSCH-Befunde offen
