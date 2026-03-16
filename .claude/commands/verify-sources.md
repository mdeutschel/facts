# Quellenverifizierung für Topic-Factsheets

Verifiziere alle Quellen und Daten in einer Topic-JSON-Datei gegen die tatsächlichen Online-Quellen.

## Eingabe

Topic-ID: $ARGUMENTS (z.B. `vermoegenssteuer`, `klimawandel`)
Datei: `public/data/{topicId}.json`

## Ablauf

### Phase 1: Analyse

1. Lies die JSON-Datei `public/data/$ARGUMENTS.json`
2. Extrahiere das `sources`-Array und alle `sourceRefs` aus den Content-Blöcken
3. Erstelle eine Übersicht:
   - Welche Quellen haben URLs? Welche nicht?
   - Welche Content-Blöcke referenzieren welche Quellen?
   - Welche konkreten Zahlen/Behauptungen werden gemacht?

### Phase 2: URL-Beschaffung (parallel)

Starte für JEDE Quelle OHNE URL einen separaten Subagent (Explore-Typ), der:
- Den Quellentitel im Web sucht
- Die korrekte URL findet
- Key Data Points von der Quelle extrahiert
- Das Ergebnis zurückgibt

Starte alle Subagents PARALLEL für maximale Geschwindigkeit.

### Phase 3: Quellenverifizierung (parallel)

Starte für JEDE Quelle MIT URL (einschl. neu gefundener) einen separaten Subagent (Explore-Typ), der:
- Die URL abruft (WebFetch/WebSearch)
- Alle konkreten Zahlen und Datenpunkte extrahiert
- Die Ergebnisse zurückgibt

Starte alle Subagents PARALLEL.

### Phase 4: Abgleich

Für jeden Content-Block mit sourceRefs:
1. Prüfe ob die referenzierte Quelle die behaupteten Zahlen enthält
2. Klassifiziere als:
   - **VERIFIZIERT**: Zahl/Aussage stimmt mit Quelle überein
   - **ABWEICHUNG**: Zahl weicht ab (dokumentiere Soll vs. Ist)
   - **NICHT VERIFIZIERBAR**: Quelle enthält die Information nicht (von Webseite aus)
   - **FALSCH**: Quelle widerspricht der Behauptung

### Phase 5: Bericht

Erstelle einen strukturierten Bericht:

```
## Verifikationsbericht: {topicId}

### Quellen ohne URL (vorher → nachher)
- [N] Quelle X → URL gefunden: ...
- [N] Quelle Y → URL gefunden: ...

### Verifizierte Daten ✓
- Section "xyz", Block N: "123 Mrd." → Quelle [N] bestätigt ✓

### Abweichungen ⚠
- Section "xyz", Block N: JSON sagt "44%", Quelle [N] sagt "42%" → KORREKTUR NÖTIG

### Nicht verifizierbar ❓
- Section "xyz", Block N: Behauptung "..." → Quelle [N] enthält diese Info nicht

### Falsch ✗
- Section "xyz", Block N: JSON sagt "72% Erben", Quelle [N] sagt "60% Selfmade" → KORREKTUR NÖTIG
```

### Phase 6: Korrekturen

Frage den User: Soll ich die gefundenen Abweichungen und fehlenden URLs korrigieren?

Falls ja:
1. Ergänze fehlende URLs in der `sources`-Sektion
2. Korrigiere falsche Zahlen (nur wenn durch Quelle eindeutig belegt)
3. Entferne sourceRefs die nachweislich falsch sind
4. Passe Fließtexte an korrigierte Zahlen an
5. Führe `npm run lint && npm run build` aus

## Regeln

- **KEINE Halluzinationen**: Nur Zahlen verwenden, die tatsächlich aus der Online-Quelle extrahiert wurden
- **Konservativ korrigieren**: Im Zweifel sourceRef entfernen statt falsche Daten stehen lassen
- **Transparenz**: Jede Änderung im Bericht dokumentieren
- **Quellenintegrität**: Nie eine Quelle erfinden oder eine URL raten
- **Parallel arbeiten**: Subagents für unabhängige Quellen immer parallel starten
