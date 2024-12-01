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
    editTask: (state, action) => {
      const index = state.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
        saveTaskToLocalStorage(state);
      }
    },
    setTodos: (state, action) => {
      return action.payload;
    },
    moveTask: (state, { payload }) => {
      const { fromIndex, toIndex } = payload;
      const [movedTask] = state.splice(fromIndex, 1);
      state.splice(toIndex, 0, movedTask);
      saveTaskToLocalStorage(state);
    },
  },
});

export const { addTodo, removeTodo, setTodos, moveTask, editTask } =
  todoSlice.actions;
export default todoSlice.reducer;
