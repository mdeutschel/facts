# Reference Examples for Source Verification

These are real examples from the codebase showing correctly structured sources and sourceRefs.

## Source Entry (Template)

Every source MUST have `id`, `label`, and `url`:

```json
{
  "id": "fraunhofer-ise-waermepumpen-qualitaet-im-bestand",
  "label": "Fraunhofer ISE – Wärmepumpen-Qualität im Bestand (2025)",
  "url": "https://www.ise.fraunhofer.de/en/press-media/press-releases/2025/fraunhofer-ise-research-project-completed-heat-pumps-provide-climate-friendly-heating-in-existing-buildings.html"
}
```

## Content Block Types with sourceRefs

### stat_grid — Financial breakdown (from bildung.json)

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

### comparison — Side-by-side cost analysis (from heizung.json)

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

### table — Multi-source data table (from klimawandel.json)

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

### timeline — Regulatory schedule (from heizung.json)

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

### fact — Highlighted key finding (from klimawandel.json)

```json
{
  "type": "fact",
  "text": "2024 war das wärmste Jahr seit Beginn der Aufzeichnungen und das erste Kalenderjahr mit mehr als 1,5 °C über dem vorindustriellen Niveau.",
  "highlight": true,
  "sourceRefs": ["copernicus-climate-change-service-c3s-global"]
}
```

## Verification Checklist

When verifying, check each content block against this pattern:

| Check | Pass | Fail |
|-------|------|------|
| Every `sourceRefs` ID exists in `sources` array | ✓ | Orphaned ref |
| Every source has `url` field | ✓ | Missing URL |
| Numbers in content match source data | ✓ | Data mismatch |
| Source URL is reachable | ✓ | Dead link |
| No source without at least one referencing block | ✓ | Unused source |
