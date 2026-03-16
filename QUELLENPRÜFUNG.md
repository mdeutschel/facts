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

- Stark belastbar bleiben die Copernicus-Rekorddaten für `2024`, die UBA-Emissionsdaten, GDV-/Munich-Re-Schadensdaten, NOAA/NASA-Kernaussagen sowie die wirtschaftlichen Hauptbefunde aus PIK und BCG.
- Korrigiert wurden vor allem überpräzise oder schwach belegte Stellen: `422,1 ppm` statt `~427 ppm`, Entfernung der `62 %`-Strommixaussage, Abschwächung bei Korallenriffen, AMOC-Kaskaden und ökonomischen ROI-Behauptungen.
- Entfernt wurden nicht sauber abgesicherte Aussagen zu Wissenschaftsakademien, exakten historischen Emissionsrängen Deutschlands und der breiten `60- bis 270-mal`-Vulkan-Spanne.
- Die Datei wurde insgesamt auf stärker direkt belegte Klimafakten zurückgeführt; auch hier fehlen aber weiterhin `sourceRefs`.

## energiewende.json

- Verifiziert und korrigiert wurden vor allem die Agora-/Fraunhofer-/BNetzA-Kernzahlen: `55,3 %` erneuerbarer Stromanteil 2025 statt `62 %`, französische AKW-Verfügbarkeitsprobleme `2022`, `573` Negativpreisstunden 2025 sowie Import-/Exportmengen im Stromverbund.
- Entschärft wurden mehrere überpräzise oder nur mittelbar belegte Stellen: Dunkelflauten jetzt qualitativ statt mit harter Jahresfrequenz, Speicherstand Ende 2025 konservativ als `>20 GWh`, Stromverbund ohne ungesicherte prozentuale EE-Anteile, Argumente zu Gas-/Uranabhängigkeit und Atommüll weniger zugespitzt.
- Die Datei bleibt inhaltlich pro-erneuerbar, stützt sich aber jetzt stärker auf unmittelbar belastbare Systemdaten statt auf zugespitzte Exaktbehauptungen.

## vermoegenssteuer.json

- Verifiziert und beibehalten wurden die Bundesbank-/DIW-/OECD-Kernaussagen zur hohen Vermögenskonzentration, zum niedrigen Aufkommen vermögensbezogener Steuern in Deutschland und zur rechtlichen Fortgeltung des Vermögensteuergesetzes.
- Korrigiert bzw. entschärft wurden mehrere riskante Zuspitzungen: Median- und Gini-Angaben leicht bereinigt, der Milliardärs-Statblock qualitativ gemacht, die OECD-Vergleichstabelle um einen unsauberen Kolumbien-Eintrag reduziert und mehrere Argumentantworten von harten Exaktbehauptungen auf belastbare Strukturargumente zurückgeführt.
- Offen stark interpretationsabhängig bleiben einzelne Aufkommens- und Erbschaftsteuer-Verteilungszahlen aus interessengeleiteten Studien; diese wurden soweit möglich konservativer formuliert statt mit zusätzlicher Scheingenauigkeit zu arbeiten.

## Follow-up: sourceRefs & Primärquellen

- In den Topic-Dateien ohne bisherige `sourceRefs` wurden in einem Nachgang konservativ claimnahe Referenzen ergänzt, wo die Zuordnung aus den vorhandenen Quellen sauber möglich war; breit formulierte oder gemischte Blöcke blieben bewusst ohne `sourceRefs` oder wurden sprachlich entschärft.
- Besonders stark nachgezogen wurden `buergergeld.json`, `teilzeit.json`, `migration.json`, `gleichberechtigung.json`, `vegane-ernaehrung.json`, `gesundheit.json`, `bildung.json`, `verkehrswende.json`, `klimawandel.json`, `energiewende.json`, `emobilitaet.json` und `heizung.json`.
- `vermoegenssteuer.json` erhielt zusätzlich strengere Quellenpflege: schwächere Sekundär-/Kommentarquellen wurden zurückgedrängt, ein offizieller BVerfG-Link und `Gesetze im Internet` für das `VStG` ergänzt sowie mehrere angreifbare Exaktbehauptungen zu Milliardärs- und Erbschaftsteuerfällen entfernt oder vorsichtiger formuliert.

## Follow-up 1: Restlücken in vier Dateien

- Für `emobilitaet.json`, `heizung.json`, `verkehrswende.json` und `energiewende.json` wurden weitere belastbare Primärquellen ergänzt, darunter `Zoll` zur Kfz-Steuerbefreiung von E-Fahrzeugen, `BMWE/BNetzA` zum Wasserstoff-Kernnetz, `BMUKN` zum finalen Atomausstieg sowie `EDF` zu den französischen Reaktorproblemen 2022.
- Damit konnten mehrere bislang unreferenzierte Mischblöcke nachträglich mit `sourceRefs` versehen oder auf besser belegbare Teilbehauptungen reduziert werden, etwa bei E-Auto-TCO, Wärmepumpen im Bestandsbau, E-Fuel-Effizienz, Radverkehrsbestandsdaten sowie Atomausstiegs- und Frankreich-2022-Passagen.
- Zusätzlich wurden in `energiewende.json` verrutschte `sourceRefs` bereinigt und beim Strommix-Block ein nicht sauber belegter Preisvergleich aus den referenzierten Tabellen/Stats entfernt, damit die Zuordnung wieder konsistent ist.

## Follow-up 2: Stabile Quellen-IDs statt Listenindizes

- Alle Topic-Dateien mit `sources` wurden von positionsbasierten `sourceRefs` wie `[1, 5]` auf explizite Quellen-IDs umgestellt.
- Jede Quelle besitzt nun ein festes `id`-Feld; die Blöcke referenzieren diese IDs direkt. Dadurch bleiben Referenzen stabil, auch wenn Quellen später ergänzt, umsortiert oder gelöscht werden.
- Die UI zeigt weiterhin nummerierte Quellen an, löst diese Nummern nun aber dynamisch über die jeweilige Quellen-ID auf. Bei der Migration wurden offensichtliche, bereits verrutschte Referenzen in `heizung.json` zusätzlich sachlich korrigiert.
- In einem anschließenden Audit der übrigen Topic-Dateien wurde noch eine klare Alt-Verschiebung in `klimawandel.json` behoben: Die Keeling-Kurve verweist nun wieder auf NOAA/Scripps, und die Extremwetter-Schadensblöcke referenzieren wieder `Munich Re` beziehungsweise `GDV` statt einer Emissionsquelle.
