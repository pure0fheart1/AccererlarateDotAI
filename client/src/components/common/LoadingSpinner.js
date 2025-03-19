import React from 'react';
import '../../styles/loading.css';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <span className="loading-message">{message}</span>
    </div>
  );
};

export default LoadingSpinner; 