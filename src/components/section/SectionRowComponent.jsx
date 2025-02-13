/*
Name: Charlize Aponte
Date: 2/1/25
Remarks: Section Row Component to be displayed throughout the section table
*/

import React, { useState, useEffect } from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material"; 
import { getAllPatients } from "../../services/patientService";
import { getSectionsById } from "../../services/sectionService";
import { getUserById } from "../../services/authService";
import { addPatientToSection } from "../../services/sectionPatientService"; 

export default function SectionRowComponent({ sectionId, onSelect }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sectionName, setSectionName] = useState("Section Name");
  const [instructorName, setInstructorName] = useState("");

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

        // Fetching instructor's name
        const instructorData = await getUserById(sectionData.instructor_id);
        setInstructorName(instructorData.full_name);
      } catch (error) {
        console.error("Error fetching section or instructor:", error);
      }
    };
    fetchSectionData();
  }, [sectionId]);

  const handleChange = (event) => {
    // Updating selected patient and triggering callback function
    setSelectedPatient(event.target.value);
    };

  const handleAssignPatient = async () => {
    if (selectedPatient) {
      try {
        await addPatientToSection(sectionId, selectedPatient);
        alert("Patient assigned successfully!");
      } catch (error) {
        console.error("Error assigning patient:", error);
        alert("Failed to assign patient.");
      }
    } else {
      alert("Please select a patient first.");
    }
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "stretch", gap: 2 }}>
      {/* Section title and Instructor name */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "25px",
          
        }}
      >
        {/* Section title */}
        <div
          style={{
            color: "#1E1E1E",
            fontSize: 16,
            fontFamily: "Inter",
            fontWeight: "600",
            lineHeight: "22.40px",
            wordWrap: "break-word",
          }}
        >
          {sectionName}
        </div>

        {/* Instructor name */}
        <div
          style={{
            color: "#1E1E1E",
            fontSize: 16,
            fontFamily: "Inter",
            fontWeight: "600",
            lineHeight: "22.40px",
            wordWrap: "break-word",
          }}
        >
          Instructor: {instructorName}
        </div>
      </div>

      {/* Container for Dropdown and Assign Patient button */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          gap: "20px",
          marginTop: "2px",
         
        }}
      >
        {/* Dropdown Select for choosing a patient */}
        <Select
          value={selectedPatient}
          onChange={(e) => {
  handleChange(e);
}}
          displayEmpty
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
            color: "#333333",
            fontSize: 14,
            fontFamily: "Lexend",
            fontWeight: "500",
            wordWrap: "break-word",
            width: "350px", 
            height: "40px",
          }}
        >
          {/* Default menu item prompting user to choose a patient */}
          <MenuItem value="" disabled>
            <div
              style={{
                width: "100%",
                color: "#828282",
                fontSize: 14,
                fontFamily: "Lexend",
                fontWeight: "500",
                wordWrap: "break-word",
              }}
            >
              Choose Patient
            </div>
          </MenuItem>

          {/* Mapping over patients to generate dropdown items */}
          {patients.map((patient) => (
            <MenuItem key={patient.id} value={patient.id}>
              {patient.full_name}
            </MenuItem>
          ))}
        </Select>

        {/* Assign Patient Button */}
        <div
          onClick={handleAssignPatient} // Adding onClick handler
          style={{
            width: "350px", 
            height: "30px", 
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 4,
            paddingBottom: 4,
            background: "#2196F3",
            borderRadius: 4,
            border: "1px #2196F3 dotted",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            display: "inline-flex",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 12,
              fontFamily: "Roboto",
              fontWeight: "400",
              lineHeight: "19.92px",
              letterSpacing: "0.40px",
              wordWrap: "break-word",
            }}
          >
            Assign Patient
          </div>
        </div>
      </div>
  </Box>
  );
}
