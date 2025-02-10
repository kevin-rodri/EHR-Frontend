/*
Name: Dylan Bellinger
Date: 2/10/2025 
Remarks: The Patient History component for displaying patient history data.
useImperativeHandle and useRef: https://vinodht.medium.com/call-child-component-method-from-parent-react-bb8db1112f55
*/
import React, { useState, useEffect, forwardRef } from "react";
import {
  Box,
  Button,
  Typography,
  Fab,
  TableRow,
  List,
  TableHead,
  TableCell
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import PatientHistoryModalComponent from "./PatientHistoryModalComponent";
import PatientHistoryRowComponent from "./PatientHistoryRowComponent";
import { getSectionPatientById } from "../../services/sectionPatientService";
import { getPatientHistory } from "../../services/patientHistoryService";
import { getUserRole } from "../../services/authService";

export default function PatientHistoryComponent({sectionId}) {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const updateRef = forwardRef();

  // controlling the open/close of the modal:
  const [openModal, setOpenModal] = useState(false);
  const [histories, setHistories] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [display, setDisplay] = useState(false);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
      if (sectionId == null) return;
      const role = getUserRole();
      if (role === "ADMIN" || role === "INSTRUCTOR") {
        setDisplay(true);
      }
      const fetchPatientHistory = async () => {
        try {
          const sectionPatient = await getSectionPatientById(sectionId);
          const patientId = sectionPatient.patient_id;
          const patientData = await getPatientHistory(patientId);
          setHistories(patientData);
          setPatientId(patientId)
        } catch (err) {
          throw err;
        }
      };
      fetchPatientHistory();
    }, [sectionId]);

  return (
    <Box>
      <PatientHistoryModalComponent
        open={openModal}
        onClose={() => setOpenModal(false)}
        patientID={patientId}
      />
      <Box
        sx={{
          display: "flex",
          padding: 1,
          flexDirection: "column",
          alignItems: "flex-start",
          backgroundColor: "white",
          marginBottom: 10,
          marginLeft: 20,
          marginRight: 30,
          borderRadius: 3,
        }}
      >
        <TableHead>
        <TableRow>
            <TableCell>
          <Typography sx={{fontWeight: "bold", marginLeft: 2 }}>History Title</Typography>
          </TableCell>
          <TableCell>
          <Typography sx={{ fontWeight: "bold", marginLeft: 2 }}>Orders</Typography>
          </TableCell>
          <TableCell>
          <Fab
            aria-label="add"
            sx={{ marginLeft: 95 }}
            //disabled={!display}
            onClick={() => setOpenModal(true)}
          >
            <Add />
          </Fab>
          </TableCell>
        </TableRow>
        </TableHead>
        <List>
          {histories.map((history) => (
            <PatientHistoryRowComponent patientID={patientId} history={history} ref={updateRef}/>
          ))}
        </List>
        <Button
          sx={{
            display: "flex",
            width: 143,
            height: 49,
          }}
          variant="contained"
          //disabled={!display}
          onClick={() => {
            updateRef.current?.handleUpdate();
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
