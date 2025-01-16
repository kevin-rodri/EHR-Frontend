/* 
Name: Kevin Rodriguez
Date: 1/16/25
Remarks: Create account component for students to sign up for. 
*/
import React from "react";
import {
  Card,
  FormGroup,
  Typography,
  FormControl,
  FormLabel,
  TextField,
  Select,
  MenuItem,
  Box,
  Button,
} from "@mui/material";

// To referenence later: <CircularProgress /> (just throw in the create account  button)
export default function CreateAccountComponent() {
  return (
    <Card variant="outlined" sx={{ padding: 2 }}>
      <Typography component="h1" variant="h4" fontWeight="bold" align="center" padding={2}>
        Create an Account
      </Typography>
      <FormGroup sx={{ gap: 2, marginBottom: 3 }}>
        <FormControl>
          <FormLabel>Email Address</FormLabel>
          <TextField placeholder="youremail@quinnipiac.edu" />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <TextField placeholder="password" type="password" />
          <Typography component="h6" align="left">
            Must be at least 8 characters
          </Typography>
        </FormControl>
        <FormControl>
          <FormLabel>Full Name</FormLabel>
          <TextField placeholder="e.g Mary Smith"></TextField>
        </FormControl>
        <FormControl>
          <FormLabel>Section</FormLabel>
          <Select>
            {/* Change me so that it's one menu item and we get a list of sections from the backend :) */}
            <MenuItem>Ten</MenuItem>
            <MenuItem>Twenty</MenuItem>
            <MenuItem>Thirty</MenuItem>
          </Select>
        </FormControl>
      </FormGroup>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
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
        >
          Create Account
        </Button>
      </Box>
    </Card>
  );
}
