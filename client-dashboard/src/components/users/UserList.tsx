import { Avatar, Box, Typography } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import usersData from "./users.json";
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { grey } from "@mui/material/colors";
import { UsersActions } from "./UsersActions";

export const UserList = ({ setSelectLink, link }) => {
  const {
    state: { users },
    dispatch,
  } = useValue();

  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);

  useEffect(() => {
    setSelectLink(link);
    if (usersData.length === 0) getUsers(dispatch);
  }, []);

  const columns = useMemo(
    () => [
      {
        field: "photoURL",
        headerName: "Фото",
        width: 60,
        renderCell: (params) => <Avatar src={params.row.photoURL} />,
        sortable: false,
        filterable: false,
      },
      { field: "name", headerName: "ФИО", width: 170 },
      { field: "email", headerName: "Эл. почта", width: 200 },
      {
        field: "role",
        headerName: "Роль",
        width: 100,
        type: "singleSelect",
        valueOptions: ["basic", "editor", "admin"],
        editable: true,
      },
      {
        field: "active",
        headerName: "Статус",
        width: 100,
        type: "boolean",
        editable: true,
      },
      {
        field: "createdAt",
        headerName: "Дата",
        width: 100,
        renderCell: (params) =>
          moment(params.row.createdAt).format("YYYY-MM-DD HH:MM:SS"),
      },
      { field: "_id", headerName: "Id", width: 220 },
      {
        field: "actions",
        headerName: "Действие",
        type: "actions",
        renderCell: (params) => (
          <UsersActions {...{ params, rowId, setRowId }} />
        ),
        width: 220,
      },
    ],
    [rowId]
  );

  return (
    <Box
      sx={{
        height: 400,
        width: "100%",
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        sx={{ textAlign: "center", mt: 3, mb: 3 }}
      >
        Управление пользователями
      </Typography>
      <DataGrid
        columns={columns}
        rows={users}
        getRowId={(row) => row._id}
        rowsPerPageOptions={[5, 10, 20]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        sx={{
          [`& .${gridClasses.row}`]: {
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? grey[200] : grey[900],
          },
        }}
        onCellEditCommit={(params) => setRowId(params.id)}
      />
    </Box>
  );
};
