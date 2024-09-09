import { Save, Query, Delete } from "./toolbar";

const endpoint = "departments/";

export const index = async (params) => {
  const data = await Query(endpoint, params);
  return data;
};

export const store = async (data) => {
  const response = await Save(endpoint, data);
  return response;
};

export const destroy = async (id) => {
  const response = await Delete(endpoint + id);
  return response;
};
