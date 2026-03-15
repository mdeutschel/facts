---
name: Domain-Migration und SEO
overview: Domain-Umzug zu fakten-stammtisch.de mit E-Mail-Update auf feedback@fakten-stammtisch.de, plus umfassende SEO-Integration mit Open Graph, Twitter Cards, canonical URLs, sitemap.xml, robots.txt, PHP-basiertem Social-Crawler-Support, JSON-LD Structured Data und AI-Discoverability (llms.txt).
todos:
  - id: email-migration
    content: E-Mail in feedback.php und Impressum.tsx auf feedback@fakten-stammtisch.de umstellen
    status: completed
  - id: og-image
    content: OG-Image (1200x630) generieren und als public/og-image.png speichern
    status: completed
  - id: static-seo
    content: robots.txt (inkl. AI-Crawler), sitemap-Generator, llms.txt + llms-full.txt-Generator schreiben, Build-Script anpassen
    status: completed
  - id: index-meta
    content: index.html mit OG, Twitter Card, Canonical Tags und WebSite JSON-LD erweitern
    status: completed
  - id: page-meta
    content: PageMeta-Komponente erstellen und in alle Seiten einbinden (inkl. JSON-LD pro Seite)
    status: completed
  - id: og-php
    content: og.php für Social-Crawler und AI-Bots erstellen (inkl. JSON-LD), .htaccess erweitern
    status: completed
  - id: verify
    content: npm run lint && npm run build erfolgreich durchlaufen lassen
    status: completed
isProject: false
---

# Domain-Migration und SEO-Integration

## Ausgangslage

- Domain wird `fakten-stammtisch.de` (ohne www)
- E-Mail wird `feedback@fakten-stammtisch.de`
- Deployment-Pipeline bleibt unver\u00e4ndert (GitHub Actions, FTP)
- Keine expliziten Domain-Referenzen im Code (alles relativ), nur E-Mail-Adressen m\u00fcssen angepasst werden
- Aktuell: Minimale Meta-Tags in `index.html`, kein robots.txt, kein sitemap.xml, keine OG/Twitter-Tags, keine dynamischen Seitentitel
- Kein llms.txt / llms-full.txt fuer AI-Systeme
- Kein JSON-LD Structured Data

## Architekturentscheidung: Crawler-Support (Social Media + AI)

**Problem:** Social-Media-Crawler (Facebook, WhatsApp, LinkedIn, Twitter/X) und viele AI-Crawler fuehren kein JavaScript aus. React 19 kann zwar `<title>` und `<meta>` nativ hoisten, aber das hilft nur fuer Google (das JS rendert).

**Gew\u00e4hlter Ansatz: Drei-Schichten-Strategie**

1. **PHP-basierte Bot-Erkennung** (Social Media + AI-Bots)
  - `.htaccess` erkennt Social-Media- und AI-Bots via User-Agent
  - Leitet Bot-Requests fuer `/thema/:topicId` an ein PHP-Script weiter
  - PHP liest die Topic-JSON und liefert minimales HTML mit OG-Tags + JSON-LD
  - Alle anderen Requests bekommen normal die SPA
2. **llms.txt + llms-full.txt** (AI-Discoverability)
  - `llms.txt`: Statischer Ueberblick ueber die Seite im Markdown-Format (llms.txt Spec v1.1.1)
  - `llms-full.txt`: Generiert beim Build mit **allen** Topic-Inhalten (Fakten, Argumente) als Plaintext-Markdown
  - Macht den gesamten SPA-Inhalt direkt fuer AI-Systeme lesbar, ohne JS-Rendering
3. **JSON-LD Structured Data**
  - `FAQPage`-Schema fuer Topic-Argumente (Claim + Response = Question + Answer)
  - `WebSite`-Schema fuer die Homepage
  - Im PHP-Handler fuer Crawler UND in React-Komponenten fuer Google

Warum nicht Build-Time-Prerendering? Wuerde eine neue npm-Dependency und Aenderungen an der Build-Pipeline erfordern. PHP ist bereits verfuegbar (feedback.php existiert), daher ist das die minimalinvasivste Loesung. llms-full.txt deckt den AI-Use-Case sogar besser ab als Prerendering.

---

## Teil 1: E-Mail-Migration

### 1.1 [public/api/feedback.php](public/api/feedback.php) (Zeile 92)

Aktuell (obfuskiert):

```php
$recipient = implode('', ['fac', 'ts']) . '@' . implode('', ['hael', 'je', '.de']);
```

Neu:

```php
$recipient = implode('', ['feed', 'back']) . '@' . implode('', ['fakten-', 'stammtisch', '.de']);
```

### 1.2 [src/pages/Impressum.tsx](src/pages/Impressum.tsx) (Zeilen 14-16)

Aktuell (via `String.fromCharCode` = `facts@haelje.de`):

```typescript
() => String.fromCharCode(102, 97, 99, 116, 115, 64, 104, 97, 101, 108, 106, 101, 46, 100, 101)
```

Neu (`feedback@fakten-stammtisch.de` als Char-Codes):

```typescript
() => String.fromCharCode(102,101,101,100,98,97,99,107,64,102,97,107,116,101,110,45,115,116,97,109,109,116,105,115,99,104,46,100,101)
```

---

## Teil 2: SEO - Statische Assets

### 2.1 OG-Image generieren

- Bild generieren: 1200x630px, passend zum Thema der Seite
- Speichern als `public/og-image.png`

### 2.2 [public/robots.txt](public/robots.txt) (neu)

Erlaubt alle Crawler explizit, inklusive AI-Such-Bots. Kein Blocking von AI-Trainings-Crawlern (der Content ist oeffentlich und soll breit auffindbar sein).

```
User-agent: *
Allow: /

# AI search crawlers - explicitly welcome
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: https://fakten-stammtisch.de/sitemap.xml
```

### 2.3 Sitemap-Generierung im Build

Kleines Node-Script `scripts/generate-sitemap.mjs`:

- Liest `public/data/topics.json`
- Generiert `public/sitemap.xml` mit allen Routen (`/`, `/thema/{id}`, `/impressum`, `/feedback`)
- Wird in `package.json` build-Script integriert: `node scripts/generate-seo.mjs && tsc -b && vite build && cp .htaccess dist/`
- `.htaccess`-Copy muss erhalten bleiben

### 2.4 [public/llms.txt](public/llms.txt) (neu, statisch)

Folgt der llms.txt Spec v1.1.1. Beschreibt die Seite fuer AI-Systeme:

```markdown
# Fakten-Stammtisch

> Fakten-Stammtisch ist eine deutschsprachige Webseite, die faktenbasierte
> Argumente und quellenbasierte Daten zu politischen und gesellschaftlichen
> Themen in Deutschland bereitstellt. Ziel ist es, Nutzer auf informelle
> Diskussionen vorzubereiten.

Die Seite behandelt Themen wie Klimawandel, Energiewende, Migration,
Buergergeld, Gleichberechtigung, Bildung, Gesundheitssystem und weitere.
Jedes Thema enthält Fakten-Sektionen mit aktuellen Daten und Quellen sowie
typische Stammtisch-Aussagen mit faktenbasierten Antworten.

## Themen

- [Heizungswechsel 2026](https://fakten-stammtisch.de/thema/heizung): Waermepumpe vs. Oel- & Gasheizung
- [E-Mobilitaet](https://fakten-stammtisch.de/thema/emobilitaet): Fakten zu Reichweite, Akkus, Kosten & Klimabilanz
- [...fuer jedes Topic aus topics.json...]

## Vollstaendiger Inhalt

- [Alle Inhalte als Plaintext](https://fakten-stammtisch.de/llms-full.txt): Vollstaendiger Text aller Themen, Fakten und Argumente

## Contact

- E-Mail: feedback@fakten-stammtisch.de
- [Feedback-Formular](https://fakten-stammtisch.de/feedback)

## Optional

- [Impressum & Datenschutz](https://fakten-stammtisch.de/impressum)
- [Sitemap](https://fakten-stammtisch.de/sitemap.xml)
```

Da die Topics dynamisch sind, wird llms.txt ebenfalls im Build generiert (im gleichen Script `scripts/generate-seo.mjs`).

### 2.5 llms-full.txt (generiert beim Build)

Wird von `scripts/generate-seo.mjs` aus **allen** Topic-JSON-Dateien generiert. Enthaelt:

- Fuer jedes Topic: Titel, Subtitle, alle Sektionen mit Content-Bloecken als lesbaren Text
- Alle Argumente als "Aussage → Faktenbasierte Antwort" Paare
- Quellen pro Topic

Beispielstruktur:

```markdown
# Fakten-Stammtisch — Vollstaendiger Inhalt

> Alle Themen, Fakten und Argumente im Plaintext-Format.

---

## Heizungswechsel 2026

Waermepumpe vs. Oel- & Gasheizung | Stand: 2026-03

### Fakten

#### Status quo
- 21,6 Mio. Heizungen in Deutschland (2024)
- 75 % davon fossil betrieben
[...]

### Argumente

**Aussage:** „Waermepumpen funktionieren nicht bei Kaelte"
**Antwort:** Moderne Waermepumpen arbeiten effizient bis -20°C [...]

[...]
```

Dieses Format ist optimiert fuer AI-Systeme: klar strukturiert, Plaintext, alle Inhalte direkt lesbar ohne JS-Rendering.

---

## Teil 3: SEO - Meta-Tags in index.html

### 3.1 [index.html](index.html) erweitern

Folgende Tags im `<head>` ergaenzen:

```html
<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Fakten-Stammtisch" />
<meta property="og:locale" content="de_DE" />
<meta property="og:title" content="Fakten-Stammtisch" />
<meta property="og:description" content="Faktenbasierte Argumente fuer Stammtischdiskussionen" />
<meta property="og:url" content="https://fakten-stammtisch.de/" />
<meta property="og:image" content="https://fakten-stammtisch.de/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Fakten-Stammtisch" />
<meta name="twitter:description" content="Faktenbasierte Argumente fuer Stammtischdiskussionen" />
<meta name="twitter:image" content="https://fakten-stammtisch.de/og-image.png" />

<!-- Canonical -->
<link rel="canonical" href="https://fakten-stammtisch.de/" />

<!-- JSON-LD: WebSite + SearchAction -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Fakten-Stammtisch",
  "url": "https://fakten-stammtisch.de",
  "description": "Faktenbasierte Argumente fuer Stammtischdiskussionen",
  "inLanguage": "de",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://fakten-stammtisch.de/suche?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```

---

## Teil 4: React 19 Native Meta-Hoisting pro Seite

React 19 erlaubt `<title>` und `<meta>` direkt in Komponenten zu rendern -- sie werden automatisch in `<head>` gehoistet. Keine zus\u00e4tzliche Dependency (kein react-helmet-async).

### 4.1 Utility-Funktion `src/components/seo/PageMeta.tsx` (neu)

Kleine Wrapper-Komponente fuer konsistente Meta-Tags. Nutzt React 19 native Meta-Hoisting. Optionaler `jsonLd`-Parameter fuer Structured Data:

```tsx
const SITE_NAME = 'Fakten-Stammtisch'
const BASE_URL = 'https://fakten-stammtisch.de'

interface PageMetaProps {
  title: string
  description: string
  path: string
  jsonLd?: Record<string, unknown>
}

export default function PageMeta({ title, description, path, jsonLd }: PageMetaProps) {
  const fullTitle = `${title} | ${SITE_NAME}`
  const url = `${BASE_URL}${path}`
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </>
  )
}
```

### 4.2 Integration in Seiten-Komponenten

- **[src/pages/Home.tsx](src/pages/Home.tsx):** `<PageMeta title="Themenuebersicht" description="..." path="/" />`
- **[src/pages/TopicPage.tsx](src/pages/TopicPage.tsx):** `<PageMeta>` mit dynamischen Daten + FAQPage JSON-LD
- **[src/pages/SearchPage.tsx](src/pages/SearchPage.tsx):** `<PageMeta title="Suche" description="..." path="/suche" />`
- **[src/pages/Impressum.tsx](src/pages/Impressum.tsx):** `<PageMeta title="Impressum & Datenschutz" ... />`
- **[src/pages/Feedback.tsx](src/pages/Feedback.tsx):** `<PageMeta title="Feedback" ... />`

### 4.3 FAQPage JSON-LD in TopicPage (dynamisch)

Die Argumente jedes Topics (Claim → Response) mappen perfekt auf das FAQPage-Schema:

```tsx
const faqJsonLd = useMemo(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: topic.arguments.map((arg) => ({
    '@type': 'Question',
    name: arg.claim,
    acceptedAnswer: {
      '@type': 'Answer',
      text: arg.response,
    },
  })),
}), [topic.arguments])

<PageMeta
  title={topic.title}
  description={topic.subtitle}
  path={`/thema/${topicId}`}
  jsonLd={faqJsonLd}
/>
```

Google rendert JS und sieht dieses JSON-LD. Fuer Social-Media- und AI-Crawler wird es zusaetzlich im PHP-Handler ausgeliefert (siehe Teil 5).

---

## Teil 5: PHP-basierter Social-Crawler-Support

### 5.1 [public/og.php](public/og.php) (neu)

Lightweight PHP-Script fuer Social-Media- UND AI-Crawler:

- Liest Topic-ID aus Query-Parameter
- Laedt `data/{topicId}.json`
- Gibt minimales HTML mit korrekten OG/Twitter-Tags aus
- **Inkludiert FAQPage JSON-LD** (Argumente als Question/Answer)
- Fallback auf Standard-Meta-Tags bei unbekannter Route
- Enthaelt `<meta http-equiv="refresh">` Redirect fuer den Fall, dass ein Browser die URL aufruft

### 5.2 [.htaccess](.htaccess) erweitern

Bot-Erkennung vor dem SPA-Fallback. Erfasst Social-Media-Crawler UND AI-Bots, die kein JS rendern:

```apache
RewriteEngine On
RewriteBase /

# Social media + AI crawler detection for topic pages
RewriteCond %{HTTP_USER_AGENT} facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Discordbot|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|anthropic-ai|PerplexityBot|Applebot [NC]
RewriteRule ^thema/(.+)$ /og.php?topic=$1 [L,QSA]

# Existing SPA fallback
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

---

## Teil 6: Build-Anpassungen

### 6.1 [package.json](package.json) - Build-Script

Alle SEO-Assets (sitemap.xml, llms.txt, llms-full.txt) werden **vor** dem Vite-Build in `public/` generiert, sodass Vite sie automatisch nach `dist/` kopiert:

```json
"build": "node scripts/generate-seo.mjs && tsc -b && vite build && cp .htaccess dist/"
```

### 6.2 `scripts/generate-seo.mjs` (neu, vereint)

Ein Script fuer alle generierten SEO-Assets:

- Liest `public/data/topics.json` und alle `public/data/{topicId}.json`
- Generiert `public/sitemap.xml`
- Generiert `public/llms.txt` (Uebersicht mit Links)
- Generiert `public/llms-full.txt` (vollstaendiger Content aller Topics)

### 6.3 Build-Verification

```bash
npm run lint && npm run build
```

---

## Aenderungsliste kompakt


| Datei                             | Aktion                                     |
| --------------------------------- | ------------------------------------------ |
| `public/api/feedback.php`         | E-Mail aendern                             |
| `src/pages/Impressum.tsx`         | E-Mail Char-Codes aendern + PageMeta       |
| `index.html`                      | OG + Twitter + Canonical + JSON-LD WebSite |
| `public/robots.txt`               | Neu (inkl. AI-Crawler-Regeln)              |
| `public/og-image.png`             | Neu (generiert)                            |
| `scripts/generate-seo.mjs`        | Neu (sitemap + llms.txt + llms-full.txt)   |
| `src/components/seo/PageMeta.tsx` | Neu (React 19 Meta-Hoisting + JSON-LD)     |
| `src/pages/Home.tsx`              | PageMeta einbinden                         |
| `src/pages/TopicPage.tsx`         | PageMeta + FAQPage JSON-LD (dynamisch)     |
| `src/pages/SearchPage.tsx`        | PageMeta einbinden                         |
| `src/pages/Feedback.tsx`          | PageMeta einbinden                         |
| `public/og.php`                   | Neu (OG-Tags + JSON-LD fuer Crawler)       |
| `.htaccess`                       | Bot-Erkennung (Social + AI)                |
| `package.json`                    | Build-Script erweitern                     |


## Nicht benoetigt

- Keine neuen npm-Dependencies
- Keine Build-Pipeline-Aenderungen (ausser Script-Aufruf)
- Kein SSR / Prerendering-Framework

