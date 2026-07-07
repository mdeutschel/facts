# Referenz: Themenstruktur und Qualitätsmaßstäbe

## Themen-JSON-Skelett

```json
{
  "id": "topic-id",
  "title": "Thementitel",
  "subtitle": "Kompakter Untertitel mit Kernaspekten",
  "icon": "mui_icon_name",
  "lastUpdated": "YYYY-MM-DD",
  "keyStats": ["Kennzahl 1", "Kennzahl 2", "Kennzahl 3", "N Argumente"],
  "sourceNote": "Basierend auf Daten von … (Stand Monat Jahr).",
  "sections": [],
  "arguments": [],
  "sources": []
}
```

## Leitfaden zur Wahl von ContentBlock-Typen

Blocktypen danach wählen, was die Daten aussagen:

| Datentyp | Empfohlener Blocktyp | Rendering | Wann einsetzen |
|----------|----------------------|-----------|----------------|
| 2–4 Kennzahlen auf einen Blick | `stat_grid` | MUI (leicht) | Abschnittseröffnungen, Schlagzahlen |
| Ein zentraler Befund | `fact` (mit `highlight: true`) | MUI (leicht) | Max. 1–2 pro Abschnitt |
| Kontext, Einschränkungen, Einordnung | `text` | MUI (leicht) | Rahmen vor/nach Datenblöcken |
| Mehrspaltige Daten | `table` | MUI (leicht) | Detaillierte Aufschlüsselungen, Vergleiche mit >2 Einträgen |
| A-versus-B-Kosten-/Merkmalsvergleich | `comparison` | MUI (leicht) | Zwei Optionen mit Zeilen und Summe |
| Wertebereiche (min–max) | `range_bar` | MUI (leicht) | Kostenspannen, Gehaltsspannen, Schätzungen |
| Rangfolgen | `bar_chart` | Recharts (lazy) | Ländervergleiche, Kategorierankings |
| Entwicklung über die Zeit (wenige Punkte) | `line_chart` | Recharts (lazy) | Trends mit 4–8 Datenpunkten |
| Aufeinanderfolgende Schritte/Meilensteine | `timeline` | MUI (leicht) | Gesetzgebungsfahrpläne, historischer Verlauf |
| Teile eines Ganzen | `progress_stack` | MUI (leicht) | Budgetaufschlüsselungen, prozentuale Zusammensetzung |
| Verbreitete Irrtümer richtigstellen | `myth_fact` | MUI (leicht) | 2–4 Mythos/Fakt-Paare kompakt gegenüberstellen (`items` mit `myth`/`fact`) |
| Ein Anteil, der greifbar werden soll | `pictograph` | MUI (leicht) | „x von y"-Aussagen (`filled`/`total` + `icon`), z. B. „96 von 100 Erbfällen steuerfrei" |
| Ist-Stand gegen Zielwert | `target_progress` | MUI (leicht) | Zielerreichung (`current` vs. `target`), z. B. Ausbau- oder Klimaziele |

**Regel zur visuellen Abwechslung:** Jedes Thema sollte mindestens 3–4 verschiedene Blocktypen nutzen. Themen vermeiden, die nur aus `fact`-Blöcken bestehen. `bar_chart` und `line_chart` nutzen Recharts (lazy-loaded) — sparsam einsetzen, wenn das Thema viele Sektionen hat. Die vollständige, verbindliche Typenliste steht in der Discriminated Union `ContentBlock` in `src/types/index.ts` — bei neuen Typen dort zuerst nachsehen, diese Tabelle kann nachlaufen.

## Muster für den Aufbau von Abschnitten

### Muster A: Daten zuerst (verwendet in heizung/status-quo)
1. `fact`-Blöcke mit den wichtigsten Zahlen (das Wesentliche hervorheben)
2. Optional `text` für Kontext

### Muster B: Kontext, dann Daten (verwendet in buergergeld/regelsatz)
1. `text` zur Einordnung
2. `stat_grid` oder `table` mit konkreten Daten
3. Optional `fact` für eine zentrale Kernaussage

### Muster C: Vergleich (verwendet in heizung/kostenvergleich)
1. `text` mit den Annahmen
2. `comparison` mit den Daten
3. `text` mit Sensitivität/Einschränkungen

### Muster D: Trend (verwendet in heizung/marktentwicklung)
1. `line_chart` oder `bar_chart` für den Trend
2. `table` als barrierefreie Alternative zu denselben Daten
3. `fact`-Blöcke für zentrale Wendepunkte

## Vorlage für Argumentqualität

```json
{
  "id": "claim-kebab-id",
  "claim": "Typischer Stammtisch-Satz mit Ausrufezeichen!",
  "response": "Truth-Sandwich-Einstieg mit der korrekten Aussage, nicht mit der Wiederholung der Parole. Danach konkrete Daten, stärkstes Gegenargument, qualifizierte Kernaussage.",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "relatedSections": ["section-id-1", "section-id-2"],
  "verdict": "false",
  "rhetoricalPattern": "Benennt das Denkmuster hinter der Parole (z. B. Pauschalisierung, Lump-of-Labor-Trugschluss, falsche Dichotomie) und erklärt in 2–4 Sätzen, warum es in die Irre führt. Wiederholt den Frame der Parole nicht.",
  "counterQuestions": [
    "Konkretisierungsfrage (löst Pauschalbegriffe auf)",
    "Perspektivwechsel- oder Folgefrage",
    "Optional: dritte Frage zu einem anderen Aspekt"
  ]
}
```

**Aufbau einer Argumentantwort (`response`):**
1. **Truth-Sandwich-Einstieg**: Mit der korrekten Aussage beginnen, nicht mit der Wiederholung der Parole („Tatsächlich …", „Es ist umgekehrt …", „Die Zahlen zeigen …").
2. **Anerkennen** des Kerns der Wahrheit, falls vorhanden (ein Satz).
3. **Darlegen** der zentralen Daten (1–2 Sätze mit Zahlen).
4. **Eingehen auf** das stärkste Gegenargument (ein Satz).
5. **Abschließen** mit einer qualifizierten Kernaussage (ein Satz).

Ziellänge `response`: 3–5 Sätze, 40–100 Wörter.

**Konter-Werkzeuge (`rhetoricalPattern`, `counterQuestions`):**
- Bei Argumenten mit **korrigierendem** `verdict` mitliefern (`false`, `mostly-false`, `misleading`, `outdated`, `lacks-context`, `partially-true`; bei `mostly-true` optional für den falschen Restanteil).
- Bei `verdict: "true"` weglassen — eine zutreffende Behauptung braucht keinen Konter.
- Bei Argumenten **ohne** Verdict (normative Wertedebatten) weglassen — dort gibt es keine Falschaussage zum Korrigieren.
- Wenn kein erkennbares Denkmuster vorliegt: `rhetoricalPattern` weglassen statt künstlich konstruieren.
- Konkrete Gestaltungsregeln und Antipattern: siehe `.claude/skills/review-content/reference.md`, Dim 8.

## Vorlage für normative Argumente (ohne Verdict)

Für Werturteile und politische Forderungen, die der Empirie-Test nicht prüfbar macht (siehe `review-content`, Dim 9a):

```json
{
  "id": "claim-kebab-id",
  "claim": "Politische Forderung oder Werteposition vom Stammtisch!",
  "response": "Einordnung als Wertefrage, dann die Faktenbasis: Was ist empirisch belegt (Rechtslage, Zahlen, Studienlage zu den Prämissen)? Welche stärksten Argumente führen beide Seiten an? Abschluss benennt explizit, welche Frage Daten nicht entscheiden können — ohne sie selbst zu beantworten.",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "relatedSections": ["section-id-1"]
}
```

**Regeln:** Kein `verdict`, kein `rhetoricalPattern`, keine `counterQuestions`. Das `response` darf falsche empirische Prämissen des Claims korrigieren, aber keine Position empfehlen.

## Vorlage für Quelleneinträge

```json
{
  "id": "publisher-kebab-topic-keyword",
  "label": "Publisher – Titel der Publikation (Jahr)",
  "url": "https://..."
}
```

**Konvention für Quellen-IDs:** `{publisher-kebab}-{2-3-keyword-summary}`
- `destatis-mietpreisindex-2025`
- `diw-berlin-verteilungsbericht-2024`
- `bundesagentur-fuer-arbeit-arbeitsmarktbericht`

## Qualitätsmaßstäbe aus bestehenden Themen

### Kennzahlen

Die verbindlichen Bestandswerte (Anzahl Themen, Mediane für Sektionen/Argumente/Quellen/Block-Typen) werden beim Skill-Start **live aus `public/data/` ermittelt** — siehe Abschnitt „Live-Benchmarks" in der SKILL.md. Keine hier notierten statischen Zahlen verwenden; sie veralten mit jedem neuen Thema.

### heizung.json (14 Fakten, 9 Argumente, 19 Quellen)
Starkes Beispiel: Nutzt `stat_grid`, `comparison`, `timeline`, `line_chart`, `progress_stack`, `table`, `fact`, `text`. Gute Transparenz der Annahmen bei Kostenschätzungen.

### buergergeld.json (6 Fakten, 8 Argumente, ~10 Quellen)
Starkes Beispiel: Gute Nuancierung in den Argumenten (legitime Sorgen zu Leistungshöhen werden anerkannt). `text`-Blöcke liefern Kontext vor den Daten.

### klimawandel.json (7 Fakten, 9 Argumente, ~12 Quellen)
Starkes Beispiel: Sinnvoller Einsatz von `table` für Extremwetter-Schäden. Argumente gehen Gegenpositionen ausdrücklich an.

## Anti-Patterns, die vermieden werden sollten

1. **Nur-Fakten-Themen** — monotone Blöcke aus lauter `fact`. `stat_grid`, Diagramme und Vergleiche einstreuen.
2. **Fehlende sourceRefs** — Jeder Datenpunkt braucht eine `sourceRef`. Bei `text` mit Einordnung können sie fehlen.
3. **Verwaiste Quellen** — Jede Quelle im Array `sources` sollte mindestens in einem Block referenziert sein.
4. **Schwarz-weiß-Argumente** — Antworten nicht als reines „Widerlegen" rahmen. Siehe review-content, Dimension 1.
5. **Quellen überinterpretieren** — Nicht mehr behaupten, als die Quelle hergibt. Siehe review-content, Dimension 2.
6. **Doppelte Daten** — Dieselben Daten nicht gleichzeitig als `stat_grid` UND `table` UND `fact` zeigen. Bestes Format wählen, oder `table` nur als barrierefreie Alternative zu Diagrammen.
7. **Ungeprüfte Quellen als Grundlage** — Zahlen aus der Web-Recherche niemals ungeprüft in Strukturierung oder JSON übernehmen. Jede URL muss abgerufen und jeder Datenpunkt gegen den tatsächlichen Seiteninhalt verifiziert sein, bevor er in ContentBlocks einfließt. Siehe Phase 2 in SKILL.md.
8. **Deutsche Anführungszeichen in JSON** — „…" (U+201E / U+201C) bricht JSON-Syntax, weil das schließende `"` beim Tool-gestützten Schreiben zu ASCII `"` wird. Stattdessen ‚…' (U+201A / U+2018) verwenden. Nach dem Schreiben der JSON-Datei immer `node -e "JSON.parse(...)"` zur Validierung ausführen, bevor `npm run build` läuft. Siehe auch `.claude/rules/data-schema.md`.
9. **Verdict auf Werturteilen** — Normative Claims („sollte", „Privatsache", „bestraft Leistung") bekommen kein `verdict` und keine Konter-Werkzeuge; das Response weist Faktenbasis und Wertkonflikt aus, statt eine Position zu vertreten. Siehe review-content, Dimension 9.
10. **Einseitige Claim-Auswahl** — Nur Parolen einer politischen Richtung sammeln, obwohl im Diskurs auch Fehlannahmen der Gegenrichtung kursieren. Richtungs-Check in Phase 1 durchführen. Siehe review-content, Dimension 9e.
11. **Interessengebundene Einzelquelle für zentrale Datenpunkte** — highlight-Fakten, keyStats oder Kernzahlen in Argumenten allein auf Verbands-, Stiftungs- oder Auftragsstudien stützen. Entweder amtliche/wissenschaftliche Quelle finden, unabhängige Zweitquelle ergänzen oder die Herkunft im Text ausweisen („laut Branchenverband …"). Siehe Unabhängigkeitsregel in Phase 2.
