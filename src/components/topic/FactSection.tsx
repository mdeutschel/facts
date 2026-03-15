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
import type { Section, ContentBlock } from '../../types'

const SimpleBarChart = lazy(() => import('../visualizations/SimpleBarChart'))
const SimpleLineChart = lazy(() => import('../visualizations/SimpleLineChart'))

function ContentBlockView({ block }: { block: ContentBlock }) {
  if (block.type === 'fact') {
    if (block.highlight) {
      return (
        <Chip
          label={block.text}
          color="secondary"
          variant="outlined"
          sx={{ height: 'auto', py: 0.5, '& .MuiChip-label': { whiteSpace: 'normal' } }}
        />
      )
    }
    return (
      <Typography variant="body2" sx={{ py: 0.25 }}>
        • {block.text}
      </Typography>
    )
  }

  if (block.type === 'text') {
    return (
      <Typography variant="body2" sx={{ py: 0.5 }}>
        {block.text}
      </Typography>
    )
  }

  if (block.type === 'table') {
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
  }

  if (block.type === 'stat_grid') {
    return <StatGrid items={block.items} />
  }

  if (block.type === 'comparison') {
    return <ComparisonView items={block.items} caption={block.caption} savings={block.savings} />
  }

  if (block.type === 'range_bar') {
    return <RangeBarChart items={block.items} maxScale={block.maxScale} unit={block.unit} caption={block.caption} />
  }

  if (block.type === 'bar_chart') {
    return (
      <Suspense fallback={null}>
        <SimpleBarChart items={block.items} unit={block.unit} caption={block.caption} />
      </Suspense>
    )
  }

  if (block.type === 'line_chart') {
    return (
      <Suspense fallback={null}>
        <SimpleLineChart items={block.items} unit={block.unit} caption={block.caption} color={block.color} />
      </Suspense>
    )
  }

  if (block.type === 'timeline') {
    return <TimelineView steps={block.steps} caption={block.caption} />
  }

  if (block.type === 'progress_stack') {
    return <ProgressStack segments={block.segments} total={block.total} caption={block.caption} />
  }

  return null
}

interface FactSectionProps {
  section: Section
  defaultExpanded?: boolean
}

export default function FactSection({ section, defaultExpanded = false }: FactSectionProps) {
  return (
    <Accordion defaultExpanded={defaultExpanded} id={`section-${section.id}`}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {section.title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {section.content.map((block, i) => (
            <ContentBlockView key={i} block={block} />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}
