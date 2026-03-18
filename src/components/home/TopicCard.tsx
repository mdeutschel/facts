import { useNavigate } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import HeatPumpIcon from '@mui/icons-material/HeatPump'
import BoltIcon from '@mui/icons-material/Bolt'
import ElectricCarIcon from '@mui/icons-material/ElectricCar'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import PublicIcon from '@mui/icons-material/Public'
import ScheduleIcon from '@mui/icons-material/Schedule'
import SpaIcon from '@mui/icons-material/Spa'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import BalanceIcon from '@mui/icons-material/Balance'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import SchoolIcon from '@mui/icons-material/School'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import TopicIcon from '@mui/icons-material/Topic'
import type { TopicMeta } from '../../types'

const iconMap: Record<string, React.ReactElement> = {
  heat_pump: <HeatPumpIcon sx={{ fontSize: 40 }} />,
  bolt: <BoltIcon sx={{ fontSize: 40 }} />,
  electric_car: <ElectricCarIcon sx={{ fontSize: 40 }} />,
  directions_car: <DirectionsCarIcon sx={{ fontSize: 40 }} />,
  account_balance_wallet: <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />,
  public: <PublicIcon sx={{ fontSize: 40 }} />,
  schedule: <ScheduleIcon sx={{ fontSize: 40 }} />,
  eco: <SpaIcon sx={{ fontSize: 40 }} />,
  account_balance: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
  balance: <BalanceIcon sx={{ fontSize: 40 }} />,
  thermostat: <ThermostatIcon sx={{ fontSize: 40 }} />,
  school: <SchoolIcon sx={{ fontSize: 40 }} />,
  local_hospital: <LocalHospitalIcon sx={{ fontSize: 40 }} />,
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5 }}>
            <Chip label={`${topic.factCount} Fakten`} size="small" variant="outlined" />
            <Chip label={`${topic.argumentCount} Argumente`} size="small" variant="outlined" />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            Stand: {new Date(topic.lastUpdated).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
