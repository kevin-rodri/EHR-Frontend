/*
Name: Kevin Rodriguez
Date: 2/21/25 
Remarks: This page is meant for the home of the patient WALDO page 
*/
import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import WaldoDiagramComponent from "../../components/waldo/WaldoDiagramComponent";
import NavBar from "../../components/nav/SideNavComponent";
import { PatientBannerComponent } from "../../components/patients/PatientBannerComponent";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";

const PatientWaldoPage = () => {
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
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingLeft: 24,
        minHeight: "100vh",
      }}
    >
      <NavBar />
      <PatientBannerComponent sectionId={sectionId} />
      <Typography
        variant="h2"
        fontFamily={"Roboto"}
        color="white"
        marginBottom={5}
        marginTop={5}
      >
        Patient Wounds and Drains
      </Typography>
      <WaldoDiagramComponent sectionId={sectionId} />
    </Box>
  );
};
export default PatientWaldoPage;
