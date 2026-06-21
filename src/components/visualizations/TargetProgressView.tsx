import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { TargetProgressItem } from '../../types'
import { chartPalette } from '../../theme'

interface TargetProgressViewProps {
  items: TargetProgressItem[]
  maxScale?: number
  unit?: string
  caption?: string
}

const palette = chartPalette.sequential

function formatValue(value: number): string {
  return value.toLocaleString('de-DE', { maximumFractionDigits: 1 })
}

// Progress-towards-target bar: a solid bar for the current value, a translucent
// segment for the remaining distance, and a dashed tick marking the goal. Ideal
// for "Ist vs. Ziel" figures (e.g. renewables share, emission reductions).
export default function TargetProgressView({ items, maxScale, unit = '', caption }: TargetProgressViewProps) {
  return (
    <Box sx={{ my: 1 }}>
      {caption && (
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
          {caption}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {items.map((item, i) => {
          const itemUnit = item.unit ?? unit
          const effectiveMax = maxScale ?? Math.max(item.current, item.target) * 1.15
          const currentPct = Math.min((item.current / effectiveMax) * 100, 100)
          const targetPct = Math.min((item.target / effectiveMax) * 100, 100)
          const gapPct = Math.max(targetPct - currentPct, 0)
          const color = item.color ?? palette[i % palette.length]
          const reached = item.current >= item.target

          return (
            <Box key={i}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  columnGap: 1,
                  rowGap: 0.25,
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  mb: 0.5,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {item.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  <Box component="span" sx={{ color, fontWeight: 700 }}>
                    Ist {formatValue(item.current)}{itemUnit ? ` ${itemUnit}` : ''}
                  </Box>
                  {' · Ziel '}
                  {formatValue(item.target)}{itemUnit ? ` ${itemUnit}` : ''}
                </Typography>
              </Box>
              <Box sx={{ position: 'relative', height: 24, bgcolor: 'grey.100', borderRadius: 1, overflow: 'hidden' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    width: `${currentPct}%`,
                    height: '100%',
                    bgcolor: color,
                    borderRadius: 1,
                  }}
                />
                {!reached && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: `${currentPct}%`,
                      width: `${gapPct}%`,
                      height: '100%',
                      bgcolor: color,
                      opacity: 0.18,
                    }}
                  />
                )}
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${targetPct}%`,
                    top: 0,
                    bottom: 0,
                    borderLeft: '2px dashed',
                    borderColor: 'text.primary',
                  }}
                />
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
