/*
Name: Charlize Aponte
Date: 2/1/25
Remarks: Section Row Component to be displayed throughout the section table
*/
import React, { useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import {
  updateSectionPatient,
  addPatientToSection,
} from "../../services/sectionPatientService";

export default function SectionRowComponent({
  section,
  patients,
  instructorName,
}) {
  const [selectedPatient, setSelectedPatient] = useState(
    section.assignedPatient
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAssignPatient = async () => {
    try {
      if (!selectedPatient) {
        showSnackbar("Please select a patient first!", "info");
        return;
      }

      if (
        section.assignedPatient &&
        section.assignedPatient !== selectedPatient
      ) {
        await updateSectionPatient(section.id, { patient_id: selectedPatient });
        showSnackbar("Patient assignment updated successfully!", "success");
      } else if (!section.assignedPatient) {
        await addPatientToSection(section.id, { patient_id: selectedPatient });
        showSnackbar("Patient assigned successfully!", "success");
      } else {
        showSnackbar(
          "This patient is already assigned to this section.",
          "info"
        );
      }
    } catch (error) {
      console.error("Error assigning patient:", error);
      showSnackbar("Failed to assign patient.", "error");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        alignItems: "center",
        gap: 2,
        border: "1px solid #ccc",
        borderRadius: 1,
        p: 2,
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#1E1E1E" }}>
        Section: {section.section_name} — Instructor: {instructorName}
      </Typography>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          displayEmpty
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
            color: "#333333",
            fontSize: 14,
            fontWeight: "500",
            width: { xs: "100%", sm: "350px" },
            height: "40px",
          }}
        >
          <MenuItem value="" disabled>
            Choose Patient
          </MenuItem>
          {patients.map((patient) => (
            <MenuItem key={patient.id} value={patient.id}>
              {patient.full_name}
            </MenuItem>
          ))}
        </Select>

        <Button
          onClick={handleAssignPatient}
          sx={{
            width: { xs: "100%", sm: "350px" },
            height: "40px",
            backgroundColor: "#2196F3",
            color: "white",
            fontSize: 14,
            fontWeight: "500",
            textTransform: "none",
            "&:hover": { backgroundColor: "#1976D2" },
          }}
        >
          Assign Patient
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
