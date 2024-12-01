import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./todoSlice";

const store = configureStore({
  reducer: {
    todos: rootReducer,
  },
});

export default store;
