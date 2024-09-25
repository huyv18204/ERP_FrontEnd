import { combineReducers } from "redux";

import modalReducer from "./modalReducer";
import warehouseReducer from "./warehouseReducer";
import saleOrderReducer from "./saleOrderReducer";
const rootReducer = combineReducers({
  modal: modalReducer,
  warehouse: warehouseReducer,
  saleOrder: saleOrderReducer,
});

export default rootReducer;
