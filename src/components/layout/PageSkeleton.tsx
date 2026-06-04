import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

interface PageSkeletonProps {
  blocks?: number
}

// Top-anchored loading placeholder that mirrors the structure of a loaded
// detail page (title, then a stack of content blocks). Reserving this layout
// instead of a centered spinner keeps the above-the-fold content stable when
// the fetched data swaps in, minimizing cumulative layout shift.
export default function PageSkeleton({ blocks = 4 }: PageSkeletonProps) {
  return (
    <Box aria-busy="true" aria-label="Inhalt wird geladen">
      <Skeleton variant="text" sx={{ fontSize: '2rem', width: '70%' }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '90%', mb: 3 }} />
      {Array.from({ length: blocks }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rounded"
          height={120}
          sx={{ mb: 2, borderRadius: 1 }}
        />
      ))}
    </Box>
  )
}
