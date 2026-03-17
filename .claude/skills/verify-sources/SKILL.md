---
name: verify-sources
description: Verify all sources and data in a topic factsheet JSON against actual online sources. Use when sources need URL verification, data accuracy checks, or sourceRef validation.
argument-hint: "[topicId]"
allowed-tools: Read, Glob, Grep, Bash, WebFetch, WebSearch, Agent, TodoWrite, AskUserQuestion, Edit
---

# Quellenverifizierung für `public/data/$ARGUMENTS.json`

Topic JSON files (`public/data/*.json`) contain a `sources` array and `sourceRefs` in content blocks. All sources MUST be online-verifiable to prevent hallucinated data.

## When to run
- After creating or substantially editing a topic JSON
- When adding `sourceRefs` to content blocks
- On explicit request (`/verify-sources {topicId}`)

## 6-Phase Process

1. **Analyse** — Read `public/data/$ARGUMENTS.json`, extract `sources` array and all `sourceRefs` from content blocks. Map which claims reference which sources.
2. **URL-Beschaffung** — For each source WITHOUT a `url` field: search the web for the correct URL. Run searches in parallel via Explore-Subagents.
3. **Quellenverifizierung** — For each source WITH a URL: fetch the URL, extract all concrete numbers and data points. Run fetches in parallel via Explore-Subagents.
4. **Abgleich** — For each content block with sourceRefs, classify every claim:
   - ✓ **VERIFIZIERT**: matches source data
   - ⚠ **ABWEICHUNG**: number differs (document expected vs. actual)
   - ❓ **NICHT VERIFIZIERBAR**: source doesn't contain this info on its web page
   - ✗ **FALSCH**: source contradicts the claim
5. **Bericht** — Present structured report to user, ask whether to apply corrections.
6. **Korrekturen** — After user confirmation: add missing URLs, fix wrong numbers, remove false sourceRefs, update prose/arguments to match corrected data. Run `npm run lint && npm run build`.

## Rules
- **No hallucinations**: Only use numbers actually extracted from online sources
- **Conservative**: Remove sourceRef rather than keep unverified data
- **Transparency**: Document every change
- **Source integrity**: Never invent a source or guess a URL
- **Parallelism**: Use parallel subagents for independent source lookups

## Reference

See `${CLAUDE_SKILL_DIR}/reference.md` for correctly structured examples of all content block types (stat_grid, comparison, table, timeline, fact) with proper sourceRefs.
