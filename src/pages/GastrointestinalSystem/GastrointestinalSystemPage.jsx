 /*
Name: Charlize Aponte
Date: 3/16/25
Remarks: This page displays the gastrointestinal system information for a patient using Material UI.
*/

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import NavBar from "../../components/nav/SideNavComponent";
import { PatientBannerComponent } from "../../components/patients/PatientBannerComponent";
import GastrointestinalSystemComponent from "../../components/Assessments/GastrointestinalSystem/GastrointestinalSystemComponent";
import { isAuthenticated } from "../../services/authService";

const GastrointestinalSystemPage = () => {
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
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", paddingLeft: 24 }}>
        <Typography
          variant="h2"
          fontFamily={"Roboto"}
          color="white"
          marginBottom={5}
          marginTop={5}
        >
          Gastrointestinal System
        </Typography>
        <GastrointestinalSystemComponent sectionId={sectionId} />
      </Box>
    </Box>
  );
};

export default GastrointestinalSystemPage;
