import FileUploader from '../common/FileUploader';
import FilePreview from '../common/FilePreview';
import { v4 as uuidv4 } from 'uuid';

const [attachments, setAttachments] = useState([]);
const [showFileUploader, setShowFileUploader] = useState(false);

const sendMessage = async (messageText) => {
  if ((!messageText.trim() && attachments.length === 0) || isSending) return;
  
  try {
    setIsSending(true);
    
    const messageId = uuidv4();
    const newMessage = {
      id: messageId,
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
      attachments: attachments
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    await DatabaseService.addChatMessage(currentUser.uid, conversationId, newMessage);
    
    setMessageInput('');
    setAttachments([]);
    setShowFileUploader(false);
    
    if (!disableAiResponse) {
      await generateAiResponse(messageText, attachments);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    setError('Failed to send message. Please try again.');
  } finally {
    setIsSending(false);
  }
};

const toggleFileUploader = () => {
  setShowFileUploader(prev => !prev);
};

const MessageInput = ({ onSendMessage, isSending }) => {
  return (
    <div className="message-input-container">
      <div className="message-actions">
        <button 
          className="attachment-button" 
          onClick={toggleFileUploader}
          title="Attach files"
        >
          <span className="attachment-icon">📎</span>
        </button>
      </div>
      
      {showFileUploader && (
        <FileUploader 
          entityType="chats"
          entityId={conversationId}
          onUploadComplete={(fileData) => {
            setAttachments(prev => [...prev, fileData]);
          }}
        />
      )}
      
      {attachments.length > 0 && (
        <FilePreview 
          files={attachments}
          entityType="chats"
          entityId={conversationId}
          onDelete={(fileData) => {
            setAttachments(prev => prev.filter(f => f.path !== fileData.path));
          }}
        />
      )}
      
      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
          disabled={isSending}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={(!messageInput.trim() && attachments.length === 0) || isSending}
        >
          <span className="send-icon">➤</span>
        </button>
      </form>
    </div>
  );
}; 