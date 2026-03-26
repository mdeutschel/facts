---
paths:
  - "public/data/**/*.json"
  - "input/**"
---

# Datenschema

Topic-JSON-Dateien in `public/data/` folgen dem Schema in `src/types/index.ts`.

## ContentBlock-Typen

Jede Section enthält `content: ContentBlock[]`. Gültige Typen:
`fact`, `text`, `table`, `stat_grid`, `comparison`, `range_bar`, `bar_chart`, `line_chart`, `timeline`, `progress_stack`

Jeder Typ hat eigene Pflichtfelder — siehe die Discriminated Union in `src/types/index.ts`.

## Konventionen

- `id`-Felder: kebab-case (`status-quo`, `foerderung-2026`)
- `icon` in TopicMeta: MUI-Icon-Name als String
- `lastUpdated`: Format `YYYY-MM-DD`
- Quellen: immer `label` angeben, `url` ist optional
- Argumente: `keywords`-Array ermöglicht Suchmatching, `relatedSections` verlinkt zu Section-IDs
