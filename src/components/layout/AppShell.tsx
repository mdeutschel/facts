import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SearchBar from './SearchBar'

export default function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          {!isHome && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate(-1)}
              aria-label="Zurück"
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
            onClick={() => navigate('/')}
          >
            Fakten-Stammtisch
          </Typography>
          <SearchBar />
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="md"
        sx={{ flex: 1, py: { xs: 2, sm: 3 }, px: { xs: 1.5, sm: 3 } }}
      >
        <Outlet />
      </Container>
    </Box>
  )
}
