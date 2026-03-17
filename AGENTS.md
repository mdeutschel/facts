# Fakten-Stammtisch — Agent Instructions

## Project Overview

German-language static React SPA providing fact-based arguments for informal discussions.
Mobile-first, no backend, JSON data fetched at runtime.

## Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| React + ReactDOM | 19.x | UI Framework |
| MUI Material + Icons | 7.x | Component Library |
| Emotion | 11.x | Styling (MUI dep) |
| react-router-dom | 7.x | Client-side routing |
| Recharts | 3.x | Charts (lazy-loaded) |
| Vite | 8.x | Build tool |
| TypeScript | 5.9 | Language (strict mode) |
| ESLint | 9.x | Linting (flat config) |

## Commands

- Install: `npm ci`
- Dev server: `npm run dev`
- Build: `npm run build` (runs `tsc -b && vite build && cp .htaccess dist/`)
- Lint: `npm run lint`
- Preview: `npm run preview`

## Project Structure

```
src/
  main.tsx              # Entry point
  App.tsx               # Router setup
  theme.ts              # MUI theme (primary #37474f, secondary #00897b)
  types/index.ts        # All TypeScript interfaces (centralized)
  hooks/                # Custom hooks (useTopics, useSearch)
  pages/                # Route-level components (Home, TopicPage, SearchPage)
  components/
    layout/             # AppShell, SearchBar
    home/               # TopicCard
    topic/              # FactSection, ArgumentCard
    search/             # SearchResults
    visualizations/     # StatGrid, ComparisonView, RangeBarChart, etc.
public/data/            # JSON factsheets loaded at runtime
input/                  # Source markdown (reference material, not deployed)
```

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Home | Topic cards overview |
| `/thema/:topicId` | TopicPage | Topic detail (Facts + Arguments tabs) |
| `/suche?q=...` | SearchPage | Search results |

## Data Architecture

- Topic index: `public/data/topics.json`
- Per-topic data: `public/data/{topicId}.json`
- Adding a topic = new JSON file + entry in `topics.json`, no code changes needed
- Schema defined in `src/types/index.ts` — ContentBlock uses discriminated unions (`type` field)
- Client-side search index built at runtime from all topic JSONs

## Code Conventions

### TypeScript
- Strict mode enabled, never use `any`
- All shared interfaces in `src/types/index.ts`
- Props interfaces defined inline in component files (`interface XProps {}`)
- No semicolons, single quotes
- Discriminated unions for variant types (see `ContentBlock`)

### React + MUI
- Functional components only
- Default exports for components and pages
- Named exports for hooks and utilities
- MUI imports: individual imports (`import Box from '@mui/material/Box'`), not destructured
- Styling via `sx` prop — no separate style files or styled-components
- `React.lazy()` for heavy components (e.g., Recharts-based charts)
- Custom hooks return `{ data, loading, error }` pattern

### Naming
- Components/Pages: `PascalCase.tsx`
- Hooks: `use*.ts` with named export
- Types: `PascalCase` (no `I` prefix)
- Functions/variables: `camelCase`

## Deployment

- CI: GitHub Actions on push to `main` → build → FTP deploy via lftp
- Hosting: Apache with `.htaccess` SPA fallback
- No source maps in production

## Boundaries — Do NOT

- Do not add a backend or SSR — this is a static SPA
- Do not add dependencies without discussing first
- Do not modify `public/data/*.json` structure without updating `src/types/index.ts`
- Do not use `any` — use `unknown` with type narrowing
- Do not force push or rewrite git history
- Do not commit `.env`, credentials, or secrets
- Do not add tests unless explicitly asked (no test framework configured yet)

## When Blocked

- If build fails after 2 attempts: stop and report the full error output
- If a type error is unclear: check `src/types/index.ts` first
- If MUI component behavior is unexpected: check MUI v7 docs (breaking changes from v6)

## Source Verification

Topic JSON sources MUST be online-verifiable. Use `/verify-sources {topicId}` — full procedure is in the skill definition (`.claude/skills/verify-sources/SKILL.md`).

## Definition of Done

A task is complete when:
1. `npm run lint` exits 0
2. `npm run build` exits 0
3. No `any` types introduced
4. Changes follow existing code patterns documented above
