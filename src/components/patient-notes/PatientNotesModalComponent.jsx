//Gabby Pierce
import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { addNoteForPatient, updateNoteForPatient } from '../../services/PatientNotesService';

function PatientNotesModalComponent({ sectionId, open, onClose, onSave, note }) {
  // When editing, prefill the fields with the note data
  const [title, setTitle] = useState(note ? note.title : '');
  const [description, setDescription] = useState(note ? note.description : '');

  // Update local state when a different note is passed in
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setDescription(note.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [note]);

  const handleSave = async () => {
    const currentTimestamp = new Date().toISOString(); // Military time format
    const currentUser = localStorage.getItem("username") || "Unknown"; // Retrieve from auth

    try {
      let savedNote;
      if (note) {
        const updatedNoteData = {
          title,
          description,
          modified_date: currentTimestamp,
          modified_by: currentUser,
        };
        savedNote = await updateNoteForPatient(sectionId, note.id, updatedNoteData);
      } else {
        const newNoteData = {
          title,
          description,
          created_date: currentTimestamp,
          created_by: currentUser,
        };
        savedNote = await addNoteForPatient(sectionId, newNoteData);
      }
      onSave(savedNote);
      onClose();
    } catch (error) {
      console.error("Error saving note", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        width: 400,
        padding: 3,
        backgroundColor: 'white',
        margin: 'auto',
        marginTop: '10%',
        borderRadius: 2,
        boxShadow: 3
      }}>
        <Typography variant="h6" gutterBottom>
          {note ? 'Edit Note' : 'Add a New Note'}
        </Typography>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button onClick={onClose} color="secondary" sx={{ marginRight: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default PatientNotesModalComponent;
