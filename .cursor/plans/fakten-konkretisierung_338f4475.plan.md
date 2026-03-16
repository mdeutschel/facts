---
name: Fakten-Konkretisierung
overview: Systematische Überarbeitung aller Themen, um weiche qualitative Aussagen durch konkrete, belegte Zahlen, Beispielrechnungen und harte Fakten zu ersetzen.
todos:
  - id: emobilitaet-konkret
    content: "E-Mobilität: TCO-Vergleich und Ladezeiten konkretisieren"
    status: completed
  - id: heizung-konkret
    content: "Heizung: Beispielrechnung Verbrauchskosten und CO2-Aufschlag ergänzen"
    status: completed
  - id: energiewende-konkret
    content: "Energiewende: LCOE und AKW-Baukosten in konkreten Zahlen gegenüberstellen"
    status: completed
  - id: buergergeld-konkret
    content: "Bürgergeld: Lohnabstand mit konkreten Euro-Beträgen als Comparison darstellen"
    status: completed
  - id: verkehrswende-konkret
    content: "Verkehrswende: Flächenverbrauch und externe Kosten beziffern"
    status: completed
  - id: vegan-konkret
    content: "Vegane Ernährung: Ressourcenverbrauch (Rind vs. Tofu) als Comparison aufbereiten"
    status: completed
  - id: gleichberechtigung-konkret
    content: "Gleichberechtigung: Child Penalty und Gehaltslücken greifbarer visualisieren"
    status: completed
  - id: vermoegenssteuer-konkret
    content: "Vermögenssteuer: Rechenbeispiel für Steuerbelastung ergänzen"
    status: completed
  - id: restliche-themen-konkret
    content: "Klimawandel, Bildung, Gesundheit, Migration, Teilzeit: Weitere weiche Fakten identifizieren und härten"
    status: completed
isProject: false
---

# Plan: Konkretisierung der Fakten (Hardening with concrete numbers)

## Zielsetzung

Die in der ersten Phase erfolgreich gegen Primärquellen gehärteten Fakten sind aktuell teilweise zu "weich" formuliert (z.B. "ist oft teurer", "hängt vom Modell ab"). Um in Diskussionen echten Mehrwert zu bieten, müssen diese qualitativen Aussagen durch **konkrete Beispielrechnungen, Durchschnittswerte und harte Zahlen** ersetzt werden.

## Methodik

1. **Identifikation:** Alle `comparison`- und `fact`-Blöcke prüfen, die qualitative Vergleiche anstellen.
2. **Recherche:** Für diese Blöcke konkrete, repräsentative Zahlen aus den bereits vorhandenen (oder bei Bedarf neuen, hochseriösen) Quellen extrahieren.
3. **Umbau:** Nutzung der bestehenden UI-Komponenten (insbesondere `comparison`, `stat_grid`, `table`), um die konkreten Zahlen anschaulich darzustellen.
4. **Transparenz:** Bei Beispielrechnungen immer die Prämissen (z.B. angenommener Strompreis, Gebäudegröße) in einem begleitenden Text- oder Fact-Block transparent machen.

## Geplante Anpassungen pro Thema (Auswahl der wichtigsten)

### 1. E-Mobilität (`emobilitaet.json`)

- **TCO-Vergleich:** Ersetzen des weichen "oft etwas niedriger/höher" durch ein konkretes ADAC-Fahrzeugpaar der Kompaktklasse (z.B. VW Golf Benziner vs. VW ID.3 oder Opel Astra vs. Peugeot Astra Electric) mit echten Cent/km-Werten und Jahreskosten bei 15.000 km.
- **Ladezeiten:** Konkretes Beispiel ergänzen (z.B. "Eine typische Schnellladung von 10 auf 80 % dauert bei modernen Fahrzeugen ca. 25-30 Minuten und lädt Strom für rund 250-300 km nach").

### 2. Heizung (`heizung.json`)

- **Kostenvergleich:** Einbau einer konkreten Beispielrechnung für ein typisches Einfamilienhaus (z.B. 20.000 kWh Wärmebedarf). Gegenüberstellung der jährlichen Verbrauchskosten: Gas (z.B. 10 ct/kWh) vs. Wärmepumpe (z.B. JAZ 3,5 bei 30 ct/kWh Wärmepumpenstrom).
- **CO₂-Kosten:** Die Auswirkungen des CO₂-Preises auf den Gaspreis in Cent/kWh umrechnen, damit es greifbarer wird (z.B. 55 €/t CO₂ = ca. 1,1 ct/kWh Aufschlag).

### 3. Energiewende (`energiewende.json`)

- **Stromgestehungskosten (LCOE):** Konkrete Cent/kWh-Werte für Wind/Solar gegenüberstellen mit den garantierten Einspeisevergütungen neuer AKW-Projekte (z.B. Hinkley Point C mit inflationsangepassten Strike-Prices).
- **Bauzeiten/Kosten:** Konkrete Zahlen zu Budgetüberschreitungen bei Flamanville 3 oder Olkiluoto 3 (Ursprungsplanung vs. finale Kosten in Mrd. Euro).

### 4. Bürgergeld (`buergergeld.json`)

- **Lohnabstand:** Den `comparison`-Block nutzen, um das WSI-Beispiel (Mindestlohn-Vollzeit inkl. ergänzender Sozialleistungen vs. Bürgergeld) für einen Single-Haushalt mit konkreten Euro-Beträgen aufzuschlüsseln.

### 5. Verkehrswende (`verkehrswende.json`)

- **Flächenverbrauch:** Konkrete Gegenüberstellung in Quadratmetern (z.B. 1 PKW-Parkplatz = ca. 12 m² = Platz für X Fahrräder).
- **Kostenwahrheit:** Konkrete Zahlen zu den externen Kosten des PKW-Verkehrs pro Jahr oder pro gefahrenem Kilometer laut UBA.

### 6. Vegane Ernährung (`vegane-ernaehrung.json`)

- **Ressourcenverbrauch:** Konkrete `comparison` zwischen 1 kg Rindfleisch und 1 kg Tofu/Soja bezüglich Wasserverbrauch (Liter), CO₂-Emissionen (kg) und Flächenbedarf (m²).

### 7. Gleichberechtigung (`gleichberechtigung.json`)

- **Child Penalty:** Die ZEW-Zahlen (fast 30.000 Euro weniger im vierten Jahr) noch prominenter als `stat_grid` oder `comparison` gegenüberstellen.

### 8. Vermögenssteuer (`vermoegenssteuer.json`)

- **Rechenbeispiel:** Konkretes Beispiel einer potenziellen Vermögenssteuer (z.B. 1 % auf Vermögen über 2 Mio. €) und was das für einen fiktiven Multimillionär in Euro pro Jahr bedeuten würde, um die Größenordnungen zu veranschaulichen.

