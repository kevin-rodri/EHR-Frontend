/*
Name: Kevin Rodriguez
Date: 1/11/25 
Remarks: The Login form component and the necessary logic needed for the form
Sidenote: Figma has a dev tool feature that will give you the actual css to the components on the page
, just sayin'. 
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
import { useNavigate } from "react-router-dom";

// To referenence later: <CircularProgress /> (just throw in the sign in button)
export default function LoginFormComponent() {
  const navigate = useNavigate();

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        padding: 3,
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Typography
        component="h1"
        variant="h5"
        fontWeight="bold"
        align="center"
        marginBottom={2}
      >
        Electronic Healthcare Application
      </Typography>
      <FormGroup sx={{ gap: 3, marginBottom: 3, width: "100%" }}>
        <FormControl>
          <FormLabel>Email Address</FormLabel>
          <TextField placeholder="youremail@quinnipiac.edu" />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <TextField placeholder="Password" type="password" />
        </FormControl>
      </FormGroup>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          width: "100%",
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
              backgroundColor: "white",
            },
          }}
          onClick={() => navigate("/register")}
        >
          Create Account
        </Button>
      </Box>
    </Card>
  );
}
