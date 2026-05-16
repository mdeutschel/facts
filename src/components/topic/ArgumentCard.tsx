import { useState, type KeyboardEvent } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import type { Argument, Section } from '../../types'
import { VERDICT_META } from '../seo/verdict'
import ShareButton from '../layout/ShareButton'

interface ArgumentCardProps {
  argument: Argument
  defaultOpen?: boolean
  sections?: Section[]
  topicId?: string
  onNavigateToSection?: (sectionId: string) => void
}

export default function ArgumentCard({
  argument,
  defaultOpen = false,
  sections,
  topicId,
  onNavigateToSection,
}: ArgumentCardProps) {
  const [open, setOpen] = useState(defaultOpen)
  const verdictMeta = argument.verdict ? VERDICT_META[argument.verdict] : null

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
      <Box
        onClick={() => setOpen(!open)}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setOpen(!open)
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        sx={{
          cursor: 'pointer',
          textAlign: 'left',
          '&:hover': { bgcolor: 'action.hover' },
          '&:focus-visible': { outline: '2px solid', outlineColor: 'secondary.main', outlineOffset: -2 },
          transition: 'background-color 0.15s',
        }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <FormatQuoteIcon
            sx={{ color: 'text.secondary', mt: 0.25, flexShrink: 0, fontSize: 20 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              „{argument.claim}"
            </Typography>
            {verdictMeta && (
              <Chip
                label={verdictMeta.label}
                size="small"
                color={verdictMeta.color}
                sx={{ mt: 0.75, fontSize: '0.65rem', height: 20, fontWeight: 600 }}
              />
            )}
          </Box>
          {topicId && (
            <Box sx={{ flexShrink: 0, mt: -0.5, mr: -0.5 }}>
              <ShareButton
                variant="icon"
                title={argument.claim}
                url={`/thema/${topicId}/${argument.id}/`}
                ariaLabel="Diese Aussage teilen"
              />
            </Box>
          )}
          <ExpandMoreIcon
            sx={{
              color: 'text.secondary',
              flexShrink: 0,
              mt: 0.25,
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
        </CardContent>
      </Box>
      <Collapse in={open}>
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {argument.response}
          </Typography>

          {argument.rhetoricalPattern && (
            <Box sx={{ mt: 1.5, pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600, display: 'block', mb: 0.5, letterSpacing: 0.4 }}
              >
                Was hinter der Parole steckt
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                {argument.rhetoricalPattern}
              </Typography>
            </Box>
          )}

          {argument.counterQuestions && argument.counterQuestions.length > 0 && (
            <Box
              sx={{
                mt: 1.5,
                p: 1.5,
                borderLeft: 3,
                borderColor: 'secondary.main',
                bgcolor: 'action.hover',
                borderRadius: 1,
              }}
            >
              <Typography
                variant="caption"
                color="secondary.main"
                sx={{ fontWeight: 600, display: 'block', mb: 0.75, letterSpacing: 0.4 }}
              >
                Am Tisch nützlich · Gegenfragen
              </Typography>
              <Box component="ul" sx={{ pl: 2.25, m: 0, '& li': { mb: 0.5, lineHeight: 1.55 } }}>
                {argument.counterQuestions.map((q) => (
                  <Typography component="li" variant="body2" key={q} sx={{ fontSize: '0.85rem' }}>
                    „{q}"
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

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

          {topicId && (
            <Box sx={{ mt: 1.5, pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
              <Button
                component={RouterLink}
                to={`/thema/${topicId}/${argument.id}/`}
                size="small"
                endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  color: 'secondary.main',
                  py: 0.25,
                  minHeight: 0,
                }}
              >
                Eigene Seite zu dieser Aussage öffnen
              </Button>
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  )
}
