import React from "react";
import { useParams } from "react-router-dom";
import PatientHistoryComponent from "../../components/patient-history/PatientHistoryComponent";
import { Box, Typography } from "@mui/material";
import { PatientBannerComponent } from "../../components/patients/PatientBannerComponent";
import NavBar from "../../components/nav/SideNavComponent";

const PatientHistory = () => {
  const { sectionId } = useParams();

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <NavBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: 24,
        }}
      >
        <PatientBannerComponent sectionId={sectionId} />
        <Typography
          variant="h2"
          fontFamily={"Roboto"}
          color="white"
          marginBottom={5}
          marginTop={5}
        >
          Patient History
        </Typography>
        <PatientHistoryComponent sectionId={sectionId} />
      </Box>
    </Box>
  );
};
export default PatientHistory;
