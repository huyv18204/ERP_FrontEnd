import { JUMP_SALE_ORDER_REGISTER } from "../types";

const initialState = {
  saleOrder: {},
  saleOrderItems: [],
};

const saleOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case JUMP_SALE_ORDER_REGISTER:
      return {
        ...state,
        saleOrder: action.payload.saleOrder,
        saleOrderItems: action.payload.saleOrderItems,
      };
    default:
      return state;
  }
};

export default saleOrderReducer;
