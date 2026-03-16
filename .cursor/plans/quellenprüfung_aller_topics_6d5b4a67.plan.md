---
name: Quellenprüfung aller Topics
overview: Systematische Quellenverifizierung aller 13 Topic-JSON-Dateien in `public/data/` nach dem 6-Phasen-Verfahren aus AGENTS.md, um halluzinierte Daten auszuschließen und alle Zahlen/Fakten online zu validieren.
todos:
  - id: batch1-emobilitaet
    content: Quellenprüfung emobilitaet.json (11 Quellen, 0 URLs -- URL-Beschaffung nötig)
    status: completed
  - id: batch1-heizung
    content: Quellenprüfung heizung.json (20 Quellen, 0 URLs -- URL-Beschaffung nötig)
    status: completed
  - id: batch1-buergergeld
    content: Quellenprüfung buergergeld.json (3 Quellen)
    status: completed
  - id: batch1-teilzeit
    content: Quellenprüfung teilzeit.json (3 Quellen)
    status: completed
  - id: batch2-migration
    content: Quellenprüfung migration.json (3 Quellen)
    status: completed
  - id: batch2-gleichberechtigung
    content: Quellenprüfung gleichberechtigung.json (4 Quellen)
    status: completed
  - id: batch2-vegane
    content: Quellenprüfung vegane-ernaehrung.json (4 Quellen)
    status: completed
  - id: batch2-gesundheit
    content: Quellenprüfung gesundheit.json (10 Quellen, 1 ohne URL)
    status: completed
  - id: batch3-bildung
    content: Quellenprüfung bildung.json (11 Quellen, 1 ohne URL)
    status: completed
  - id: batch3-verkehrswende
    content: Quellenprüfung verkehrswende.json (10 Quellen)
    status: completed
  - id: batch3-klimawandel
    content: Quellenprüfung klimawandel.json (16 Quellen)
    status: completed
  - id: batch4-energiewende
    content: Quellenprüfung energiewende.json (21 Quellen, 1 ohne URL)
    status: completed
  - id: batch4-vermoegenssteuer
    content: Quellenprüfung vermoegenssteuer.json (15 Quellen, 31 sourceRef-Blöcke -- aufwändigster Fall)
    status: completed
  - id: korrekturen
    content: Korrekturen automatisch anwenden + npm run lint && npm run build zur Validierung
    status: completed
isProject: false
---

# Quellenprüfung aller Topic-Dateien

## Ausgangslage

13 Topic-JSON-Dateien in `[public/data/](public/data/)` mit insgesamt ~131 Quellen, ~102 Arguments und unterschiedlichem Reifegrad:

- **Kritisch (keine URLs):** `emobilitaet.json` (11 Quellen), `heizung.json` (20 Quellen)
- **Einzelne fehlende URLs:** `gesundheit.json` (1), `bildung.json` (1), `energiewende.json` (1)
- **Vollständig mit URLs:** alle übrigen 8 Dateien
- **sourceRefs vorhanden:** nur `vermoegenssteuer.json` (31 Blöcke)

## Verfahren

Jede Datei wird per **verify-sources Skill** (`[.claude/skills/verify-sources/SKILL.md](.claude/skills/verify-sources/SKILL.md)`) geprüft, der das vollständige 6-Phasen-Verfahren aus `[AGENTS.md](AGENTS.md)` umsetzt. Korrekturen werden automatisch angewendet.

## Durchführungsplan

Die 13 Dateien werden in 4 Batches zu je 3-4 parallelen Subagents verarbeitet:

- **Batch 1:** `emobilitaet`, `heizung`, `buergergeld`, `teilzeit`
- **Batch 2:** `migration`, `gleichberechtigung`, `vegane-ernaehrung`, `gesundheit`
- **Batch 3:** `bildung`, `verkehrswende`, `klimawandel`
- **Batch 4:** `energiewende`, `vermoegenssteuer`

## Ergebnis-Handling

Alle Ergebnisse werden in einer einzigen Berichtsdatei `QUELLENPRÜFUNG.md` im Projektstamm gesammelt. Aufbau:

```
# Quellenprüfung -- Gesamtbericht

## emobilitaet.json
Quellen: X geprüft, Y mit URL ergänzt

| # | Quelle | Status | Details |
|---|--------|--------|---------|
| 1 | Label  | VERIFIZIERT / ABWEICHUNG / ... | ... |

Durchgeführte Korrekturen:
- ...

## heizung.json
...
```

Korrekturen werden **automatisch** angewendet -- fehlende URLs ergänzt, abweichende Zahlen korrigiert, nicht verifizierbare sourceRefs entfernt. Falsche Claims werden korrigiert oder entfernt. Am Ende aller Batches: `npm run lint && npm run build` zur Validierung.

## Regeln

- Keine erfundenen URLs oder Zahlen -- nur tatsächlich online gefundene Daten
- Lieber `sourceRef` entfernen als unverifizierte Daten behalten
- Jede Änderung wird dokumentiert
- Kein Commit ohne Nutzeranweisung

