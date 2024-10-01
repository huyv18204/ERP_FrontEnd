import { JUMP_PRODUCTION_ORDER_REGISTER } from "../types";

export const jumpPDORegister = (payload) => {
  let saleOrderItems = [];

  payload.forEach((items) => {
    const mappedItems = items.sale_order_items?.map((item) => ({
      ...item,
      key: item.id,
    }));

    saleOrderItems = [...saleOrderItems, ...mappedItems];
  });

  return {
    type: JUMP_PRODUCTION_ORDER_REGISTER,
    payload: saleOrderItems,
  };
};
