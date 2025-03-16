/*
Name: Charlize Aponte
Date: 2/1/25
Remarks: Section Row Component to be displayed throughout the section table
*/

import React, { useState, useEffect } from "react";
import { Box, MenuItem, Select, Typography, Button } from "@mui/material";
import { getAllPatients, getPatientById } from "../../services/patientService";
import { getSectionsById } from "../../services/sectionService";
import { getUserById } from "../../services/authService";
import {
  addPatientToSection,
  getSectionPatientById,
  updateSectionPatient,
} from "../../services/sectionPatientService";

export default function SectionRowComponent({ sectionId }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [assignedPatient, setAssignedPatient] = useState(null);
  const [sectionName, setSectionName] = useState(null);
  const [instructorName, setInstructorName] = useState(null);

  useEffect(() => {
    // Fetching patients data
    const fetchPatients = async () => {
      try {
        const patientList = await getAllPatients();
        setPatients(patientList);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();

    // Fetching section and instructor data
    const fetchSectionData = async () => {
      try {
        const sectionData = await getSectionsById(sectionId);
        setSectionName(sectionData.section_name);

        // Fetching instructor's name and patient
        const instructorData = await getUserById(sectionData.instructor_id);
        const sectionPatient = await getSectionPatientById(sectionId);
        const patientId = sectionPatient.patient_id;
        const patientData = await getPatientById(patientId);
        setInstructorName(instructorData.full_name);
        setAssignedPatient(patientData);
        setSelectedPatient(patientData);
      } catch (error) {
        console.error("Error fetching section or instructor:", error);
      }
    };
    fetchSectionData();
  }, [sectionId]);

  const handleChange = (event) => {
    // Find the full patient object from the patients list
    const selected = patients.find(
      (patient) => patient.id === event.target.value
    );
    setSelectedPatient(selected);
  };

  const handleAssignPatient = async () => {
    try {
      if (
        assignedPatient != null &&
        assignedPatient.id !== selectedPatient.id
      ) {
        const data = await getSectionPatientById(sectionId);
        await updateSectionPatient(data.id, {
          patient_id: selectedPatient.id,
        });
        alert("Patient assignment updated successfully!");
      } else if (assignedPatient == null) {
        await addPatientToSection(sectionId, {
          patient_id: selectedPatient.id,
        });
        alert("Patient assigned successfully!");
      } else {
        alert("This patient is already assigned.");
      }

      setAssignedPatient(selectedPatient);
    } catch (error) {
      console.error("Error assigning/updating patient:", error);
      alert("Failed to assign or update patient.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: 2,
      }}
    >
      {/* Section Title & Instructor Name */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start"
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#1E1E1E" }}>
          {sectionName} Instructor: {instructorName}
        </Typography>
      </Box>

      {/* Dropdown Select & Assign Button */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {/* Patient Select Dropdown */}
        <Select
          value={selectedPatient ? selectedPatient.id : ""}
          onChange={handleChange}
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

        {/* Assign Patient Button */}
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
    </Box>
  );
}
