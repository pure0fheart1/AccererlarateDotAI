import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { id: 'notes', icon: '✏️', path: '/notes' },
    { id: 'ideas', icon: '💡', path: '/ideas' },
    { id: 'tasks', icon: '✓', path: '/tasks' },
    { id: 'settings', icon: '⚙️', path: '/settings' }
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <img src="/logo.svg" alt="AImpact Logo" />
      </div>
      
      <nav className="nav-links">
        {navItems.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="user-profile">
        <button className="profile-button">
          <img src="/default-avatar.svg" alt="User profile" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 