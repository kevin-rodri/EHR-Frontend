/*
Name: Kevin Rodriguez
Date: 1/16/25
Remarks: This is just the banner that appears in the login and register pages... 
Feel free to reference the mockups if this doesn't ring a bell. 
https://www.figma.com/design/As4zc60MI5hv1g1u5DYKS0/EHR-Application?node-id=0-1&p=f&t=bXaHsZYAFq9lZEHk-0
*/
import { Box } from "@mui/material";
import React from "react";
import logoImage from "../../assets/ehr_logo.png";

export default function EHRAuthBannerComponent() {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={logoImage}
        alt="Quinnipiac School of Nursing logo"
        style={{
          width: "10rem",
        }}
      />
    </Box>
  );
}
