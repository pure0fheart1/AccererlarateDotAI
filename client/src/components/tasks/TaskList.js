import React, { useState } from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ initialTasks = [] }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');
  
  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now().toString(),
      content: newTask.trim(),
      completed: false,
      date: new Date().toISOString()
    };
    
    setTasks([task, ...tasks]);
    setNewTask('');
  };
  
  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  // Separate tasks into active and completed
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  if (tasks.length === 0) {
    return (
      <div className="empty-task-list">
        <div className="empty-icon">✓</div>
        <p>You don't have any tasks yet.</p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="add-task">
        <input
          type="text"
          className="task-input"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <button className="add-task-button" onClick={addTask}>
          +
        </button>
      </div>
      
      {activeTasks.length > 0 && (
        <div className="task-section">
          <h3 className="task-section-title">To Do</h3>
          <div className="task-list">
            {activeTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskCompletion}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </div>
      )}
      
      {completedTasks.length > 0 && (
        <div className="task-section">
          <h3 className="task-section-title">Completed</h3>
          <div className="task-list">
            {completedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskCompletion}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList; 