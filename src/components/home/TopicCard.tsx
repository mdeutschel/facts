import { useNavigate } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import HeatPumpIcon from '@mui/icons-material/HeatPump'
import BoltIcon from '@mui/icons-material/Bolt'
import TopicIcon from '@mui/icons-material/Topic'
import type { TopicMeta } from '../../types'

const iconMap: Record<string, React.ReactElement> = {
  heat_pump: <HeatPumpIcon sx={{ fontSize: 40 }} />,
  bolt: <BoltIcon sx={{ fontSize: 40 }} />,
}

interface TopicCardProps {
  topic: TopicMeta
}

export default function TopicCard({ topic }: TopicCardProps) {
  const navigate = useNavigate()
  const icon = iconMap[topic.icon] ?? <TopicIcon sx={{ fontSize: 40 }} />

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea
        onClick={() => navigate(`/thema/${topic.id}`)}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardContent sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ color: 'secondary.main' }}>{icon}</Box>
            <Box>
              <Typography variant="h6" component="h2" sx={{ lineHeight: 1.2 }}>
                {topic.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {topic.subtitle}
              </Typography>
            </Box>
          </Box>
          {topic.keyStats && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5 }}>
              {topic.keyStats.map((stat, i) => (
                <Chip key={i} label={stat} size="small" variant="outlined" />
              ))}
            </Box>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            Stand: {topic.lastUpdated}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
