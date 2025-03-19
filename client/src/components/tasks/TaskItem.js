import React from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onToggleComplete, onDelete }) => {
  const handleCheckboxChange = () => {
    onToggleComplete(task.id);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-checkbox-container">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleCheckboxChange}
          id={`task-${task.id}`}
          className="task-checkbox"
        />
        <label htmlFor={`task-${task.id}`} className="task-checkbox-label">
          <span className="checkmark"></span>
        </label>
      </div>
      
      <div className="task-content">
        <div className="task-title">{task.title}</div>
        {task.dueDate && (
          <div className="task-due-date">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
      
      <button 
        className="task-delete-btn" 
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
      >
        ×
      </button>
    </div>
  );
};

export default TaskItem; 