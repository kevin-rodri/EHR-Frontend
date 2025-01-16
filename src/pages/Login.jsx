/* 
Name: Kevin Rodriguez
Date: 1/16/25
Remarks: Login page that will appear when the EHR application starts
*/
import React from "react";
import LoginFormComponent from "../components/auth/LoginFormComponent";
import EHRAuthBannerComponent from "../components/auth/EHRAuthBannerComponent";
import { Box } from "@mui/material";

export default function LoginPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh"}}>
      <EHRAuthBannerComponent />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1
        }}
      >
        <LoginFormComponent />
      </Box>
    </Box>
  );
}
