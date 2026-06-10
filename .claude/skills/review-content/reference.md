# Referenz: Problematische Muster und Korrekturen

Konkrete Beispiele aus echtem Feedback mit Antipattern und verbesserten Versionen.

## Inhaltsverzeichnis

1. [Dimension 1: Fehlende Nuance](#dim-1-fehlende-nuance)
2. [Dimension 2: Quellen überinterpretiert](#dim-2-quellen-überinterpretiert)
3. [Dimension 3: Einseitige Kalkulationen](#dim-3-einseitige-kalkulationen)
4. [Dimension 5: Ignorierte Gegenargumente](#dim-5-ignorierte-gegenargumente)
5. [Dimension 6: Absolutistische Sprache](#dim-6-absolutistische-sprache)
6. [Dimension 7: Antwort verfehlt den Claim](#dim-7-antwort-verfehlt-den-claim)
7. [Dimension 8: Gesprächstauglichkeit](#dim-8-gesprächstauglichkeit)
8. [Dimension 9: Politische Neutralität](#dim-9-politische-neutralität)
9. [Review-Report-Vorlage](#review-report-vorlage)

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

## Dim 8: Gesprächstauglichkeit

### Antipattern A: Response wiederholt zuerst die Parole

```json
{
  "claim": "Ausländer nehmen uns die guten Jobs weg.",
  "response": "Es stimmt nicht, dass Ausländer uns die Jobs wegnehmen. Geflüchtete arbeiten laut IAB vor allem in Mangelbereichen …"
}
```

**Problem**: Der erste Halbsatz wiederholt den Frame der Parole („Ausländer nehmen Jobs weg"). Nach Lakoff verstärkt das den Frame im Kopf der Zuhörenden, auch wenn formal negiert wird.

### Korrigierte Version (Truth-Sandwich-Einstieg)

```json
{
  "claim": "Ausländer nehmen uns die guten Jobs weg.",
  "response": "Es ist umgekehrt: Geflüchtete arbeiten laut IAB überwiegend dort, wo Personal fehlt — Gesundheit, Verkehr und Logistik, Fertigung. Bis Mitte der 2030er sinkt die Zahl der 20- bis 66-Jährigen laut Destatis selbst bei hoher Nettozuwanderung um rund 3,2 Millionen; ohne Zuwanderung bleiben Stellen unbesetzt, statt dass jemand verdrängt wird."
}
```

**Warum besser**: Beginnt mit der korrekten Aussage. Der Frame der Parole wird nicht wiederholt.

### Antipattern B: Polemische Gegenfragen

```json
{
  "counterQuestions": [
    "Glaubst du das wirklich selbst?",
    "Liest du eigentlich auch mal eine Statistik?",
    "Wann hast du zuletzt nachgedacht?"
  ]
}
```

**Problem**: Suggestivfragen, Belehrungen als Frage verkleidet, demütigend. Wirkt wie Angriff statt Gespräch, treibt das Gegenüber in die Defensive — genau das Gegenteil dessen, was die Forschung empfiehlt.

### Korrigierte Version (sokratisch, konkret, neutral)

```json
{
  "counterQuestions": [
    "Welchen Job hat dir oder jemandem, den du persönlich kennst, konkret ein Ausländer weggenommen?",
    "Wer soll in zehn Jahren in der Pflege oder auf dem Bau arbeiten, wenn schon heute Zehntausende Stellen unbesetzt bleiben?",
    "Du sagst ‚die Ausländer' — meinst du den polnischen Handwerker, die syrische Ärztin oder den italienischen Wirt um die Ecke?"
  ]
}
```

**Warum besser**: Jede Frage adressiert einen anderen Aspekt (Konkretisierung, Perspektivwechsel, Pauschalisierung auflösen). Alle sind ehrlich beantwortbar, keine Demütigung, kein Sarkasmus.

### Antipattern C: rhetoricalPattern wiederholt nur die Parole

```json
{
  "rhetoricalPattern": "Die Aussage, Ausländer würden uns die Jobs wegnehmen, ist falsch, weil sie pauschal ist und nicht zutrifft."
}
```

**Problem**: Wiederholt die Parole sprachlich und liefert keine eigenständige Mustererklärung. Verstärkt den Frame, ohne das Denkmuster zu benennen.

### Korrigierte Version

```json
{
  "rhetoricalPattern": "Die Parole unterstellt einen Arbeitsmarkt mit fester Job-Menge: Wer ein Stück bekommt, nimmt es jemand anderem weg. In der Volkswirtschaftslehre heißt das ‚Lump-of-Labor-Trugschluss'. Tatsächlich entstehen mit jeder zusätzlichen Arbeitskraft auch neue Bedarfe — durch Konsum, Wohnen und Dienstleistungen."
}
```

**Warum besser**: Benennt das Denkmuster (Lump-of-Labor-Trugschluss) mit Fachterm, erklärt warum es in die Irre führt, und vermeidet die Phrase „Ausländer nehmen Jobs weg" im Wiederholen.

### Wann `rhetoricalPattern` und `counterQuestions` weglassen

- Bei Argumenten **ohne** Verdict (normative Wertedebatten, politische Forderungen) — dort gibt es keine Falschaussage zum Korrigieren.
- Wenn kein erkennbares Denkmuster vorliegt (z. B. reine Zahlen-Streitigkeiten ohne rhetorische Figur): `rhetoricalPattern` weglassen, leeres Feld nicht erzwingen.
- Wenn keine konkrete, nicht-polemische Gegenfrage formulierbar ist: `counterQuestions` weglassen statt schwache Fragen einbauen.

---

## Dim 9: Politische Neutralität

### Antipattern A: Verdict auf einem Werturteil

```json
{
  "claim": "Erben ist Privatsache — der Staat hat da nichts zu suchen!",
  "verdict": "misleading",
  "response": "Art. 14 GG garantiert Eigentum, betont aber auch dessen Sozialpflichtigkeit. […] Deshalb ist ihre Besteuerung keine unzulässige Einmischung, sondern Teil legitimer Verteilungspolitik in einem Sozialstaat."
}
```

**Problem**: Der Claim ist eine Werteposition — keine Statistik kann ihn widerlegen, der Empirie-Test (Dim 9a) schlägt fehl. Das Verdict `misleading` suggeriert faktische Widerlegbarkeit. Zusätzlich endet das `response` in einem Plädoyer („legitime Verteilungspolitik"), das eine politische Position als richtig erklärt.

### Korrigierte Version

```json
{
  "claim": "Erben ist Privatsache — der Staat hat da nichts zu suchen!",
  "response": "Das ist eine Werteposition — hier die Faktenbasis dazu: Art. 14 GG garantiert Eigentum und Erbrecht, verankert aber auch die Sozialpflichtigkeit des Eigentums; das BVerfG hat die Erbschaftsteuer mehrfach als verfassungskonform bestätigt. 96 % aller Erbfälle bleiben unter den Freibeträgen. Ob der Staat darüber hinaus stärker oder schwächer besteuern soll, ist eine Verteilungsfrage, die Daten allein nicht entscheiden können."
}
```

**Warum besser**: Kein Verdict auf einer Wertfrage. Das `response` liefert die verfassungsrechtliche und statistische Faktenbasis und benennt explizit, wo das Werturteil beginnt — ohne es zu fällen.

### Antipattern B: Plädoyer-Sprache und Lager-Framing

```json
{
  "response": "[…] 96 % aller Erbfälle fallen komplett unter die Freibeträge. Das 'Elternhaus'-Argument schützt in Wahrheit die Villen der Superreichen."
}
```

**Problem**: Der erste Satz ist Faktencheck, der zweite politische Rhetorik. „Villen der Superreichen" ist Lager-Sprache (Dim 9d), „in Wahrheit … schützt" unterstellt den Vertretern der Gegenposition ein verdecktes Motiv statt eine falsche Zahl.

### Korrigierte Version

```json
{
  "response": "[…] 96 % aller Erbfälle fallen komplett unter die Freibeträge. Von einer Abschaffung oder weiteren Senkung der Erbschaftsteuer würden daher rechnerisch vor allem die wenigen sehr großen Nachlässe profitieren — das geerbte Elternhaus ist heute schon weitgehend steuerfrei."
}
```

**Warum besser**: Dieselbe Aussage als überprüfbare Verteilungsaussage formuliert, ohne Motivunterstellung und ohne Kampfvokabular.

### Antipattern C: Asymmetrischer Maßstab

```json
{
  "claim": "Die Reichen wandern dann einfach ins Ausland ab!",
  "verdict": "mostly-false"
}
```

— während im selben Topic ein gleich pauschaler Claim der Gegenrichtung („Eine Vermögenssteuer finanziert unsere Schulen und Krankenhäuser!") fehlt oder milder bewertet würde.

**Prüfung (Dim 9c/9e)**: Würde der inhaltlich gleich starke Claim der Gegenrichtung dasselbe Verdict bekommen? Gibt es im realen Diskurs verbreitete Fehlannahmen der anderen Richtung, die im Topic fehlen? Wenn ja: als ⚠-Befund melden und Claims ergänzen — z. B. überzogene Aufkommenserwartungen, „die Schweiz zeigt, dass niemand abwandert", „nur die obersten 0,1 % wären betroffen, ganz ohne Nebenwirkungen".

### Schnelltest für jedes Argument

1. **Empirie-Test**: Könnte eine Studie/Statistik den Claim widerlegen? Nein → kein Verdict, Faktenbasis + Wertkonflikt ausweisen.
2. **Plädoyer-Test**: Enthält das `response` eine Empfehlung oder Legitimitätszuschreibung („sollte", „legitim", „nötig", „überfällig")? Ja → in Datenlage + offene Wertfrage umformulieren.
3. **Spiegel-Test**: Würde dieselbe Formulierung mit vertauschten politischen Vorzeichen als parteiisch auffallen? Ja → neutralisieren.

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

### Dim 9: Politische Neutralität
| Element | Bewertung | Befund | Vorschlag |
|---------|-----------|--------|-----------|
| argument "claim-id" | ✗ | Verdict auf normativem Claim | Verdict entfernen, Wertkonflikt ausweisen |
| Topic gesamt | ⚠ | Claims nur aus einer Richtung | Verbreitete Fehlannahmen der Gegenrichtung ergänzen |

## Empfohlene Änderungen
1. argument "claim-id": response umformulieren (Dim 1, 5)
2. section "section-id", fact block: Bedingung ergänzen (Dim 6)
...

Sollen die Änderungen angewendet werden?
```
