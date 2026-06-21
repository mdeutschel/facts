import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { alpha } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import type { MythFactItem } from '../../types'

interface MythFactViewProps {
  items: MythFactItem[]
  caption?: string
}

// Two-part card contrasting a circulating claim ("Behauptung") with the
// fact-checked correction ("Faktencheck"). Red/teal mirror the site's verdict
// colours; the halves stack vertically so they stay readable on mobile.
export default function MythFactView({ items, caption }: MythFactViewProps) {
  return (
    <Box sx={{ my: 1 }}>
      {caption && (
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
          {caption}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {items.map((item, i) => (
          <Paper
            key={i}
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1.25,
                p: 1.5,
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.06),
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: 'error.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, color: 'error.main', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}
                >
                  Behauptung
                </Typography>
                <Typography variant="body2">{item.myth}</Typography>
              </Box>
            </Box>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                gap: 1.25,
                p: 1.5,
                bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.06),
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: 'secondary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckIcon sx={{ fontSize: 16 }} />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}
                >
                  Faktencheck
                </Typography>
                <Typography variant="body2">{item.fact}</Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  )
}
