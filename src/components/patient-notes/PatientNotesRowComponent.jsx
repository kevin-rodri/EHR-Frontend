//Gabby Pierce
import React from "react";
import { TableRow, TableCell, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString("en-GB", { hour12: false });
}

function PatientNotesRowComponent({ note, onEdit, onDelete }) {
  return (
    <TableRow>
      <TableCell>{note.title}</TableCell>
      <TableCell>{note.description}</TableCell>
      <TableCell>{formatTimestamp(note.created_date)}</TableCell>
      <TableCell>
        <IconButton onClick={() => onEdit(note)}>
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(note.id)}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default PatientNotesRowComponent;
