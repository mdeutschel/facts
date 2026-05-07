export const PERSON_ID = 'https://fakten-stammtisch.de/ueber/#person'

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
