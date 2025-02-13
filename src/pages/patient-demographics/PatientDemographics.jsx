import React from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "../../components/nav/SideNavComponent";
import { PatientBannerComponent } from "../../components/patients/PatientBannerComponent";
import PatientDemographicsComponent from "../../components/patient-demographics/PatientDemographicsComponent";

const PatientDemographicsPage = () => {
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
          paddingLeft: 23
        }}
      >
        <PatientBannerComponent sectionId={sectionId} />
        <PatientDemographicsComponent sectionId={sectionId} />
      </Box>
    </Box>
  );
};

export default PatientDemographicsPage;
