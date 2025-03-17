import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Paper } from "@mui/material";

const drawerWidth = 240;

export default function Layout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Верхний бар */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Topbar />
      </AppBar>

      {/* Боковое меню */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", marginTop: "50px" }}>
          <Sidebar />
        </Box>
      </Drawer>

      {/* Основной контент */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 5,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            minWidth: "900px", // Чтобы контент не сжимался
            width: "100%", // Адаптивная ширина
            p: 4,
            boxShadow: 5,
            borderRadius: 2,
            backgroundColor: "background.paper",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "auto",
            overflow: "hidden", // Скрывает лишний контент
          }}
        >
          <Toolbar />
          <h2>Heading Page</h2>
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Outlet />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
