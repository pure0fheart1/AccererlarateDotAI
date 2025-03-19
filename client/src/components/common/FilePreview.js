import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import FileStorageService from '../../services/FileStorageService';
import './FilePreview.css';

const FilePreview = ({ files, entityType, entityId, onDelete }) => {
  const { currentUser } = useAuth();
  
  if (!files || files.length === 0) {
    return null;
  }
  
  const handleFileDelete = async (file) => {
    if (!currentUser) return;
    
    try {
      await FileStorageService.deleteFile(
        currentUser.uid,
        entityType,
        entityId,
        file
      );
      
      // Call the callback if provided
      if (onDelete) {
        onDelete(file);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };
  
  const getFileIcon = (file) => {
    // If a thumbnail URL exists, use it
    if (file.thumbnailUrl) {
      return file.thumbnailUrl;
    }
    
    // Otherwise, determine icon based on file type
    if (file.type.startsWith('image/')) {
      return file.url;
    } else if (file.type.includes('pdf')) {
      return '/icons/pdf.svg';
    } else if (file.type.includes('word') || file.type.includes('document')) {
      return '/icons/doc.svg';
    } else if (file.type.includes('sheet') || file.type.includes('excel')) {
      return '/icons/sheet.svg';
    } else if (file.type.includes('presentation') || file.type.includes('powerpoint')) {
      return '/icons/presentation.svg';
    } else if (file.type.includes('audio')) {
      return '/icons/audio.svg';
    } else if (file.type.includes('video')) {
      return '/icons/video.svg';
    } else if (file.type.includes('zip') || file.type.includes('archive')) {
      return '/icons/archive.svg';
    } else {
      return '/icons/file.svg';
    }
  };
  
  return (
    <div className="file-preview">
      <h3 className="preview-title">Attachments</h3>
      
      <div className="files-list">
        {files.map((file, index) => (
          <div className="file-item" key={index}>
            <div className="file-thumbnail">
              {file.type.startsWith('image/') ? (
                <img src={file.url} alt={file.name} className="thumbnail-image" />
              ) : (
                <div className="file-icon">
                  <img src={getFileIcon(file)} alt={file.type} />
                </div>
              )}
            </div>
            
            <div className="file-info">
              <a 
                href={file.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="file-name"
              >
                {file.name}
              </a>
              
              <span className="file-size">
                {formatFileSize(file.size)}
              </span>
            </div>
            
            <button 
              className="delete-file-button" 
              onClick={() => handleFileDelete(file)}
              aria-label="Delete file"
            >
              <span className="delete-icon">×</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilePreview; 