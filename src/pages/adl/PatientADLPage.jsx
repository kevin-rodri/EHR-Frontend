/*
Name: Gabby Pierce
Date: 2/23/25
Remark: Responsible for holding the patient ADL page
*/
import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import NavBar from "../../components/nav/SideNavComponent";
import PatientADLComponent from "../../components/adl/PatientADLComponent";
import { PatientBannerComponent } from "../../components/patients/PatientBannerComponent";

const PatientADLPage = () => {
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
          paddingLeft: 25,
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
          ADL
        </Typography>
        <PatientADLComponent sectionId={sectionId} />
      </Box>
    </Box>
  );
};

export default PatientADLPage;
