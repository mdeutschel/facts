---
name: verify-sources
description: Verify all sources and data in a topic factsheet JSON against actual online sources. Use when sources need URL verification, data accuracy checks, or sourceRef validation.
argument-hint: "[topicId]"
allowed-tools: Read, Glob, Grep, Bash, WebFetch, WebSearch, Agent, TodoWrite, AskUserQuestion, Edit
---

# Quellenverifizierung für Topic-Factsheets

Verifiziere alle Quellen und Daten in `public/data/$ARGUMENTS.json` gegen die tatsächlichen Online-Quellen.

## Phase 1: Analyse

1. Lies `public/data/$ARGUMENTS.json`
2. Extrahiere `sources`-Array und alle `sourceRefs` aus Content-Blöcken
3. Erstelle Übersicht:
   - Quellen mit/ohne URLs
   - Content-Blöcke → referenzierte Quellen
   - Konkrete Zahlen/Behauptungen pro Block

## Phase 2: URL-Beschaffung (parallel)

Starte für **jede Quelle ohne URL** einen Explore-Subagent, der:
- Den Quellentitel im Web sucht
- Die korrekte URL findet
- Key Data Points extrahiert

Alle Subagents **parallel** starten.

## Phase 3: Quellenverifizierung (parallel)

Starte für **jede Quelle mit URL** (inkl. neu gefundener) einen Explore-Subagent, der:
- Die URL abruft (WebFetch/WebSearch)
- Alle konkreten Zahlen und Datenpunkte extrahiert

Alle Subagents **parallel** starten.

## Phase 4: Abgleich

Für jeden Content-Block mit sourceRefs, klassifiziere jede Behauptung:
- **VERIFIZIERT** ✓: Zahl/Aussage stimmt mit Quelle überein
- **ABWEICHUNG** ⚠: Zahl weicht ab (dokumentiere Soll vs. Ist)
- **NICHT VERIFIZIERBAR** ❓: Quelle enthält die Info nicht (von Webseite aus)
- **FALSCH** ✗: Quelle widerspricht der Behauptung

## Phase 5: Bericht

Erstelle strukturierten Bericht und frage den User ob Korrekturen vorgenommen werden sollen.

## Phase 6: Korrekturen (nach User-Bestätigung)

1. Fehlende URLs in `sources`-Sektion ergänzen
2. Falsche Zahlen korrigieren (nur wenn durch Quelle eindeutig belegt)
3. Falsche sourceRefs entfernen
4. Fließtexte und Argument-Responses an korrigierte Zahlen anpassen
5. `npm run lint && npm run build` ausführen

## Regeln

- **KEINE Halluzinationen**: Nur Zahlen verwenden die tatsächlich aus Online-Quelle extrahiert wurden
- **Konservativ**: Im Zweifel sourceRef entfernen statt falsche Daten stehen lassen
- **Transparenz**: Jede Änderung dokumentieren
- **Quellenintegrität**: Nie Quelle erfinden oder URL raten
- **Parallel**: Subagents für unabhängige Quellen immer parallel starten
