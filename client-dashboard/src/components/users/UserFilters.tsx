import { Box, Button, Select, MenuItem } from "@mui/material";

const UserFilters = () => {
  return (
    <Box sx={{ display: "flex", gap: 2, my: 2 }}>
      <Button variant="contained">Email</Button>
      <Button variant="contained">Отдел</Button>
      <Button variant="contained">Телефон</Button>
      <Select defaultValue="new" size="small">
        <MenuItem value="new">Сначала новые</MenuItem>
        <MenuItem value="old">Сначала старые</MenuItem>
      </Select>
    </Box>
  );
};

export default UserFilters;
