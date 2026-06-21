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
- Schema definiert in `src/types/index.ts` — ContentBlock nutzt Discriminated Unions (`type`-Feld)
- ContentBlock-Typen: `fact`, `text`, `table`, `stat_grid`, `comparison`, `range_bar`, `bar_chart`, `line_chart`, `timeline`, `progress_stack`, `myth_fact`, `pictograph`, `target_progress`
- Client-seitiger Suchindex wird zur Laufzeit aus allen Topic-JSONs aufgebaut
- `id`-Felder: kebab-case, `icon`: MUI-Icon-Name, `lastUpdated`: `YYYY-MM-DD`
- Quellen: `label` Pflicht, `url` optional
- Argumente: `keywords` für Suchmatching, `relatedSections` verlinkt zu Section-IDs

## Auto-generierte Dateien

Folgende Dateien werden beim Build erzeugt und sollten nicht manuell gepflegt werden:

- `public/data/topics.json` — Topic-Index, generiert von `scripts/generate-topic-index.mjs` aus allen `public/data/*.json`
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

## Bei Blockaden

- Wenn der Build nach 2 Versuchen fehlschlägt: stoppen und den vollständigen Fehler-Output melden
- Bei unklaren Type-Fehlern: zuerst `src/types/index.ts` prüfen
- Bei unerwartetem MUI-Komponentenverhalten: MUI-v9-Docs prüfen (Breaking Changes gegenüber v7/v8)

## Thema erstellen

Um ein komplett neues Thema von Grund auf zu erstellen, `/create-topic {topicId} {topicTitle}` verwenden. Der Skill orchestriert Recherche mit integrierter Quellenverifizierung, JSON-Erstellung und beide Quality Gates (`review-content`, `verify-sources`) in einem 6-Phasen-Workflow. Vollständige Anleitung in `.claude/skills/create-topic/SKILL.md`.

## Quellenverifizierung

Topic-JSON-Quellen MÜSSEN online verifizierbar sein. `/verify-sources {topicId}` verwenden — vollständige Anleitung in `.claude/skills/verify-sources/SKILL.md`.

## Inhaltliche Qualitätsprüfung

Topic-Inhalte müssen argumentativ stichhaltig, ausgewogen und schwer angreifbar sein. `/review-content {topicId}` verwenden, um Framing, Nuancierung und intellektuelle Redlichkeit zu prüfen. Beim Erstellen oder Erweitern von Topic-Inhalten die Autor-Modus-Leitplanken aus `.claude/skills/review-content/SKILL.md` anwenden.

Zentrale Qualitätsdimensionen: Nuance & Teilwahrheiten, Claim-Source-Fit, Annahmen-Transparenz, Fakt vs. Bewertung, Gegenargumente einbeziehen, sprachliche Präzision, Argument-Claim-Passung, Gesprächstauglichkeit (Truth-Sandwich-Einstieg, `rhetoricalPattern`, `counterQuestions` — siehe Leitfaden unter `/leitfaden/`), politische Neutralität (Verdict nur auf empirisch prüfbare Claims, kein Plädoyer, gleicher Maßstab und ausgewogene Claim-Auswahl über alle politischen Richtungen).

## Thema bearbeiten

Beim Aktualisieren oder Erweitern bestehender Topic-JSONs:

1. JSON bearbeiten — dabei Autor-Modus-Leitplanken aus `review-content` anwenden
2. `/review-content {topicId}` — Framing und Argumentation prüfen
3. `/verify-sources {topicId}` — bei geänderten Daten oder Quellen
4. `npm run build` — Validierung und Index-Neugenerierung

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
