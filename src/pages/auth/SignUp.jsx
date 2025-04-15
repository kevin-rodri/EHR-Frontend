/* 
Name: Kevin Rodriguez
Date: 1/16/25
Remark: Sign up to appear when you create an account
*/
import React from "react";
import CreateAccountComponent from "../../components/auth/CreateAccountComponent";
import { Box } from "@mui/material";

export default function SignUpPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <CreateAccountComponent />
      </Box>
    </Box>
  );
}
