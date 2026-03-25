# Referenzbeispiele zur Quellenverifizierung

Das sind reale Beispiele aus dem Code, die korrekt strukturierte `sources` und `sourceRefs` zeigen.

## Quelleneintrag (Vorlage)

Jede Quelle MUSS `id`, `label` und `url` haben:

```json
{
  "id": "fraunhofer-ise-waermepumpen-qualitaet-im-bestand",
  "label": "Fraunhofer ISE – Wärmepumpen-Qualität im Bestand (2025)",
  "url": "https://www.ise.fraunhofer.de/en/press-media/press-releases/2025/fraunhofer-ise-research-project-completed-heat-pumps-provide-climate-friendly-heating-in-existing-buildings.html"
}
```

## Inhaltstypen mit sourceRefs

### stat_grid — Finanzaufschlüsselung (aus bildung.json)

```json
{
  "type": "stat_grid",
  "items": [
    { "label": "Gesamt 2024", "value": "198 Mrd. €", "sublabel": "+7 % nominal, +4 % real" },
    { "label": "Pro Einwohner", "value": "2.400 €", "sublabel": "bzw. 8.000 € pro unter 30-Jährigem" },
    { "label": "Schulen", "value": "97 Mrd. €", "sublabel": "49 % der Ausgaben" },
    { "label": "Kita-Betreuung", "value": "49 Mrd. €", "sublabel": "25 % der Ausgaben" }
  ],
  "sourceRefs": ["statistisches-bundesamt-bildungsausgaben-2024"]
}
```

### comparison — Kostenvergleich nebeneinander (aus heizung.json)

```json
{
  "type": "comparison",
  "caption": "Beispielrechnung: Einfamilienhaus, 20.000 kWh Wärmebedarf/Jahr",
  "items": [
    {
      "title": "Gasheizung (Brennwert)",
      "color": "#546e7a",
      "rows": [
        { "label": "Energieverbrauch", "value": "20.000 kWh Gas" },
        { "label": "Gaspreis (2026)", "value": "~10 Ct/kWh" },
        { "label": "Energiekosten", "value": "~2.000 €/Jahr" }
      ],
      "total": { "label": "Jährliche Betriebskosten", "value": "~2.470 €" }
    },
    {
      "title": "Wärmepumpe (Luft-Wasser, JAZ 3,5)",
      "color": "#00897b",
      "rows": [
        { "label": "Energieverbrauch", "value": "~5.700 kWh Strom" },
        { "label": "WP-Strompreis (2026)", "value": "~24 Ct/kWh" },
        { "label": "Energiekosten", "value": "~1.370 €/Jahr" }
      ],
      "total": { "label": "Jährliche Betriebskosten", "value": "~1.520 €" }
    }
  ],
  "savings": "Ersparnis Wärmepumpe: rund 950 €/Jahr im Betrieb.",
  "sourceRefs": ["ewi-koeln-auswirkungen-und-preispfade-des-eu"]
}
```

### table — Datentabelle mit mehreren Quellen (aus klimawandel.json)

```json
{
  "type": "table",
  "caption": "Extremwetter-Schäden in Deutschland",
  "headers": ["Ereignis / Jahr", "Versicherte Schäden", "Einordnung"],
  "rows": [
    ["Ahrtal-Flut 2021", "8,75 Mrd. €", "Folgenschwerste Naturkatastrophe"],
    ["Hochwasser/Starkregen 2024", "2,6 Mrd. €", "Deutschlandweit versicherte Schäden"],
    ["Alle Naturgefahren 2024", "5,7 Mrd. €", "Sturm, Hagel, Starkregen und Überschwemmungen"]
  ],
  "sourceRefs": [
    "gdv-flutkatastrophe-von-2021-7-5-milliarden",
    "gdv-naturgefahrenstatistik-2024",
    "gdv-naturgefahrenbilanz-2025"
  ]
}
```

### timeline — Regulatorischer Fahrplan (aus heizung.json)

```json
{
  "type": "timeline",
  "caption": "CO₂-Preis-Fahrplan",
  "steps": [
    { "label": "2025", "value": "55 EUR/t", "sublabel": "Festpreis" },
    { "label": "2026", "value": "55–65 EUR/t", "sublabel": "nationaler Korridor" },
    { "label": "ab 2027", "value": "Marktbasiert", "sublabel": "ETS 2", "highlight": true },
    { "label": "2045", "value": "klimaneutral", "sublabel": "Zielpfad für den Gebäudesektor" }
  ],
  "sourceRefs": ["ewi-koeln-auswirkungen-und-preispfade-des-eu"]
}
```

### fact — Hervorgehobener Kernbefund (aus klimawandel.json)

```json
{
  "type": "fact",
  "text": "2024 war das wärmste Jahr seit Beginn der Aufzeichnungen und das erste Kalenderjahr mit mehr als 1,5 °C über dem vorindustriellen Niveau.",
  "highlight": true,
  "sourceRefs": ["copernicus-climate-change-service-c3s-global"]
}
```

## Prüfliste

Bei der Verifizierung jeden Inhaltsblock an diesem Muster prüfen:

| Prüfpunkt | Bestanden | Fehler |
|-----------|-----------|--------|
| Jede `sourceRefs`-ID existiert im `sources`-Array | ✓ | Verwaiste Referenz |
| Jede Quelle hat ein `url`-Feld | ✓ | URL fehlt |
| Zahlen im Inhalt stimmen mit den Quelldaten überein | ✓ | Datenabweichung |
| Quellen-URL ist erreichbar | ✓ | Toter Link |
| Keine Quelle ohne mindestens einen verweisenden Block | ✓ | Ungenutzte Quelle |
