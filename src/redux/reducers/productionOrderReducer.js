import { JUMP_PRODUCTION_ORDER_REGISTER } from "../types";

const initialState = {
  saleOrderItems: [],
};

const productionOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case JUMP_PRODUCTION_ORDER_REGISTER:
      return {
        ...state,
        saleOrderItems: action.payload,
      };
    default:
      return state;
  }
};

export default productionOrderReducer;
