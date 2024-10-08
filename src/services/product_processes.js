import { Create, Query, Delete, Update } from "./toolbar";
import instance from "../configs/axios";
const endpoint = "product-processes/";

export const index = async (params) => {
  const data = await Query(endpoint, params);
  return data;
};

export const store = async (data) => {
  const response = await Create(endpoint, data);
  return response;
};

export const destroy = async (id) => {
  const response = await Delete(endpoint + id);
  return response;
};

export const update = async (id, data) => {
  const response = await Update(endpoint + id, data);
  return response;
};

export const show = async (code) => {
  const response = await instance.get(endpoint + code);
  return response;
};
