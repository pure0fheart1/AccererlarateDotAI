import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import { useSubscription } from '../../contexts/SubscriptionContext';
import './Header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();
  
  // Get user's first name or email
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const { isPro } = useSubscription();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-title">
        <h1>Productive AI Hub</h1>
      </div>
      
      <div className="header-actions">
        {!isPro() && (
          <Link to="/pricing" className="upgrade-button">
            <span className="upgrade-icon">⭐</span>
            <span className="upgrade-text">UPGRADE TO PRO</span>
          </Link>
        )}
        
        <ThemeToggle />
        
        <button className="action-button refresh-button">
          <span className="action-icon">↻</span>
        </button>
        
        <div className="user-menu-container" ref={menuRef}>
          <button 
            className="action-button menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="user-initial">{displayName.charAt(0).toUpperCase()}</span>
          </button>
          
          {isMenuOpen && (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-name">{displayName}</span>
                <span className="user-email">{currentUser?.email}</span>
              </div>
              
              <div className="menu-divider"></div>
              
              <Link to="/profile" className="menu-item">
                <span className="menu-icon">👤</span>
                <span>Profile</span>
              </Link>
              
              <div className="menu-divider"></div>
              
              <button className="menu-item" onClick={handleLogout}>
                <span className="menu-icon">⇥</span>
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 