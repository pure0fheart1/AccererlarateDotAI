import FilePreview from '../common/FilePreview';

const ChatMessage = ({ message, isLast }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'ai-message'} ${isLast ? 'last-message' : ''}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '🤖'}
      </div>
      
      <div className="message-content">
        <div className="message-text">
          {message.content}
        </div>
        
        {/* Render attachments if present */}
        {message.attachments && message.attachments.length > 0 && (
          <FilePreview 
            files={message.attachments}
            entityType="chats"
            entityId={message.id}
            onDelete={null} // No deletion from chat history
          />
        )}
        
        <div className="message-timestamp">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 