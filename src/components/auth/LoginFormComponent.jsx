/*
Name: Kevin Rodriguez
Date: 1/11/25 
Remarks: The Login form component and the necessary logic needed for the form
*/
import React from "react";
import {
  Box,
  Button,
  Card,
  FormControl,
  FormGroup,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";

export default function LoginFormComponent() {
  return (
    <Card variant="outlined" sx={{ padding: 2 }}>
      <Typography component="h1" variant="h4" fontWeight="bold" align="center">
        Electronic Healthcare Application
      </Typography>
      <FormGroup sx={{ gap: 2, marginBottom: 3 }}>
        <FormControl>
          <FormLabel>Email Address</FormLabel>
          <TextField placeholder="youremail@quinnipiac.edu" />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <TextField placeholder="password" type="password" />
        </FormControl>
      </FormGroup>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": { backgroundColor: "darkgray" },
          }}
        >
          Sign In
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: "black",
            borderColor: "black",
            backgroundColor: "lightgray",
            "&:hover": {
              backgroundColor: "white"
            },
          }}
        >
          Create Account
        </Button>
      </Box>
    </Card>
  );
}
