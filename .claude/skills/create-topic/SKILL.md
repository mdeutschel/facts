---
name: create-topic
description: Erstellt ein vollständiges neues Themen-Factsheet von Grund auf, inklusive Recherche, JSON-Erstellung und Qualitätssicherung. Verwenden, wenn ein neues Thema zum Fakten-Stammtisch hinzugefügt werden soll.
argument-hint: "[topicId] [topicTitle]"
---

# Neues Thema erstellen: `public/data/$ARGUMENTS[0].json`

End-to-End-Workflow für ein neues Fakten-Stammtisch-Thema. Orchestriert Recherche mit integrierter Quellenverifizierung, Inhaltserstellung und die bestehenden Quality-Gate-Skills (`review-content`, `verify-sources`).

## Voraussetzungen

- `src/types/index.ts` lesen für das `Topic`-Schema
- `${CLAUDE_SKILL_DIR}/reference.md` lesen für Strukturvorlagen und Qualitäts-Benchmarks

## 6-Phasen-Prozess

### Phase 1: Themenanalyse & Scoping

1. **Reichweite verstehen** — Was ist die Kerndebatte? Was macht das Thema stammtischtauglich?
2. **5–10 Teilaspekte identifizieren**, die jeweils eine eigene Sektion verdienen (z. B. für „Wohnen": Mietentwicklung, Neubau, Sozialwohnungen, Mietpreisbremse, Enteignungsdebatte, internationaler Vergleich)
3. **6–12 typische Stammtisch-Behauptungen sammeln** — diese werden zu `arguments`
4. **ContentBlock-Mix planen** — Jedes Thema sollte mindestens 3–4 verschiedene Block-Typen für visuelle Abwechslung nutzen. Siehe reference.md für Auswahl-Hilfe.
5. **Gliederung dem Nutzer vorlegen** bevor es weitergeht:

```
Geplante Struktur für "{topicTitle}":

Sektionen:
1. {section-title} — {Kurzbeschreibung}, geplante Blöcke: stat_grid, fact
2. {section-title} — ...
...

Stammtisch-Argumente:
1. "{claim}" — Kernaussage der Antwort: ...
2. "{claim}" — ...
...

Soll ich mit der Recherche starten?
```

### Phase 2: Quellenrecherche mit Inline-Verifizierung

Belastbare, verifizierbare Quellen für jede geplante Sektion recherchieren **und sofort verifizieren**. Parallele Subagents verwenden.

**Quellenhierarchie** (höhere bevorzugen):
1. Amtliche Statistiken (Destatis, Eurostat, Bundesministerien)
2. Forschungsinstitute (Fraunhofer, DIW, ifo, IW Köln, Bertelsmann Stiftung)
3. Offizielle Verbände und Körperschaften (GDV, ADAC, BDA, DGB)
4. Peer-reviewed Studien und Meta-Analysen
5. Qualitätsjournalismus (nur wenn Originaldaten zitiert werden)

**Pro Sektion sammeln und inline verifizieren:**
- 2–4 konkrete Datenpunkte mit exakten Zahlen
- Die Quell-URL für jeden Datenpunkt
- Das Veröffentlichungsdatum (Daten der letzten 2 Jahre bevorzugen)

**Inline-Verifizierung — jede URL sofort prüfen:**

Für jeden recherchierten Datenpunkt direkt im Anschluss:

1. **URL abrufen** — Quell-URL per WebFetch laden
2. **Zahlen extrahieren** — die konkreten Datenpunkte aus dem Seiteninhalt herausziehen
3. **Abgleich** — jeden notierten Wert gegen die extrahierten Daten prüfen und einordnen:
   - ✓ **VERIFIZIERT**: Zahl stimmt mit Quelle überein → in Ergebnisliste aufnehmen
   - ⚠ **ABWEICHUNG**: Zahl weicht ab → korrigierte Zahl aus Quelle übernehmen
   - ✗ **NICHT VERIFIZIERBAR**: URL nicht erreichbar oder Zahl nicht auffindbar → als Lücke markieren, alternative Quelle suchen

**Gate:** Nur Datenpunkte mit Status ✓ oder ⚠ (korrigiert) kommen in die Ergebnisliste. ✗-Datenpunkte brauchen eine Ersatzquelle oder werden gestrichen.

**Nach Abschluss aller Sektionen — Quellenbericht dem Nutzer vorlegen:**

```
Recherche-Ergebnis für "{topicTitle}":

Verifizierte Quellen:
✓ {source-id} — {Kernaussage} (Quelle: {url})
✓ {source-id} — ...
⚠ {source-id} — korrigiert: {alt} → {neu} (Quelle: {url})

Offene Lücken:
✗ Sektion "{section}" — kein belastbarer Datenpunkt für {Aspekt} gefunden

Soll ich mit der Strukturierung fortfahren oder zuerst Lücken schließen?
```

**Quellen-ID-Konvention:** `{herausgeber-kebab}-{themen-stichwort}` (z. B. `destatis-mietpreisindex-2025`)

### Phase 3: Strukturierung

Gesammelte Daten der Sektionsstruktur zuordnen:

1. Für jede Sektion ContentBlock-Typen wählen:
   - Einleitender Kontext → `text`-Block
   - Kernzahlen → `stat_grid` (max. 4 Einträge) oder `fact`-Blöcke
   - Vergleiche → `comparison` oder `range_bar`
   - Zeitreihen → `timeline`, `line_chart` oder `bar_chart`
   - Detaildaten → `table`
   - Aufschlüsselungen → `progress_stack`

2. Für jedes Argument festlegen:
   - Welche Sektionen die Belege liefern (`relatedSections`)
   - Welche Stichwörter jemand benutzen würde, der diese Behauptung aufstellt (`keywords`, 4–6 pro Argument)

3. Das `sources`-Array mit `id`, `label` und `url` für jede Quelle anlegen

### Phase 4: JSON-Erstellung

`public/data/{topicId}.json` entsprechend dem `Topic`-Interface schreiben.

**Autor-Modus-Leitplanken** aus `review-content` beim Schreiben anwenden:

- [ ] Jede Argument-Antwort erkennt den Wahrheitskern an (Dim 1)
- [ ] sourceRefs stützen direkt die angehängte Behauptung (Dim 2)
- [ ] Berechnungen zeigen Annahmen explizit (Dim 3)
- [ ] Fakten und Interpretation klar getrennt (Dim 4)
- [ ] Stärkstes Gegenargument pro Argument adressiert (Dim 5)
- [ ] Keine absolutistische Sprache (Dim 6)
- [ ] Antwort beantwortet direkt die Behauptung (Dim 7)

**Strukturregeln:**
- `id`-Felder: kebab-case
- `lastUpdated`: heutiges Datum im Format `YYYY-MM-DD`
- Jeder `sourceRef` muss im `sources`-Array existieren
- `highlight: true` auf max. 1–2 Fakten pro Sektion (die wichtigsten)

### Phase 5: Quality Gate

Beide Quality-Gate-Skills nacheinander auf das neue Thema anwenden.

**Schritt 1 — Inhaltliche Qualitätsprüfung:**

```
/review-content {topicId}
```

Alle ✗ PROBLEM-Befunde beheben. ⚠ VERBESSERBAR-Befunde soweit möglich adressieren.

**Schritt 2 — Quellenverifizierung (Sicherheitsnetz):**

```
/verify-sources {topicId}
```

Die Inline-Verifizierung in Phase 2 sollte die meisten Fehler bereits abgefangen haben. Dieser Durchlauf stellt sicher, dass auch beim Schreiben der JSON in Phase 4 keine neuen Fehler eingeflossen sind (z. B. verrutschte sourceRefs, versehentlich geänderte Zahlen). Verbleibende Abweichungen korrigieren, nicht verifizierbare sourceRefs entfernen.

### Phase 6: Integration & Validierung

1. **Validieren** — `npm run build` generiert automatisch den `topics.json`-Index aus der neuen Topic-Datei:
   ```bash
   npm run lint && npm run build
   ```

2. **Dem Nutzer berichten**, was erstellt wurde

## Regeln

- **Nutzerbestätigung** nach Phase 1 (Gliederung), nach Phase 2 (Quellenbericht) und vor Phase 6 (Integration)
- **Keine halluzinierten Daten** — jede Zahl muss aus einer verifizierten Quelle stammen
- **Ausgewogenes Framing** — die Seite argumentiert mit guten Quellen, muss aber fair bleiben
- **Konservative Sprache** — bei Unsicherheit abschwächen, niemals übertreiben
- **Visuelle Vielfalt** — mindestens 3 verschiedene ContentBlock-Typen pro Thema
- **Mindestumfang** — mindestens 5 Sektionen, 6 Argumente, 8 Quellen

## Referenz

Siehe `${CLAUDE_SKILL_DIR}/reference.md` für Strukturvorlagen, ContentBlock-Typ-Auswahl und Qualitäts-Benchmarks aus bestehenden Themen.
