import React from 'react';
import './Notes.css';

const Notes = ({ notes }) => {
  // Group notes by date for timeline display
  const groupedNotes = notes.reduce((groups, note) => {
    const date = new Date(note.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(note);
    return groups;
  }, {});

  return (
    <div className="notes-timeline">
      {Object.entries(groupedNotes).map(([date, dateNotes]) => (
        <div key={date} className="timeline-group">
          <div className="timeline-date">
            <span className="date-indicator"></span>
            <h3>{date}</h3>
          </div>
          
          <div className="timeline-notes">
            {dateNotes.map(note => (
              <div key={note.id} className="note-card">
                <h4>{note.title}</h4>
                <p>{note.content}</p>
                {note.isImportant && <span className="blue-dot"></span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notes; 