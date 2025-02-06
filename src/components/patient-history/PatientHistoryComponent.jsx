import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormGroup,
  FormLabel,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Fab,
  TableRow,
  List,
  ListItem,
  ButtonGroup,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PatientHistoryModalComponent from "./PatientHistoryModalComponent";

export default function PatientHistoryComponent() {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  // controlling the open/close of the modal:
  const [openModal, setOpenModal] = useState(false);

  const patientHistories = [
    {
      type: "Primary Admitting Diagnosis",
      title: "Patient's Primary Admitting Diagnosis",
      descrption: "This is Patients Primary Admitting Diagnosis",
    },
    {
      type: "Family Health History",
      title: "Patient's Family Health History",
      descrption: "This is Patient's Family Health History",
    },
    {
      type: "Social History",
      title: "Patient's Social History",
      descrption: "This is Patient's Social History",
    },
    {
      type: "Medical/Sugical History",
      title: "Patient's Medical/Sugical History",
      descrption: "This is Patient's Medical/Sugical History",
    },
  ];

  return (
    <Box>
      <PatientHistoryModalComponent
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
      <Box
        sx={{
          display: "flex",
          padding: 5,
          flexDirection: "column",
          alignItems: "flex-start",
          backgroundColor: "white",
          marginBottom: 10,
          marginLeft: 20,
          marginRight: 30,
          borderRadius: 3,
        }}
      >
        <TableRow>
          <FormLabel>History Title</FormLabel>
          <FormLabel sx={{ marginLeft: 25 }}>Orders</FormLabel>
          <Fab
            aria-label="add"
            sx={{ marginLeft: 100 }}
            onClick={() => setOpenModal(true)}
          >
            <Add />
          </Fab>
        </TableRow>
        <List>
          {patientHistories.map((patientHistory, index) => (
            <ListItem key={index}>
              {patientHistory.type}
              <span style={{ marginLeft: 20 }}>
                {patientHistory.descrption}
              </span>
              <ButtonGroup sx={{ marginLeft: 2 }}>
                <Fab>
                  <Edit />
                </Fab>
                <Fab>
                  <Delete />
                </Fab>
              </ButtonGroup>
            </ListItem>
          ))}
        </List>
        <Button
          sx={{
            display: "flex",
            width: 143,
            height: 49,
          }}
          variant="contained"
        >
          Save
        </Button>
      </Box>

      {/* Pass the open and onClose props down to your modal component */}
    </Box>
  );
}
