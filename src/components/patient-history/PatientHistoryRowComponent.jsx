/*
Name: Dylan Bellinger
Date: 2/10/2025 
Remarks: The Patient History Row component for displaing each patient history, as well as editing and deleting
each history.
useImperativeHandle and useRef: https://vinodht.medium.com/call-child-component-method-from-parent-react-bb8db1112f55
*/
import React, { useState, useEffect } from "react";
import {
  TableRow,
  TextField,
  Fab,
  Typography,
  ButtonGroup,
  TableCell,
} from "@mui/material";
import { deletePatientHistory } from "../../services/patientHistoryService";
import { updatePatientHistory } from "../../services/patientHistoryService";
import { Delete, Edit } from "@mui/icons-material";
import { getUserRole } from "../../services/authService";

export default function PatientHistoryRowComponent({
  patientID,
  history,
  refreshPatientHistory,
}) {
  const [access, setAccess] = useState(false);
  const [edit, setEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(history.title);
  const [newDescription, setNewDescription] = useState(history.description);

  useEffect(() => {
    const role = getUserRole();
    if (role === "ADMIN" || role === "INSTRUCTOR") {
      setAccess(true);
    }
    setNewTitle(history.title);
    setNewDescription(history.description);
  }, [history]);

  async function handleUpdate() {
    if (newTitle === history.title && newDescription === history.description)
      return;
    try {
      await updatePatientHistory(patientID, history.id, {
        type: history.type,
        title: newTitle,
        description: newDescription,
      });

      setEdit(false);
      refreshPatientHistory();
    } catch (error) {
      throw error;
    }
  }

  async function handleDelete(Id) {
    try {
      await deletePatientHistory(patientID, Id);
      refreshPatientHistory();
    } catch (error) {
      throw error;
    }
  }

  return (
    <TableRow>
      <TableCell>
        <Typography textAlign={"center"} display={"flex"} width={107}>
          {history.type}
        </Typography>
      </TableCell>
      <TableCell width={1500}>
        <TextField
          fullWidth={true}
          variant="outlined"
          defaultValue={history.title}
          disabled={!edit}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleUpdate}
        />
      </TableCell>
      <TableCell width={1500}>
        <TextField
          fullWidth={true}
          variant="outlined"
          defaultValue={history.description}
          disabled={!edit}
          onChange={(e) => setNewDescription(e.target.value)}
          onBlur={handleUpdate}
        />
      </TableCell>
      <TableCell>
        {access && (
          <ButtonGroup sx={{ display: "flex", gap: 2 }}>
            <Fab onClick={() => setEdit(!edit)} disabled={!access}>
              <Edit />
            </Fab>
            <Fab onClick={() => handleDelete(history.id)} disabled={!access}>
              <Delete />
            </Fab>
          </ButtonGroup>
        )}
      </TableCell>
    </TableRow>
  );
}