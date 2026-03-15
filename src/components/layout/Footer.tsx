import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <Box component="footer" sx={{ py: 3, mt: 'auto', bgcolor: 'primary.dark', color: 'primary.contrastText' }}>
      <Container maxWidth="md">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2}>
            <Link
              component={RouterLink}
              to="/impressum"
              color="inherit"
              underline="hover"
              sx={{ fontWeight: 500 }}
            >
              Impressum & Datenschutz
            </Link>
            <Link
              component={RouterLink}
              to="/feedback"
              color="inherit"
              underline="hover"
              sx={{ fontWeight: 500 }}
            >
              Feedback
            </Link>
          </Stack>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            © {year} Fakten-Stammtisch
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}
