import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    footer: Palette['primary']
    greenPale: Palette['primary']
    goldPale: Palette['primary']
    border: Palette['primary']
    surfaceMuted: Palette['primary']
  }
  interface PaletteOptions {
    footer?: PaletteOptions['primary']
    greenPale?: PaletteOptions['primary']
    goldPale?: PaletteOptions['primary']
    border?: PaletteOptions['primary']
    surfaceMuted?: PaletteOptions['primary']
  }
}

export const mullaiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#067a52',
      dark: '#064e3b',
      light: '#0e9f6e',
      contrastText: '#fbfcfa',
    },
    secondary: {
      main: '#e6b130',
      dark: '#bc8e1c',
      light: '#f3e3b3',
      contrastText: '#064e3b',
    },
    success: { main: '#067a52', light: '#e6f6ee' },
    warning: { main: '#9a6b00', light: '#fbf1d8' },
    info: { main: '#2c6fb5', light: '#eaf4ff' },
    error: { main: '#c2412d', light: '#fbeeec' },
    background: {
      default: '#f4f6f3',
      paper: '#ffffff',
    },
    text: {
      primary: '#15241d',
      secondary: '#5a6b61',
    },
    divider: '#e4ede7',
    footer: { main: '#053524', contrastText: '#c9dfcf' },
    greenPale: { main: '#e6f6ee' },
    goldPale: { main: '#f3e3b3' },
    border: { main: '#d5e0d8' },
    surfaceMuted: { main: '#f1f6f2' },
  },
  typography: {
    fontFamily: '"Anek Tamil", sans-serif',
    h1: { fontFamily: '"Noto Serif Tamil", serif', fontWeight: 700 },
    h2: { fontFamily: '"Noto Serif Tamil", serif', fontWeight: 700 },
    h3: { fontFamily: '"Noto Serif Tamil", serif', fontWeight: 700 },
    h4: { fontFamily: '"Noto Serif Tamil", serif', fontWeight: 700 },
    h5: { fontFamily: '"Noto Serif Tamil", serif', fontWeight: 700 },
    h6: { fontFamily: '"Noto Serif Tamil", serif', fontWeight: 700 },
    subtitle1: { fontFamily: '"Cormorant Garamond", Georgia, serif' },
    subtitle2: { fontFamily: '"Cormorant Garamond", Georgia, serif' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#f4f6f3' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, fontWeight: 600, padding: '10px 20px' },
        contained: {
          boxShadow: '0 6px 16px rgba(6,122,82,0.22)',
          '&:hover': { boxShadow: '0 8px 20px rgba(6,122,82,0.28)' },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small', fullWidth: true },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#fff',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#067a52',
            boxShadow: '0 0 0 3px rgba(6,122,82,0.12)',
          },
        },
        notchedOutline: { borderColor: '#d5e0d8' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 18, boxShadow: '0 40px 90px rgba(3,32,22,0.4)' },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: { padding: 0 },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: { padding: 0 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 18, border: '1px solid #e4ede7', boxShadow: '0 10px 30px rgba(5,70,50,0.05)' },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, fontSize: '0.75rem' } },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          fontSize: '0.75rem',
          color: '#5a6b61',
          backgroundColor: '#f1f6f2',
          borderBottom: '1px solid #e4ede7',
        },
      },
    },
  },
})
