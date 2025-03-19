import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { useSubscription } from '../../contexts/SubscriptionContext';

const Sidebar = () => {
  const location = useLocation();
  const { isPro } = useSubscription();
  
  const navItems = [
    { id: 'chat', icon: '◇', label: 'Chat', path: '/' },
    { id: 'notes', icon: '•', label: 'Notes', path: '/notes' },
    { id: 'tasks', icon: '○', label: 'Tasks', path: '/tasks' },
    { id: 'ideas', icon: '△', label: 'Ideas', path: '/ideas' }
  ];
  
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link to="/" className="logo-link">
          <span className="logo-icon">◇</span>
        </Link>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map(item => (
            <li key={item.id} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                title={item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="screen-reader-only">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button className="profile-button">
          <span className="profile-icon">●</span>
        </button>
      </div>
      
      {isPro() && (
        <>
          <hr className="sidebar-divider" />
          <h3 className="sidebar-section-title">Pro Features</h3>
          <NavItem to="/analytics" icon="📊" label="Analytics" />
          <NavItem to="/templates" icon="📋" label="Templates" />
        </>
      )}
    </aside>
  );
};

export default Sidebar; 