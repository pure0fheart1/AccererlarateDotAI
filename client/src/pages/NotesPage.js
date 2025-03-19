import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DatabaseService from '../services/DatabaseService';
import NoteCreator from '../components/notes/NoteCreator';
import NotesTimeline from '../components/notes/NotesTimeline';
import FileUploader from '../components/common/FileUploader';
import FilePreview from '../components/common/FilePreview';

// Sample notes for development
const sampleNotes = [
  {
    id: '1',
    title: 'Project Meeting Notes',
    content: 'Discussed timeline for the new feature launch. Need to prepare demo by next Friday.',
    importance: 'high',
    tags: ['meeting', 'project'],
    date: new Date('2023-08-15T10:30:00').toISOString(),
    source: 'Team Meeting'
  },
  {
    id: '2',
    title: 'React Hooks Documentation',
    content: 'useEffect hook can cause infinite loops if dependencies are not handled correctly.',
    importance: 'normal',
    tags: ['react', 'programming'],
    date: new Date().toISOString(),
    source: 'React Documentation'
  },
  {
    id: '3',
    title: 'Ideas for Blog Post',
    content: 'Write about the impact of AI on productivity tools and how it changes workflows.',
    importance: 'high',
    tags: ['writing', 'ai'],
    date: new Date().toISOString()
  }
];

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  
  // Fetch notes from Firebase
  useEffect(() => {
    const fetchNotes = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const fetchedNotes = await DatabaseService.getNotes(currentUser.uid);
        setNotes(fetchedNotes);
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError('Failed to load notes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotes();
  }, [currentUser]);
  
  const handleAddNote = async (newNote) => {
    try {
      // Add userId to note
      const noteWithUser = {
        ...newNote,
        userId: currentUser.uid
      };
      
      // Optimistically update UI
      setNotes(prevNotes => [noteWithUser, ...prevNotes]);
      
      // Add to database
      await DatabaseService.addNote(currentUser.uid, noteWithUser);
    } catch (err) {
      console.error('Error adding note:', err);
      setError('Failed to save note. Please try again.');
      
      // Revert optimistic update
      setNotes(prevNotes => prevNotes.filter(note => note.id !== newNote.id));
    }
  };
  
  const handleDeleteNote = async (noteId) => {
    try {
      // Store note before deletion in case we need to revert
      const deletedNote = notes.find(note => note.id === noteId);
      
      // Optimistically update UI
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      
      // Delete from database
      await DatabaseService.deleteNote(noteId);
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note. Please try again.');
      
      // Revert optimistic update if we have the deleted note
      if (deletedNote) {
        setNotes(prevNotes => [...prevNotes, deletedNote]);
      }
    }
  };

  return (
    <div className="page-container">
      <h1>Notes</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <NoteCreator onAddNote={handleAddNote} />
      
      {loading ? (
        <div className="loading-indicator">Loading notes...</div>
      ) : (
        <NotesTimeline 
          notes={notes} 
          onDeleteNote={handleDeleteNote}
        />
      )}
    </div>
  );
};

export default NotesPage; 