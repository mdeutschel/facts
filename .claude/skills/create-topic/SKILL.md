---
name: create-topic
description: Erstellt ein vollständiges neues Themen-Factsheet von Grund auf, inklusive Recherche, JSON-Erstellung und Qualitätssicherung. Verwenden, wenn ein neues Thema zum Fakten-Stammtisch hinzugefügt werden soll.
argument-hint: "[topicId] [topicTitle]"
---

# Neues Thema erstellen: `public/data/$ARGUMENTS[0].json`

End-to-End-Workflow für ein neues Fakten-Stammtisch-Thema. Orchestriert Recherche, Inhaltserstellung und die bestehenden Quality-Gate-Skills (`review-content`, `verify-sources`).

## Voraussetzungen

- `src/types/index.ts` lesen für das `Topic`-Schema
- `${CLAUDE_SKILL_DIR}/reference.md` lesen für Strukturvorlagen und Qualitäts-Benchmarks

## 7-Phasen-Prozess

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

### Phase 2: Quellenrecherche

Belastbare, verifizierbare Quellen für jede geplante Sektion recherchieren. Parallele Subagents verwenden.

**Quellenhierarchie** (höhere bevorzugen):
1. Amtliche Statistiken (Destatis, Eurostat, Bundesministerien)
2. Forschungsinstitute (Fraunhofer, DIW, ifo, IW Köln, Bertelsmann Stiftung)
3. Offizielle Verbände und Körperschaften (GDV, ADAC, BDA, DGB)
4. Peer-reviewed Studien und Meta-Analysen
5. Qualitätsjournalismus (nur wenn Originaldaten zitiert werden)

**Pro Sektion sammeln:**
- 2–4 konkrete Datenpunkte mit exakten Zahlen
- Die Quell-URL für jeden Datenpunkt
- Das Veröffentlichungsdatum (Daten der letzten 2 Jahre bevorzugen)

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
- `factCount` und `argumentCount` in den Topic-Metadaten setzen

### Phase 5: Qualitätsprüfung

Den `review-content`-Skill auf das neue Thema anwenden:

```
/review-content {topicId}
```

Alle ✗ PROBLEM-Befunde beheben. ⚠ VERBESSERBAR-Befunde soweit möglich adressieren.

### Phase 6: Quellenverifizierung

Den `verify-sources`-Skill auf das neue Thema anwenden:

```
/verify-sources {topicId}
```

Alle Datenabweichungen korrigieren. Fehlende URLs ergänzen. Nicht verifizierbare sourceRefs entfernen.

### Phase 7: Integration & Validierung

1. **In `topics.json` eintragen** — einen `TopicMeta`-Eintrag anhängen:
   ```json
   {
     "id": "{topicId}",
     "title": "{topicTitle}",
     "subtitle": "{subtitle}",
     "icon": "{mui-icon-name}",
     "lastUpdated": "YYYY-MM-DD",
     "factCount": N,
     "argumentCount": M
   }
   ```

2. **Validieren:**
   ```bash
   npm run lint && npm run build
   ```

3. **Dem Nutzer berichten**, was erstellt wurde

## Regeln

- **Nutzerbestätigung** nach Phase 1 (Gliederung) und vor Phase 7 (Integration)
- **Keine halluzinierten Daten** — jede Zahl muss aus einer verifizierten Quelle stammen
- **Ausgewogenes Framing** — die Seite argumentiert mit guten Quellen, muss aber fair bleiben
- **Konservative Sprache** — bei Unsicherheit abschwächen, niemals übertreiben
- **Visuelle Vielfalt** — mindestens 3 verschiedene ContentBlock-Typen pro Thema
- **Mindestumfang** — mindestens 5 Sektionen, 6 Argumente, 8 Quellen

## Referenz

Siehe `${CLAUDE_SKILL_DIR}/reference.md` für Strukturvorlagen, ContentBlock-Typ-Auswahl und Qualitäts-Benchmarks aus bestehenden Themen.
