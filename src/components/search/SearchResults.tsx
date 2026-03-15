import { useNavigate } from 'react-router-dom'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import ForumIcon from '@mui/icons-material/Forum'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import type { SearchResult } from '../../types'

interface SearchResultsProps {
  results: SearchResult[]
  query: string
}

export default function SearchResults({ results, query }: SearchResultsProps) {
  const navigate = useNavigate()

  if (query && results.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Keine Ergebnisse für „{query}"
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Versuche andere Stichwörter wie „Kosten", „Wasserstoff" oder „Atomkraft"
        </Typography>
      </Box>
    )
  }

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.topicTitle]) acc[r.topicTitle] = []
    acc[r.topicTitle].push(r)
    return acc
  }, {})

  const handleClick = (result: SearchResult) => {
    if (result.type === 'argument') {
      navigate(`/thema/${result.topicId}?tab=0#arg-${result.id}`)
    } else {
      navigate(`/thema/${result.topicId}?tab=1#section-${result.id}`)
    }
  }

  return (
    <List>
      {Object.entries(grouped).map(([topicTitle, items]) => (
        <Box key={topicTitle}>
          <ListSubheader sx={{ bgcolor: 'transparent', lineHeight: 2 }}>
            {topicTitle}
          </ListSubheader>
          {items.map((result) => (
            <ListItemButton
              key={`${result.topicId}-${result.id}`}
              onClick={() => handleClick(result)}
              sx={{ borderRadius: 1, mb: 0.5 }}
            >
              {result.type === 'argument' ? (
                <ForumIcon sx={{ mr: 1.5, color: 'secondary.main', fontSize: 20 }} />
              ) : (
                <FactCheckIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 20 }} />
              )}
              <ListItemText
                primary={result.title}
                secondary={result.snippet}
                primaryTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                secondaryTypographyProps={{ variant: 'caption', noWrap: false }}
              />
              <Chip
                label={result.type === 'argument' ? 'Argument' : 'Fakt'}
                size="small"
                variant="outlined"
                sx={{ ml: 1, flexShrink: 0, fontSize: '0.65rem' }}
              />
            </ListItemButton>
          ))}
        </Box>
      ))}
    </List>
  )
}
