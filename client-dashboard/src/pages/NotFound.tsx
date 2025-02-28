import { Box, Typography } from "@mui/material";

const NotFound = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column",
    }}
  >
    <Typography variant="h2">404</Typography>
    <Typography variant="h6">Страница не найдена</Typography>
  </Box>
);

export default NotFound;
