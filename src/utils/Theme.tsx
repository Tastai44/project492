import { createTheme } from "@mui/material";

export const themeApp = createTheme({
  typography: {
    allVariants: {
      fontFamily: "inter",
      textTransform: "none",
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
