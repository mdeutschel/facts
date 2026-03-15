---
name: Impressum Feedback Footer
overview: "Drei Erweiterungen: Footer-Komponente im AppShell, Impressum-Seite mit Datenschutzhinweisen, Feedback-Seite mit PHP-basiertem E-Mail-Formular inkl. Honeypot + Zeitpruefung als Spam-Schutz."
todos:
  - id: footer
    content: Footer-Komponente erstellen und in AppShell einbinden
    status: completed
  - id: impressum
    content: Impressum-Seite mit Datenschutzhinweisen erstellen
    status: completed
  - id: feedback-frontend
    content: Feedback-Seite mit Formular erstellen (React/MUI)
    status: completed
  - id: feedback-php
    content: PHP-Backend fuer Feedback-Formular erstellen
    status: completed
  - id: routing
    content: Neue Routen in App.tsx registrieren
    status: completed
  - id: verify
    content: Lint und Build pruefen
    status: completed
isProject: false
---

# Impressum, Feedback-Seite und Footer

## 1. Footer-Komponente

Neue Datei: `[src/components/layout/Footer.tsx](src/components/layout/Footer.tsx)`

- Schlichter Footer passend zum bestehenden Theme (primary-Farben)
- Links zu `/impressum` und `/feedback`
- Copyright-Hinweis
- Integration in `[src/components/layout/AppShell.tsx](src/components/layout/AppShell.tsx)` unterhalb des `<Container>` mit `<Outlet />`

```tsx
<Box component="footer" sx={{ py: 3, mt: 'auto', bgcolor: 'primary.dark', color: 'primary.contrastText' }}>
  <Container maxWidth="md">
    {/* Links: Impressum | Feedback   ·   © 2025 Fakten-Stammtisch */}
  </Container>
</Box>
```

## 2. Impressum-Seite

Neue Datei: `[src/pages/Impressum.tsx](src/pages/Impressum.tsx)`

Inhalt mit Platzhaltern (markiert mit `TODO`):

- **Impressum nach DDG**: Name, Anschrift, E-Mail, Telefon/Kontaktweg
- **Datenschutzerklaerung (kompakt)**: 
  - Verantwortlicher (gleiche Daten wie Impressum)
  - Hosting-Informationen (Apache-Webserver)
  - Keine Cookies, kein Tracking, kein Analytics
  - Kontaktformular: Hinweis auf Datenverarbeitung (Name, E-Mail, Nachricht per E-Mail an Betreiber)
  - Keine Weitergabe an Dritte
  - Rechte der Betroffenen (Auskunft, Loeschung, Widerspruch)
  - Beschwerderecht bei Aufsichtsbehoerde

Da die App kein Tracking, keine Cookies und keine externen Dienste nutzt, bleibt die Erklaerung kurz und uebersichtlich.

## 3. Feedback-Seite

### Frontend: `[src/pages/Feedback.tsx](src/pages/Feedback.tsx)`

- Freundliche Einladung in "Du"-Form zur Beteiligung
- Formular mit MUI-Komponenten:
  - **Typ-Auswahl**: Radio/Toggle "Neues Argument zu bestehendem Thema" vs. "Neues Thema vorschlagen"
  - **Themen-Dropdown** (bei bestehendem Thema): Laedt Topics aus `topics.json` via `useTopics`-Hook
  - **Thema-Name** (bei neuem Thema): Freitext
  - **Inhalt/Argument**: Mehrzeiliges Textfeld
  - **Quellen** (optional): Textfeld fuer Links/Belege
  - **Name** (optional)
  - **E-Mail** (optional, fuer Rueckfragen)
  - **Honeypot-Feld**: Unsichtbares `<input>` das nur Bots ausfuellen
  - **Zeitstempel**: Hidden field mit Lade-Zeitpunkt, PHP prueft ob < 3 Sekunden
- Submit per `fetch()` an `/api/feedback.php`
- Erfolgs-/Fehlermeldung im UI (Snackbar oder Alert)

### Backend: `[public/api/feedback.php](public/api/feedback.php)`

- Nimmt POST-Request (JSON oder FormData) entgegen
- Validierung:
  - Honeypot-Feld muss leer sein
  - Zeitpruefung: Formular muss mind. 3 Sekunden offen gewesen sein
  - Pflichtfelder pruefen (Typ, Inhalt)
  - E-Mail-Validierung mit `filter_var()` (falls angegeben)
- Sendet E-Mail via `mail()` an Platzhalter-Adresse
- Gibt JSON-Response zurueck (`{ "success": true/false, "message": "..." }`)
- User-E-Mail nur als Reply-To, nicht als From (SPF-Konformitaet)
- Absicherung: Nur POST erlaubt, Content-Type-Pruefung, keine Header-Injection

## 4. Routing

Erweiterung in `[src/App.tsx](src/App.tsx)`:

```tsx
import Impressum from './pages/Impressum'
import Feedback from './pages/Feedback'

// In Routes:
<Route path="impressum" element={<Impressum />} />
<Route path="feedback" element={<Feedback />} />
```

## 5. Anpassungen an bestehenden Dateien

- `[src/components/layout/AppShell.tsx](src/components/layout/AppShell.tsx)`: Footer-Komponente einbinden
- `[.htaccess](.htaccess)`: Keine Aenderung noetig (PHP-Dateien werden durch `RewriteCond %{REQUEST_FILENAME} !-f` korrekt von Apache verarbeitet)

## Dateiuebersicht


| Aktion | Datei                                                   |
| ------ | ------------------------------------------------------- |
| Neu    | `src/components/layout/Footer.tsx`                      |
| Neu    | `src/pages/Impressum.tsx`                               |
| Neu    | `src/pages/Feedback.tsx`                                |
| Neu    | `public/api/feedback.php`                               |
| Edit   | `src/App.tsx` (2 Routen hinzufuegen)                    |
| Edit   | `src/components/layout/AppShell.tsx` (Footer einbinden) |


