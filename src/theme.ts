import { createTheme } from '@mui/material/styles'

// Visualization color palettes — used by chart/graph components
export const chartPalette = {
  comparison: ['#546e7a', '#00897b'],
  sequential: ['#00897b', '#26a69a', '#4db6ac', '#80cbc4', '#78909c', '#b71c1c'],
}

export function formatGermanDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#37474f',
      light: '#62727b',
      dark: '#102027',
    },
    secondary: {
      main: '#00897b',
      light: '#4ebaaa',
      dark: '#005b4f',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    body2: {
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          '&:before': { display: 'none' },
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 48,
        },
      },
    },
  },
})

export default theme
