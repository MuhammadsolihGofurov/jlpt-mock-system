import { configureStore } from "@reduxjs/toolkit";
import paginationReducer from "../slice/pagination";
import authReducer from "../slice/auth";
import uiReducer from "../slice/ui";

const store = configureStore({
  reducer: {
    pagination: paginationReducer,
    auth: authReducer,
    ui: uiReducer,
  },
});

export default store;
