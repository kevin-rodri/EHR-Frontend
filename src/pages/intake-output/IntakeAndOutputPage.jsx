import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import PatientIntakeTableComponent from "../../components/intake-output/PatientIntakeTableComponent";
import PatientOutputTableComponent from "../../components/intake-output/PatientOuputTableComponent";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";
import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function IntakeAndOutputPage() {
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
    <Box sx={{ display: "flex", flexDirection: "column" , gap: 2}}>
      <Typography
        variant="h2"
        fontFamily={"Roboto"}
        color="white"
        marginBottom={5}
        marginTop={5}
        alignSelf={"center"}
      >
        Intake and Output
      </Typography>
      <PatientIntakeTableComponent sectionId={sectionId} />
      <PatientOutputTableComponent sectionId={sectionId} />
    </Box>
  );
}
