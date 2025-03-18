import React, { useEffect, useState, useCallback } from "react";
import { User, useUsersStore } from "../store/usersStore";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Avatar,
  Tabs,
  Tab,
  Typography,
  OutlinedInput,
  Popover,
} from "@mui/material";
import {
  Email,
  Phone,
  Delete,
  Edit,
  CheckCircle,
  DoDisturbOn,
  WatchLater,
} from "@mui/icons-material";

const UsersPage: React.FC = () => {
  const {
    users,
    departments,
    isLoading,
    fetchUsers,
    fetchDepartments,
    editUser,
  } = useUsersStore();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });

  // Для фильтрации по телефону
  const [phoneFilter, setPhoneFilter] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    console.log("Запуск функции загрузки пользователей");
    fetchDepartments();
    fetchDepartments();
    const username = sessionStorage.getItem("username");
    const sessionCode = sessionStorage.getItem("session_code");
    console.log("username:", username, "sessionCode:", sessionCode);

    if (username && sessionCode) {
      fetchUsers(username, sessionCode);
    } else {
      console.log("Нет username или sessionCode");
    }
  }, [fetchDepartments, fetchUsers]);

  useEffect(() => {
    console.log("Users:", users); // Логируем состояние users
  }, [users]);

  const handleDepartmentChange = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      setSelectedDepartment(event.target.value as string);
    },
    []
  );

  const handleEdit = useCallback((user: User) => {
    setEditingUser(user);
  }, []);

  const handleDelete = useCallback((userId: number) => {
    console.log("Удаление пользователя ID:", userId);
  }, []);

  const handleSave = useCallback(async () => {
    if (editingUser) {
      await editUser(editingUser.id as number, editingUser);
      setEditingUser(null);
    }
  }, [editingUser, editUser]);

  const renderRole = (roleId: number) => {
    const roles: { [key: number]: string } = {
      1: "Администратор", //ROLE_SUPER_USER = 1
      2: "Администратор филиала", // ROLE_COMPANY_ADMIN = 2
      3: "Мастер", // ROLE_SHIFT_MANAGER = 3
      4: "Оператор", // ROLE_OPERATOR = 4
      5: "Наблюдатель Филиала", //ROLE_OBSERVER = 5 ((Директор, Главный инженер, начальник отдела))
      6: "Гость", // ROLE_GUEST = 6
      7: "Уволенные", // ROLE_DISMISSED = 7
      8: "Администратор общества", // ROLE_MAIN_ADMIN = 8
    };
    return roles[roleId] || "Неизвестно";
  };

  // Функция для рендера статуса
  const renderStatusChip = (statusId: number | null) => {
    const statusMap: { [key: number]: { label: string; icon: JSX.Element } } = {
      1: {
        label: "Работает",
        icon: <CheckCircle color="success" />,
      },
      2: { label: "Уволен(а)", icon: <DoDisturbOn color="error" /> },
      3: { label: "Отпуск", icon: <WatchLater color="warning" /> },
      4: { label: "Командировка", icon: <WatchLater color="warning" /> },
      5: { label: "Больничный", icon: <WatchLater color="warning" /> },
    };

    const status = statusMap[statusId || 0];
    return status ? (
      <Chip
        variant="outlined"
        size="small"
        label={status.label}
        icon={status.icon}
      />
    ) : (
      <Chip variant="outlined" size="small" label="Неизвестно" />
    );
  };

  const columns: GridColDef[] = [
    {
      field: "user_info",
      headerName: "ФИО пользователя",
      width: 400,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={params.row.avatar || "/assets/default-avatar.png"} />
          <Box>
            <Typography variant="subtitle2">{params.row.full_name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {params.row.email}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    { field: "department", headerName: "Отдел", width: 350 },
    { field: "phone", headerName: "Телефон", width: 150 },
    {
      field: "role_id",
      headerName: "Роли и права доступа",
      width: 200,
      renderCell: (params) => renderRole(params.value),
    },
    {
      field: "status_id",
      headerName: "Статус",
      width: 150,
      renderCell: (params) => renderStatusChip(params.value),
    },
    {
      field: "actions",
      headerName: "Действия",
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            startIcon={<Edit />}
            onClick={() => handleEdit(params.row)}
          ></Button>
          <Button
            size="small"
            color="error"
            startIcon={<Delete />}
            onClick={() => handleSave}
          ></Button>
        </Stack>
      ),
    },
  ];

  const filteredUsers = users.filter((user) => {
    const departmentMatch =
      selectedDepartment === "all" || user.department === selectedDepartment;
    const statusMatch =
      statusFilter === "all" || user.status_id?.toString() === statusFilter;
    const phoneMatch = phoneFilter === "" || user.phone.includes(phoneFilter);
    return departmentMatch && statusMatch && phoneMatch;
  });

  const handlePhoneFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPhoneFilter(event.target.value);
  };

  const handlePhoneFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePhoneFilterClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      {/* Вкладки */}
      <Tabs
        value={statusFilter}
        onChange={(_, newValue) => setStatusFilter(newValue)}
      >
        <Tab label="Все" value="all" />
        <Tab label="Работает" value="1" />
        <Tab label="Отпуск" value="3" />
        <Tab label="Больничный" value="5" />
        <Tab label="Уволен" value="2" />
      </Tabs>

      {/* Панель управления */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        sx={{ my: 2 }}
      >
        <Stack direction="row" spacing={1}>
          <FormControl sx={{ minWidth: 350 }}>
            <InputLabel>Отдел</InputLabel>
            <Select
              value={selectedDepartment}
              label="Отдел"
              onChange={handleDepartmentChange}
            >
              <MenuItem value="all">Все</MenuItem>
              {departments.map((dept, idx) => (
                <MenuItem key={idx} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<Email />}>
            Email
          </Button>
          <Button
            onClick={handlePhoneFilterClick}
            variant="outlined"
            startIcon={<Phone />}
          >
            Телефон
          </Button>
        </Stack>
      </Stack>

      {/* Фильтр по телефону */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePhoneFilterClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ padding: 2, width: 350 }}>
          <Typography variant="subtitle2">Фильтр по телефону</Typography>
          <OutlinedInput
            value={phoneFilter}
            onChange={handlePhoneFilterChange}
            placeholder="Введите телефон"
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handlePhoneFilterClose}>
            Применить
          </Button>
        </Box>
      </Popover>

      {/* Таблица */}
      {isLoading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          checkboxSelection
          disableRowSelectionOnClick
        />
      )}
    </Box>
  );
};

export default UsersPage;
