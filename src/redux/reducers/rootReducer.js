import { combineReducers } from "redux";

import modalReducer from "./modalReducer";
import warehouseReducer from "./warehouseReducer";

const rootReducer = combineReducers({
  modal: modalReducer,
  warehouse: warehouseReducer,
});

export default rootReducer;
