// App.js

import React, { useState } from 'react';
import Calendar from './components/Calendar';
import TodoForm from './components/TodoForm';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('day');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const addTask = (task) => {
    if (selectedTask) {
      // Edit existing task
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? task : t))
      );
    } else {
      // Add new task
      setTasks((prevTasks) => [...prevTasks, task]);
    }
    setShowForm(false);
    setSelectedTask(null);
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleSlotClick = (task) => {
    setSelectedTask(task || null);
    setShowForm(true);
  };

  const handleViewChange = (view) => {
    setView(view);
  };

  return (
    <div className="app">
      <Calendar tasks={tasks} view={view} viewChange={handleViewChange} onSlotClick={handleSlotClick} />
      {showForm && (
        <div className="form-modal">
          <TodoForm addTask={addTask} task={selectedTask} deleteTask={deleteTask} closeForm={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
};

export default App;

