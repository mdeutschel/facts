# Referenz: Problematische Muster und Korrekturen

Konkrete Beispiele aus echtem Feedback mit Antipattern und verbesserten Versionen.

## Inhaltsverzeichnis

1. [Dimension 1: Fehlende Nuance](#dim-1-fehlende-nuance)
2. [Dimension 2: Quellen überinterpretiert](#dim-2-quellen-überinterpretiert)
3. [Dimension 3: Einseitige Kalkulationen](#dim-3-einseitige-kalkulationen)
4. [Dimension 5: Ignorierte Gegenargumente](#dim-5-ignorierte-gegenargumente)
5. [Dimension 6: Absolutistische Sprache](#dim-6-absolutistische-sprache)
6. [Dimension 7: Antwort verfehlt den Claim](#dim-7-antwort-verfehlt-den-claim)
7. [Review-Report-Vorlage](#review-report-vorlage)

---

## Dim 1: Fehlende Nuance

### Antipattern: Reines Widerlegen

```json
{
  "claim": "E-Autos sind genauso klimaschädlich wie Verbrenner",
  "response": "Ein E-Auto verursacht über den Lebenszyklus bis zu 73 % weniger CO₂ als ein Verbrenner."
}
```

**Problem**: Die 73-%-Zahl hängt vom Strommix ab. Der Claim hat einen wahren Kern bei kohlestromlastigen Netzen.

### Korrigierte Version

```json
{
  "claim": "E-Autos sind genauso klimaschädlich wie Verbrenner",
  "response": "Die Klimabilanz hängt vom Strommix ab: Im deutschen Mix (2025: >55 % erneuerbar) verursacht ein E-Auto laut ICCT über den Lebenszyklus rund 63 % weniger CO₂. Bei 100 % Ökostrom sind es bis zu 73 %. Nur in Ländern mit fast reinem Kohlestrom schrumpft der Vorteil deutlich — in Europa ist das aktuell nirgends der Fall."
}
```

**Warum besser**: Benennt die Bedingung (Strommix), nennt die realistische Zahl für den tatsächlichen deutschen Mix und den Grenzfall.

---

## Dim 2: Quellen überinterpretiert

### Antipattern: Die Quelle trägt den Claim nicht

```json
{
  "type": "fact",
  "text": "Wärmepumpen sparen in jedem Altbau mindestens 40 % Heizkosten.",
  "sourceRefs": ["fraunhofer-ise-waermepumpen-qualitaet"]
}
```

**Problem**: Die Fraunhofer-ISE-Studie zeigt, dass Wärmepumpen in Bestandsgebäuden *gut funktionieren*, behauptet aber keine pauschale 40-%-Einsparung für *alle* Fälle.

### Korrigierte Version

```json
{
  "type": "fact",
  "text": "Wärmepumpen arbeiten laut Fraunhofer ISE auch in Bestandsgebäuden effizient — die Jahresarbeitszahlen lagen im Schnitt über 3,0.",
  "sourceRefs": ["fraunhofer-ise-waermepumpen-qualitaet"]
}
```

**Warum besser**: Formuliert genau das, was die Quelle zeigt — nicht mehr.

---

## Dim 3: Einseitige Kalkulationen

### Antipattern: Nur best-case

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

**Problem**: Nutzt JAZ 3,5 (günstige Bedingungen). Bei schlechter Dämmung kann die JAZ bei 2,5–3,0 liegen — die Wirtschaftlichkeit verschiebt sich deutlich.

### Verbessert: Kontext über Textblock ergänzen

```json
{
  "type": "text",
  "text": "Die Rechnung basiert auf günstigen Bedingungen (JAZ 3,5, WP-Stromtarif). Bei schlechter Dämmung (JAZ 2,5–3,0) steigen die Stromkosten auf ca. 1.900–2.280 € — der Kostenvorteil wird kleiner, bleibt aber in den meisten Fällen bestehen."
}
```

**Alternative**: Mit `range_bar` die Kostenbandbreite unter verschiedenen Bedingungen darstellen.

---

## Dim 5: Ignorierte Gegenargumente

### Antipattern: Keine Gegenposition

```json
{
  "claim": "Der Atomausstieg war ein Fehler",
  "response": "Erneuerbare deckten 2025 über 55 % des Stroms und sind günstiger als neue AKW. Lazard beziffert Solar-LCOE auf 24–96 USD/MWh vs. Atom 141–221 USD/MWh."
}
```

**Problem**: Geht nicht auf die berechtigte Sorge um Grundlastversorgung in der EE-Transition ein. Ignoriert das Gegenargument vollständig.

### Korrigierte Version

```json
{
  "claim": "Der Atomausstieg war ein Fehler",
  "response": "Erneuerbare deckten 2025 über 55 % des deutschen Stroms und sind laut Lazard deutlich günstiger als neue AKW (Solar: 24–96 USD/MWh vs. Atom: 141–221 USD/MWh). Kritiker verweisen zurecht auf Versorgungssicherheit bei Dunkelflauten — hier setzen Speichertechnologien (Batterien, Wasserstoff) und europäische Netzanbindung an, deren Ausbau allerdings planmäßig erfolgen muss."
}
```

**Warum besser**: Nimmt das stärkste Gegenargument auf und zeigt, wie es adressiert wird — ohne so zu tun, als sei die Sorge unbegründet.

---

## Dim 6: Absolutistische Sprache

### Zu vermeidende Wörter und sinnvolle Alternativen

| Vermeiden | Besser |
|-------|--------|
| beweist | belegt, zeigt, deutet darauf hin |
| widerlegt endgültig | spricht stark dagegen, die Daten zeigen ein anderes Bild |
| die Medien verschweigen | wird in der Debatte selten erwähnt |
| eindeutig | nach aktueller Studienlage, nach den vorliegenden Daten |
| immer / nie | in der Regel / in den meisten Fällen / selten |
| Fakt ist | die Datenlage zeigt |

### Fehlende Bedingungen

**Antipattern**: "E-Autos verursachen 73 % weniger CO₂."
**Korrigiert**: "E-Autos verursachen bei Nutzung des aktuellen deutschen Strommix rund 63 % weniger CO₂ über den Lebenszyklus (ICCT, 2024)."

### Abkürzungsregel

**Antipattern**: "Laut Destatis arbeiten 30 % in Teilzeit."
**Korrigiert**: "Laut Statistischem Bundesamt (Destatis) arbeiten 30 % der Beschäftigten in Teilzeit."

---

## Dim 7: Antwort verfehlt den Claim

### Antipattern: Thematisch, aber nicht kausal

```json
{
  "claim": "Die Deutschen arbeiten immer weniger",
  "response": "Die Zahl der Erwerbstätigen in Deutschland hat 2024 mit 46,1 Mio. einen Rekordstand erreicht."
}
```

**Problem**: Der Claim betrifft *Arbeitsstunden pro Person*, die Antwort die *Zahl der Erwerbstätigen*. Thematisch nah, beantwortet aber nicht den eigentlichen Claim.

### Korrigierte Version

```json
{
  "claim": "Die Deutschen arbeiten immer weniger",
  "response": "Die durchschnittliche Arbeitszeit pro Kopf sinkt tatsächlich leicht — von 1.354 h (2010) auf 1.343 h (2024). Gleichzeitig hat die Zahl der Erwerbstätigen mit 46,1 Mio. einen Rekord erreicht, sodass das gesamte Arbeitsvolumen auf dem höchsten Stand seit der Wiedervereinigung liegt."
}
```

**Warum besser**: Nimmt den sachlichen Kern des Claims auf und ordnet ihn im Gesamtbild ein.

---

## Review-Report-Vorlage

Bei der Darstellung der Befunde im Review-Modus diese Struktur verwenden:

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

(für jede Dimension mit Befunden wiederholen)

## Empfohlene Änderungen
1. argument "claim-id": response umformulieren (Dim 1, 5)
2. section "section-id", fact block: Bedingung ergänzen (Dim 6)
...

Sollen die Änderungen angewendet werden?
```
</think>
Schließendes Code-Fence korrigieren — ein doppeltes ``` wurde versehentlich eingefügt.

<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
Read