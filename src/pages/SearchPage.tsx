import { useSearchParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import SearchResults from '../components/search/SearchResults'
import { useSearch } from '../hooks/useSearch'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const { results, loading } = useSearch(query)

  return (
    <Box>
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
