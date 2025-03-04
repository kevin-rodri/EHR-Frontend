//Gabby Pierce
import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, Button } from '@mui/material';
import { getNotesForPatient, deleteNoteForPatient } from '../../services/PatientNotesService';
import PatientNotesRowComponent from './PatientNotesRowComponent';
import PatientNotesModalComponent from './PatientNotesModalComponent';

function PatientNotesTableComponent({ sectionId }) {
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // null means add mode

  useEffect(() => {
    async function fetchNotes() {
      try {
        const notesData = await getNotesForPatient(sectionId);
        setNotes(notesData);
      } catch (error) {
        console.error('Error fetching notes', error);
      }
    }
    fetchNotes();
  }, [sectionId]);

  const handleSave = (savedNote) => {
    if (editingNote) {
      // Update existing note in the list
      setNotes(prevNotes => prevNotes.map(note => note.id === savedNote.id ? savedNote : note));
    } else {
      // Add new note to the list
      setNotes(prevNotes => [...prevNotes, savedNote]);
    }
    // Reset modal state
    setEditingNote(null);
    setModalOpen(false);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  // Updated deletion handler: deletes from DB then updates UI
  const handleDelete = async (noteId) => {
    try {
      await deleteNoteForPatient(sectionId, noteId);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note', error);
    }
  };

  const handleAdd = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Paper sx={{
          padding: 3,
          width: '80%',
          maxWidth: '900px',
          borderRadius: '10px',
          position: 'relative',
        }}>
          <Button
            variant="contained"
            onClick={handleAdd}
            sx={{
              minWidth: '40px',
              height: '40px',
              borderRadius: '50%',
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'theme-color',
              color: 'white',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            +
          </Button>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notes.map((note) => (
                <PatientNotesRowComponent
                  key={note.id}
                  note={note}
                  onEdit={handleEdit}
                  onDelete={handleDelete}  // Pass the deletion handler
                />
              ))}
            </TableBody>
          </Table>

          <PatientNotesModalComponent
            sectionId={sectionId}
            open={modalOpen}
            onClose={() => { setModalOpen(false); setEditingNote(null); }}
            onSave={handleSave}
            note={editingNote}
          />
        </Paper>
      </div>
    </>
  );
}

export default PatientNotesTableComponent;
