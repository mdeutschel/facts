---
description: JSON-Datenschema und Konventionen für Themen-Factsheets
globs: public/data/**/*.json, input/**
alwaysApply: false
paths:
  - "public/data/**/*.json"
  - "input/**"
---

# Datenschema

Topic-JSON-Dateien in `public/data/` folgen dem Schema in `src/types/index.ts`.

## ContentBlock-Typen

Jede Section enthält `content: ContentBlock[]`. Gültige Typen:
`fact`, `text`, `table`, `stat_grid`, `comparison`, `range_bar`, `bar_chart`, `line_chart`, `timeline`, `progress_stack`, `myth_fact`, `pictograph`, `target_progress`

Jeder Typ hat eigene Pflichtfelder — siehe die Discriminated Union in `src/types/index.ts`.

## Konventionen

- `id`-Felder: kebab-case (`status-quo`, `foerderung-2026`)
- `icon` in TopicMeta: MUI-Icon-Name als String
- `lastUpdated`: Format `YYYY-MM-DD`
- Quellen: `label` und `url` sind Pflicht — jede Quelle muss online verifizierbar sein. Einzige Ausnahme: nicht online verfügbare Publikationen (Print), dann Ausgabe/Jahr im `label` vermerken
- Zentrale Datenpunkte (highlight-Fakten, `keyStats`) nicht allein auf interessengebundene Quellen (Verbände, Stiftungen, Auftragsstudien) stützen — unabhängige Zweitquelle oder Herkunftsvermerk im Text
- Argumente: `keywords`-Array ermöglicht Suchmatching, `relatedSections` verlinkt zu Section-IDs
- `verdict` (optional): `false` | `mostly-false` | `misleading` | `outdated` | `lacks-context` | `partially-true` | `mostly-true` | `true` — nur für empirisch prüfbare Claims; normative Werturteile bekommen kein Verdict (siehe `review-content`, Dim 9a)

## Anführungszeichen in JSON-Strings

Deutsche Anführungszeichen „…" (U+201E / U+201C) **niemals** in JSON-String-Werten verwenden. Das schließende `"` (U+201C) wird beim Schreiben durch Tools zu ASCII `"` (U+0022) und bricht die JSON-Syntax.

**Stattdessen:** Deutsche einfache Anführungszeichen ‚…' (U+201A / U+2018) verwenden.

```
✗ "value": "RdR: Sonderzeichen „nicht im Kernbestand""
✓ "value": "RdR: Sonderzeichen ‚nicht im Kernbestand'"
```

Nach dem Schreiben einer JSON-Datei immer validieren: `node -e "JSON.parse(require('fs').readFileSync('FILE','utf8'))"` bevor `npm run build` aufgerufen wird.
