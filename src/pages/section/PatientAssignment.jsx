/*
Name: Charlize Aponte
Date: 2/1/25 
Remarks: This is where user's will be redirected for now... This will need to be deleted once the starting pages are done.
Mobile friendly material ui: https://stackoverflow.com/questions/77716384/how-to-make-react-mui-component-mobile-responsive
*/
import React from "react";
import { Box, Typography } from "@mui/material";
import SectionTableComponent from "../../components/section/SectionTableComponent";
import { isAuthenticated } from "../../services/authService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PatientAssignment() {
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
        <Typography
          variant="h2"
          fontFamily={"Roboto"}
          color="white"
          marginBottom={5}
          marginTop={5}
          alignSelf={"center"}
        >
          Assign Patient to Lab
        </Typography>
        <SectionTableComponent />
      </Box>
  );
}

