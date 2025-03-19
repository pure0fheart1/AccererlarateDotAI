import React, { useState } from 'react';
import './NotesTimeline.css';

const NotesTimeline = ({ initialNotes = [] }) => {
  const [notes, setNotes] = useState(initialNotes);
  
  // Group notes by date
  const groupNotesByDate = () => {
    const groups = {};
    
    notes.forEach(note => {
      const date = new Date(note.date);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!groups[dateKey]) {
        groups[dateKey] = {
          displayDate: formatDate(date),
          notes: []
        };
      }
      
      groups[dateKey].notes.push(note);
    });
    
    // Sort dates in descending order
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
      .map(([key, value]) => ({ key, ...value }));
  };
  
  const formatDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const noteDate = new Date(date);
    noteDate.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - noteDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };
  
  const groupedNotes = groupNotesByDate();
  
  if (notes.length === 0) {
    return (
      <div className="empty-notes">
        <div className="empty-notes-icon">•</div>
        <h2>No notes yet</h2>
        <p>Create your first note to get started</p>
      </div>
    );
  }
  
  return (
    <div className="notes-timeline">
      {groupedNotes.map(group => (
        <div key={group.key} className="date-group">
          <div className="timeline-date">
            <div className="date-indicator"></div>
            <div className="date-label">{group.displayDate}</div>
          </div>
          
          {group.notes.map(note => (
            <div key={note.id} className="note-card">
              {note.importance === 'high' && <div className="blue-dot"></div>}
              <h3 className="note-title">{note.title}</h3>
              <p className="note-content">{note.content}</p>
              <div className="note-tags">
                {note.tags && note.tags.map(tag => (
                  <span key={tag} className="note-tag">#{tag}</span>
                ))}
              </div>
              {note.source && (
                <div className="note-source">
                  <span className="source-label">Source:</span> {note.source}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default NotesTimeline; 