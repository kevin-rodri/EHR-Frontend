/*
Name: Charlize Aponte
Date: 2/1/25 
Remarks: This is where user's will be redirected for now... This will need to be deleted once the starting pages are done.
Mobile friendly material ui: https://stackoverflow.com/questions/77716384/how-to-make-react-mui-component-mobile-responsive
*/
import React from "react";
import { Box, Typography } from "@mui/material";
import SectionTableComponent from "../../components/section/SectionTableComponent";
import NavBar from "../../components/nav/SideNavComponent";

export default function PatientAssignment() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignContent: "space-between"
      }}
    >
      <NavBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 15
        }}
      >
        <Typography
          variant="h2"
          fontFamily={"Roboto"}
          color="white"
          marginBottom={5}
          marginTop={5}
        >
          Assign Patient to Lab
        </Typography>
        <SectionTableComponent />
      </Box>
    </Box>
  );
}
