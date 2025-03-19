import React, { useState } from 'react';
import './Tasks.css';

const Tasks = ({ initialTasks = [] }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    
    setTasks([
      ...tasks,
      { 
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        date: new Date().toISOString()
      }
    ]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="tasks-container">
      <h2>Tasks</h2>
      
      <div className="add-task">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask}>+</button>
      </div>
      
      {tasks.length === 0 ? (
        <div className="empty-tasks">
          <p>No tasks yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`task-item ${task.completed ? 'completed' : ''}`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span className="task-title">{task.title}</span>
              <span className="task-dot"></span>
            </div>
          ))}
        </div>
      )}
      
      {tasks.length > 0 && (
        <div className="tasks-divider">
          <span>future</span>
        </div>
      )}
    </div>
  );
};

export default Tasks; 