import {
  JUMP_WAREHOUSE_IMPORT,
  JUMP_WAREHOUSE_CREATE,
  CLEAR_WAREHOUSE_CREATE,
  CLEAR_WAREHOUSE_IMPORT,
} from "../types";

const initialState = {
  warehouseImport: [],
  supplier_id: null,
  warehouseEntry: {},
  warehouseEntryDetials: [],
};

const warehouseReducer = (state = initialState, action) => {
  switch (action.type) {
    case JUMP_WAREHOUSE_IMPORT:
      return {
        ...state,
        warehouseImport: action.payload.WHEntryDetail,
        supplier_id: action.payload.supplier_id,
      };
    case JUMP_WAREHOUSE_CREATE:
      return {
        ...state,
        warehouseEntry: action.payload.warehouse_entry,
        warehouseEntryDetials: action.payload.warehouse_entry_details,
      };

    case CLEAR_WAREHOUSE_CREATE:
      return {
        ...state,
        warehouseEntry: {},
        warehouseEntryDetials: [],
      };

    case CLEAR_WAREHOUSE_IMPORT:
      return {
        ...state,
        warehouseImport: [],
        supplier_id: null,
      };
    default:
      return state;
  }
};

export default warehouseReducer;
