import {
  JUMP_WAREHOUSE_IMPORT,
  JUMP_WAREHOUSE_CREATE,
  CLEAR_WAREHOUSE_CREATE,
  CLEAR_WAREHOUSE_IMPORT,
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
