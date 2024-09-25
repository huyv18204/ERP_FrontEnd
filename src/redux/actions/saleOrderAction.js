import { JUMP_SALE_ORDER_REGISTER } from "../types";

export const jumpRegister = (payload) => {
  const saleOrderItem = payload.sale_order_items.map((item) => ({
    ...item,
    key: item.id,
  }));

  return {
    type: JUMP_SALE_ORDER_REGISTER,
    payload: {
      saleOrder: payload,
      saleOrderItems: saleOrderItem,
    },
  };
};
