import {
  OPEN_MODAL_PRODUCT_PROCESS,
  CLOSE_MODAL_PRODUCT_PROCESS,
  OPEN_MODAL_PRODUCT_NG,
  CLOSE_MODAL_PRODUCT_NG,
} from "../types";

const initialState = {
  isOpenProductProcess: false,
  isOpenProductNg: false,
  saleOrder: {},
};

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_MODAL_PRODUCT_PROCESS:
      return {
        ...state,
        saleOrder: action.payload,
        isOpenProductProcess: true,
      };
    case CLOSE_MODAL_PRODUCT_PROCESS:
      return { ...state, isOpenProductProcess: false };
    case OPEN_MODAL_PRODUCT_NG:
      return {
        ...state,
        saleOrder: action.payload,
        isOpenProductNg: true,
      };
    case CLOSE_MODAL_PRODUCT_NG:
      return { ...state, isOpenProductNg: false };
    default:
      return state;
  }
};

export default modalReducer;
