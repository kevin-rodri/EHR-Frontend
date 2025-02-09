import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Fab,
  TableRow,
  List
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

  // controlling the open/close of the modal:
  const [openModal, setOpenModal] = useState(false);
  const [histories, setHistories] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [display, setDisplay] = useState(false);
  const [update, setUpdate] = useState();

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
        <TableRow>
          <Typography sx={{fontWeight: "bold", marginLeft: 5, marginTop: 5 }}>History Title</Typography>
          <Typography sx={{ fontWeight: "bold", marginLeft: 25 }}>Orders</Typography>
          <Fab
            aria-label="add"
            sx={{ marginLeft: 100 }}
            disabled={!display}
            onClick={() => setOpenModal(true)}
          >
            <Add />
          </Fab>
        </TableRow>
        <List>
          {histories.map((history) => (
            <PatientHistoryRowComponent patientID={patientId} history={history} />
          ))}
        </List>
        <Button
          sx={{
            display: "flex",
            width: 143,
            height: 49,
          }}
          variant="contained"
          disabled={!display}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
