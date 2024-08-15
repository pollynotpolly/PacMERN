import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#D3D3D3", // Grey
    },
    yellow: {
      main: "#FFC001", // Yellow
    },
    green: {
      main: "#069330", // Green
    },
    red: {
      main: "#FF3000", // Red
    },
    background: {
      default: '#F5F5F5', // Gray
      paper: '#FFFFFF',  // White (corrected typo)
    },
    text: {
      primary: "#000099", // Blue
      secondary: '#FFFFFF', // White
    },
  },

  typography: {
    fontFamily: "NintendoFont",
  },

  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#000099", // Set the label color to blue
        },
      },
    },
  },
});

export default theme;
