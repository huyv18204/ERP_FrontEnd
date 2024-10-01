import {
  JUMP_PURCHASE_ORDER_REGISTER,
  JUMP_PURCHASE_REQUISITION,
} from "../types";

export const jumpPORegister = (payload) => {
  console.log(payload);

  let purchaseOrderItemsMap = {};

  payload.PRs.forEach((items) => {
    const mappedItems = items.purchase_requisition_items?.map((item) => ({
      ...item,
      key: item.id,
    }));

    mappedItems.forEach((item) => {
      if (purchaseOrderItemsMap[item.material_code]) {
        purchaseOrderItemsMap[item.material_code].quantity += item.quantity;
      } else {
        purchaseOrderItemsMap[item.material_code] = { ...item };
      }
    });
  });

  const purchaseOrderItems = Object.values(purchaseOrderItemsMap);

  return {
    type: JUMP_PURCHASE_ORDER_REGISTER,
    payload: {
      purchaseOrderItems: purchaseOrderItems,
      selectedRowKeys: payload.selectedRowKeys,
    },
  };
};

export const clearData = () => ({
  type: JUMP_PURCHASE_REQUISITION,
});
