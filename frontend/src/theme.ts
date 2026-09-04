import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1a5276',      // Deep ocean blue
      light: '#2e86c1',     // Sky blue
      dark: '#0e2f44',      // Deep sea
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#27ae60',      // Forest green
      light: '#52be80',     // Light green
      dark: '#1a7a42',      // Deep forest
      contrastText: '#ffffff',
    },
    success: {
      main: '#27ae60',
      light: '#52be80',
      dark: '#1a7a42',
    },
    warning: {
      main: '#f39c12',      // Earth/sand
      light: '#f7dc6f',
      dark: '#b7950b',
    },
    error: {
      main: '#e74c3c',      // Terrain red
      light: '#ec7063',
      dark: '#922b21',
    },
    background: {
      default: '#f0f4f8',   // Light sky
      paper: '#ffffff',
    },
    text: {
      primary: '#1a2a3a',
      secondary: '#4a5a6a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(26, 82, 118, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(26, 82, 118, 0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0e2f44 0%, #1a5276 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #1a7a42 0%, #27ae60 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0e5a30 0%, #1a7a42 100%)',
          },
        },
        outlined: {
          borderColor: '#2e86c1',
          color: '#1a5276',
          '&:hover': {
            backgroundColor: 'rgba(46, 134, 193, 0.08)',
            borderColor: '#1a5276',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 1px 20px rgba(26, 82, 118, 0.06)',
          borderBottom: '1px solid rgba(46, 134, 193, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: 'rgba(46, 134, 193, 0.1)',
          color: '#1a5276',
        },
      },
    },
  },
});
