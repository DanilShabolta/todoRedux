import React, { useState, useEffect } from "react";
import TaskForm from "./ui/TaskForm";
import TaskList from "./TaskList";
import "../style.css";
import {
  getTasksFromLocalStorage,
  saveTaskToLocalStorage,
} from "./utils/TaskStorage";
import Info from "./ui/Info";
import Edit from "./ui/Edit";
import ShareMenu from "./ui/ShareMenu";
import ConfirmDelete from "./ui/ConfirmDelete";
import { useSelector, useDispatch } from "react-redux";
import {
  addTodo,
  removeTodo,
  setDraggedTaskIndex,
  clearDraggedTaskIndex,
} from "./redux/todoSlice";
//import { setDraggedTaskIndex, clearDraggedTaskIndex } from "./redux/dragSlice";

const TaskManager = () => {
  const draggedTaskIndex = useSelector((state) => state.drag.draggedTaskIndex);
  const [showNoTasksMessage, setShowNoTasksMessage] = useState(true);
  const [isInfoVisible, setInfoVisible] = useState(false);
  const [isEditVisible, setEditVisible] = useState(false);
  const [isShareMenuVisible, setShareMenuVisible] = useState(false);
  const [isConfirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.todos);

  useEffect(() => {
    checkTasks();
  }, []);

  const checkTasks = () => {
    const storedTasks = getTasksFromLocalStorage();
    setShowNoTasksMessage(storedTasks.length === 0);
  };

  const addTask = (newTask) => {
    dispatch(addTodo(newTask));
  };

  const removeTask = (task) => {
    dispatch(removeTodo(task.id));
    console.log("Задача удалена:", task.id);
    setConfirmDeleteVisible(false);
  };

  // const handleDragStart = (index) => {
  //   setDraggedTaskIndex(index);
  // };

  // const handleDragOver = (index) => {
  //   if (draggedTaskIndex === null || draggedTaskIndex === index) return;

  //   const updatedTasks = [...tasks];
  //   const draggedTask = updatedTasks[draggedTaskIndex];
  //   updatedTasks.splice(draggedTaskIndex, 1);
  //   updatedTasks.splice(index, 0, draggedTask);

  //   //setTasks(updatedTasks);
  //   setDraggedTaskIndex(index);
  //   saveTaskToLocalStorage(updatedTasks);
  // };

  // const handleDragEnd = () => {
  //   setDraggedTaskIndex(null);
  // };

  const handleDragStart = (index) => {
    dispatch(setDraggedTaskIndex(index)); // Установите индекс перетаскиваемой задачи
  };

  const handleDragOver = (index) => {
    if (draggedTaskIndex === null || draggedTaskIndex === index) return;

    const updatedTasks = [...tasks];
    const draggedTask = updatedTasks[draggedTaskIndex];
    updatedTasks.splice(draggedTaskIndex, 1);
    updatedTasks.splice(index, 0, draggedTask);

    // Обновите состояние задач в Redux
    // dispatch(setTodos(updatedTasks)); // Если у вас есть действие для установки задач
    // Или просто обновите локальное состояние, если это необходимо
  };

  const handleDragEnd = () => {
    dispatch(clearDraggedTaskIndex()); // Очистите индекс после завершения перетаскивания
  };

  const closeModal = () => {
    setShareMenuVisible(false);
    setEditVisible(false);
    setInfoVisible(false);
    setSelectedTask(null);
    setConfirmDeleteVisible(false);
  };

  const openInfo = (task) => {
    setSelectedTask(task);
    setInfoVisible(true);
  };

  const openEdit = (task) => {
    dispatch(Edit(task));
    setSelectedTask(task);
    setEditVisible(true);
  };

  const openShareMenu = (task) => {
    setSelectedTask(task);
    setShareMenuVisible(true);
  };

  const openConfirm = (task, event) => {
    setSelectedTask(task);
    setConfirmDeleteVisible(true);
  };

  const saveEditTask = ({ title, text }) => {
    if (selectedTask) {
      const updatedTasks = tasks.map((task) =>
        task === selectedTask ? { ...task, title, text } : task
      );
      setTasks(updatedTasks);
      saveTaskToLocalStorage(updatedTasks);
      setSelectedTask(null);
    }
  };

  return (
    <div id="app">
      <TaskForm addTask={addTask} />
      {showNoTasksMessage && <div id="no-tasks-message">No tasks</div>}
      <TaskList
        tasks={tasks}
        removeTask={removeTask}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDragEnd={handleDragEnd}
        openInfo={openInfo}
        openEdit={openEdit}
        openShareMenu={openShareMenu}
        openConfirm={openConfirm}
      />

      {selectedTask &&
        ((isInfoVisible && (
          <Info
            taskTitle={selectedTask.title}
            taskText={selectedTask.text}
            onClose={closeModal}
          />
        )) ||
          (isEditVisible && (
            <Edit
              taskTitle={selectedTask.title}
              taskText={selectedTask.text}
              onClose={closeModal}
              saveEditTask={saveEditTask}
            />
          )) ||
          (isShareMenuVisible && <ShareMenu onClose={closeModal} />) ||
          (isConfirmDeleteVisible && (
            <ConfirmDelete
              onClose={closeModal}
              removeTask={() => removeTask(selectedTask)}
            />
          )))}
    </div>
  );
};

export default TaskManager;
