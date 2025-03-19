import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DatabaseService from '../services/DatabaseService';
import TaskCreator from '../components/tasks/TaskCreator';
import TaskList from '../components/tasks/TaskList';

// Sample tasks data for development
const sampleTasks = [
  {
    id: '1',
    title: 'Complete project proposal',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString() // 2 days from now
  },
  {
    id: '2',
    title: 'Review pull requests',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 86400000).toISOString() // 1 day from now
  },
  {
    id: '3',
    title: 'Set up project repository',
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    dueDate: null
  }
];

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  
  // Fetch tasks from Firebase
  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const fetchedTasks = await DatabaseService.getTasks(currentUser.uid);
        setTasks(fetchedTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [currentUser]);
  
  const handleAddTask = async (newTask) => {
    try {
      // Optimistically update UI
      setTasks(prevTasks => [newTask, ...prevTasks]);
      
      // Add to database
      await DatabaseService.addTask(currentUser.uid, newTask);
    } catch (err) {
      console.error('Error adding task:', err);
      
      // Revert optimistic update
      setTasks(prevTasks => prevTasks.filter(task => task.id !== newTask.id));
      setError('Failed to add task. Please try again.');
    }
  };
  
  const handleToggleComplete = async (taskId) => {
    try {
      // Find task and toggle completed status
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;
      
      const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
      
      // Optimistically update UI
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      
      // Update in database
      await DatabaseService.updateTask(taskId, { completed: updatedTask.completed });
    } catch (err) {
      console.error('Error toggling task completion:', err);
      setError('Failed to update task. Please try again.');
      
      // Revert optimistic update
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ));
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    try {
      // Store task before deletion in case we need to revert
      const deletedTask = tasks.find(task => task.id === taskId);
      
      // Optimistically update UI
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      // Delete from database
      await DatabaseService.deleteTask(taskId);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
      
      // Revert optimistic update if we have the deleted task
      if (deletedTask) {
        setTasks(prevTasks => [...prevTasks, deletedTask]);
      }
    }
  };

  return (
    <div className="page-container">
      <h1>Tasks</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <TaskCreator onAddTask={handleAddTask} />
      
      {loading ? (
        <div className="loading-indicator">Loading tasks...</div>
      ) : (
        <TaskList 
          tasks={tasks} 
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default TasksPage; 