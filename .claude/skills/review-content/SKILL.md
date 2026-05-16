---
name: review-content
description: Prüft Topic-JSON-Inhalte auf argumentative Qualität, Ausgewogenheit und intellektuelle Redlichkeit. Verwenden beim Erstellen neuer Themeninhalte, beim Hinzufügen von Abschnitten oder Argumenten, beim Bearbeiten bestehender Inhalte oder wenn der Nutzer eine Prüfung oder Verbesserung der argumentativen Stärke eines Factsheets wünscht.
argument-hint: "[topicId]"
allowed-tools: Read, Glob, Grep, Bash, WebSearch, Agent, TodoWrite, AskUserQuestion, Edit
---

# Inhaltliche Qualitätsprüfung für `public/data/$ARGUMENTS.json`

Ergänzt `verify-sources` (das die Datenlage prüft). Dieser Skill prüft, ob **Framing, Argumentation und Darstellung** intellektuell ehrlich sind und schwer angreifbar bleiben.

## Wann ausführen

- **Review-Modus**: Auf ausdrückliche Anfrage oder nach umfangreichen inhaltlichen Änderungen — liefert einen strukturierten Bericht
- **Autor-Modus**: Beim Erstellen oder Erweitern von Themeninhalten — Qualitätsdimensionen vor dem Schreiben als Leitplanken anwenden

## Qualitätsdimensionen

Jeder Inhaltsblock und jedes Argument MUSS diese 8 Prüfungen bestehen:

### 1. Nuance & Teilwahrheiten

Stammtisch-Aussagen sind oft nur teilweise wahr. Ein `response` darf nicht als reine „Widerlegung“ gerahmt sein, wenn der Claim einen legitimen Kern hat.

- Ist ein Claim teilweise zutreffend, dies ausdrücklich anerkennen, bevor Gegenbeweise folgen
- Formulierungen wie „Der Kern stimmt, aber…“, „Das war bis X richtig, seitdem…“ nutzen
- Kennzeichnen, wenn das `response` ein komplexes Thema schwarz-weiß behandelt

### 2. Claim-Source-Fit

Die Quelle muss den konkreten Claim tatsächlich stützen. Überinterpretation ist der häufigste Fehler.

- Jeder `sourceRef` muss genau den Claim tragen, an den er gebunden ist — nicht mehr
- Stützt eine Quelle einen breiteren Trend, aber nicht die konkrete Zahl, das klar sagen
- `sourceRefs` entfernen, die den zugehörigen Inhaltsblock nicht direkt stützen

### 3. Annahmen-Transparenz

Kostenrechnungen und Projektionen müssen ihre Annahmen ehrlich offenlegen.

- Alle Rechnungen brauchen explizite Prämissen (Energiepreis, Nutzung, Region, Gebäudetyp)
- Sensitivität zeigen: Was ändert sich unter weniger günstigen Bedingungen?
- Bereichsangaben (`range_bar`) oder Einschränkungen in `text`-Blöcken bei unsicheren Projektionen nutzen
- Rechnungen kennzeichnen, die nur das Best-Case-Szenario zeigen

### 4. Fakt vs. Bewertung

Daten und Interpretation strikt trennen.

- `fact`- und `stat_grid`-Blöcke: nur überprüfbare Daten, keine Adjektive oder Framing
- `text`-Blöcke: dürfen Interpretation enthalten, müssen aber klar als solche erkennbar sein
- Argumente (`response`-Feld): Interpretation ist erwünscht, muss aber in den referenzierten Abschnitten verankert sein

### 5. Gegenargumente einbeziehen

Legitime Gegenpositionen stärken die Glaubwürdigkeit, wenn sie angesprochen statt ignoriert werden.

- Jedes Argument sollte die stärkste gegnerische Position anerkennen
- Muster wie „Kritiker wenden ein, dass… — allerdings zeigen die Daten…“
- Kann ein Gegenargument nicht mit Daten widerlegt werden, das ehrlich sagen
- `relatedSections` sollte auf Abschnitte verweisen, die die Belege liefern

### 6. Sprachliche Präzision

Absolutistische Sprache vermeiden, die unnötige Angriffsflächen schafft.

- **Nicht verwenden**: „beweist“, „widerlegt endgültig“, „die Medien verschweigen“, „eindeutig“
- **Besser**: „deutet darauf hin“, „die Daten zeigen“, „nach aktueller Studienlage“
- Notwendige Bedingungen nennen (z. B. „bei Nutzung erneuerbarer Energien“ bei EV-CO₂-Claims)
- Beim ersten Vorkommen volle Namen, Abkürzungen erst danach (z. B. „Statistisches Bundesamt (Destatis)“)

### 7. Argument-Claim-Passung

Das `response` muss den Claim direkt adressieren — nicht ein verwandtes, aber anderes Thema.

- `claim` und `response` als Paar lesen: Beantwortet das `response` tatsächlich die Frage?
- Kausallogik prüfen: Stützen die Belege die gezogene Schlussfolgerung?
- `relatedSections` muss Abschnitte enthalten, die das `response` wirklich untermauern
- `keywords` muss zu dem passen, was jemand bei diesem Claim sagen würde

### 8. Gesprächstauglichkeit

Ein Argument soll nicht nur als Faktencheck-Eintrag, sondern auch in der konkreten Gesprächssituation taugen. Die optionalen Felder `rhetoricalPattern` und `counterQuestions` adressieren das. Grundlage: politische Bildung (Hufer, bpb, KonterBUNT) und Misinformation-Forschung (Bruns et al., Scientific Reports 2024) — zusammengefasst im [Gesprächsleitfaden](https://fakten-stammtisch.de/leitfaden/).

**Wann beide Felder pflegen:**
- Bei jedem Argument mit Verdict (`false`, `mostly-false`, `misleading`, `lacks-context`, `outdated`, `partially-true`, `mostly-true`) — also überall, wo eine Behauptung faktisch eingeordnet werden kann.
- **Ausnahme:** Argumente ohne Verdict (normative Wertedebatten, politische Forderungen) brauchen keine Konter-Werkzeuge — dort gibt es keine Falschaussage zum Korrigieren.

**Anforderungen an `response`:**
- **Truth-Sandwich-Einstieg**: Mit der korrekten Aussage beginnen, nicht mit der Wiederholung der Parole. Statt „Es stimmt nicht, dass …" lieber „Tatsächlich ist es so, dass …" oder „Die Zahlen zeigen das Gegenteil: …".
- Frame der Parole nicht unnötig wiederholen (Lakoff).

**Anforderungen an `rhetoricalPattern` (optional, 2–4 Sätze):**
- Benennt das **Denkmuster** hinter der Parole (z. B. Pauschalisierung, Lump-of-Labor-Trugschluss, Anekdotenargument, falsche Dichotomie, Korrelation-statt-Kausalität).
- Erklärt, **warum** das Muster im konkreten Fall in die Irre führt — nicht nur „die Parole ist falsch, weil X".
- Wiederholt die Parole sprachlich **nicht** — bezeichnet sie höchstens distanziert („die Parole unterstellt …", „die Aussage tut so, als ob …").
- Weglassen, wenn kein erkennbares Muster vorliegt (z. B. bei reinen Zahlen-Streits) — leeres Feld ist besser als künstliches Muster.

**Anforderungen an `counterQuestions` (optional, 2–3 Fragen):**
- **Sokratisch**: Zwingen das Gegenüber zur Präzisierung statt zu belehren.
- **Konkret**: Lösen Pauschalbegriffe auf („Welchen Job konkret?", „Wen meinst du konkret?").
- **Nicht polemisch, nicht rhetorisch fangend**: Müssen auch ehrlich beantwortbar sein, keine versteckten Anklagen.
- **Du-Form**, direkt ansprechbar in einem Gespräch.
- Maximal 3 Fragen — mehr wirkt wie ein Verhör.
- Jede Frage adressiert einen anderen Aspekt der Parole (z. B. Konkretisierung, Perspektivwechsel, Folgefrage).

**Antipattern für Gegenfragen:**
- Suggestivfragen mit eingebauter Wertung („Findest du das nicht selber lächerlich?")
- Belehrungen als Frage verkleidet („Weißt du eigentlich, dass …?")
- Mehr als 3 Fragen (Verhör-Effekt)
- Fragen, die das Gegenüber demütigen oder ins Lächerliche ziehen

## Ablauf Review (Review-Modus)

1. **Laden** — `public/data/$ARGUMENTS.json` lesen, alle `arguments` und `sections` extrahieren
2. **Analysieren** — Pro Argument alle 8 Dimensionen bewerten. Pro Abschnitt Dimensionen 1–4 und 6 prüfen.
3. **Einordnen** — Jedes Befund bewerten:
   - ✓ **OK**: Prüfung bestanden
   - ⚠ **VERBESSERBAR**: Nicht falsch, aber erzeugt Angriffsfläche — Verbesserung vorschlagen
   - ✗ **PROBLEM**: intellektuell unehrlich oder logisch mangelhaft — muss behoben werden
4. **Berichten** — Befunde nach Dimension gruppiert darstellen, mit konkreten Korrekturvorschlägen
5. **Umsetzen** — Nach Bestätigung durch den Nutzer: JSON bearbeiten, danach `npm run lint && npm run build` ausführen

## Autor-Leitplanken (Autor-Modus)

Beim Schreiben neuer Inhalte vor dem Festhalten im JSON anwenden:

### Checkliste neues Argument

```
- [ ] Response erkennt den Wahrheitskern im Claim an (Dim 1)
- [ ] Jeder sourceRef stützt direkt den zugehörigen Claim (Dim 2)
- [ ] Rechnungen zeigen Annahmen und Sensitivität (Dim 3)
- [ ] Fakten und Interpretation klar getrennt (Dim 4)
- [ ] Stärkstes Gegenargument angesprochen (Dim 5)
- [ ] Keine absolutistische Sprache (Dim 6)
- [ ] Response beantwortet den Claim direkt (Dim 7)
- [ ] Response startet mit der korrekten Aussage (Truth Sandwich, Dim 8)
- [ ] rhetoricalPattern benennt das Denkmuster, ohne den Frame zu wiederholen (Dim 8, sofern Muster vorhanden)
- [ ] counterQuestions: 2–3 sokratische, konkrete, nicht polemische Fragen (Dim 8, bei Argumenten mit Verdict)
```

### Checkliste neuer Abschnitt

```
- [ ] Daten-Blöcke enthalten nur überprüfbare Fakten (Dim 4)
- [ ] Quellen stützen die konkreten Zahlen tatsächlich (Dim 2)
- [ ] Einschränkungen und Bedingungen genannt (Dim 3, 6)
- [ ] Keine aufgeladene Sprache in Beschriftungen oder Labels (Dim 6)
```

## Regeln

- **Kein Wegreden**: Berechtigte Kritik nicht entfernen — sie aufnehmen
- **Zurückhaltende Formulierungen**: Bei Unsicherheit abschwächen; nie überzeichnen
- **Strukturelle Ehrlichkeit**: Die Seite vertritt eine klare Position und nutzt gute Quellen — nicht so tun, als sei sie neutral, aber fair bleiben
- **Ergänzt verify-sources**: Dieser Skill prüft Framing; `verify-sources` prüft Datenlage. Beides bei neuen Inhalten ausführen.

## Referenz

Siehe `${CLAUDE_SKILL_DIR}/reference.md` für konkrete Beispiele problematischer Muster und ihrer Korrekturen, abgeleitet aus realem Feedback.
