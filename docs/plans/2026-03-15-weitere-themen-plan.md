# Weitere Themen Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integration von vier weiteren Themen (Gleichberechtigung, Vegane Ernährung, Teilzeit, Vermögenssteuer) durch Recherche und Erstellung valider JSON-Dateien.

**Architecture:** Da die App rein datengetrieben ist, werden keine React-Komponenten angefasst. Es werden vier neue JSON-Dateien in `public/data/` erstellt und in `public/data/topics.json` registriert.

**Tech Stack:** JSON, TypeScript (für Schema-Validierung), Web-Recherche.

---

### Task 1: Recherche & Erstellung Gleichberechtigung

**Files:**
- Create: `public/data/gleichberechtigung.json`

**Step 1: Recherche durchführen**
Nutze das `Task`-Tool, um aktuelle Fakten (2025/2026) und 5-8 Stammtisch-Argumente zum Thema Gleichberechtigung (Frauenanteil in Regierungen/Parlamenten, Gender Pay Gap, Care-Arbeit) zu recherchieren.

**Step 2: JSON erstellen**
Erstelle die Datei `public/data/gleichberechtigung.json` streng nach dem `Topic`-Interface aus `src/types/index.ts`.

### Task 2: Recherche & Erstellung Vegane Ernährung

**Files:**
- Create: `public/data/vegane-ernaehrung.json`

**Step 1: Recherche durchführen**
Nutze das `Task`-Tool, um aktuelle Fakten (CO2-Fußabdruck, Wasserverbrauch, Gesundheit, Landnutzung) und 5-8 Stammtisch-Argumente zum Thema fleischlose Ernährung zu recherchieren.

**Step 2: JSON erstellen**
Erstelle die Datei `public/data/vegane-ernaehrung.json` streng nach dem `Topic`-Interface.

### Task 3: Recherche & Erstellung Teilzeit

**Files:**
- Create: `public/data/teilzeit.json`

**Step 1: Recherche durchführen**
Nutze das `Task`-Tool, um aktuelle Fakten (Arbeitsvolumen insgesamt, Gründe für Teilzeit wie Care-Arbeit vs. "Freizeit-Teilzeit", Gen Z Mythen) und 5-8 Stammtisch-Argumente zu recherchieren.

**Step 2: JSON erstellen**
Erstelle die Datei `public/data/teilzeit.json` streng nach dem `Topic`-Interface.

### Task 4: Recherche & Erstellung Vermögenssteuer

**Files:**
- Create: `public/data/vermoegenssteuer.json`

**Step 1: Recherche durchführen**
Nutze das `Task`-Tool, um aktuelle Fakten (Vermögensverteilung, Erbschaftssteueraufkommen, Ausnahmen für Betriebsvermögen) und 5-8 Stammtisch-Argumente zu recherchieren.

**Step 2: JSON erstellen**
Erstelle die Datei `public/data/vermoegenssteuer.json` streng nach dem `Topic`-Interface.

### Task 5: Index-Update & Build-Verifizierung

**Files:**
- Modify: `public/data/topics.json`

**Step 1: topics.json aktualisieren**
Füge die vier neuen Themen zum Array in `public/data/topics.json` hinzu.

**Step 2: Build & Lint ausführen**
Führe `npm run lint && npm run build` aus.