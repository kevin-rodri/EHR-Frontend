import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "../../components/nav/SideNavComponent";
import { PatientBannerComponent } from "../../components/patients/PatientBannerComponent";
import PatientOrdersComponent from "../../components/patient-orders/PatientOrdersComponent";
import { isAuthenticated } from "../../services/authService";

const PatientOrdersPage = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      await isAuthenticated(navigate);
    }
    checkAuth();
  }, [navigate]);

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box sx={{ flex: 1, paddingLeft: 23, display: "flex", flexDirection: "column" }}>
        <PatientBannerComponent sectionId={sectionId} />
        <PatientOrdersComponent sectionId={sectionId} />
      </Box>
    </Box>
  );
};

export default PatientOrdersPage;
