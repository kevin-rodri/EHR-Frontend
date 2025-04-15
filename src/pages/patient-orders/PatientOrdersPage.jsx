import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { isAuthenticated } from "../../services/authService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PatientOrderComponent } from "../../components/patient-orders/PatientOrdersComponent";

const PatientOrdersPage = () => {
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
      {" "}
      <Typography
        variant="h2"
        fontFamily={"Roboto"}
        color="white"
        marginBottom={5}
        marginTop={5}
        alignSelf="center"
      >
        Patient Orders
      </Typography>
      <PatientOrderComponent sectionId={sectionId} />
    </Box>
  );
};

export default PatientOrdersPage;
