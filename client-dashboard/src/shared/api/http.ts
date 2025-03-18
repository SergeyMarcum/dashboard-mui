import api from "../../app/api/axios";

export const get = (url: string, params?: object) => {
  return api.get(url, { params }).then((response) => response.data);
};

export const post = (url: string, data?: object) => {
  return api.post(url, data).then((response) => response.data);
};

export const put = (url: string, data?: object) => {
  return api.put(url, data).then((response) => response.data);
};

export const del = (url: string) => {
  return api.delete(url).then((response) => response.data);
};
