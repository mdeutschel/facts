import type { ComponentType } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SvgIconProps } from '@mui/material/SvgIcon'
import PersonIcon from '@mui/icons-material/Person'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import HomeIcon from '@mui/icons-material/Home'
import EuroIcon from '@mui/icons-material/Euro'
import PublicIcon from '@mui/icons-material/Public'
import GroupIcon from '@mui/icons-material/Group'

interface PictographProps {
  filled: number
  total: number
  label: string
  icon?: string
  color?: string
  caption?: string
}

const iconMap: Record<string, ComponentType<SvgIconProps>> = {
  person: PersonIcon,
  child_care: ChildCareIcon,
  home: HomeIcon,
  euro: EuroIcon,
  public: PublicIcon,
  group: GroupIcon,
}

// Icon-array (waffle) chart: renders `total` icons, of which `filled` are
// highlighted — turning an abstract share ("X von N") into something tangible.
// Kept MUI-only and capped at 100 icons to stay light on mobile.
export default function Pictograph({ filled, total, label, icon, color, caption }: PictographProps) {
  const Icon = iconMap[icon ?? 'person'] ?? PersonIcon
  const safeTotal = Math.max(1, Math.min(Math.round(total), 100))
  const safeFilled = Math.max(0, Math.min(Math.round(filled), safeTotal))
  const activeColor = color ?? 'secondary.main'

  return (
    <Box sx={{ my: 1 }}>
      {caption && (
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
          {caption}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: safeTotal <= 10 ? 320 : 'none' }}>
        {Array.from({ length: safeTotal }).map((_, i) => (
          <Icon key={i} sx={{ fontSize: 22, color: i < safeFilled ? activeColor : 'grey.300' }} />
        ))}
      </Box>
      <Typography variant="body2" sx={{ mt: 1 }}>
        <Box component="span" sx={{ color: activeColor, fontWeight: 800 }}>
          {safeFilled} von {safeTotal}
        </Box>{' '}
        {label}
      </Typography>
    </Box>
  )
}
