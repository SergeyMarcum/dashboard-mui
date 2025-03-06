import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Используем useNavigate для редиректа
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from "@mui/icons-material/Group";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import MailIcon from "@mui/icons-material/Mail";
import BookIcon from "@mui/icons-material/Book";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportIcon from "@mui/icons-material/Support";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useAuthStore } from "../store/authStore"; // Импортируем useAuthStore для logout
import { useSidebarStore } from "../store/useSidebarStore";

const mainMenu = [
  { title: "Главная", path: "/", icon: <DashboardIcon /> },
  { title: "Календарь работ", path: "/calendar", icon: <EventNoteIcon /> },
  {
    title: "Задания",
    path: "",
    icon: <AssignmentIcon />,
    nestedList: [
      { title: "Создать", path: "/tasks/create", icon: null },
      { title: "Просмотр", path: "/tasks/view", icon: null },
      { title: "Контроль", path: "/tasks/control", icon: null },
    ],
  },
  { title: "Список сотрудников", path: "/employees", icon: <GroupIcon /> },
  {
    title: "Список пользователей",
    path: "/users",
    icon: <ManageAccountsIcon />,
  },
  {
    title: "Журналы",
    path: "",
    icon: <AutoStoriesIcon />,
    nestedList: [
      { title: "Журнал проверок", path: "/journals/audit", icon: null },
      { title: "Журнал дефектов", path: "/journals/defect", icon: null },
    ],
  },
  { title: "Сообщения", path: "/messages", icon: <MailIcon /> },
];

const bottomMenu = [
  { title: "Инструкции", path: "/instructions", icon: <BookIcon /> },
  { title: "Настройки", path: "/settings", icon: <SettingsIcon /> },
  { title: "Нужна помощь?", path: "/support", icon: <SupportIcon /> },
  { title: "Выход", path: "/logout", icon: <LogoutIcon /> },
];

const Sidebar = () => {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const navigate = useNavigate(); // Для редиректа на страницу логина после logout
  const logout = useAuthStore((state) => state.logout); // Используем logout из authStore
  const isOpenSidebar = useSidebarStore((state) => state.isOpen); // Получаем состояние

  const handleLogout = () => {
    logout(); // Выполняем logout
    navigate("/login"); // Редиректим на страницу авторизации
  };

  const handleClick = (title: string) => {
    setOpen((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <Drawer
      variant="permanent"
      open={isOpenSidebar}
      sx={{
        width: isOpenSidebar ? 240 : 30, // Узкая панель при закрытии
        transition: "width 0.3s",
        [`& .MuiDrawer-paper`]: {
          width: isOpenSidebar ? 240 : 60,
          transition: "width 0.3s",
        },
        flexShrink: 0,
      }}
    >
      <List sx={{ flexGrow: 1, paddingTop: 10 }}>
        {mainMenu.map(({ title, path, icon, nestedList }) => (
          <div key={title}>
            <ListItemButton
              component={path ? Link : "button"}
              to={path || "#"}
              sx={{ cursor: "pointer" }}
              onClick={nestedList ? () => handleClick(title) : undefined}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
              {nestedList && (open[title] ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
            {nestedList && (
              <Collapse in={open[title]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {nestedList.map(({ title, path }) => (
                    <ListItemButton
                      key={title}
                      component={Link}
                      to={path}
                      sx={{ pl: 4 }}
                    >
                      <ListItemText primary={title} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>
      <Divider />
      <List>
        {bottomMenu.map(({ title, path, icon }) => (
          <ListItemButton
            key={title}
            component={title === "Выход" ? "button" : Link} // Преобразуем "Выход" в кнопку
            onClick={title === "Выход" ? handleLogout : undefined} // Вызов logout при клике
            to={title !== "Выход" ? path : undefined} // Для "Выход" путь не нужен
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={title} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
