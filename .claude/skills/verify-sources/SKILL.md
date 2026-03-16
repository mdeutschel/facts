---
name: verify-sources
description: Verify all sources and data in a topic factsheet JSON against actual online sources. Use when sources need URL verification, data accuracy checks, or sourceRef validation.
argument-hint: "[topicId]"
allowed-tools: Read, Glob, Grep, Bash, WebFetch, WebSearch, Agent, TodoWrite, AskUserQuestion, Edit
---

# Quellenverifizierung

Führe das **Source Verification Procedure** aus `AGENTS.md` für die Topic-Datei `public/data/$ARGUMENTS.json` durch.

Nutze parallele Explore-Subagents für Phase 2 (URL-Beschaffung) und Phase 3 (Quellenverifizierung).
