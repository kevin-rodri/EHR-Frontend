import React from "react";
import { useParams } from "react-router-dom";
import PatientHistoryComponent from "../../components/patient-history/PatientHistoryComponent";
import { Box, Typography } from "@mui/material";
import { isAuthenticated } from "../../services/authService";
import {  useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PatientHistory = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => { 
      async function checkAuth() { 
        const authStatus = await isAuthenticated(navigate);   
      } checkAuth(); }, [navigate]);
      
  return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 1
        }}
      >
        <Typography
          variant="h2"
          fontFamily={"Roboto"}
          color="white"
          marginBottom={5}
          marginTop={5}
          alignSelf="center"
        >
          Patient History
        </Typography>
        <PatientHistoryComponent sectionId={sectionId} />
      </Box>
  );
};
export default PatientHistory;
