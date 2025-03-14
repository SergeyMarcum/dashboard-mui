import React, { useEffect, useState, useCallback } from "react";
import { User, useUsersStore } from "../store/usersStore";

import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";

import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Avatar,
  Checkbox,
  SelectChangeEvent,
  Popover,
  Stack,
  Typography,
  OutlinedInput,
} from "@mui/material";
import { Add, Delete, Email, Phone, Edit } from "@mui/icons-material";

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
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  //const [pageSize, setPageSize] = useState<number>(5);

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
    const username = sessionStorage.getItem("username");
    const sessionCode = sessionStorage.getItem("session_code");

    console.log("username:", username, "sessionCode:", sessionCode); // Логируем параметры

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
    (event: SelectChangeEvent<string>) => {
      setSelectedDepartment(event.target.value);
    },
    []
  );

  const handleEdit = useCallback((user: User) => {
    setEditingUser(user);
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

  const renderStatus = (statusId: number | null) => {
    const statuses: { [key: number]: string } = {
      1: "Работает",
      2: "Уволен",
      3: "Отпуск",
      4: "Командировка",
      5: "Больничный",
    };
    return statuses[statusId || 0] || "Неизвестно";
  };

  const columns: GridColDef[] = [
    {
      field: "select",
      headerName: "",
      width: 50,
      renderCell: () => <Checkbox />,
    },
    {
      field: "avatar",
      headerName: "Аватар",
      width: 70,
      renderCell: () => <Avatar />,
    },
    { field: "full_name", headerName: "ФИО пользователя", width: 200 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "department", headerName: "Отдел", width: 180 },
    { field: "phone", headerName: "Телефон", width: 150 },
    {
      field: "role_id",
      headerName: "Роли и права доступа",
      width: 250,
      renderCell: (params) => renderRole(params.value),
    },
    {
      field: "status_id",
      headerName: "Статус",
      width: 150,
      renderCell: (params) => renderStatus(params.value),
    },
    {
      field: "actions",
      headerName: "Действия",
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button onClick={() => handleEdit(params.row)}>Редактировать</Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </Box>
      ),
    },
  ];

  /*const filteredUsers =
    selectedDepartment === "all"
      ? users
      : users.filter((user) => user.department === selectedDepartment);
*/

  // Фильтрация пользователей по отделу и телефону
  const filteredUsers = users.filter((user) => {
    const departmentMatch =
      selectedDepartment === "all" || user.department === selectedDepartment;
    const phoneMatch = phoneFilter === "" || user.phone.includes(phoneFilter);

    return departmentMatch && phoneMatch;
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
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <FormControl sx={{ minWidth: 120 }}>
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
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<Email />}>
            Email
          </Button>
          <Button
            onClick={handlePhoneFilterClick}
            variant="outlined"
            startIcon={<Phone />}
            sx={{ ml: 2 }}
          >
            Телефон
          </Button>
        </Stack>
      </Stack>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePhoneFilterClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ padding: 2, width: 200 }}>
          <Typography variant="subtitle2">Фильтр по телефону</Typography>
          <OutlinedInput
            value={phoneFilter}
            onChange={handlePhoneFilterChange}
            placeholder="Введите телефон"
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <Button variant="contained" onClick={handlePhoneFilterClose}>
            Применить
          </Button>
        </Box>
      </Popover>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel} //  Обновляем состояние
          disableRowSelectionOnClick
        />
      )}
    </Box>
  );
};

export default UsersPage;
