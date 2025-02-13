/*
Name: Charlize Aponte
Date: 2/1/25 
Remarks: This is where user's will be redirected for now... This will need to be deleted once the starting pages are done.
*/
import React from "react";
import { Box, Typography } from "@mui/material";
import SectionTableComponent from "../components/section/SectionTableComponent";
import SectionRowComponent from "../components/section/SectionRowComponent";

export default function PatientAssignment() {
  return (
    <>
  <Typography
    sx={{
      textAlign: "left", // Align text to the left
      color: "#F5F5F5", 
      fontSize: 57,
      fontFamily: "Roboto",
      fontWeight: 400,
      lineHeight: "64px",
      wordWrap: "break-word",
      alignSelf: "flex-start",
      marginBottom: 2, 
      marginTop: 15, // Reduced to move text higher
      marginLeft: 20, // Added to move text to the left
    }}
  >
    Assign Patient to Lab
  </Typography>
  <SectionTableComponent />
</>
  );
}
