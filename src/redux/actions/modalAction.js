import {
  OPEN_MODAL_PRODUCT_ITEM,
  CLOSE_MODAL_PRODUCT_ITEM,
  OPEN_MODAL_PRODUCT_PROCESS,
  CLOSE_MODAL_PRODUCT_PROCESS,
} from "../types";

export const openModalProductItem = (payload) => ({
  type: OPEN_MODAL_PRODUCT_ITEM,
  payload: payload,
});

export const closeModalProductItem = () => ({
  type: CLOSE_MODAL_PRODUCT_ITEM,
});

export const openModalProductProcess = (payload) => ({
  type: OPEN_MODAL_PRODUCT_PROCESS,
  payload: payload,
});

export const closeModalProductProcess = () => ({
  type: CLOSE_MODAL_PRODUCT_PROCESS,
});
