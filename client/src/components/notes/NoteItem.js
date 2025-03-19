import FilePreview from '../common/FilePreview';

// Inside the NoteItem component
// After note content
{note.attachments && note.attachments.length > 0 && (
  <div className="note-attachments">
    <FilePreview 
      files={note.attachments}
      entityType="notes"
      entityId={note.id}
      onDelete={null} // Handle deletion separately to update the note
    />
  </div>
)} 