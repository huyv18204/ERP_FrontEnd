import {
  OPEN_MODAL_PRODUCT_PROCESS,
  CLOSE_MODAL_PRODUCT_PROCESS,
  OPEN_MODAL_PRODUCT_NG,
  CLOSE_MODAL_PRODUCT_NG,
} from "../types";

export const openModalProductProcess = (payload) => ({
  type: OPEN_MODAL_PRODUCT_PROCESS,
  payload: payload,
});

export const closeModalProductProcess = () => ({
  type: CLOSE_MODAL_PRODUCT_PROCESS,
});

export const openModalProductNG = (payload) => ({
  type: OPEN_MODAL_PRODUCT_NG,
  payload: payload,
});

export const closeModalProductNG = () => ({
  type: CLOSE_MODAL_PRODUCT_NG,
});
