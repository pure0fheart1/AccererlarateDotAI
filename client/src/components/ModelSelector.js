import React, { useState } from 'react';
import './ModelSelector.css';

const ModelSelector = ({ selectedModel, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const models = [
    { id: 'claude-3.7', name: 'Claude 3.7', color: '#9c9cff', isPro: true },
    { id: 'gpt-4.5', name: 'GPT 4.5', color: '#4caf50', isPro: true },
    { id: 'gemini-2.0', name: 'Gemini 2.0', color: '#ffab40', isPro: false },
    { id: 'qwen-2.5', name: 'Qwen 2.5', color: '#9c27b0', isPro: true }
  ];
  
  const currentModel = models.find(m => m.id === selectedModel) || models[0];
  
  return (
    <div className="model-selector">
      <button 
        className="selected-model"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span 
          className="model-indicator" 
          style={{ backgroundColor: currentModel.color }}
        />
        {currentModel.name}
      </button>
      
      {isOpen && (
        <div className="model-dropdown">
          {models.map(model => (
            <div 
              key={model.id}
              className={`model-option ${model.id === selectedModel ? 'active' : ''}`}
              onClick={() => {
                onModelChange(model.id);
                setIsOpen(false);
              }}
            >
              <span 
                className="model-indicator" 
                style={{ backgroundColor: model.color }}
              />
              {model.name}
              {model.isPro && <span className="pro-badge">PRO</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector; 