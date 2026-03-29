# Anweisungen für Claude Code

@AGENTS.md

## Claude-spezifischer Workflow

- Antworte auf Deutsch, Code und Kommentare auf Englisch
- Greife minimal-invasiv in den Code ein — kein Over-Engineering
- Debug-Ausgaben sparsam: primär für Fehler, mehr nur auf Anweisung
- Kein Commit ohne explizite Anweisung durch den Nutzer
- Vor Library-Nutzung: aktuelle Docs prüfen (MUI v7, React 19, Vite 8)
- Vor dem Melden als fertig: Definition of Done aus AGENTS.md einhalten

## Projektspezifischer Kontext

- MUI v7 hat Breaking Changes gegenüber v6 (Pigment CSS, neue Slot-API)
- React 19 Actions, `use()`, `useOptimistic()` sind verfügbar
- Vite 8 nutzt natives ESM — keine CommonJS-Importe
- Recharts wird lazy geladen (`React.lazy`)
