import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { TimelineStep } from '../../types'

interface TimelineViewProps {
  steps: TimelineStep[]
  caption?: string
}

export default function TimelineView({ steps, caption }: TimelineViewProps) {
  return (
    <Box sx={{ my: 1 }}>
      {caption && (
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1.5, display: 'block' }}>
          {caption}
        </Typography>
      )}
      <Box sx={{ position: 'relative', pl: 3 }}>
        <Box
          sx={{
            position: 'absolute',
            left: 8,
            top: 4,
            bottom: 4,
            width: 2,
            bgcolor: 'divider',
          }}
        />
        {steps.map((step, i) => (
          <Box key={i} sx={{ position: 'relative', pb: i < steps.length - 1 ? 2 : 0 }}>
            <Box
              sx={{
                position: 'absolute',
                left: -23,
                top: 2,
                width: 14,
                height: 14,
                borderRadius: '50%',
                bgcolor: step.highlight ? 'secondary.main' : 'primary.light',
                border: '2px solid white',
                boxShadow: 1,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: step.highlight ? 'secondary.main' : 'text.primary',
                display: 'block',
              }}
            >
              {step.label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              {step.value}
            </Typography>
            {step.sublabel && (
              <Typography variant="caption" color="text.secondary">
                {step.sublabel}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
