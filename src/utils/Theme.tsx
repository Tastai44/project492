import { createTheme } from "@mui/material";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const themeApp = createTheme({
  typography: {
    allVariants: {
      fontFamily: "Roboto",
      textTransform: "none",
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // border: "0px",
          "&:focus": {
            outline: "none",
          },
          "&:active": {
            boxShadow: "none",
          },
        },
      },
    },

    MuiCircularProgress: {
      styleOverrides: {
        root: {
          border: "0px",
          "&:focus": {
            outline: "none",
          },
          "&:active": {
            boxShadow: "none",
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          border: "0px",
          "&:focus": {
            outline: "none",
          },
          "&:active": {
            boxShadow: "none",
          },
        },
      },
    },
  },

  palette: {
    primary: { main: "#8E51E2", dark: "#000000", contrastText: "#CCCCCC" },
    secondary: { main: "#456086", dark: "#CCC1BE" },
    action: { active: "#000" },
    background: {
      default: "#EEE6E2",
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});
