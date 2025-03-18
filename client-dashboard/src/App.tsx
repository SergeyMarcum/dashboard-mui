import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import { AppRouter } from "./app/router";

export const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AppRouter />
  </ThemeProvider>
);

export default App;
