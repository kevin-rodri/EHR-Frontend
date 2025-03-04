//Gabby Pierce
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import NavBar from "../../components/nav/SideNavComponent";
import PatientNotesTableComponent from "../../components/patient-notes/PatientNotesTableComponent";
import { PatientBannerComponent } from "../../components/patients/PatientBannerComponent";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";
import { useEffect } from "react";

function PatientNotesPage() {
  const { sectionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const authStatus = await isAuthenticated(navigate);
    }
    checkAuth();
  }, [navigate]);


  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: 25,
          width: "100%",
        }}
      >
        <PatientBannerComponent sectionId={sectionId} />
        <Typography
          variant="h2"
          fontFamily={"Roboto"}
          color="white"
          marginBottom={5}
          marginTop={5}
          alignSelf="center"
        >
          Patient Notes
        </Typography>
        <PatientNotesTableComponent sectionId={sectionId} />
      </Box>
    </Box>
  );
}

export default PatientNotesPage;
