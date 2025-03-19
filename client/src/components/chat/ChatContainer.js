import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DatabaseService from '../../services/DatabaseService';
import AIService from '../../services/AIService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ModelSelector from './ModelSelector';
import './ChatContainer.css';

// Mock AI service
const mockAiResponse = (message, model) => {
  const responses = {
    'claude-3.7': `Claude 3.7: I've analyzed your request: "${message}". Here's my thoughtful response...`,
    'gpt-4.5': `GPT 4.5: Based on your input: "${message}", I'd like to offer the following insights...`,
    'gemini-2.0': `Gemini 2.0: Thanks for your message: "${message}". Here's what I think...`,
    'qwen-2.5': `Qwen 2.5: I've processed your query: "${message}" and would respond as follows...`
  };
  
  return new Promise((resolve) => {
    // Add artificial delay to simulate network request
    setTimeout(() => {
      resolve(responses[model] || `Response from ${model}: ${message}`);
    }, 1000);
  });
};

// Model colors mapping
const modelColors = {
  'claude-3.7': '#9c9cff',
  'gpt-4.5': '#4caf50',
  'gemini-2.0': '#ffab40',
  'qwen-2.5': '#9c27b0'
};

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('claude-3.7');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const { currentUser } = useAuth();
  
  // Fetch chat history from Firebase
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!currentUser) return;
      
      try {
        setLoadingMessages(true);
        const fetchedMessages = await DatabaseService.getChatMessages(currentUser.uid);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        setLoadingMessages(false);
      }
    };
    
    fetchChatHistory();
  }, [currentUser]);
  
  const handleSendMessage = async (content) => {
    if (!currentUser) return;
    
    // Add user message to chat
    const userMessage = {
      content,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Save user message to Firebase
      await DatabaseService.addChatMessage(currentUser.uid, userMessage);
      
      // Get AI response
      const aiResponse = await AIService.sendMessage(content, selectedModel);
      
      // Add AI message to chat
      const aiMessage = {
        content: aiResponse.content,
        isUser: false,
        model: selectedModel,
        modelColor: aiResponse.modelColor,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI message to Firebase
      await DatabaseService.addChatMessage(currentUser.uid, aiMessage);
    } catch (error) {
      console.error('Error in chat exchange:', error);
      
      // Add error message
      const errorMessage = {
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        isUser: false,
        model: selectedModel,
        modelColor: 'red',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {loadingMessages ? (
          <div className="loading-messages">Loading conversation history...</div>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>
      
      <div className="chat-input-area">
        <div className="chat-controls">
          <ModelSelector 
            selectedModel={selectedModel} 
            onSelectModel={setSelectedModel} 
          />
          
          {isLoading && (
            <div className="typing-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}
        </div>
        
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={isLoading || loadingMessages} 
        />
      </div>
    </div>
  );
};

export default ChatContainer; 