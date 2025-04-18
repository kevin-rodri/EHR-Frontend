/*
Name: Gabby Pierce
Date: 2/23/25
Remark: Responsible for holding the patient ADL page
*/
import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import PatientADLComponent from "../../components/adl/PatientADLComponent";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAuthenticated } from "../../services/authService";

const PatientADLPage = () => {
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
          ADL
        </Typography>
        <PatientADLComponent sectionId={sectionId} />
      </Box>
  );
};

export default PatientADLPage;
