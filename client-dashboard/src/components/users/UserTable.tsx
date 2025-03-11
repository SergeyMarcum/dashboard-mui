import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
} from "@mui/material";
import { useUsersStore } from "../../store/usersStore";

import usersData from "./users.json"; // Импорт JSON напрямую, для тестов

const UserTable = ({ filterStatus }: { filterStatus: string }) => {
  /*const { users, fetchUsers } = useUsersStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
*/
  const { users, setUsers } = useUsersStore();

  useEffect(() => {
    setUsers(usersData); // Устанавливаем пользователей в Zustand Store
  }, []);

  const filteredUsers =
    filterStatus === "all"
      ? users
      : users.filter((user) => user.status === filterStatus);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell>#</TableCell>
            <TableCell>ФИО / Email</TableCell>
            <TableCell>Отдел</TableCell>
            <TableCell>Телефон</TableCell>
            <TableCell>Последний визит</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {user.full_name || user.name} / {user.email || "—"}
              </TableCell>
              <TableCell>{user.department || "—"}</TableCell>
              <TableCell>{user.phone || "—"}</TableCell>
              <TableCell>{user.lastVisit || "—"}</TableCell>
              <TableCell>{user.status || "—"}</TableCell>
              <TableCell>
                <Button variant="contained" size="small">
                  Редактировать
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
