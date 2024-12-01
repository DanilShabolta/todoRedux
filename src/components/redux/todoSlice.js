import { createSlice } from "@reduxjs/toolkit";
import {
  getTasksFromLocalStorage,
  saveTaskToLocalStorage,
} from "../utils/TaskStorage";

const todoSlice = createSlice({
  name: "todos",
  initialState: getTasksFromLocalStorage(),
  reducers: {
    addTodo: (state, { payload }) => {
      const newTask = {
        ...payload,
        id: new Date().getTime(),
        index: state.length,
        title: payload.title,
        text: payload.text,
      };
      state.push(newTask);
      saveTaskToLocalStorage(state);
    },
    removeTodo: (state, { payload }) => {
      state = state.filter((todo) => todo.id !== payload);
      saveTaskToLocalStorage(state);
      return state;
    },
    Edit: (state, action) => {
      const index = state.findIndex((task) => task.id === action.payload.id);
    },
    setTodos: (state, action) => {
      return action.payload;
    },
    setDraggedTaskIndex: (state, action) => {
      state.draggedTaskIndex = action.payload;
    },
    clearDraggedTaskIndex: (state) => {
      state.draggedTaskIndex = null;
    },
  },
});

export const {
  addTodo,
  removeTodo,
  setTodos,
  setDraggedTaskIndex,
  clearDraggedTaskIndex,
} = todoSlice.actions;
export default todoSlice.reducer;
