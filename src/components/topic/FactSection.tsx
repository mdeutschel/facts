import { lazy, Suspense } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import StatGrid from '../visualizations/StatGrid'
import ComparisonView from '../visualizations/ComparisonView'
import RangeBarChart from '../visualizations/RangeBarChart'
import TimelineView from '../visualizations/TimelineView'
import ProgressStack from '../visualizations/ProgressStack'
import MythFactView from '../visualizations/MythFactView'
import Pictograph from '../visualizations/Pictograph'
import TargetProgressView from '../visualizations/TargetProgressView'
import type { Section, ContentBlock, Source, SourceRef } from '../../types'

const SimpleBarChart = lazy(() => import('../visualizations/SimpleBarChart'))
const SimpleLineChart = lazy(() => import('../visualizations/SimpleLineChart'))

function SourceRefLinks({ refs, sources }: { refs?: SourceRef[]; sources?: Source[] }) {
  if (!refs?.length || !sources?.length) return null

  const resolvedRefs = refs
    .map((ref) => {
      const index = sources.findIndex((source) => source.id === ref)

      if (index < 0) return null

      return { ref, sourceNumber: index + 1, url: sources[index].url }
    })
    .filter(
      (entry): entry is { ref: SourceRef; sourceNumber: number; url: string | undefined } =>
        entry !== null,
    )

  if (!resolvedRefs.length) return null

  const linkSx = {
    color: 'text.disabled',
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  }

  return (
    <Typography
      component="span"
      variant="caption"
      sx={{ color: 'text.disabled', fontSize: '0.65rem', ml: 0.5 }}
    >
      [{resolvedRefs.map(({ ref, sourceNumber, url }, i) => (
        <span key={ref}>
          {i > 0 && ', '}
          {url ? (
            // Source has a URL — open it directly in a new tab, so the reader
            // reaches the source with a single click instead of first scrolling
            // to the source list.
            <Box component="a" href={url} target="_blank" rel="noopener noreferrer" sx={linkSx}>
              {sourceNumber}
            </Box>
          ) : (
            // No URL — fall back to scrolling to the entry in the source list.
            <Box
              component="a"
              href={`#quelle-${ref}`}
              sx={linkSx}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
                document.getElementById(`quelle-${ref}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              {sourceNumber}
            </Box>
          )}
        </span>
      ))}]
    </Typography>
  )
}

function ContentBlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'fact':
      if (block.highlight) {
        return (
          <Box>
            <Chip
              label={block.text}
              color="secondary"
              variant="outlined"
              sx={{ height: 'auto', py: 0.5, '& .MuiChip-label': { whiteSpace: 'normal' } }}
            />
            {block.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, pl: 1.5, fontSize: '0.8rem' }}>
                {block.description}
              </Typography>
            )}
          </Box>
        )
      }
      return (
        <Box>
          <Typography variant="body2" sx={{ py: 0.25 }}>
            • {block.text}
          </Typography>
          {block.description && (
            <Typography variant="body2" color="text.secondary" sx={{ pl: 2, fontSize: '0.8rem' }}>
              {block.description}
            </Typography>
          )}
        </Box>
      )

    case 'text':
      return (
        <Typography variant="body2" sx={{ py: 0.5 }}>
          {block.text}
        </Typography>
      )

    case 'table':
      return (
        <TableContainer sx={{ my: 1 }}>
          {block.caption && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
              {block.caption}
            </Typography>
          )}
          <Table size="small">
            <TableHead>
              <TableRow>
                {block.headers.map((h, i) => (
                  <TableCell key={i} sx={{ fontWeight: 600, fontSize: '0.75rem', py: 0.75 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {block.rows.map((row, ri) => (
                <TableRow key={ri}>
                  {row.map((cell, ci) => (
                    <TableCell key={ci} sx={{ fontSize: '0.75rem', py: 0.5 }}>
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )

    case 'stat_grid':
      return <StatGrid items={block.items} />

    case 'comparison':
      return <ComparisonView items={block.items} caption={block.caption} savings={block.savings} />

    case 'range_bar':
      return <RangeBarChart items={block.items} maxScale={block.maxScale} unit={block.unit} caption={block.caption} />

    case 'bar_chart':
      return (
        <Suspense fallback={null}>
          <SimpleBarChart items={block.items} unit={block.unit} caption={block.caption} />
        </Suspense>
      )

    case 'line_chart':
      return (
        <Suspense fallback={null}>
          <SimpleLineChart items={block.items} unit={block.unit} caption={block.caption} color={block.color} />
        </Suspense>
      )

    case 'timeline':
      return <TimelineView steps={block.steps} caption={block.caption} />

    case 'progress_stack':
      return <ProgressStack segments={block.segments} total={block.total} caption={block.caption} />

    case 'myth_fact':
      return <MythFactView items={block.items} caption={block.caption} />

    case 'pictograph':
      return (
        <Pictograph
          filled={block.filled}
          total={block.total}
          label={block.label}
          icon={block.icon}
          color={block.color}
          caption={block.caption}
        />
      )

    case 'target_progress':
      return (
        <TargetProgressView items={block.items} maxScale={block.maxScale} unit={block.unit} caption={block.caption} />
      )

    default: {
      const _exhaustive: never = block
      return _exhaustive
    }
  }
}

function ContentBlockWithSources({ block, sources }: { block: ContentBlock; sources?: Source[] }) {
  return (
    <Box>
      <ContentBlockView block={block} />
      {'sourceRefs' in block && block.sourceRefs && (
        <Box sx={{ textAlign: 'right', mt: -0.25 }}>
          <SourceRefLinks refs={block.sourceRefs} sources={sources} />
        </Box>
      )}
    </Box>
  )
}

interface FactSectionProps {
  section: Section
  defaultExpanded?: boolean
  sources?: Source[]
  // Heading level of the section title, so the document outline stays valid in
  // both contexts: directly under the topic h1 (h2) and nested under another
  // section heading on the argument page (h3).
  titleComponent?: 'h2' | 'h3'
  // Overrides the accordion's DOM id. Needed when the same section is embedded
  // multiple times on one page (e.g. under several arguments) to avoid duplicate
  // ids; the default `section-{id}` is the hash-scroll target on the facts tab.
  domId?: string
  // Tones the title down for nested usage (e.g. "Fakten dazu" inside an argument
  // card): smaller than the argument claim and in the secondary colour, so the
  // embedded fact sections don't dominate. The facts tab keeps the default style.
  embedded?: boolean
}

export default function FactSection({
  section,
  defaultExpanded = false,
  sources,
  titleComponent = 'h2',
  domId,
  embedded = false,
}: FactSectionProps) {
  return (
    <Accordion defaultExpanded={defaultExpanded} id={domId ?? `section-${section.id}`}>
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={embedded ? { fontSize: 20, color: 'secondary.main' } : undefined} />}>
        <Typography
          variant="subtitle1"
          component={titleComponent}
          sx={embedded ? { fontWeight: 600, fontSize: '0.8rem', color: 'secondary.main' } : { fontWeight: 600 }}
        >
          {section.title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {section.content.map((block, i) => (
            <ContentBlockWithSources key={i} block={block} sources={sources} />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}
