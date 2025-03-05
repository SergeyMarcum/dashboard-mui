import { useEffect, useState } from "react";
import { Container, Tabs, Tab, Box } from "@mui/material";
import UserFilters from "../components/users/UserFilters";
import UserTable from "../components/users/UserTable";
import { useUsersStore } from "../store/usersStore";

const UsersPage = () => {
  const [tab, setTab] = useState("all");
  const { fetchUsers } = useUsersStore();

  useEffect(() => {
    fetchUsers(); // Убрал параметр page, так как сервер не поддерживает пагинацию
  }, [fetchUsers]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 3 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Все" value="all" />
          <Tab label="На работе" value="working" />
          <Tab label="На больничном" value="sick" />
          <Tab label="В командировке" value="business" />
          <Tab label="В отпуске" value="vacation" />
          <Tab label="Уволены" value="fired" />
        </Tabs>
      </Box>
      <UserFilters />
      <UserTable filterStatus={tab} />
    </Container>
  );
};

export default UsersPage;
