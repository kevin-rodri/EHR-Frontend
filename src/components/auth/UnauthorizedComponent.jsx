/*
Name: Kevin Rodriguez
Date: 1/11/25 
Remarks: Unauthoized Component to be displayed when a user does not have access to a certain page (based on feature flag)
*/
import React from "react";
import { Box, Alert } from "@mui/material";

export default function unauthorizedComponent() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Alert severity="error">
        Unauthorized Access: You do not have permission to view this page.
        Please contact your administrator for assistance.
      </Alert>
    </Box>
  );
}
