import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

import { chartPalette } from '../../theme'

interface ProgressStackProps {
  segments: { label: string; value: number; sublabel?: string }[]
  total?: string
  caption?: string
}

const colors = chartPalette.sequential.slice(0, 3)

export default function ProgressStack({ segments, total, caption }: ProgressStackProps) {
  const sum = segments.reduce((s, seg) => s + seg.value, 0)

  return (
    <Box sx={{ my: 1 }}>
      {caption && (
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
          {caption}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 0.5, height: 40, borderRadius: 2, overflow: 'hidden' }}>
        {segments.map((seg, i) => (
          <Box
            key={i}
            sx={{
              flex: seg.value,
              bgcolor: colors[i % colors.length],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              minWidth: 40,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
              {seg.value} %
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
        {segments.map((seg, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: colors[i % colors.length] }} />
            <Typography variant="caption">
              {seg.label}
              {seg.sublabel ? ` (${seg.sublabel})` : ''}
            </Typography>
          </Box>
        ))}
      </Box>
      {total && (
        <Chip
          label={total}
          color="secondary"
          variant="outlined"
          sx={{ mt: 1, fontWeight: 700, width: '100%' }}
        />
      )}
      {sum > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, textAlign: 'center' }}>
          Gesamt: bis zu {sum} %
        </Typography>
      )}
    </Box>
  )
}
