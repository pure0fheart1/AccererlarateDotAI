import React, { useState } from 'react';
import './TaskCreator.css';

const TaskCreator = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    // Create new task object
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate || null
    };
    
    // Pass to parent
    onAddTask(newTask);
    
    // Reset form
    setTitle('');
    setDueDate('');
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <button 
        className="add-task-button" 
        onClick={() => setShowForm(true)}
      >
        <span className="plus-icon">+</span>
        <span>Add New Task</span>
      </button>
    );
  }

  return (
    <div className="task-creator">
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="task-input"
          autoFocus
        />
        
        <div className="task-form-row">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="date-input"
          />
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={!title.trim()}
            >
              Add Task
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskCreator; 