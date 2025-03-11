import React, { useEffect, useState } from "react";
import { User, useUsersStore } from "../store/usersStore"; // Импортируем тип User
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

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

  useEffect(() => {
    fetchDepartments();
    fetchUsers("orenburg");
  }, [fetchDepartments, fetchUsers]);

  const handleDepartmentChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedDepartment(event.target.value as string);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleSave = async () => {
    if (editingUser) {
      await editUser(editingUser.id as number, editingUser);
      setEditingUser(null);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "Аватар",
      width: 70,
      renderCell: () => <div className="avatar-placeholder" />,
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
      width: 180,
      renderCell: (params) => (
        <Box>
          <Button onClick={() => handleEdit(params.row)}>Редактировать</Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </Box>
      ),
    },
  ];

  const renderRole = (roleId: number) => {
    const roles: { [key: number]: string } = {
      1: "Администратор",
      2: "Администратор общества",
      3: "Администратор филиала",
      4: "Мастер",
      5: "Оператор",
      6: "Гость",
    };
    return roles[roleId] || "Неизвестно";
  };

  const renderStatus = (statusId: number | null) => {
    const statuses: { [key: number]: string } = {
      1: "Работает",
      2: "Уволен",
      3: "Командировка",
      4: "Больничный",
    };
    return statuses[statusId || 0] || "Неизвестно";
  };

  const filteredUsers =
    selectedDepartment === "all"
      ? users
      : users.filter((user) => user.department === selectedDepartment);

  return (
    <Box sx={{ height: 400, width: "100%" }}>
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

      {isLoading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      )}
    </Box>
  );
};

export default UsersPage;
