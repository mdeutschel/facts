import { useSearchParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import SearchResults from '../components/search/SearchResults'
import PageMeta from '../components/seo/PageMeta'
import { useSearch } from '../hooks/useSearch'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const { results, loading } = useSearch(query)
  const encodedQuery = encodeURIComponent(query)
  const searchPath = query ? `/suche?q=${encodedQuery}` : '/suche'
  const searchTitle = query ? `Suche: ${query}` : 'Suche'
  const searchDescription = query
    ? `Suchergebnisse für "${query}" bei Fakten-Stammtisch.`
    : 'Suche in Fakten, Argumenten und Quellen bei Fakten-Stammtisch.'

  return (
    <Box>
      <PageMeta title={searchTitle} description={searchDescription} path={searchPath} />
      <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>
        Suche
      </Typography>
      {query && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {loading
            ? 'Suche läuft…'
            : `${results.length} Ergebnis${results.length !== 1 ? 'se' : ''} für „${query}"`}
        </Typography>
      )}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <SearchResults results={results} query={query} />
      )}
    </Box>
  )
}
