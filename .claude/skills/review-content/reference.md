# Reference: Problematic Patterns and Fixes

Concrete examples from real feedback, showing anti-patterns and improved versions.

## Table of Contents

1. [Dimension 1: Missing Nuance](#dim-1-missing-nuance)
2. [Dimension 2: Over-Reading Sources](#dim-2-over-reading-sources)
3. [Dimension 3: One-Sided Calculations](#dim-3-one-sided-calculations)
4. [Dimension 5: Ignored Counter-Arguments](#dim-5-ignored-counter-arguments)
5. [Dimension 6: Absolutist Language](#dim-6-absolutist-language)
6. [Dimension 7: Response Misses the Claim](#dim-7-response-misses-the-claim)
7. [Review Report Template](#review-report-template)

---

## Dim 1: Missing Nuance

### Anti-pattern: Pure debunking

```json
{
  "claim": "E-Autos sind genauso klimaschädlich wie Verbrenner",
  "response": "Ein E-Auto verursacht über den Lebenszyklus bis zu 73 % weniger CO₂ als ein Verbrenner."
}
```

**Problem**: The 73% figure depends on the electricity mix. The claim has a kernel of truth for coal-heavy grids.

### Fixed version

```json
{
  "claim": "E-Autos sind genauso klimaschädlich wie Verbrenner",
  "response": "Die Klimabilanz hängt vom Strommix ab: Im deutschen Mix (2025: >55 % erneuerbar) verursacht ein E-Auto laut ICCT über den Lebenszyklus rund 63 % weniger CO₂. Bei 100 % Ökostrom sind es bis zu 73 %. Nur in Ländern mit fast reinem Kohlestrom schrumpft der Vorteil deutlich — in Europa ist das aktuell nirgends der Fall."
}
```

**Why better**: Acknowledges the condition (electricity mix), gives the realistic figure for the actual German grid, and names the edge case.

---

## Dim 2: Over-Reading Sources

### Anti-pattern: Source doesn't carry the claim

```json
{
  "type": "fact",
  "text": "Wärmepumpen sparen in jedem Altbau mindestens 40 % Heizkosten.",
  "sourceRefs": ["fraunhofer-ise-waermepumpen-qualitaet"]
}
```

**Problem**: The Fraunhofer ISE study shows that heat pumps *work well* in existing buildings, but doesn't claim a universal 40% savings figure for *all* cases.

### Fixed version

```json
{
  "type": "fact",
  "text": "Wärmepumpen arbeiten laut Fraunhofer ISE auch in Bestandsgebäuden effizient — die Jahresarbeitszahlen lagen im Schnitt über 3,0.",
  "sourceRefs": ["fraunhofer-ise-waermepumpen-qualitaet"]
}
```

**Why better**: States exactly what the source shows, not more.

---

## Dim 3: One-Sided Calculations

### Anti-pattern: Only best-case

```json
{
  "type": "comparison",
  "caption": "Kostenvergleich: Gasheizung vs. Wärmepumpe",
  "items": [
    {
      "title": "Gasheizung",
      "total": { "label": "Jährliche Betriebskosten", "value": "~2.470 €" }
    },
    {
      "title": "Wärmepumpe (JAZ 3,5)",
      "total": { "label": "Jährliche Betriebskosten", "value": "~1.520 €" }
    }
  ]
}
```

**Problem**: Uses JAZ 3.5 (good conditions). In poorly insulated buildings, JAZ can be 2.5–3.0, changing the economics significantly.

### Improved: Add context via text block

```json
{
  "type": "text",
  "text": "Die Rechnung basiert auf günstigen Bedingungen (JAZ 3,5, WP-Stromtarif). Bei schlechter Dämmung (JAZ 2,5–3,0) steigen die Stromkosten auf ca. 1.900–2.280 € — der Kostenvorteil wird kleiner, bleibt aber in den meisten Fällen bestehen."
}
```

**Alternative**: Use `range_bar` to show the cost range under different conditions.

---

## Dim 5: Ignored Counter-Arguments

### Anti-pattern: No opposing view

```json
{
  "claim": "Der Atomausstieg war ein Fehler",
  "response": "Erneuerbare deckten 2025 über 55 % des Stroms und sind günstiger als neue AKW. Lazard beziffert Solar-LCOE auf 24–96 USD/MWh vs. Atom 141–221 USD/MWh."
}
```

**Problem**: Doesn't address the legitimate concern about base-load reliability during the EE transition. Ignores the counter-argument entirely.

### Fixed version

```json
{
  "claim": "Der Atomausstieg war ein Fehler",
  "response": "Erneuerbare deckten 2025 über 55 % des deutschen Stroms und sind laut Lazard deutlich günstiger als neue AKW (Solar: 24–96 USD/MWh vs. Atom: 141–221 USD/MWh). Kritiker verweisen zurecht auf Versorgungssicherheit bei Dunkelflauten — hier setzen Speichertechnologien (Batterien, Wasserstoff) und europäische Netzanbindung an, deren Ausbau allerdings planmäßig erfolgen muss."
}
```

**Why better**: Acknowledges the strongest counter-argument, then shows how it's being addressed — without pretending the concern is invalid.

---

## Dim 6: Absolutist Language

### Words to avoid and their replacements

| Avoid | Prefer |
|-------|--------|
| beweist | belegt, zeigt, deutet darauf hin |
| widerlegt endgültig | spricht stark dagegen, die Daten zeigen ein anderes Bild |
| die Medien verschweigen | wird in der Debatte selten erwähnt |
| eindeutig | nach aktueller Studienlage, nach den vorliegenden Daten |
| immer / nie | in der Regel / in den meisten Fällen / selten |
| Fakt ist | die Datenlage zeigt |

### Missing conditions

**Anti-pattern**: "E-Autos verursachen 73 % weniger CO₂."
**Fixed**: "E-Autos verursachen bei Nutzung des aktuellen deutschen Strommix rund 63 % weniger CO₂ über den Lebenszyklus (ICCT, 2024)."

### Abbreviation rule

**Anti-pattern**: "Laut Destatis arbeiten 30 % in Teilzeit."
**Fixed**: "Laut Statistischem Bundesamt (Destatis) arbeiten 30 % der Beschäftigten in Teilzeit."

---

## Dim 7: Response Misses the Claim

### Anti-pattern: Thematic but not causal

```json
{
  "claim": "Die Deutschen arbeiten immer weniger",
  "response": "Die Zahl der Erwerbstätigen in Deutschland hat 2024 mit 46,1 Mio. einen Rekordstand erreicht."
}
```

**Problem**: The claim is about *hours worked per person*, the response is about *number of employed people*. Thematically related, but doesn't answer the actual claim.

### Fixed version

```json
{
  "claim": "Die Deutschen arbeiten immer weniger",
  "response": "Die durchschnittliche Arbeitszeit pro Kopf sinkt tatsächlich leicht — von 1.354 h (2010) auf 1.343 h (2024). Gleichzeitig hat die Zahl der Erwerbstätigen mit 46,1 Mio. einen Rekord erreicht, sodass das gesamte Arbeitsvolumen auf dem höchsten Stand seit der Wiedervereinigung liegt."
}
```

**Why better**: Acknowledges the factual core of the claim, then contextualizes it with the complete picture.

---

## Review Report Template

When presenting findings in review mode, use this structure:

```markdown
# Inhaltliche Qualitätsprüfung: {topicId}

## Zusammenfassung
- X Argumente geprüft, Y Sektionen geprüft
- N ✗ PROBLEM, M ⚠ VERBESSERBAR, K ✓ OK

## Befunde nach Dimension

### Dim 1: Nuance & Teilwahrheiten
| Element | Bewertung | Befund | Vorschlag |
|---------|-----------|--------|-----------|
| argument "claim-id" | ⚠ | Kein Zugeständnis an Teilwahrheit | "Der Kern stimmt…" ergänzen |

### Dim 2: Claim-Source-Fit
...

(repeat for each dimension with findings)

## Empfohlene Änderungen
1. argument "claim-id": response umformulieren (Dim 1, 5)
2. section "section-id", fact block: Bedingung ergänzen (Dim 6)
...

Sollen die Änderungen angewendet werden?
```
