import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { RangeBarItem } from '../../types'

interface RangeBarChartProps {
  items: RangeBarItem[]
  maxScale?: number
  unit?: string
  caption?: string
}

const palette = ['#00897b', '#26a69a', '#4db6ac', '#80cbc4', '#78909c', '#b71c1c']

export default function RangeBarChart({ items, maxScale, unit = '', caption }: RangeBarChartProps) {
  const effectiveMax = maxScale ?? Math.max(...items.map((i) => i.max)) * 1.1

  return (
    <Box sx={{ my: 1 }}>
      {caption && (
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
          {caption}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map((item, i) => {
          const leftPct = (item.min / effectiveMax) * 100
          const widthPct = ((item.max - item.min) / effectiveMax) * 100
          const color = item.color ?? palette[i % palette.length]

          return (
            <Box key={i}>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.25 }}>
                {item.label}
              </Typography>
              <Box sx={{ position: 'relative', height: 24, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    height: '100%',
                    bgcolor: color,
                    borderRadius: 1,
                    minWidth: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'white',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      px: 0.5,
                    }}
                  >
                    {item.min}–{item.max} {unit || item.unit || ''}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )
        })}
      </Box>
      {unit && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', textAlign: 'right' }}>
          {unit}
        </Typography>
      )}
    </Box>
  )
}
