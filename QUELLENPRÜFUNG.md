# Quellenprüfung

## emobilitaet.json

- Quellenliste auf echte, online erreichbare URLs umgestellt.
- Belastbar verifiziert und beibehalten: `2.034.260` BEV zum `1. Januar 2026`, `19,1 %` BEV-Marktanteil 2025, `>190.000` öffentliche Ladepunkte, `-73 %` Lebenszyklus-Emissionen laut ICCT, Mindestleistung `4,2 kW` bei Dimmung nach `§ 14a EnWG`, EU-Rückgewinnungsziele für Batterierohstoffe.
- Entfernt oder entschärft wurden nicht sauber primär belegte Exaktwerte zu Batterie-Lebensdauer, ADAC-TCO-Beispielrechnungen, Strombedarfs-Szenarien, E-Fuel-/Wasserstoff-Wirkungsgraden, Brandstatistik auf Basis von `AutoinsuranceEZ` sowie Reichweiten- und Ladezeit-Exaktzahlen.
- Quellenstruktur bereinigt: schwache oder unpräzise Labels wurden durch autoritativere KBA-, BMUKN-, Bundesnetzagentur-, ADAC-, ICCT- und EU-Quellen ersetzt.

## heizung.json

- Quellenliste vollständig auf verlinkte Primär- und institutionelle Sekundärquellen umgestellt.
- Belastbar verifiziert und beibehalten: Fraunhofer-ISE-Bestandsdaten (`77` Gebäude, `JAZ 3,4/4,3`, `-64 % CO₂`), BWP-/BDH-Absatzzahlen, Destatis-Neubauwerte (`69,4 %` fertiggestellte Wohngebäude, `81,0 %` genehmigte Wohngebäude mit Wärmepumpe), VKU-/MVV-Aussagen zur Wärmewende, KfW-Förderlogik, EHPA-Markttrend 2025 und TA-Lärm-Richtwert `35 dB(A)`.
- Korrigiert wurden unter anderem: `21,6` auf `21,7 Mio. Heizungen`, `Öl 17 %` auf `19 %`, ETS2-Start von `2028` auf `ab 2027`, CO₂-Kosten bei `55 EUR/t` von `110` auf rund `220 EUR/Jahr`, EHPA-Verkäufe von `11 % / 2,63 Mio.` auf `10 % / rund 2,62 Mio.`.
- Entfernt oder entschärft wurden nicht sauber verifizierbare Modellrechnungen und Detailzahlen in `kostenvergleich`, `gesetzeslage-gmg`, `stromnetz`, `fachkraefte`, `kaelteleistung` sowie mehrere H₂-/Gasnetz-Exaktwerte.

## buergergeld.json

- Veraltete BMAS-URL ersetzt; Quellenbasis um eine spezifischere BA- und eine Regierungsquelle ergänzt.
- Belastbar verifiziert und korrigiert: Regelbedarfe (`563 / 506 / 471 / 390 EUR`), Nullrunden 2025/2026 mit Besitzschutzlogik, WSI-Lohnabstände (`+557 EUR` Single, `+749 EUR` alleinerziehend) samt korrigierter Zwischenwerte (`1.015 / 1.572 EUR` bzw. `1.783 / 2.532 EUR`).
- Präzisiert wurde die Sanktionslage: vollständiger Wegfall des Regelbedarfs nur unter engen Voraussetzungen bei wiederholter Verweigerung tatsächlich und unmittelbar möglicher zumutbarer Arbeit; Unterkunftskosten bleiben davon unberührt.
- Entfernt wurden die nicht belastbar öffentlich verifizierte `421`-Betrugszahl und die dazugehörige Visualisierung. Aussagen zu EU-Ausländern und ukrainischen Geflüchteten wurden rechtlich und historisch präziser formuliert.

## teilzeit.json

- Die n-tv-Sekundärquelle wurde durch die originäre IAB-Presseinfo ersetzt.
- Belastbar verifiziert und beibehalten: `61,26 Mrd.` Arbeitsvolumen 2025, `45,98 Mio.` Erwerbstätige, `39,9 %` Teilzeitquote sowie die Destatis-Werte zu Teilzeitgründen (`27,9 / 23,5 / 11,6 / 4,9 / 4,8 %`).
- Korrigiert wurden mehrere Übertreibungen: Bei Frauen ist Care-Arbeit nicht der alleinige Hauptgrund, sondern liegt mit `28,8 %` nahezu gleichauf mit dem eigenen Wunsch (`28,9 %`); die Gen-Z-Vergleichswerte wurden zeitlich sauber auf `2023` bezogen.
- Entschärft wurden zu starke Schlussfolgerungen in den Argumenten zu Arbeitsvolumen, Studierendenbeschäftigung und Teilzeit als vermeintlicher Hauptursache des Fachkräftemangels.

## migration.json

- Belastbar verifiziert wurden vor allem die BAMF-Asylzahlen für 2025 und Januar 2026 sowie die IAB-Daten zur Arbeitsmarktintegration der 2015 zugezogenen Geflüchteten.
- Korrigiert wurden Datierungen und Verallgemeinerungen: Die `64 %` beziehen sich auf Ende `2024` und neun Jahre nach dem Zuzug, nicht pauschal auf `2025` oder `10 Jahre`.
- Entfernt oder stark entschärft wurden die nicht sauber belegten Teile zum Kriminalitätsblock, zur gesamtwirtschaftlichen IW-Zahl und zur pauschalen Beschäftigungsquote der ausländischen Gesamtbevölkerung.
- Die Jahresreihe der Asylzahlen wurde auf aktuell sicher belegte Werte reduziert; die Datei enthält weiterhin keine `sourceRefs`.

## gleichberechtigung.json

- Die Kernzahlen zu Gender Pay Gap, Gender Care Gap, Frauen in Führungspositionen und Frauenanteil im Bundestag sind belastbar verifiziert.
- Präzisiert wurden mehrere Argumente: Branche und Beruf erklären rund `18 %` der Lohnlücke; die Gesamtarbeitszeit ist ähnlich hoch, aber Frauen leisten mehr unbezahlte Arbeit; der Gender Pension Gap wurde auf aktuelle Destatis-Abgrenzungen (`24,2 %` bzw. `36,2 %`) aktualisiert.
- Die Child-Penalty-Passage wurde auf eine belastbare ZEW-Aussage umgestellt: Mütter verdienen im vierten Jahr nach der ersten Geburt durchschnittlich fast `30.000 Euro` weniger als vergleichbare Frauen ohne Kinder.
- Entfernt wurden unbelegte Zuspitzungen zu Quotenrecht, informellen Männernetzwerken und pauschalen Erfolgsbehauptungen zu diversen Führungsteams.

## vegane-ernaehrung.json

- Der belastbare Kern bleibt bestehen: weniger tierische Produkte senken Umwelt- und Klimabelastungen deutlich, die DGE empfiehlt mehr als `3/4` pflanzliche Ernährung, und global könnten bei veganer Ernährung mehr als `75 %` der Agrarfläche frei werden.
- Entfernt oder entschärft wurden nicht sauber belegte Exaktzahlen zu täglichen CO₂-Werten, Produkt-CO₂-Bilanzen, Wasserwerten für Soja und Pflanzenmilch sowie die unpassend zugeordnete Oxford-Kostenaussage.
- Korrigiert wurden unter anderem `15.000` auf `15.400 Liter` Wasser für `1 kg` Rindfleisch, `80 %` auf `83 %` Agrarflächenanteil für Tierprodukte sowie die DGE-Quellenstruktur.
- Mehrere Argumente wurden auf gut belegte Kernaussagen reduziert, etwa bei Soja, B12, Fleischkonsum und Kosten.

## gesundheit.json

- Die Quellenliste wurde auf konkrete OECD-, BAS-, BMG-, Zi-, GKV- und RKI-/GBE-Zielseiten umgestellt; eine fehlende Spiegel-/Doctolib-URL wurde ergänzt.
- Belastbar verifiziert und korrigiert wurden unter anderem `346,6 Mrd. Euro` GKV-Ausgaben 2025, `17,5 %` Gesamtbeitragssatz 2026, `1.841` Krankenhäuser bei `72 %` Bettenauslastung, `5,7 Mio.` Pflegebedürftige Ende 2023 sowie die Pflegeprognosen `90.000 / 280.000 / 690.000`.
- Entfernt oder berichtigt wurden problematische Angaben wie `~51 Mrd. Euro` Finanzierungslücke, `7,6 Betten pro 10.000` Einwohner, die Reformangaben `2028` und `29 Milliarden`, sowie unbelegte Psychotherapie- und Geflüchtetenkosten-Zahlen.
- Die Datei enthält weiterhin keine `sourceRefs`; mehrere verbliebene Aussagen sind deshalb nur auf Abschnittsebene, nicht claimgenau, zuordenbar.

## bildung.json

- Verifiziert und beibehalten wurden vor allem die Destatis-Bildungsausgaben `198 Mrd. Euro`, die IW-Prognose von `35.000 / 68.000 / 76.000` fehlenden Lehrkräften sowie die PISA-2022-Kernzahlen.
- Korrigiert wurden mehrere Quellenprobleme: defekte oder zu generische URLs bei KMK, PISA, bpb und Prognos wurden durch präzisere Zielseiten ersetzt.
- Entfernt oder entschärft wurden die überschlägige `100-Mrd.-Euro`-Mehrinvestitionsbehauptung, die harte Superlative zur sozialen Ungleichheit sowie die unzureichend belegten Kita-Unterbesetzungswerte.
- Der DigitalPakt-Abschnitt wurde auf den verifizierten Stand gebracht: Zwischenbericht seit `2025`, nicht erst `2027`.

## verkehrswende.json

- Belastbar verifiziert und beibehalten wurden insbesondere KBA-, VDV-, Destatis-, MiD- und Fraunhofer-Kernaussagen zur Fahrzeugentwicklung, zum Deutschlandticket, zu Unfallzahlen und zu Radverkehrspotenzialen.
- Korrigiert wurden u. a. die Deutschlandticket-Aussage (`2025` rund `8 %` Kündigungsquote, `2026` `5,75 %`) und die Verletztenzahl 2025 (`366.000` statt `370.000`).
- Entfernt oder entschärft wurden mehrere nicht sauber belegte Flächen-, Lärm- und Subventionszahlen sowie zugespitzte Raumverbrauchs- und Zitatpassagen.
- Die Datei enthält weiterhin keine `sourceRefs`; mehrere verbleibende Aussagen sind daher nur auf Abschnittsebene abgesichert.

## klimawandel.json

- Deutlich nachgeschärft wurden die Primärquellen für die Kernblöcke: `Copernicus` jetzt mit Press-Deep-Link plus Jahresdatensatz `1850–2024`, `WMO` für den globalen CO₂-Mittelwert `2024`, `NOAA` für die Mauna-Loa-Reihe, `Munich Re` getrennt für `2024` und `2025`, `GDV` für Deutschland-/Ahrtal-Schäden, `UBA` inkl. `Data Cube` für Emissionssektoren, `IPCC WGIII` und `IEA` für den Kostenblock sowie `Oreskes`/`Cook`/`Lynas` für den Konsensblock.
- Inhaltlich gehärtet wurden vor allem die angreifbaren Stellen: CO₂ jetzt sauber getrennt in globalen Mittelwert (`423,9 ppm`) und Keeling-Kurve am `Mauna Loa`, Extremwetter ohne schwach belegte Ahrtal-Gesamtschäden/Wiederaufbauzahlen, Kippelemente mit konservativeren Schwellen und ohne das zuvor missverständlich als Kipppunkt geführte arktische Sommereis, sowie ein neu gebauter Kostenblock ohne die problematischen `PIK`-/`BCG`-Exaktbehauptungen.
- Zusätzliche `sourceRefs` wurden für bisher schwächer abgesicherte Blöcke ergänzt, insbesondere bei deutschen Emissionssektoren sowie im Block zum wissenschaftlichen Konsens.
- Die Argumentantworten wurden ebenfalls nachgehärtet: weniger zugespitzte Aussagen zu Jobs, Jetstream/Kälte, China/Indien, Vulkanen und Kosten; stärkerer Fokus auf robuste Kernaussagen statt auf angreifbare Detailbehauptungen.
- Die Datei ist damit deutlich robuster gegen typische Fehlinfo-Angriffe, weil jetzt stärker zwischen belastbaren Messwerten, offiziellen Zielgrößen, Modellpfaden und unsicheren Kipprisiken getrennt wird.

## energiewende.json

- Nachgeschärft wurden die Quellen vor allem bei `AGEB`, `Lazard`, `BNetzA/SMARD`, `Eurostat`, `EDF`, `KENFO`, `BGE`, `ACER` sowie mehreren Projektquellen zu westlichen AKW-Neubauten und `SMR`.
- Inhaltlich gehärtet wurden besonders die angreifbaren Abschnitte: Uranabhängigkeit jetzt ohne schwache Exaktanteile, LCOE in Originaleinheit `USD/MWh` statt unsauber umgerechneter Cent-Werte, westliche AKW-Neubauten mit Fokus auf Budgetüberschreitungen und lange Bauzeiten statt auf scheinpräzise Kostenstände, Dunkelflauten/Speicher/Atommüll deutlich konservativer und stärker an Primärquellen gebunden.
- Zusätzlich wurden mehrere Argumentantworten nüchterner formuliert, damit sie weniger auf Schlagworte und stärker auf systemische Kernaussagen zu Kosten, Zeit, Abhängigkeiten, Verbundsystem und Endlagerung setzen.

## vermoegenssteuer.json

- Verifiziert und beibehalten wurden die Bundesbank-/DIW-/OECD-Kernaussagen zur hohen Vermögenskonzentration, zum niedrigen Aufkommen vermögensbezogener Steuern in Deutschland und zur rechtlichen Fortgeltung des Vermögensteuergesetzes.
- Korrigiert bzw. entschärft wurden mehrere riskante Zuspitzungen: Median- und Gini-Angaben leicht bereinigt, der Milliardärs-Statblock qualitativ gemacht, die OECD-Vergleichstabelle um einen unsauberen Kolumbien-Eintrag reduziert und mehrere Argumentantworten von harten Exaktbehauptungen auf belastbare Strukturargumente zurückgeführt.
- Offen stark interpretationsabhängig bleiben einzelne Aufkommens- und Erbschaftsteuer-Verteilungszahlen aus interessengeleiteten Studien; diese wurden soweit möglich konservativer formuliert statt mit zusätzlicher Scheingenauigkeit zu arbeiten.

## Follow-up: sourceRefs & Primärquellen

- In den Topic-Dateien ohne bisherige `sourceRefs` wurden in einem Nachgang konservativ claimnahe Referenzen ergänzt, wo die Zuordnung aus den vorhandenen Quellen sauber möglich war; breit formulierte oder gemischte Blöcke blieben bewusst ohne `sourceRefs` oder wurden sprachlich entschärft.
- Besonders stark nachgezogen wurden `buergergeld.json`, `teilzeit.json`, `migration.json`, `gleichberechtigung.json`, `vegane-ernaehrung.json`, `gesundheit.json`, `bildung.json`, `verkehrswende.json`, `klimawandel.json`, `energiewende.json`, `emobilitaet.json` und `heizung.json`.
- `vermoegenssteuer.json` erhielt zusätzlich strengere Quellenpflege: schwächere Sekundär-/Kommentarquellen wurden zurückgedrängt, ein offizieller BVerfG-Link und `Gesetze im Internet` für das `VStG` ergänzt sowie mehrere angreifbare Exaktbehauptungen zu Milliardärs- und Erbschaftsteuerfällen entfernt oder vorsichtiger formuliert.

## verkehrswende.json

- Die Datei wurde erneut auf Deep Links und claimnähere Quellen umgestellt, unter anderem `KBA`, `VDV`, `UBA`-Tabellen/PDFs, `Destatis`, `BNetzA`, `BBSR`, `BMV/MiD`, `ADAC`, `FÖS`, `Fraunhofer ISI` und `Stadt Oldenburg`.
- Gehärtet wurden vor allem die typischen Angriffsflächen: Deutschlandticket nun stärker an `VDV` gebunden und bei Preis-/Kündigungsfragen konservativer, Verkehrs-Ziellücke direkt an `UBA`-Projektionen rückgebunden, Flächenverbrauch ohne schwache Raum- und Kostenexaktheit neu aufgebaut, Gesundheitsblock ohne veraltete `~4.000 Herzinfarkte`-Zahl, soziale Teilhabe ohne überpräzise Autokosten-/Subventionsbehauptungen.
- Auch die Argumentantworten wurden entschärft und stärker auf belastbare Kernaussagen zurückgeführt, etwa bei Reichweite, Stromnetz, Radwegen, Tempo 30, ländlicher Mobilität und Deutschlandticket.

## Follow-up 3: Quellenbereinigung und weitere Härtung

- Die bereits nachgeschärften Dateien `klimawandel.json`, `energiewende.json` und `verkehrswende.json` wurden zusätzlich auf tatsächlich genutzte Quellen bereinigt, damit die `sources`-Listen nur noch claimrelevante Einträge enthalten und keine Karteileichen aus früheren Bearbeitungen mitlaufen.

## migration.json

- Nachgeschärft wurden vor allem die Stellen, an denen die bisherige Quellenlage über die belegbaren Aussagen hinausging: Die Arbeitsmarktintegration bleibt klar mit `IAB` unterlegt, aber pauschale Aussagen zu Verdrängung, generellen Engpassberufen oder wirtschaftlichem Gesamtnutzen wurden zurückgenommen.
- Ergänzt wurde eine belastbarere Demografie-Einordnung über `Destatis`: Selbst bei hoher Nettozuwanderung sinkt die Zahl der 20- bis 66-Jährigen bis Mitte der 2030er Jahre deutlich, sodass der Fokus stärker auf Arbeitsmarktintegration statt auf pauschale Nutzenbehauptungen gelegt wird.
- Zusätzlich wurden die Argumentantworten konservativer formuliert, insbesondere zu Bürgergeldbezug, Jobs, Bildung und Kosten, und enger an die tatsächlich abgedeckten `IAB`-/`Destatis`-Befunde rückgebunden.

## gesundheit.json

- Ersetzt wurden die schwächsten Quellen und Zuspitzungen vor allem bei Wartezeiten und psychischer Versorgung: Statt der schwer prüfbaren `Doctolib`-/`Spiegel`-Passage stützt sich die Datei jetzt auf `GKV-Spitzenverband`, `KBV` und `Zi`-Primärquellen.
- Gehärtet wurden außerdem die Strukturblöcke zu Beitragssätzen, Pflege und Prävention: Der Beitrags-Chart startet nun erst dort, wo die Systematik vergleichbar ist; Pflege trennt sauber zwischen aktueller Zahl der Pflegebedürftigen und Pflegekräftevorausberechnung; Präventions- und Arzneimittelausgaben wurden an `Destatis`/`RKI` rückgebunden.
- Auch mehrere Argumentantworten wurden nüchterner gefasst, etwa zu Zwei-Klassen-Medizin, Geflüchtetenversorgung, Homöopathie und Pharma, damit sie weniger auf zugespitzten Beispielen und stärker auf belegbaren Systemaussagen beruhen.

## buergergeld.json

- Die Datei wurde enger an Primärquellen aus `BMAS`, `Bundesregierung`, `BA` und `Gesetze im Internet` gebunden. Nullrunde, Regelsätze und Sanktionen sind jetzt zusätzlich mit den einschlägigen Regierungs- und Gesetzesquellen abgesichert.
- Nachgeschärft wurden besonders die typischen Angriffsflächen: Lohnabstand bleibt an `WSI` gebunden und wird als Bundesdurchschnitt gekennzeichnet; Missbrauch wird ausdrücklich nicht pauschal quantifiziert; Zugangsfragen für EU-Bürger, Asylbewerber und ukrainische Geflüchtete sind nun als Rechtslage statt als zugespitzte Debattenbehauptung formuliert.
- Ergänzend wurde die Quellenliste bereinigt, damit nur noch tatsächlich im Inhalt referenzierte Einträge verbleiben.

## Follow-up 1: Restlücken in vier Dateien

- Für `emobilitaet.json`, `heizung.json`, `verkehrswende.json` und `energiewende.json` wurden weitere belastbare Primärquellen ergänzt, darunter `Zoll` zur Kfz-Steuerbefreiung von E-Fahrzeugen, `BMWE/BNetzA` zum Wasserstoff-Kernnetz, `BMUKN` zum finalen Atomausstieg sowie `EDF` zu den französischen Reaktorproblemen 2022.
- Damit konnten mehrere bislang unreferenzierte Mischblöcke nachträglich mit `sourceRefs` versehen oder auf besser belegbare Teilbehauptungen reduziert werden, etwa bei E-Auto-TCO, Wärmepumpen im Bestandsbau, E-Fuel-Effizienz, Radverkehrsbestandsdaten sowie Atomausstiegs- und Frankreich-2022-Passagen.
- Zusätzlich wurden in `energiewende.json` verrutschte `sourceRefs` bereinigt und beim Strommix-Block ein nicht sauber belegter Preisvergleich aus den referenzierten Tabellen/Stats entfernt, damit die Zuordnung wieder konsistent ist.

## Follow-up 2: Stabile Quellen-IDs statt Listenindizes

- Alle Topic-Dateien mit `sources` wurden von positionsbasierten `sourceRefs` wie `[1, 5]` auf explizite Quellen-IDs umgestellt.
- Jede Quelle besitzt nun ein festes `id`-Feld; die Blöcke referenzieren diese IDs direkt. Dadurch bleiben Referenzen stabil, auch wenn Quellen später ergänzt, umsortiert oder gelöscht werden.
- Die UI zeigt weiterhin nummerierte Quellen an, löst diese Nummern nun aber dynamisch über die jeweilige Quellen-ID auf. Bei der Migration wurden offensichtliche, bereits verrutschte Referenzen in `heizung.json` zusätzlich sachlich korrigiert.
- In einem anschließenden Audit der übrigen Topic-Dateien wurde noch eine klare Alt-Verschiebung in `klimawandel.json` behoben: Die Keeling-Kurve verweist nun wieder auf NOAA/Scripps, und die Extremwetter-Schadensblöcke referenzieren wieder `Munich Re` beziehungsweise `GDV` statt einer Emissionsquelle.
