import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { StatItem } from '../../types'

interface StatGridProps {
  items: StatItem[]
}

export default function StatGrid({ items }: StatGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: items.length <= 2 ? '1fr 1fr' : 'repeat(2, 1fr)',
          sm: `repeat(${Math.min(items.length, 4)}, 1fr)`,
        },
        gap: 1,
        my: 1,
      }}
    >
      {items.map((item, i) => (
        <Paper
          key={i}
          elevation={0}
          sx={{
            p: 1.5,
            textAlign: 'center',
            bgcolor: item.color ?? 'secondary.main',
            color: 'white',
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            {item.value}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mt: 0.25 }}>
            {item.label}
          </Typography>
          {item.sublabel && (
            <Typography variant="caption" sx={{ opacity: 0.85, display: 'block', fontSize: '0.65rem' }}>
              {item.sublabel}
            </Typography>
          )}
        </Paper>
      ))}
    </Box>
  )
}
