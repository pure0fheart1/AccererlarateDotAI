// This is a mock service for now - will be replaced with real API calls later

class AIService {
  constructor() {
    this.models = {
      'claude-3.7': {
        name: 'Claude 3.7',
        color: '#9c9cff',
        isPro: true
      },
      'gpt-4.5': {
        name: 'GPT 4.5', 
        color: '#4caf50',
        isPro: true
      },
      'gemini-2.0': {
        name: 'Gemini 2.0',
        color: '#ffab40',
        isPro: false
      },
      'qwen-2.5': {
        name: 'Qwen 2.5',
        color: '#9c27b0',
        isPro: true
      }
    };
  }

  async sendMessage(message, modelId) {
    // Mock response generation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          content: this.generateResponse(message, modelId),
          model: modelId,
          modelColor: this.models[modelId].color,
          timestamp: new Date().toISOString()
        });
      }, 1000); // Simulate network delay
    });
  }

  generateResponse(message, modelId) {
    const lowercaseMessage = message.toLowerCase();
    
    // Basic response patterns based on model
    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
      return `${this.models[modelId].name}: Hello! How can I assist you today?`;
    }
    
    if (lowercaseMessage.includes('help')) {
      return `${this.models[modelId].name}: I'm here to help! You can ask me questions, request information, or ask for assistance with various tasks.`;
    }

    if (lowercaseMessage.includes('thank')) {
      return `${this.models[modelId].name}: You're welcome! Feel free to ask if you need anything else.`;
    }

    // Default responses by model type
    switch (modelId) {
      case 'claude-3.7':
        return `Claude 3.7: I've analyzed your request: "${message}". Here's my thoughtful response based on my understanding of your query...`;
      
      case 'gpt-4.5':
        return `GPT 4.5: Based on your input: "${message}", I'd like to offer the following insights and information that might be helpful...`;
      
      case 'gemini-2.0':
        return `Gemini 2.0: Thanks for your message: "${message}". I've processed this and would like to share some thoughts on the matter...`;
      
      case 'qwen-2.5':
        return `Qwen 2.5: I've processed your query: "${message}" and have prepared a comprehensive response based on my analysis...`;
      
      default:
        return `AI response to: "${message}"`;
    }
  }

  getAvailableModels(userIsPro = false) {
    // Filter models based on user's subscription status
    return Object.entries(this.models)
      .filter(([, model]) => !model.isPro || userIsPro)
      .map(([id, model]) => ({
        id,
        name: model.name,
        color: model.color,
        isPro: model.isPro
      }));
  }
}

export default new AIService(); 