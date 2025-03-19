import React, { useState } from 'react';
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';
import ModelSelector from './ModelSelector';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('claude-3.7');
  
  // Logic for handling messages
  // ...

  return (
    <div className="chat-interface">
      <MessageList messages={messages} />
      <div className="chat-controls">
        <ModelSelector 
          selectedModel={selectedModel} 
          onModelChange={setSelectedModel} 
        />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatInterface; 