import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ffcc',
    },
    secondary: {
      main: '#ffff66',
    },
    background: {
      default: '#1b1b1b',
      paper: '#2b2b2b',
    },
  },
  typography: {
    fontFamily: '"Press Start 2P", cursive',
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '6px 12px',
          fontSize: '0.75rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#00ffcc',
            },
            '&:hover fieldset': {
              borderColor: '#00ffaa',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00ffcc',
            },
          },
        },
      },
    },
  },
});

export default theme; 