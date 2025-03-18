import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "../../components/nav/SideNavComponent";
import { PatientBannerComponent } from "../../components/patients/PatientBannerComponent";
import PatientOrdersComponent from "../../components/patient-orders/PatientOrdersComponent";
import { getSectionPatientById } from "../../services/sectionPatientService";
import { isAuthenticated } from "../../services/authService";

const PatientOrdersPage = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Check authentication and retrieve user role from storage.
  useEffect(() => {
    async function checkAuth() {
      await isAuthenticated(navigate);
      const storedRole = localStorage.getItem("ROLE");
      if (storedRole) {
        try {
          const parsedRole = JSON.parse(storedRole).role;
          setUserRole(parsedRole.toUpperCase());
        } catch (error) {
          console.error("Error parsing ROLE from localStorage:", error);
          setUserRole("STUDENT");
        }
      } else {
        // For testing, you can default to INSTRUCTOR.
        setUserRole("INSTRUCTOR");
      }
    }
    checkAuth();
  }, [navigate]);

  // Fetch the patient ID based on sectionId.
  useEffect(() => {
    async function fetchPatientId() {
      try {
        const sectionPatient = await getSectionPatientById(sectionId);
        if (sectionPatient && sectionPatient.patient_id) {
          setPatientId(sectionPatient.patient_id);
        }
      } catch (error) {
        console.error("Error fetching patient ID:", error);
      }
    }
    if (sectionId) {
      fetchPatientId();
    }
  }, [sectionId]);

  if (!patientId || !userRole) {
    return <div>Loading patient orders...</div>;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box
        sx={{
          flex: 1,
          paddingLeft: 23,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PatientBannerComponent sectionId={sectionId} />
        <PatientOrdersComponent patientId={patientId} userRole={userRole} />
      </Box>
    </Box>
  );
};

export default PatientOrdersPage;
