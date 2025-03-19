import React, { useRef, useEffect } from 'react';
import './MessageList.css';

const MessageList = ({ messages }) => {
  const endOfMessagesRef = useRef(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="empty-chat">
        <div className="empty-chat-icon">◇</div>
        <h2>What can I help with?</h2>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
        >
          {!message.isUser && (
            <div className="message-model-badge">
              <span 
                className="model-indicator" 
                style={{ backgroundColor: message.modelColor }} 
              />
              {message.model}
            </div>
          )}
          <div className="message-content">{message.content}</div>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList; 