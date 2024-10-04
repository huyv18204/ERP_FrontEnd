import {
  JUMP_WAREHOUSE_IMPORT,
  JUMP_WAREHOUSE_CREATE,
  CLEAR_WAREHOUSE_CREATE,
  CLEAR_WAREHOUSE_IMPORT,
  JUMP_SO_EXPORT,
  JUMP_SO_CREATE,
  CLEAR_SO_CREATE,
  CLEAR_SO_EXPORT,
} from "../types";

export const jumpWHImport = (payload) => ({
  type: JUMP_WAREHOUSE_IMPORT,
  payload: payload,
});

export const clearWHImport = () => ({
  type: CLEAR_WAREHOUSE_IMPORT,
});

export const clearWHCreate = () => ({
  type: CLEAR_WAREHOUSE_CREATE,
});

export const jumpWHCreate = (payload) => {
  const warehouseEntryDetials = payload.warehouse_entry_details.map((item) => ({
    ...item,
    key: item.id,
  }));

  return {
    type: JUMP_WAREHOUSE_CREATE,
    payload: {
      warehouse_entry: payload,
      warehouse_entry_details: warehouseEntryDetials,
    },
  };
};

export const jumpSOExport = (payload) => ({
  type: JUMP_SO_EXPORT,
  payload: payload,
});

export const clearSOExport = () => ({
  type: CLEAR_SO_EXPORT,
});

export const clearSOCreate = () => ({
  type: CLEAR_SO_CREATE,
});

export const jumpSOCreate = (payload) => {
  const stockOutItems = payload.stock_out_items.map((item) => ({
    ...item,
    key: item.id,
  }));

  return {
    type: JUMP_SO_CREATE,
    payload: {
      stock_out: payload,
      stock_out_items: stockOutItems,
    },
  };
};
