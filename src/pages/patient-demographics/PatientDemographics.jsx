import React from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import PatientDemographicsComponent from "../../components/patient-demographics/PatientDemographicsComponent";
import { isAuthenticated } from "../../services/authService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PatientDemographicsPage = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const authStatus = await isAuthenticated(navigate);
    }
    checkAuth();
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PatientDemographicsComponent sectionId={sectionId} />
    </Box>
  );
};

export default PatientDemographicsPage;
