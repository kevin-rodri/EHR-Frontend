/* 
Name: Kevin Rodriguez
Date: 1/16/25
Remark: Sign up to appear when you create an account
*/
import React from "react";
import CreateAccountComponent from "../components/auth/CreateAccountComponent";
import { Box } from "@mui/material";
import EHRAuthBannerComponent from "../components/auth/EHRAuthBannerComponent";

export default function SignUpPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4}}>
      <EHRAuthBannerComponent />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <CreateAccountComponent />
      </Box>
    </Box>
  );
}
