import {
  JUMP_PURCHASE_ORDER_REGISTER,
  JUMP_PURCHASE_REQUISITION,
} from "../types";

const initialState = {
  purchaseOrderItems: [],
  selectedRowKeys: [],
};

const purchaseOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case JUMP_PURCHASE_ORDER_REGISTER:
      return {
        ...state,
        purchaseOrderItems: action.payload.purchaseOrderItems,
        selectedRowKeys: action.payload.selectedRowKeys,
      };

    case JUMP_PURCHASE_REQUISITION:
      return {
        ...state,
        purchaseOrderItems: [],
        selectedRowKeys: [],
      };
    default:
      return state;
  }
};

export default purchaseOrderReducer;
