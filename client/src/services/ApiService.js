import firebase from '../firebase';

const db = firebase.firestore();

class ApiService {
  // Notes API
  async getNotes(userId) {
    try {
      const snapshot = await db.collection('notes')
        .where('userId', '==', userId)
        .orderBy('date', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  }
  
  async createNote(userId, note) {
    try {
      const noteRef = await db.collection('notes').add({
        ...note,
        userId,
        date: new Date().toISOString()
      });
      
      return {
        id: noteRef.id,
        ...note
      };
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }
  
  // Tasks API
  async getTasks(userId) {
    try {
      const snapshot = await db.collection('tasks')
        .where('userId', '==', userId)
        .orderBy('date', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }
  
  async createTask(userId, task) {
    try {
      const taskRef = await db.collection('tasks').add({
        ...task,
        userId,
        completed: false,
        date: new Date().toISOString()
      });
      
      return {
        id: taskRef.id,
        ...task
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }
  
  async updateTask(taskId, updates) {
    try {
      await db.collection('tasks').doc(taskId).update(updates);
      return { success: true };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }
}

export default new ApiService(); 