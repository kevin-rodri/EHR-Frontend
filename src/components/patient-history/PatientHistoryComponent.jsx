/*
Name: Dylan Bellinger
Date: 2/10/2025 
Remarks: The Patient History component for displaying patient history data.
useImperativeHandle and useRef: https://vinodht.medium.com/call-child-component-method-from-parent-react-bb8db1112f55
*/
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Fab,
  TableRow,
  List,
  TableHead,
  TableCell,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import PatientHistoryModalComponent from "./PatientHistoryModalComponent";
import PatientHistoryRowComponent from "./PatientHistoryRowComponent";
import { getSectionPatientById } from "../../services/sectionPatientService";
import { getPatientHistory } from "../../services/patientHistoryService";
import { getUserRole } from "../../services/authService";

export default function PatientHistoryComponent({ sectionId }) {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const updateRefs = useRef({});

  // controlling the open/close of the modal:
  const [openModal, setOpenModal] = useState(false);
  const [histories, setHistories] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [display, setDisplay] = useState(false);
  const [update, setUpdate] = useState(false);

  const fetchPatientHistory = async () => {
    try {
      const sectionPatient = await getSectionPatientById(sectionId);
      const patientId = sectionPatient.patient_id;
      const patientData = await getPatientHistory(patientId);
      setHistories(patientData);
      setPatientId(patientId);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (sectionId == null) return;
    const role = getUserRole();
    if (role === "ADMIN" || role === "INSTRUCTOR") {
      setDisplay(true);
    }
    fetchPatientHistory();
  }, [sectionId]);

  return (
    <Box>
      <PatientHistoryModalComponent
        open={openModal}
        onClose={() => setOpenModal(false)}
        patientID={patientId}
        refreshPatientHistory={fetchPatientHistory}
      />
      <Box
        sx={{
          display: "flex",
          padding: 1,
          flexDirection: "column",
          backgroundColor: "white",
          /*marginBottom: 10,
          marginLeft: 20,
          marginRight: 30,*/
          borderRadius: 3,
          overflowX: "auto",
        }}
      >
        <TableHead>
          <TableRow display={"flex"}>
            <TableCell>
              <Typography sx={{ fontWeight: "bold", marginLeft: 2 }}>
                History Type
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontWeight: "bold", marginLeft: 2 }}>
                History Title
              </Typography>
            </TableCell>
            <TableCell width={1500}>
              <Typography sx={{ fontWeight: "bold", marginLeft: 2 }}>
                Orders
              </Typography>
            </TableCell>
            <TableCell>
              <TableCell>
                {display && (
                  <Fab aria-label="add" onClick={() => setOpenModal(true)}>
                    <Add />
                  </Fab>
                )}
              </TableCell>
            </TableCell>
          </TableRow>
        </TableHead>
        <List>
          {histories.map((history) => (
            <PatientHistoryRowComponent
              key={history.id}
              patientID={patientId}
              history={history}
              refreshPatientHistory={fetchPatientHistory}
            />
          ))}
        </List>
      </Box>
    </Box>
  );
}
