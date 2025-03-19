import React, { useState, useRef, useEffect } from 'react';
import './ModelSelector.css';

const ModelSelector = ({ selectedModel, onSelectModel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Available AI models
  const models = [
    { id: 'claude-3.7', name: 'Claude 3.7', color: '#9c9cff', isPro: true },
    { id: 'gpt-4.5', name: 'GPT 4.5', color: '#4caf50', isPro: true },
    { id: 'gemini-2.0', name: 'Gemini 2.0', color: '#ffab40', isPro: false },
    { id: 'qwen-2.5', name: 'Qwen 2.5', color: '#9c27b0', isPro: true }
  ];
  
  const currentModel = models.find(model => model.id === selectedModel) || models[0];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="model-selector" ref={dropdownRef}>
      <button 
        className="selected-model"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span 
          className="model-dot" 
          style={{ backgroundColor: currentModel.color }}
        ></span>
        <span className="model-name">{currentModel.name}</span>
      </button>
      
      {isOpen && (
        <div className="model-dropdown">
          {models.map(model => (
            <div 
              key={model.id}
              className={`model-option ${model.id === selectedModel ? 'active' : ''}`}
              onClick={() => {
                onSelectModel(model.id);
                setIsOpen(false);
              }}
            >
              <span 
                className="model-dot" 
                style={{ backgroundColor: model.color }}
              ></span>
              <span className="model-name">{model.name}</span>
              {model.isPro && <span className="pro-badge">PRO</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector; 