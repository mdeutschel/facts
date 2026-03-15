---
name: SEO-Fixes Fakten-Stammtisch
overview: Behebung der SEO-Fehler (doppelte Meta-Tags, www-Redirect) und PageSpeed-Optimierungen (Caching, Bildoptimierung, CLS, Vite-Build).
todos:
  - id: fix-duplicate-meta
    content: Statische meta-description und canonical link aus index.html entfernen
    status: completed
  - id: fix-htaccess
    content: www-Redirect, AddDefaultCharset und Cache-Header in .htaccess hinzufuegen
    status: completed
  - id: optimize-logo
    content: Logo als WebP konvertieren und kleine Variante (64px) fuer AppBar erzeugen
    status: completed
  - id: fix-cls-footer
    content: Layout Shift durch Footer beheben (min-height auf Content-Bereich)
    status: completed
  - id: optimize-vite
    content: Vite-Build-Config optimieren (target, chunk-splitting, CSS)
    status: completed
  - id: improve-h1
    content: H1 auf der Startseite aussagekraeftiger gestalten (mind. 20 Zeichen)
    status: completed
  - id: extend-content
    content: Textinhalt auf der Startseite erweitern (Richtung 800 Woerter)
    status: completed
  - id: verify
    content: npm run lint && npm run build ausfuehren zur Validierung
    status: completed
isProject: false
---

# SEO- und Performance-Verbesserungsplan Fakten-Stammtisch

Zwei Quellen: SEO-Analyse-Tool + Google PageSpeed Insights (93 mobile / 80 desktop).

---

## Fehler (Prioritaet 1 — SEO-Tool)

### 1. Doppelte Meta-Description + Canonical Link

**Datei:** [index.html](index.html)

Ursache: `index.html` hat statische `<meta name="description">` (Z.8) und `<link rel="canonical">` (Z.22). Die [PageMeta](src/components/seo/PageMeta.tsx)-Komponente injiziert dieselben Tags nochmal via React 19. React 19 dedupliziert `<title>` korrekt, aber nicht `<meta>`/`<link>` gegen statische HTML-Tags.

**Fix:** Beide Tags aus `index.html` entfernen. `PageMeta` uebernimmt das seitenspezifisch, Social-Crawler werden ueber [og.php](public/og.php) bedient.

### 2. www-Redirect einrichten

**Datei:** [.htaccess](.htaccess)

301-Redirect von `www.fakten-stammtisch.de` auf `fakten-stammtisch.de` vor allen anderen Regeln:

```apache
RewriteCond %{HTTP_HOST} ^www\.fakten-stammtisch\.de$ [NC]
RewriteRule ^(.*)$ https://fakten-stammtisch.de/$1 [R=301,L]
```

---

## Performance (Prioritaet 1 — PageSpeed Insights)

### 3. Cache-Header setzen

**Datei:** [.htaccess](.htaccess)

Aktuell keine Cache-TTL fuer JS-Bundle (153 KiB) und Logo (152 KiB). Fix via Apache-Direktiven:

```apache
AddDefaultCharset UTF-8

# Hashed assets — 1 year immutable
<FilesMatch "\.(js|css)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# Images — 1 month
<FilesMatch "\.(png|jpg|jpeg|webp|avif|svg|ico)$">
  Header set Cache-Control "public, max-age=2592000"
</FilesMatch>

# HTML/JSON — revalidate
<FilesMatch "\.(html|json)$">
  Header set Cache-Control "no-cache"
</FilesMatch>
```

Vite erzeugt bereits Content-Hashed Dateinamen (`index-ja9zGvhD.js`), daher ist `immutable` sicher.

### 4. Logo-Bild optimieren

**Aktuell:** `logo.png` ist 512x512 PNG (152 KiB), wird in der AppBar bei 28-32px Hoehe angezeigt. PageSpeed schlaegt 151,5 KiB Einsparung vor.

**Fix:**

- `logo.png` (512x512) nach WebP konvertieren fuer favicon/apple-touch-icon → deutlich kleiner
- Zusaetzlich eine kleine Variante `logo-sm.webp` (64x64) erzeugen fuer die AppBar
- In [AppShell.tsx](src/components/layout/AppShell.tsx) das `<img>` auf die kleine Variante umstellen
- `width`/`height`-Attribute am `<img>` setzen (verhindert zusaetzlich CLS)

Konvertierung via Build-Script oder manuell (einmalig). Da es nur ein Bild ist, reicht manuelles Konvertieren.

### 5. Layout Shift (CLS 0.124) durch Footer beheben

**Datei:** [src/components/layout/AppShell.tsx](src/components/layout/AppShell.tsx)

Ursache: Waehrend des Datenladens zeigt die Seite nur einen kleinen CircularProgress. Der Footer sitzt am unteren Viewport-Rand (`mt: auto` + `flex: 1`). Wenn die Daten geladen sind und der Content erscheint, wird der Footer nach unten geschoben — das ist der Layout Shift.

**Fix:** Dem Content-Container eine `minHeight` geben, die den Footer bereits beim initialen Render unter die Viewport-Grenze drueckt:

```tsx
<Container
  maxWidth="md"
  sx={{
    flex: 1,
    py: { xs: 2, sm: 3 },
    px: { xs: 1.5, sm: 3 },
    minHeight: 'calc(100vh - 64px - 100px)',  // AppBar + Footer
  }}
>
```

Alternativ: `display: 'flex'` + `alignItems: 'flex-start'` auf dem Container, damit der Loading-Spinner den Platz nicht bestimmt.

### 6. Vite-Build-Config optimieren

**Datei:** [vite.config.ts](vite.config.ts)

Aktuelle Config ist minimal. Optimierungen:

```ts
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2022',
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material'],
        },
      },
    },
  },
})
```

- `**target: 'es2022'**` — Modernere Syntax, kleinerer Output (kein Polyfill fuer optionale Chaining etc.)
- `**cssMinify: 'lightningcss'**` — Schnellere und kleinere CSS-Minifizierung (Vite 8 built-in)
- `**manualChunks**` — Vendor-Code (React, MUI) in eigene Chunks. Aendert sich selten → profitiert vom Browser-Cache. App-Code aendert sich oefter → kleiner, schneller neu geladen

---

## Warnungen (Prioritaet 2 — SEO-Tool)

### 7. H1 auf der Startseite verbessern

**Datei:** [src/pages/Home.tsx](src/pages/Home.tsx) Zeile 31-33

Aktuell: "Themen" (6 Zeichen). Aendern zu z.B. "Themen fuer den Stammtisch" (>= 20 Zeichen).

### 8. Content auf der Startseite erweitern

**Datei:** [src/pages/Home.tsx](src/pages/Home.tsx)

354 Woerter, Empfehlung ~800. Ansatz: dezenten SEO-Absatz unter dem Topic-Grid hinzufuegen, der die Seite und ihren Zweck naeher beschreibt. Kein SEO-Spam, sondern nuetzlicher Content.

---

## Nicht im Scope (dieser Runde)

- Backend/SSR (Projektbeschraenkung)
- Backlink-Aufbau (externe Massnahme)
- Social-Sharing-Buttons (spaetere Runde)
- Externe Links auf der Startseite (auf Themenseiten bereits vorhanden)

---

## Dateien-Uebersicht

- `index.html` — Statische meta-description + canonical entfernen
- `.htaccess` — www-Redirect, AddDefaultCharset, Cache-Header
- `vite.config.ts` — target, cssMinify, manualChunks
- `src/components/layout/AppShell.tsx` — CLS-Fix (minHeight), Logo-src auf WebP
- `src/pages/Home.tsx` — H1 verbessern, Content erweitern
- `public/logo.png` → `public/logo.webp` + `public/logo-sm.webp` — Bildoptimierung

