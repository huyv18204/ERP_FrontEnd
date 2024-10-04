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

const initialState = {
  warehouseImport: [],
  supplier_id: null,
  warehouseEntry: {},
  warehouseEntryDetials: [],

  warehouseExport: [],
  stockOut: {},
  stockOutItems: [],
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

    case JUMP_SO_EXPORT:
      return {
        ...state,
        warehouseExport: action.payload,
      };
    case JUMP_SO_CREATE:
      return {
        ...state,
        stockOut: action.payload.stock_out,
        stockOutItems: action.payload.stock_out_items,
      };

    case CLEAR_SO_CREATE:
      return {
        ...state,
        stockOut: {},
        stockOutItems: [],
      };

    case CLEAR_SO_EXPORT:
      return {
        ...state,
        warehouseExport: [],
      };
    default:
      return state;
  }
};

export default warehouseReducer;
