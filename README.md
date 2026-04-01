# Fakten-Stammtisch

Deutschsprachige, mobile-first React-SPA mit faktenbasierten Argumenten und Quellen zu politischen und gesellschaftlichen Debatten in Deutschland.

> Dieses Repository ist kein generisches Demo-Projekt, sondern ein Experiment für die Idee hinter `fakten-stammtisch.de`.
> Es dient zugleich als Arbeits- und Referenzprojekt dafür, wie einzelne KI-Komponenten zusammenarbeiten können:
> Themen recherchieren, Inhalte strukturieren, Argumente schärfen, Quellen verifizieren und daraus eine veröffentlichbare Seite bauen.
>
> Ebenso wichtig: Das ist ein privates Projekt. Code und vorhandene Inhalte in diesem Repository sind bewusst zu 100 % KI-generiert. Genau das ist Teil des Experiments: nicht nur das Produkt zu testen, sondern auch zu untersuchen, wie weit sich eine solche Seite vollständig mit KI-Unterstützung konzipieren, implementieren und redaktionell befüllen lässt.

## Worum es hier geht

Die Anwendung stellt kompakte Factsheets zu einzelnen Themen bereit. Jedes Thema besteht aus:

- strukturierten Faktenblöcken
- typischen Stammtisch-Behauptungen mit faktenbasierten Antworten
- verlinkten Quellen
- optionalen Visualisierungen wie Tabellen, Stat-Grids, Vergleichsansichten, Zeitachsen oder Diagrammen

Die Inhalte werden als JSON-Dateien gepflegt und zur Laufzeit geladen. Die Suche läuft clientseitig, ein klassisches Backend ist für die Kern-App nicht nötig.

## Projektstatus und Experiment-Rahmen

Das Repo bildet einen experimentellen Arbeitsstand für `fakten-stammtisch.de` ab:

- als privates Experiment und nicht als offen kuratiertes Community-Projekt
- als bewusst vollständig KI-generiertes Projekt, sowohl im Code als auch in den vorhandenen Inhalten
- als Produkt-Prototyp für eine statische, quellengestützte Argumentationsseite
- als Redaktionssystem auf Dateibasis mit klar definiertem JSON-Schema
- als Beispiel dafür, wie Regeln, Skills, Build-Skripte und KI-gestützte Qualitätsprüfungen in einem gemeinsamen Workflow zusammenspielen

Wichtig dabei: Die Kernanwendung bleibt bewusst eine statische SPA. Für das Hosting-Setup liegen zusätzlich kleine PHP-Helfer in [`public/api/feedback.php`](/home/mdeutschel/github/facts/public/api/feedback.php) und [`public/og.php`](/home/mdeutschel/github/facts/public/og.php), aber es gibt kein separates Backend-System, keine Datenbank und kein SSR-Framework.

## Tech-Stack

- React 19 + ReactDOM 19
- TypeScript 5.9 im Strict Mode
- Vite 8
- MUI Material 7 + MUI Icons 7
- Emotion 11
- React Router 7
- Recharts 3, für einzelne Charts lazy geladen
- ESLint 9 mit Flat Config

## Funktionen

- Themenübersicht auf der Startseite
- Themenseiten mit Tabs für `Argumente` und `Fakten`
- clientseitige Volltextsuche über alle Themen
- strukturierte Quellenverweise pro Inhaltsblock
- SEO-Metadaten, JSON-LD und Sitemap-Generierung
- LLM-Exports als `llms.txt`, `llms-full.txt` und themenspezifische Textdateien
- Feedback-Formular für neue Themen oder neue Argumente

## Verzeichnisstruktur

```text
src/
  App.tsx                    Router und Seitenstruktur
  main.tsx                   Einstiegspunkt
  theme.ts                   MUI-Theme und Hilfsfunktionen
  types/index.ts             Zentrales Datenmodell
  hooks/                     Laden der Topics und Suchindex
  pages/                     Home, TopicPage, SearchPage, Impressum, Feedback
  components/
    layout/                  AppShell, SearchBar, Footer
    home/                    TopicCard
    topic/                   FactSection, ArgumentCard
    search/                  Suchergebnisliste
    seo/                     PageMeta
    visualizations/          Präsentationskomponenten für Content-Blöcke
  content/                   Texte für die Startseite

public/
  data/                      Themen-JSONs und generierter Topic-Index
  llms/                      generierte Plaintext-Exporte pro Thema
  api/feedback.php           Formular-Endpoint für das Hosting-Setup
  og.php                     serverseitige OG-/Fallback-Ausgabe

scripts/
  generate-topic-index.mjs   erzeugt public/data/topics.json
  generate-seo.mjs           erzeugt Sitemap, LLM-Dateien und HTML-Fallbacks
  setup-cursor-rules.sh      spiegelt .claude/rules nach .cursor/rules
```

## Lokale Entwicklung

### Voraussetzungen

- Node.js mit aktuellem LTS-Stand
- npm

### Installation

```bash
npm ci
```

### Wichtige Befehle

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

Zusätzlich:

```bash
bash scripts/setup-cursor-rules.sh
```

Das Skript legt Symlinks von `.cursor/rules/*.mdc` auf die eigentlichen Regeln in `.claude/rules/`. Damit bleibt `.claude/rules/` die Single Source of Truth.

## Datenmodell

Die Inhalte liegen in `public/data/*.json`. Das Schema steckt zentral in [`src/types/index.ts`](/home/mdeutschel/github/facts/src/types/index.ts).

Wichtige Punkte:

- `topics.json` ist ein generierter Index über alle Themen
- jedes Thema hat `sections`, `arguments` und `sources`
- `ContentBlock` ist als Discriminated Union modelliert
- unterstützte Blocktypen sind:
  `fact`, `text`, `table`, `stat_grid`, `comparison`, `range_bar`, `bar_chart`, `line_chart`, `timeline`, `progress_stack`
- `sourceRefs` verknüpfen konkrete Inhaltsblöcke mit Einträgen aus `sources`

Ein neues Thema anzulegen heißt praktisch: eine neue `public/data/{topicId}.json` erstellen und anschließend den Build laufen lassen.

## Build-Pipeline

`npm run build` macht mehr als nur einen Vite-Build:

1. `generate-topic-index.mjs` baut `public/data/topics.json`
2. `generate-seo.mjs` erzeugt:
   - `public/sitemap.xml`
   - `public/llms.txt`
   - `public/llms-full.txt`
   - `public/llms/{topicId}.txt`
   - HTML-Fallback-Inhalte in `index.html`
3. TypeScript-Build mit `tsc -b`
4. Vite-Production-Build nach `dist/`
5. Kopie der Apache-Konfiguration nach `dist/.htaccess`

Das Projekt ist auf statisches Hosting mit Apache-Fallback ausgelegt. Source Maps sind im Production-Build deaktiviert.

## KI-Workflow im Repository

Ein zentraler Teil des Experiments ist nicht nur die Seite selbst, sondern der Weg dorthin.

Hier geht es ausdrücklich um ein vollständig KI-getriebenes Setup: Der vorhandene Code und die vorhandenen Inhalte sind bewusst KI-generiert und werden in diesem Repository als Teil des Versuchs weiterentwickelt, überprüft und in eine konsistente Pipeline überführt.

Das Repo enthält dafür drei Ebenen:

### 1. Regeln

In `.claude/rules/` liegen projektspezifische Vorgaben für:

- TypeScript
- React-Komponenten
- Visualisierungen
- das Topic-JSON-Schema

Diese Regeln können über `scripts/setup-cursor-rules.sh` auch in `.cursor/rules/` verfügbar gemacht werden.

### 2. Skills

In `.claude/skills/` sind wiederverwendbare KI-Workflows hinterlegt:

- `create-topic`: erstellt ein neues Thema end-to-end
- `review-content`: prüft Framing, argumentative Qualität und intellektuelle Redlichkeit
- `verify-sources`: verifiziert Quellen, URLs und Datenpunkte

### 3. Zusammenspiel

Der beabsichtigte Arbeitsfluss sieht so aus:

1. Thema strukturieren und recherchieren
2. JSON im bestehenden Schema erzeugen oder erweitern
3. Inhalte argumentativ prüfen
4. Quellen online verifizieren
5. Build laufen lassen und generierte Artefakte aktualisieren

Genau dadurch taugt das Repo auch als Anschauungsbeispiel dafür, wie einzelne KI-Komponenten nicht isoliert, sondern als abgestimmte Pipeline zusammenarbeiten können.

## Themen bearbeiten oder erweitern

Bei Änderungen an Topic-Inhalten ist der erwartete Ablauf:

1. Topic-JSON bearbeiten
2. `review-content` anwenden
3. `verify-sources` anwenden
4. `npm run build`

Auto-generierte Dateien sollten nicht manuell gepflegt werden, insbesondere:

- `public/data/topics.json`
- `public/sitemap.xml`
- `public/llms.txt`
- `public/llms-full.txt`
- `public/llms/*.txt`

## Deployment

- GitHub Actions baut das Projekt bei Push auf `main`
- das Ergebnis wird per FTP auf das Hosting deployt
- das Hosting ist für Apache mit SPA-Fallback eingerichtet

## Grenzen

- kein Backend oder SSR-Framework für die Kern-App hinzufügen
- keine neuen Abhängigkeiten ohne Absprache
- das JSON-Schema in `public/data/*.json` nicht stillschweigend ändern
- keine `any`-Typen einführen

## Definition of Done

### Für Code-Änderungen

- `npm run lint` läuft mit Exit-Code 0
- `npm run build` läuft mit Exit-Code 0
- es werden keine `any`-Typen eingeführt

### Für Inhaltsänderungen an Topics

- `npm run build` läuft mit Exit-Code 0
- `review-content` hinterlässt keine offenen `✗ PROBLEM`-Befunde
- `verify-sources` hinterlässt keine offenen `✗ FALSCH`-Befunde
