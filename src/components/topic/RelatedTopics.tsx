import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Link from '@mui/material/Link'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Link as RouterLink } from 'react-router-dom'
import { useTopicIndex } from '../../hooks/useTopics'

interface RelatedTopicsProps {
  ids: string[]
  currentTopicId?: string
}

export default function RelatedTopics({ ids, currentTopicId }: RelatedTopicsProps) {
  const { topics, loading } = useTopicIndex()

  const uniqueIds = Array.from(new Set(ids.filter((id) => id !== currentTopicId)))

  if (loading || uniqueIds.length === 0) {
    return null
  }

  const matchedTopics = uniqueIds
    .map((id) => topics.find((topic) => topic.id === id))
    .filter((topic): topic is NonNullable<typeof topic> => Boolean(topic))

  if (matchedTopics.length === 0) {
    return null
  }

  return (
    <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
      <Typography variant='subtitle2' component='h2' sx={{ fontWeight: 600, mb: 1 }}>
        Verwandte Themen
      </Typography>
      <Stack spacing={1}>
        {matchedTopics.map((relatedTopic) => (
          <Card key={relatedTopic.id} variant='outlined'>
            <CardActionArea component={RouterLink} to={`/thema/${relatedTopic.id}/`}>
              <CardContent sx={{ py: 1.25, '&:last-child': { pb: 1.25 } }}>
                <Typography variant='body2' sx={{ fontWeight: 600, mb: 0.25 }}>
                  {relatedTopic.title}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {relatedTopic.subtitle}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Link
                    component='span'
                    underline='none'
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    Thema öffnen
                    <ArrowForwardIcon sx={{ fontSize: 14 }} />
                  </Link>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}
