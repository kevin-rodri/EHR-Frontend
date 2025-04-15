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
        WALDO
      </Typography>
      <WaldoDiagramComponent sectionId={sectionId} />
    </Box>
  );
};
export default PatientWaldoPage;
