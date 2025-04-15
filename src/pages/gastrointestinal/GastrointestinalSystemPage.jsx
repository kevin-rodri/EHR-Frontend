/*
Name: Charlize Aponte
Date: 3/16/25
Remarks: This page displays the gastrointestinal system information for a patient using Material UI.
*/
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import GastrointestinalSystemComponent from "../../components/assessments/gastrointestinal/GastrointestinalSystemComponent";
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
        flexDirection: "column",
        p:1
      }}
    >
      <Typography
        variant="h2"
        fontFamily={"Roboto"}
        color="white"
        marginBottom={5}
        marginTop={5}
        alignSelf={"center"}
      >
        Gastrointestinal System
      </Typography>
      <GastrointestinalSystemComponent sectionId={sectionId} />
    </Box>
  );
};

export default GastrointestinalSystemPage;
