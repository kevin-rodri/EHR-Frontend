/*
Name: Charlize Aponte
Date: 2/1/25
Remarks: Section TABLE Component to be displayed throughout the PATIENT ASSIGNMENT PAGE
*/
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, useMediaQuery, Snackbar, Alert } from "@mui/material";
import SectionRowComponent from "./SectionRowComponent";
import { getAllSections } from "../../services/sectionService";
import { getUserRole, getAllFacultyUsers } from "../../services/authService";
import { getAllPatients } from "../../services/patientService";
import { getSectionPatientById, updateSectionPatient, addPatientToSection } from "../../services/sectionPatientService";
import UnauthorizedComponent from "../auth/UnauthorizedComponent";

export default function SectionTableComponent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sections, setSections] = useState([]);
  const [patients, setPatients] = useState([]);
  const [facultyUsers, setFacultyUsers] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [authorized, setAuthorized] = useState(true);
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAssignPatient = async (sectionId, assignedPatient, selectedPatient, sectionPatientRecordId) => {
    try {
      if (!selectedPatient) {
        showSnackbar("Please select a patient first!", "info");
        return;
      }
  
      if (assignedPatient && assignedPatient !== selectedPatient) {
        if (!sectionPatientRecordId) {
          showSnackbar("Failed to find section patient record.", "error");
          return;
        }

        await updateSectionPatient(sectionPatientRecordId, { patient_id: selectedPatient });
        showSnackbar("Patient assignment updated successfully!", "success");
      } else if (!assignedPatient) {
        await addPatientToSection(sectionId, { patient_id: selectedPatient });
        showSnackbar("Patient assigned successfully!", "success");
      } else {
        showSnackbar("This patient is already assigned to this section.", "info");
      }
    } catch (error) {
      showSnackbar("Failed to assign patient.", "error");
    }
  };
  

  useEffect(() => {
    async function fetchData() {
      try {
        const sectionsData = await getAllSections();
        const role = await getUserRole();
        const allPatients = await getAllPatients();
        const faculty = await getAllFacultyUsers();
  
        if (role === "ADMIN" || role === "INSTRUCTOR") {
          setUserRole(role);
          setAuthorized(true);
          setFacultyUsers(faculty);
  
          const sectionsWithDetails = await Promise.all(
            sectionsData.map(async (section) => {
              try {
                const sectionPatient = await getSectionPatientById(section.id);
  
                // SAFELY look for the instructor
                const instructor = faculty.find((user) => user.id === section.instructor_id);
                
                return {
                  ...section,
                  assignedPatient: sectionPatient ? sectionPatient.patient_id : null,
                  sectionPatientRecordId: sectionPatient ? sectionPatient.id : null,
                  instructorName: instructor?.full_name || "Unknown Instructor",
                };
                
              } catch (err) {
                console.error("Error getting section details:", err);
                return {
                  ...section,
                  assignedPatient: null,
                  instructorName: "Unknown Instructor",
                };
              }
            })
          );
  
          setSections(sectionsWithDetails.filter(Boolean)); // filter out any undefined sections
          setPatients(allPatients);
        } else {
          setAuthorized(false);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        return null;
      }
    }
    fetchData();
  }, [isMobile]);
  

  if (!authorized) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <UnauthorizedComponent />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      {sections.map((section) => (
        <Box key={section.id}>
          <SectionRowComponent
            section={section}
            patients={patients}
            instructorName={section.instructorName} 
            onAssignPatient={handleAssignPatient}
          />
        </Box>
      ))}

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