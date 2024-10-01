import { combineReducers } from "redux";

import modalReducer from "./modalReducer";
import warehouseReducer from "./warehouseReducer";
import saleOrderReducer from "./saleOrderReducer";
import productionOrderReducer from "./productionOrderReducer";
import purchaseOrderReducer from "./purchaseOrderReducer";
const rootReducer = combineReducers({
  modal: modalReducer,
  warehouse: warehouseReducer,
  saleOrder: saleOrderReducer,
  productionOrder: productionOrderReducer,
  purchaseOrder: purchaseOrderReducer,
});

export default rootReducer;
