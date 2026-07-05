import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import EventIcon from '@mui/icons-material/Event'
import LinkIcon from '@mui/icons-material/Link'
import ScienceIcon from '@mui/icons-material/Science'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import GitHubIcon from '@mui/icons-material/GitHub'
import type { Topic } from '../../types'
import { formatGermanDate } from '../../theme'

interface TopicTrustBoxProps {
  topic: Topic
}

export default function TopicTrustBox({ topic }: TopicTrustBoxProps) {
  const sourceCount = topic.sources.length
  const argumentCount = topic.arguments.length

  return (
    <Box
      sx={{
        mb: 2,
        p: { xs: 1.5, sm: 2 },
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'action.hover',
      }}
      aria-label="Wie geprüft"
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2 }}
        sx={{
          flexWrap: 'wrap',
          alignItems: { sm: 'center' },
          mb: 1,
        }}
      >
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <EventIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            Stand: {formatGermanDate(topic.lastUpdated)}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <LinkIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Link
            href="#quellen"
            underline="hover"
            color="text.secondary"
            sx={{ fontSize: '0.75rem', display: 'inline-block', py: 0.5 }}
          >
            {sourceCount} {sourceCount === 1 ? 'Quelle' : 'Quellen'}
          </Link>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {argumentCount} {argumentCount === 1 ? 'Argument' : 'Argumente'}
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 0.5, sm: 2 }}
        sx={{ flexWrap: 'wrap' }}
      >
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <ScienceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Link
            component={RouterLink}
            to="/methodik/"
            underline="hover"
            sx={{ fontSize: '0.75rem', display: 'inline-block', py: 0.5 }}
          >
            Wie geprüft wird
          </Link>
        </Stack>
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <ReportProblemIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Link
            component={RouterLink}
            to="/feedback/"
            underline="hover"
            sx={{ fontSize: '0.75rem', display: 'inline-block', py: 0.5 }}
          >
            Fehler melden
          </Link>
        </Stack>
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <GitHubIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Link
            href="https://github.com/mdeutschel/facts"
            target="_blank"
            rel="noopener"
            underline="hover"
            sx={{ fontSize: '0.75rem', display: 'inline-block', py: 0.5 }}
          >
            Quelltext &amp; Inhalte auf GitHub
          </Link>
        </Stack>
      </Stack>
    </Box>
  )
}
