import React, { useState } from 'react';
import './MessageInput.css';

const MessageInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          className="message-input"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!message.trim() || disabled}
        >
          <span className="send-icon">↑</span>
        </button>
      </form>
    </div>
  );
};

export default MessageInput; 