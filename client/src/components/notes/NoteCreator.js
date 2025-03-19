import React, { useState } from 'react';
import './NoteCreator.css';
import FileUploader from '../common/FileUploader';
import FilePreview from '../common/FilePreview';
import { v4 as uuidv4 } from 'uuid';

const NoteCreator = ({ onCreateNote }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [importance, setImportance] = useState('normal');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [source, setSource] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) return;
    
    const newNote = {
      id: uuidv4(),
      title,
      content,
      importance,
      tags: tags.filter(tag => tag.trim() !== ''),
      date: new Date().toISOString(),
      source: source || 'Manual Entry',
      attachments: attachments
    };
    
    onCreateNote(newNote);
    
    // Reset form
    setTitle('');
    setContent('');
    setImportance('normal');
    setTags([]);
    setSource('');
    setAttachments([]);
    setIsOpen(false);
  };
  
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const resetForm = () => {
    setTitle('');
    setContent('');
    setImportance('normal');
    setTags([]);
    setTagInput('');
    setIsOpen(false);
  };
  
  return (
    <div className="note-creator">
      {!isOpen ? (
        <button 
          className="create-note-button" 
          onClick={() => setIsOpen(true)}
        >
          + Create Note
        </button>
      ) : (
        <form className="note-form" onSubmit={handleSubmit}>
          <input
            className="note-title-input"
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          
          <textarea
            className="note-content-input"
            placeholder="Note content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
          
          <div className="note-form-options">
            <div className="importance-selector">
              <label>Importance:</label>
              <select 
                value={importance}
                onChange={(e) => setImportance(e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="tags-input-container">
              <label>Tags:</label>
              <div className="tags-input-wrapper">
                {tags.map(tag => (
                  <span key={tag} className="tag-pill">
                    #{tag}
                    <button 
                      type="button" 
                      className="remove-tag" 
                      onClick={() => removeTag(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  className="tag-input"
                  placeholder={tags.length ? "" : "Add tags..."}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              </div>
            </div>
          </div>
          
          <div className="note-form-expanded">
            <FileUploader 
              entityType="notes"
              entityId={uuidv4()}
              onUploadComplete={(fileData) => {
                setAttachments(prev => [...prev, fileData]);
              }}
            />
            
            {attachments.length > 0 && (
              <FilePreview 
                files={attachments}
                entityType="notes"
                entityId="temp"
                onDelete={(fileData) => {
                  setAttachments(prev => prev.filter(f => f.path !== fileData.path));
                }}
              />
            )}
          </div>
          
          <div className="note-form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={resetForm}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={!title.trim() || !content.trim()}
            >
              Save Note
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NoteCreator; 