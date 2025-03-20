/*
Name: Dylan Bellinger
Remarks: The page for the Medical Administration Record.
*/
import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import PatientScheduledTableComponent from "../../components/MAR/PatientScheduledTableComponent";
import PatientPRNTableComponent from "../../components/MAR/PatientPRNTableComponent";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";
import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function MedicalAdministrationRecord() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    async function checkAuth() {
      const authStatus = await isAuthenticated(navigate);
    }
    checkAuth();
  }, [navigate]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography
        variant="h2"
        fontFamily={"Roboto"}
        color="white"
        marginBottom={5}
        marginTop={5}
        alignSelf={"center"}
      >
        Medical Administration Record
      </Typography>
      <Typography
        variant="h5"
        fontFamily={"Roboto"}
        color="white"
        marginBottom={1}
      >
        Scheduled Medications
      </Typography>
      <PatientScheduledTableComponent sectionId={sectionId} />
      <Typography
        variant="h5"
        fontFamily={"Roboto"}
        color="white"
        marginTop={4}
        marginBottom={1}
      >
        PRN Medications
      </Typography>
      <PatientPRNTableComponent sectionId={sectionId} />
    </Box>
  );
}
