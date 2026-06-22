import { createTheme } from '@mui/material/styles'
export default createTheme({
  palette: {
    mode: 'light',
    background: { default: '#f6f8fc', paper: '#ffffff' },
    primary: { main: '#1a73e8' },     // Google blue
    success: { main: '#188038' },
    warning: { main: '#e37400' },
    error:   { main: '#d93025' },
    text: { primary: '#202124', secondary: '#5f6368' }
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h6: { fontWeight: 600, letterSpacing: .2 },
    subtitle2: { color: '#5f6368' }
  },
  components: {
    MuiPaper: { styleOverrides: { root: { boxShadow: '0 1px 2px rgba(60,64,67,.1),0 1px 3px rgba(60,64,67,.08)' } } },
    MuiAppBar: { styleOverrides: { root: { background: '#fff', color: '#202124' } } }
  }
})
