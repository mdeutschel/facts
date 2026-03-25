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

Jeder Inhaltsblock und jedes Argument MUSS diese 7 Prüfungen bestehen:

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

## Ablauf Review (Review-Modus)

1. **Laden** — `public/data/$ARGUMENTS.json` lesen, alle `arguments` und `sections` extrahieren
2. **Analysieren** — Pro Argument alle 7 Dimensionen bewerten. Pro Abschnitt Dimensionen 1–4 und 6 prüfen.
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
