/* 
Name: Kevin Rodriguez
Date: 1/16/25
Remarks: Login page that will appear when the EHR application starts
*/
import React from "react";
import LoginFormComponent from "../../components/auth/LoginFormComponent";
import { Box } from "@mui/material";

export default function LoginPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#00a3ff", // Solid Quinnipiac navy blue
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <LoginFormComponent />
      </Box>
    </Box>
  );
}
