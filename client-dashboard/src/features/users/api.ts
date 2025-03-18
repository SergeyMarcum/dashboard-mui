import { get, put, del } from "../../shared/api/http";

export const fetchUsers = async () => {
  return get("/users");
};

export const updateUser = async (userId: string, data: object) => {
  return put(`/users/${userId}`, data);
};

export const deleteUser = async (userId: string) => {
  return del(`/users/${userId}`);
};
