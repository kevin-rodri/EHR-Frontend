/*
Name: Kevin Rodriguez
Date: 1/19/25 
Remarks: This is where user's will be redirected for now... This will need to be deleted once the starting pages are done.
*/
import React from "react";
import { Box, Typography } from "@mui/material";
import PatientBannerComponent from "../components/patients/PatientBannerComponent";

export default function EmptyPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Typography
        component="h1"
        variant="h5"
        fontWeight="bold"
        align="center"
        marginBottom={2}
      >
        Please delete me when the patient assignment and dashboard are done :') 
      </Typography>
      <PatientBannerComponent sectionId={'032c51d8-dea1-11ef-b75f-fa63d398c461'} />
    </Box>
  );
}