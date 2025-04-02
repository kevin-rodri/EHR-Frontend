import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { isAuthenticated } from "../../services/authService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientPainScaleComponent from "../../components/pain-scales/PatientPainScaleComponent";

const PainScalePage = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();

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
        alignSelf="center"
      >
        Scenario Specific Pain Scales
      </Typography>
    <PatientPainScaleComponent sectionId={sectionId} />
    </Box>
  );
};

export default PainScalePage;
