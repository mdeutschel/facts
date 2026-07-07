---
name: update-topic
description: Aktualisiert oder erweitert ein bestehendes Themen-Factsheet — Daten auffrischen, Sektionen ergänzen, Argumente überarbeiten — inklusive Recherche, Inline-Verifizierung und beiden Quality Gates. Verwenden, wenn ein bestehendes Topic-JSON inhaltlich geändert werden soll.
argument-hint: "[topicId] [Änderungsauftrag]"
allowed-tools: Read, Glob, Grep, Edit, WebFetch, WebSearch, Agent, Bash(npm run lint), Bash(npm run build), Bash(node *), Bash(curl *)
---

# Thema aktualisieren: `public/data/$ARGUMENTS[0].json`

Workflow für Änderungen an bestehenden Topic-Factsheets. Nutzt dieselben Qualitätsstandards wie `create-topic`, aber ohne den Scoping-Overhead einer Neuanlage.

Änderungsauftrag: $ARGUMENTS

## Arbeitsmodus: Autonome Abarbeitung

Der Workflow läuft **standardmäßig vollständig autonom** durch. Zwischenberichte dokumentieren Entscheidungen; sie sind keine Freigabe-Gates. Angehalten wird nur, wenn der Änderungsauftrag mehrdeutig ist und die Varianten zu inhaltlich gegensätzlichen Ergebnissen führen würden, oder wenn der Build nach 2 Korrekturversuchen fehlschlägt.

## Ablauf

### 1. Bestand erfassen

- `public/data/$ARGUMENTS[0].json` vollständig lesen; `src/types/index.ts` für das Schema
- Betroffene Sektionen, Argumente und Quellen identifizieren
- `lastUpdated` und zeitgebundene Angaben notieren (Jahreszahlen, „aktuell", Preise, Prognosen) — bei Datenaktualisierungen sind das die Prüfkandidaten

### 2. Recherche mit Inline-Verifizierung

Für neue oder zu aktualisierende Datenpunkte gilt Phase 2 aus `.claude/skills/create-topic/SKILL.md` vollständig — insbesondere:

- Quellenhierarchie (amtliche Statistiken vor Instituten vor Stiftungen/Verbänden vor Journalismus)
- **Unabhängigkeitsregel**: zentrale Datenpunkte nicht allein auf interessengebundene Quellen stützen
- Jede URL sofort verifizieren (✓ / ⚠ / ❓); nur ✓- und korrigierte ⚠-Datenpunkte verwenden
- Sonderfälle (PDF via curl + Read, Paywall, Wayback für tote URLs, widersprüchliche Quellen) nach `.claude/skills/verify-sources/SKILL.md`

### 3. Bearbeiten mit Autor-Leitplanken

- Die Checklisten „Neues Argument" und „Neuer Abschnitt" aus `.claude/skills/review-content/SKILL.md` sind kanonisch — auch für geänderte Bestandsinhalte anwenden
- Blocktyp-Auswahl nach `.claude/skills/create-topic/reference.md` (alle 13 Typen, inkl. `myth_fact`, `pictograph`, `target_progress`)
- Ersetzte Zahlen konsistent nachziehen: auch Fließtext, `keyStats`, `sourceNote`, Argument-Antworten und `relatedSections` prüfen — nicht nur den einen Block
- Nicht mehr gestützte `sourceRefs` entfernen; neue Quellen ins `sources`-Array (`id`, `label`, `url`)
- `lastUpdated` auf das heutige Datum setzen (`YYYY-MM-DD`)
- Keine deutschen Anführungszeichen „…" in JSON-Strings (siehe `.claude/rules/data-schema.md`); nach dem Schreiben `node -e "JSON.parse(...)"` ausführen

### 4. Quality Gates

```
/review-content $ARGUMENTS[0]
```

Bei geänderten Daten oder Quellen zusätzlich:

```
/verify-sources $ARGUMENTS[0]
```

Alle ✗-Befunde beheben, ⚠-Befunde soweit sinnvoll adressieren.

### 5. Validierung & Abschlussbericht

```bash
npm run lint && npm run build
```

Abschlussbericht ausgeben: geänderte Sektionen/Argumente, alte → neue Zahlen, neue/entfernte Quellen, Ergebnis der Quality Gates.

## Regeln

- **Autonome Abarbeitung** (siehe oben) — Berichte dokumentieren, Gates laufen durch
- **Keine halluzinierten Daten** — jede neue Zahl aus einer verifizierten Quelle
- **Kein Strukturbruch** — `public/data/*.json`-Struktur nicht ändern ohne `src/types/index.ts` anzupassen (siehe AGENTS.md)
- **Minimalinvasiv** — nur ändern, was der Auftrag verlangt oder was durch die Änderung inkonsistent würde; keine ungefragten Umbauten an unbeteiligten Sektionen
