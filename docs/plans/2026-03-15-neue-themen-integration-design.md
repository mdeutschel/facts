# Design: Integration neuer Themen (Verkehrswende, Bürgergeld, Migration)

## 1. Übersicht
Die App "Fakten-Stammtisch" wird um drei neue Themenbereiche erweitert. Die Integration erfolgt rein datengetrieben über neue JSON-Dateien, ohne dass Änderungen am React-Code oder der Routing-Logik erforderlich sind.

## 2. Architektur & Datenstruktur
*   **Zentrale Index-Datei:** `public/data/topics.json` wird um drei neue `TopicMeta`-Einträge ergänzt.
*   **Neue Datendateien:**
    *   `public/data/verkehrswende.json`
    *   `public/data/buergergeld.json`
    *   `public/data/migration.json`
*   **Schema-Konformität:** Alle Dateien folgen strikt den TypeScript-Interfaces aus `src/types/index.ts`. Insbesondere werden visuelle `ContentBlock`-Typen (`stat_grid`, `comparison`, `bar_chart`) genutzt.

## 3. Inhaltlicher Fokus (Stand 2026)
*   **Verkehrswende:** Antriebswende (E-Mobilität vs. Verbrenner), ÖPNV-Ausbau, Emissionsziele, E-Fuels.
*   **Bürgergeld:** Aktuelle Regelsätze 2026, Sanktionsmechanismen, Lohnabstandsgebot (Bürgergeld vs. Mindestlohn), Missbrauchsstatistiken.
*   **Migration:** Asylantragszahlen (2025/2026), Fachkräfteeinwanderung, Arbeitsmarktintegration, demografischer Wandel.

## 4. Recherche-Strategie
Die Datenbeschaffung erfolgt über parallele KI-Agenten, die gezielt nach offiziellen und verlässlichen Quellen suchen:
*   Destatis (Statistisches Bundesamt)
*   Bundesagentur für Arbeit (BA)
*   Bundesamt für Migration und Flüchtlinge (BAMF)
*   Kraftfahrt-Bundesamt (KBA)
*   Bundesministerien (BMAS, BMDV, BMI)

## 5. Umsetzungsschritte
1.  Parallele Web-Recherche durch Sub-Agenten für alle drei Themen.
2.  Strukturierung der Rohdaten in das geforderte JSON-Format.
3.  Validierung der JSON-Dateien gegen das TypeScript-Schema.
4.  Lokaler Test der App (Lint & Build).
