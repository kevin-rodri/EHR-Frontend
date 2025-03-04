/*
Name: Charlize Aponte
Date: 2/23/25 
Remarks: This page displays the IVs and lines information for a patient using Material UI.
*/
import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import PatientIVandLinesComponent from "../../components/IVsandLines/PatientIVandLinesComponent";
import { isAuthenticated } from "../../services/authService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IVandLinesPage = () => { 
  const { sectionId } = useParams();
  console.log("here is section patient id", sectionId);
  const navigate = useNavigate();

  useEffect(() => { 
    async function checkAuth() { 
      const authStatus = await isAuthenticated(navigate);   
    } checkAuth(); }, [navigate]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", paddingLeft: 24 }}>
      <Typography
        variant="h2"
        fontFamily={"Roboto"}
        color="white"
        marginBottom={5}
        marginTop={5}
      >
        IVs and Lines
      </Typography>
      <PatientIVandLinesComponent sectionId={sectionId} />  
    </Box>
  );
};

export default IVandLinesPage;
