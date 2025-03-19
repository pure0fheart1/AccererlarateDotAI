import React from 'react';
import './Header.css';

const Header = ({ user, isPro = false }) => {
  return (
    <header className="app-header">
      <div className="site-info">
        <h1>vectal.ai</h1>
      </div>
      
      <div className="header-actions">
        {!isPro && (
          <button className="upgrade-button">
            <span>↑</span> UPGRADE TO PRO
          </button>
        )}
        
        <button className="refresh-button">
          <span>↻</span>
        </button>
        
        <button className="menu-button">
          <span>≡</span>
        </button>
      </div>
    </header>
  );
};

export default Header; 