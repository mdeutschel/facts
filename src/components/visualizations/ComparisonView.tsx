import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import type { ComparisonItem } from '../../types'

interface ComparisonViewProps {
  items: ComparisonItem[]
  caption?: string
  savings?: string
}

const defaultColors = ['#546e7a', '#00897b']

export default function ComparisonView({ items, caption, savings }: ComparisonViewProps) {
  return (
    <Box sx={{ my: 1 }}>
      {caption && (
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
          {caption}
        </Typography>
      )}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
        {items.map((item, idx) => (
          <Paper
            key={idx}
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}
          >
            <Box
              sx={{
                bgcolor: item.color ?? defaultColors[idx % defaultColors.length],
                color: 'white',
                px: 2,
                py: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {item.title}
              </Typography>
            </Box>
            <Box sx={{ px: 2, py: 1 }}>
              {item.rows.map((row, ri) => (
                <Box key={ri}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {row.label}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {row.value}
                    </Typography>
                  </Box>
                  {ri < item.rows.length - 1 && <Divider />}
                </Box>
              ))}
              {item.total && (
                <>
                  <Divider sx={{ my: 0.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {item.total.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {item.total.value}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        ))}
      </Box>
      {savings && (
        <Chip
          label={savings}
          color="secondary"
          sx={{
            mt: 1.5,
            width: '100%',
            height: 'auto',
            py: 1,
            fontSize: '0.85rem',
            fontWeight: 700,
            '& .MuiChip-label': { whiteSpace: 'normal' },
          }}
        />
      )}
    </Box>
  )
}
