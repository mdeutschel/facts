import { useState } from 'react'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import type { Argument, Section } from '../../types'

interface ArgumentCardProps {
  argument: Argument
  defaultOpen?: boolean
  sections?: Section[]
  onNavigateToSection?: (sectionId: string) => void
}

export default function ArgumentCard({
  argument,
  defaultOpen = false,
  sections,
  onNavigateToSection,
}: ArgumentCardProps) {
  const [open, setOpen] = useState(defaultOpen)

  const relatedSectionTitles =
    sections && argument.relatedSections
      ? argument.relatedSections
          .map((id) => {
            const section = sections.find((s) => s.id === id)
            return section ? { id, title: section.title } : null
          })
          .filter(Boolean) as { id: string; title: string }[]
      : []

  return (
    <Card
      id={`arg-${argument.id}`}
      sx={{
        border: open ? '1px solid' : '1px solid transparent',
        borderColor: open ? 'secondary.light' : 'transparent',
        transition: 'border-color 0.2s',
      }}
    >
      <CardActionArea onClick={() => setOpen(!open)} sx={{ textAlign: 'left' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <FormatQuoteIcon
            sx={{ color: 'text.secondary', mt: 0.25, flexShrink: 0, fontSize: 20 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              „{argument.claim}"
            </Typography>
          </Box>
          <ExpandMoreIcon
            sx={{
              color: 'text.secondary',
              flexShrink: 0,
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
        </CardContent>
      </CardActionArea>
      <Collapse in={open}>
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {argument.response}
          </Typography>

          {relatedSectionTitles.length > 0 && (
            <Box sx={{ mt: 1.5, pt: 1, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                Fakten dazu:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {relatedSectionTitles.map((s) => (
                  <Button
                    key={s.id}
                    size="small"
                    startIcon={<FactCheckIcon sx={{ fontSize: 16 }} />}
                    onClick={() => onNavigateToSection?.(s.id)}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      color: 'secondary.main',
                      py: 0.25,
                      minHeight: 0,
                    }}
                  >
                    {s.title}
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          {argument.keywords.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5 }}>
              {argument.keywords.map((kw) => (
                <Chip key={kw} label={kw} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
              ))}
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  )
}
