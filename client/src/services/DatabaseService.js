import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { FileStorageService } from './FileStorageService';

class DatabaseService {
  // Tasks
  async getTasks(userId) {
    try {
      const q = query(
        collection(db, 'tasks'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  }

  async addTask(userId, taskData) {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        userId,
        createdAt: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        ...taskData
      };
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }

  async updateTask(taskId, data) {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      return { id: taskId, ...data };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(taskId) {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      return taskId;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // Notes
  async getNotes(userId) {
    try {
      const q = query(
        collection(db, 'notes'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting notes:', error);
      throw error;
    }
  }

  async addNote(userId, noteData) {
    try {
      const docRef = await addDoc(collection(db, 'notes'), {
        ...noteData,
        userId,
        createdAt: serverTimestamp()
      });
      
      // If there are attachments with a temp entityId, update them
      if (noteData.attachments && noteData.attachments.length > 0) {
        await Promise.all(noteData.attachments.map(attachment => {
          if (attachment.entityId === 'temp') {
            return FileStorageService.updateFileEntity(
              userId,
              'notes',
              'temp',
              docRef.id,
              attachment
            );
          }
          return Promise.resolve();
        }));
      }
      
      return {
        id: docRef.id,
        ...noteData
      };
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  }

  async updateNote(noteId, data) {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      return { id: noteId, ...data };
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  async deleteNote(noteId) {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      return noteId;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  // Chat messages
  async getChatMessages(userId) {
    try {
      const q = query(
        collection(db, 'chat_messages'), 
        where('userId', '==', userId),
        orderBy('timestamp', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting chat messages:', error);
      throw error;
    }
  }

  async addChatMessage(userId, message) {
    try {
      const docRef = await addDoc(collection(db, 'chat_messages'), {
        ...message,
        userId,
        timestamp: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        ...message
      };
    } catch (error) {
      console.error('Error adding chat message:', error);
      throw error;
    }
  }

  // User Profile
  async getUserProfile(userId) {
    try {
      const docRef = doc(db, 'user_profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        // Create default profile if it doesn't exist
        const defaultProfile = {
          displayName: 'User',
          photoURL: null,
          isPro: false,
          createdAt: serverTimestamp()
        };
        
        await this.createUserProfile(userId, defaultProfile);
        return { id: userId, ...defaultProfile };
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async createUserProfile(userId, profileData) {
    try {
      await addDoc(collection(db, 'user_profiles'), {
        ...profileData,
        createdAt: serverTimestamp()
      });
      
      return { id: userId, ...profileData };
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(userId, data) {
    try {
      const userRef = doc(db, 'user_profiles', userId);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      return { id: userId, ...data };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Add a method to handle file attachments for existing entities
  async updateEntityAttachments(userId, entityType, entityId, attachments) {
    try {
      const docRef = doc(db, entityType, entityId);
      
      await updateDoc(docRef, {
        attachments: attachments,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error(`Error updating ${entityType} attachments:`, error);
      throw error;
    }
  }
}

export default new DatabaseService(); 