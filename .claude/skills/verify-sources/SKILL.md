---
name: verify-sources
description: Alle Quellen und Daten in einem Topic-Factsheet-JSON gegen tatsächliche Online-Quellen prüfen. Verwenden, wenn URLs verifiziert, Datenrichtigkeit geprüft oder sourceRefs validiert werden sollen.
argument-hint: "[topicId]"
allowed-tools: Read, Glob, Grep, Bash, WebFetch, WebSearch, Agent, TodoWrite, AskUserQuestion, Edit
---

# Quellenverifizierung für `public/data/$ARGUMENTS.json`

Topic-JSON-Dateien (`public/data/*.json`) enthalten ein `sources`-Array und `sourceRefs` in Content-Blöcken. Alle Quellen MÜSSEN online verifizierbar sein, um halluzinierte Daten zu vermeiden.

## Wann ausführen

- Nach Erstellung oder wesentlicher Bearbeitung einer Topic-JSON
- Beim Hinzufügen von `sourceRefs` zu Content-Blöcken
- Auf ausdrückliche Anfrage (`/verify-sources {topicId}`)

## 6-Phasen-Ablauf

1. **Analyse** — `public/data/$ARGUMENTS.json` lesen, das `sources`-Array und alle `sourceRefs` aus Content-Blöcken extrahieren. Zuordnen, welche Behauptungen welche Quellen referenzieren.
2. **URL-Beschaffung** — Für jede Quelle OHNE `url`-Feld: im Web nach der korrekten URL suchen. Suchen parallel über Explore-Subagents ausführen.
3. **Quellenverifizierung** — Für jede Quelle MIT URL: URL abrufen, alle konkreten Zahlen und Datenpunkte extrahieren. Abrufe parallel über Explore-Subagents ausführen.
4. **Abgleich** — Für jeden Content-Block mit `sourceRefs` jede Behauptung einordnen:
   - ✓ **VERIFIZIERT**: stimmt mit Quellendaten überein
   - ⚠ **ABWEICHUNG**: Zahl weicht ab (Erwartung vs. Ist dokumentieren)
   - ❓ **NICHT VERIFIZIERBAR**: Quelle enthält diese Info auf ihrer Webseite nicht
   - ✗ **FALSCH**: Quelle widerspricht der Behauptung
5. **Bericht** — Strukturierten Bericht dem Nutzer präsentieren, fragen, ob Korrekturen angewendet werden sollen.
6. **Korrekturen** — Nach Zustimmung des Nutzers: fehlende URLs ergänzen, falsche Zahlen korrigieren, unzutreffende `sourceRefs` entfernen, Fließtext/Argumente an korrigierte Daten anpassen. `npm run lint && npm run build` ausführen.

## Regeln

- **Keine Halluzinationen**: Nur Zahlen verwenden, die tatsächlich aus Online-Quellen extrahiert wurden
- **Konservativ**: `sourceRef` eher entfernen als unverifizierte Daten beibehalten
- **Transparenz**: Jede Änderung dokumentieren
- **Quellenintegrität**: Niemals eine Quelle erfinden oder eine URL raten
- **Parallelität**: Parallele Subagents für unabhängige Quellenrecherchen nutzen

## Referenz

Siehe `${CLAUDE_SKILL_DIR}/reference.md` für korrekt strukturierte Beispiele aller Content-Block-Typen (stat_grid, comparison, table, timeline, fact) mit passenden `sourceRefs`.
