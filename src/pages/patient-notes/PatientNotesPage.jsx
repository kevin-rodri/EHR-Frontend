//Gabby Pierce
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import NavBar from "../../components/nav/SideNavComponent";
import PatientNotesTableComponent from "../../components/patient-notes/PatientNotesTableComponent";
import { PatientBannerComponent } from "../../components/patients/PatientBannerComponent";

function PatientNotesPage() {
  const { sectionId } = useParams();

  if (!sectionId) {
    return <p>Error: No Section ID provided.</p>;
  }

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
