# Neue Themen Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integration der drei neuen Themen (Verkehrswende, Bürgergeld, Migration) durch Recherche und Erstellung valider JSON-Dateien.

**Architecture:** Da die App rein datengetrieben ist, werden keine React-Komponenten angefasst. Es werden drei neue JSON-Dateien in `public/data/` erstellt und in `public/data/topics.json` registriert.

**Tech Stack:** JSON, TypeScript (für Schema-Validierung), Web-Recherche.

---

### Task 1: Recherche & Erstellung Verkehrswende

**Files:**
- Create: `public/data/verkehrswende.json`

**Step 1: Recherche durchführen**
Nutze das `Task`-Tool (Sub-Agent), um aktuelle Fakten (2026) und 5-8 Stammtisch-Argumente zum Thema Verkehrswende (E-Mobilität, ÖPNV, E-Fuels) zu recherchieren.

**Step 2: JSON erstellen**
Erstelle die Datei `public/data/verkehrswende.json` streng nach dem `Topic`-Interface aus `src/types/index.ts`. Nutze visuelle Blöcke wie `stat_grid` und `comparison`.

**Step 3: Validierung**
Prüfe die JSON-Datei auf korrekte Syntax und Schema-Konformität (keine fehlenden Pflichtfelder).

### Task 2: Recherche & Erstellung Bürgergeld

**Files:**
- Create: `public/data/buergergeld.json`

**Step 1: Recherche durchführen**
Nutze das `Task`-Tool, um aktuelle Fakten (Regelsätze 2026, Sanktionen, Lohnabstandsgebot) und 5-8 Stammtisch-Argumente zum Thema Bürgergeld zu recherchieren.

**Step 2: JSON erstellen**
Erstelle die Datei `public/data/buergergeld.json` streng nach dem `Topic`-Interface.

**Step 3: Validierung**
Prüfe die JSON-Datei auf korrekte Syntax und Schema-Konformität.

### Task 3: Recherche & Erstellung Migration

**Files:**
- Create: `public/data/migration.json`

**Step 1: Recherche durchführen**
Nutze das `Task`-Tool, um aktuelle Fakten (Asylzahlen 2025/2026, Arbeitsmarktintegration) und 5-8 Stammtisch-Argumente zum Thema Migration zu recherchieren.

**Step 2: JSON erstellen**
Erstelle die Datei `public/data/migration.json` streng nach dem `Topic`-Interface.

**Step 3: Validierung**
Prüfe die JSON-Datei auf korrekte Syntax und Schema-Konformität.

### Task 4: Index-Update & Build-Verifizierung

**Files:**
- Modify: `public/data/topics.json`

**Step 1: topics.json aktualisieren**
Füge die drei neuen Themen (`verkehrswende`, `buergergeld`, `migration`) mit passenden Icons, Titeln und Key-Stats zum Array in `public/data/topics.json` hinzu.

**Step 2: Build & Lint ausführen**
Führe `npm run lint && npm run build` aus, um sicherzustellen, dass die App die neuen Daten fehlerfrei verarbeiten kann.
