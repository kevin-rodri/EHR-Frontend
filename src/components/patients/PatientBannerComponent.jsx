/*
Name: Kevin Rodriguez
Date: 2/1/25
Remarks: Patient Banner Component to be displayed throughout the application
*/
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { getSectionPatientById } from "../../services/sectionPatientService";
import { getPatientById } from "../../services/patientService";

export default function PatientBannerComponent({ sectionId }) {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    if (sectionId == null) return;
    /*
    Process to get the patient: 
    1. Find out who the patient is based on the section id
    2. Once we have the patient's id, let's get their data.
    */
    const fetchPatientInfo = async () => {
      try {
        const sectionPatient = await getSectionPatientById(sectionId);
        const patientId = sectionPatient.patient_id;
        const patientData = await getPatientById(patientId);
        setPatient(patientData);
      } catch (err) {
        throw err;
      }
    };
    fetchPatientInfo();
  }, [sectionId]);
  // If we found no patient, then there should be nothing that gets display. Otherwise, let display the banner (this is to prevent the app from throwing null errors, etc)
  if (patient == null) return null;

  return (
    <Box
      sx={{
        backgroundColor: "white",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        padding: 1,
        borderRadius: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", marginRight: 1 }}>
          Patient Name:
        </Typography>
        <Typography variant="body2">{patient.full_name || "NONE"}</Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", marginRight: 1 }}>
          MRN:
        </Typography>
        <Typography variant="body2">
          {patient.medical_registration_number || "N/A"}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", marginRight: 1 }}>
          DOB:
        </Typography>
        <Typography variant="body2">
          {patient.date_of_birth || "N/A"}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", marginRight: 1 }}>
          Weight:
        </Typography>
        <Typography variant="body2">
          {patient.weight ? `${patient.weight} lbs` : "N/A"}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", marginRight: 1 }}>
          Height:
        </Typography>
        <Typography variant="body2">{patient.height || "N/A"}</Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", marginRight: 1 }}>
          Allergies:
        </Typography>
        <Typography variant="body2">
          {patient.allergies == {} ? patient.allergies : "NONE"}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", marginRight: 1 }}>
          Advanced Directives:
        </Typography>
        <Typography variant="body2">
          {patient.has_advanced_directives ? "Yes" : "No"}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", marginRight: 1 }}>
          Precautions:
        </Typography>
        <Typography variant="body2">{patient.precautions || "N/A"}</Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", marginRight: 1 }}>
          Code Status:
        </Typography>
        <Typography variant="body2">{patient.code_status || "N/A"}</Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", marginRight: 1 }}>
          Insurance:
        </Typography>
        <Typography variant="body2">
          {patient.has_insurance ? "YES" : "NO"}
        </Typography>
      </Box>
    </Box>
  );
}
