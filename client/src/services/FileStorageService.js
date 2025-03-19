import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject, 
  listAll 
} from 'firebase/storage';
import { storage, db } from '../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

class FileStorageService {
  /**
   * Upload a file to Firebase Storage
   * @param {File} file - The file to upload
   * @param {string} userId - The user's ID
   * @param {string} entityType - The type of entity (note, chat, etc.)
   * @param {string} entityId - The ID of the entity
   * @param {Function} progressCallback - Optional callback for upload progress
   * @returns {Promise<Object>} - The uploaded file metadata
   */
  uploadFile = async (file, userId, entityType, entityId, progressCallback = null) => {
    try {
      // Create a unique file path
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = `users/${userId}/${entityType}/${entityId}/${fileName}`;
      
      // Create a storage reference
      const storageRef = ref(storage, filePath);
      
      // Create file metadata
      const metadata = {
        contentType: file.type,
        customMetadata: {
          fileName: file.name,
          uploadedBy: userId,
          entityType,
          entityId,
          uploadTime: timestamp.toString()
        }
      };
      
      // Start the upload
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      
      // Return a promise that resolves when the upload is complete
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Calculate and report progress if callback is provided
            if (progressCallback) {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              progressCallback(progress);
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            console.error('Upload failed:', error);
            reject(error);
          },
          async () => {
            // Handle successful uploads
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Create file metadata object
            const fileData = {
              name: file.name,
              size: file.size,
              type: file.type,
              extension: fileExtension,
              path: filePath,
              url: downloadURL,
              uploadTime: timestamp,
              thumbnailUrl: this.getThumbnailUrl(file.type, downloadURL)
            };
            
            // Update the entity with the file reference
            await this.addFileReferenceToEntity(userId, entityType, entityId, fileData);
            
            resolve(fileData);
          }
        );
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };
  
  /**
   * Add a file reference to an entity (note, chat, etc.)
   * @param {string} userId - The user's ID
   * @param {string} entityType - The type of entity
   * @param {string} entityId - The ID of the entity
   * @param {Object} fileData - The file metadata
   * @returns {Promise<void>}
   */
  addFileReferenceToEntity = async (userId, entityType, entityId, fileData) => {
    try {
      // Get a document reference based on entity type
      let docRef;
      
      switch (entityType) {
        case 'notes':
          docRef = doc(db, 'notes', entityId);
          break;
        case 'chats':
          docRef = doc(db, 'chat_messages', entityId);
          break;
        case 'tasks':
          docRef = doc(db, 'tasks', entityId);
          break;
        case 'profile':
          docRef = doc(db, 'user_profiles', userId);
          break;
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
      
      // Update the document with the file reference
      await updateDoc(docRef, {
        attachments: arrayUnion(fileData),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding file reference:', error);
      throw error;
    }
  };
  
  /**
   * Delete a file from Firebase Storage
   * @param {string} userId - The user's ID
   * @param {string} entityType - The type of entity
   * @param {string} entityId - The ID of the entity
   * @param {Object} fileData - The file metadata
   * @returns {Promise<void>}
   */
  deleteFile = async (userId, entityType, entityId, fileData) => {
    try {
      // Create a reference to the file
      const fileRef = ref(storage, fileData.path);
      
      // Delete the file
      await deleteObject(fileRef);
      
      // Remove the file reference from the entity
      await this.removeFileReferenceFromEntity(userId, entityType, entityId, fileData);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };
  
  /**
   * Remove a file reference from an entity
   * @param {string} userId - The user's ID
   * @param {string} entityType - The type of entity
   * @param {string} entityId - The ID of the entity
   * @param {Object} fileData - The file metadata
   * @returns {Promise<void>}
   */
  removeFileReferenceFromEntity = async (userId, entityType, entityId, fileData) => {
    try {
      // Get a document reference based on entity type
      let docRef;
      
      switch (entityType) {
        case 'notes':
          docRef = doc(db, 'notes', entityId);
          break;
        case 'chats':
          docRef = doc(db, 'chat_messages', entityId);
          break;
        case 'tasks':
          docRef = doc(db, 'tasks', entityId);
          break;
        case 'profile':
          docRef = doc(db, 'user_profiles', userId);
          break;
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
      
      // Update the document by removing the file reference
      await updateDoc(docRef, {
        attachments: arrayRemove(fileData),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error removing file reference:', error);
      throw error;
    }
  };
  
  /**
   * Get all files for a specific entity
   * @param {string} userId - The user's ID
   * @param {string} entityType - The type of entity
   * @param {string} entityId - The ID of the entity
   * @returns {Promise<Array>} - Array of file metadata
   */
  getEntityFiles = async (userId, entityType, entityId) => {
    try {
      const folderPath = `users/${userId}/${entityType}/${entityId}`;
      const folderRef = ref(storage, folderPath);
      
      // List all items in the folder
      const result = await listAll(folderRef);
      
      // Get download URLs and metadata for each item
      const filesPromises = result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        
        return {
          name: metadata.customMetadata?.fileName || itemRef.name,
          path: itemRef.fullPath,
          url,
          size: metadata.size,
          type: metadata.contentType,
          uploadTime: metadata.customMetadata?.uploadTime 
            ? parseInt(metadata.customMetadata.uploadTime) 
            : metadata.timeCreated,
          thumbnailUrl: this.getThumbnailUrl(metadata.contentType, url)
        };
      });
      
      return Promise.all(filesPromises);
    } catch (error) {
      console.error('Error getting entity files:', error);
      // Return empty array if folder doesn't exist yet
      if (error.code === 'storage/object-not-found') {
        return [];
      }
      throw error;
    }
  };
  
  /**
   * Generate a thumbnail URL based on file type
   * @param {string} fileType - The MIME type of the file
   * @param {string} url - The download URL of the file
   * @returns {string} - The thumbnail URL
   */
  getThumbnailUrl = (fileType, url) => {
    // For images, we can use the image itself as thumbnail
    if (fileType.startsWith('image/')) {
      return url;
    }
    
    // For other file types, return an icon based on the type
    if (fileType.includes('pdf')) {
      return '/icons/pdf.svg';
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return '/icons/doc.svg';
    } else if (fileType.includes('sheet') || fileType.includes('excel')) {
      return '/icons/sheet.svg';
    } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
      return '/icons/presentation.svg';
    } else if (fileType.includes('audio')) {
      return '/icons/audio.svg';
    } else if (fileType.includes('video')) {
      return '/icons/video.svg';
    } else if (fileType.includes('zip') || fileType.includes('archive')) {
      return '/icons/archive.svg';
    } else {
      return '/icons/file.svg';
    }
  };
  
  /**
   * Check if a file is within the user's storage limits
   * @param {number} newFileSize - The size of the new file in bytes
   * @param {string} userId - The user's ID
   * @returns {Promise<boolean>} - Whether the file is within limits
   */
  isWithinStorageLimits = async (newFileSize, userId) => {
    try {
      // Get the user's subscription plan
      const userSubscription = await SubscriptionService.getSubscription(userId);
      
      // Check if new file would exceed max file size limit
      const maxFileSizeMB = userSubscription.limits.max_file_size_mb || 5;
      if (newFileSize > maxFileSizeMB * 1024 * 1024) {
        return false;
      }
      
      // Check if new file would exceed total storage limit
      const maxStorageMB = userSubscription.limits.storage_mb || 100;
      const currentUsageMB = await this.calculateUserStorageUsage(userId) / (1024 * 1024);
      const newFileSizeMB = newFileSize / (1024 * 1024);
      
      return (currentUsageMB + newFileSizeMB) <= maxStorageMB;
    } catch (error) {
      console.error('Error checking storage limits:', error);
      return false;
    }
  };
  
  /**
   * Calculate a user's total storage usage
   * @param {string} userId - The user's ID
   * @returns {Promise<number>} - The total storage usage in bytes
   */
  calculateUserStorageUsage = async (userId) => {
    try {
      const userFolderPath = `users/${userId}`;
      const userFolderRef = ref(storage, userFolderPath);
      
      // This is a simplified approach - for a real app, you'd likely
      // store and update the total usage in the user profile
      let totalSize = 0;
      
      // Recursively list all files in the user's folder
      const listFolderContents = async (folderRef) => {
        const result = await listAll(folderRef);
        
        // Process files
        for (const itemRef of result.items) {
          const metadata = await getMetadata(itemRef);
          totalSize += metadata.size;
        }
        
        // Process subfolders
        for (const subFolderRef of result.prefixes) {
          await listFolderContents(subFolderRef);
        }
      };
      
      await listFolderContents(userFolderRef);
      
      return totalSize;
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      // If folder doesn't exist, usage is 0
      if (error.code === 'storage/object-not-found') {
        return 0;
      }
      throw error;
    }
  };
}

export default new FileStorageService(); 