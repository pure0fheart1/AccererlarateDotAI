import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import FileStorageService from '../../services/FileStorageService';
import './FileUploader.css';

const FileUploader = ({ entityType, entityId, onUploadComplete, maxFiles = 5 }) => {
  const { currentUser } = useAuth();
  const { subscription } = useSubscription();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  
  // Calculate max file size from subscription
  const maxFileSizeMB = subscription?.limits?.max_file_size_mb || 5;
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  
  const handleDragLeave = () => {
    setDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };
  
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };
  
  const handleFiles = async (files) => {
    if (!currentUser) return;
    
    // Check if adding these files would exceed the max files limit
    if (uploadedFiles.length + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files at a time.`);
      return;
    }
    
    // Process each file
    for (const file of files) {
      try {
        setError(null);
        setUploading(true);
        
        // Check file size
        if (file.size > maxFileSizeMB * 1024 * 1024) {
          setError(`File ${file.name} exceeds the maximum file size of ${maxFileSizeMB}MB.`);
          continue;
        }
        
        // Check if within storage limits
        const withinLimits = await FileStorageService.isWithinStorageLimits(
          file.size, 
          currentUser.uid
        );
        
        if (!withinLimits) {
          setError('You have reached your storage limit. Upgrade to Pro for more storage.');
          continue;
        }
        
        // Upload the file
        const fileData = await FileStorageService.uploadFile(
          file,
          currentUser.uid,
          entityType,
          entityId,
          (progressValue) => setProgress(progressValue)
        );
        
        // Add to uploaded files list
        setUploadedFiles(prev => [...prev, fileData]);
        
        // Call the callback if provided
        if (onUploadComplete) {
          onUploadComplete(fileData);
        }
      } catch (err) {
        console.error('Error uploading file:', err);
        setError(`Failed to upload ${file.name}. Please try again.`);
      }
    }
    
    setUploading(false);
    setProgress(0);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className="file-uploader">
      {error && <div className="upload-error">{error}</div>}
      
      <div 
        className={`upload-area ${dragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          multiple
        />
        
        {uploading ? (
          <div className="upload-progress">
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            />
            <span className="progress-text">{Math.round(progress)}%</span>
          </div>
        ) : (
          <>
            <div className="upload-icon">📂</div>
            <p className="upload-text">
              Drop files here or click to browse
            </p>
            <p className="upload-limit">
              Max file size: {maxFileSizeMB}MB
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader; 