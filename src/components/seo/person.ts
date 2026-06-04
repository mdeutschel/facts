export const PERSON_ID = 'https://fakten-stammtisch.de/ueber/#person'
// Publisher entity. The matching Organization node is declared once in the static
// index.html JSON-LD graph (present in the DOM on every route), so author/publisher
// references resolve by @id without re-declaring the node per page.
export const ORG_ID = 'https://fakten-stammtisch.de/#organization'

export const PERSON_JSONLD = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Marcel Deutschel',
  jobTitle: 'Informatiker',
  description:
    'Informatiker mit langjähriger Auseinandersetzung mit großen Sprachmodellen. Verantwortlich für Konzept und Methodik von Fakten-Stammtisch.',
  url: 'https://fakten-stammtisch.de/ueber/',
  sameAs: ['https://github.com/mdeutschel'],
  knowsAbout: [
    'KI-gestützte Inhaltsverifikation',
    'Quellenverifizierung',
    'Argumentationsanalyse',
    'Informatik',
  ],
}
