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

**Regel zur visuellen Abwechslung:** Jedes Thema sollte mindestens 3–4 verschiedene Blocktypen nutzen. Themen vermeiden, die nur aus `fact`-Blöcken bestehen. `bar_chart` und `line_chart` nutzen Recharts (lazy-loaded) — sparsam einsetzen, wenn das Thema viele Sektionen hat.

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
  "response": "Nuancierte Antwort die: (1) den Kern der Behauptung anerkennt, (2) mit konkreten Daten kontert, (3) das stärkste Gegenargument adressiert, (4) vorsichtige Sprache verwendet.",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "relatedSections": ["section-id-1", "section-id-2"]
}
```

**Aufbau einer Argumentantwort:**
1. **Anerkennen** des Kerns der Wahrheit (ein Satz)
2. **Darlegen** der zentralen Daten (1–2 Sätze mit Zahlen)
3. **Eingehen auf** das stärkste Gegenargument (ein Satz)
4. **Abschließen** mit einer qualifizierten Kernaussage (ein Satz)

Ziellänge: 3–5 Sätze, 40–80 Wörter.

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

### Gute Kennzahlen für Themen (basierend auf 13 bestehenden Themen)
- Abschnitte: 5–14 (Median ~8)
- Argumente: 7–13 (Median ~9)
- Quellen: 8–19 (Median ~12)
- genutzte ContentBlock-Typen: 3–6 verschiedene Typen pro Thema

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
