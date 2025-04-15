/*
Name: Kevin Rodriguez
Date: 1/11/25 
Remarks: The Login form component and the necessary logic needed for the form
Sidenote: Figma has a dev tool feature that will give you the actual css to the components on the page
, just sayin'. 
Also, https://stackoverflow.com/questions/68120804/how-to-create-custom-validation-from-react-hook-form 
*/
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormGroup,
  FormLabel,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getUserRole, login } from "../../services/authService";
import { getUserSectionRosterByID } from "../../services/sectionRosterService";
import { getSectionId } from "../../services/authService";
import logo from "../../assets/ehr_logo.png";

export default function LoginFormComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await login(data.username.trim(), data.password.trim());
      const role = getUserRole();
      const sectionRoster = await getUserSectionRosterByID();

      localStorage.setItem(
        "SECTION_ID",
        JSON.stringify({ sectionId: sectionRoster.section_id })
      );
      const sectionId = getSectionId();
      if (role === "STUDENT") {
        try {
          navigate(`/patient-demographics/${sectionId}`);
        } catch (error) {
          console.error("Error retrieving section or patient data:", error);
        }
      } else {
        navigate("/assign");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        padding: 3,
        flexDirection: "column",
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
        <img
          src={logo}
          alt="Quinnipiac School of Nursing logo"
          style={{ width: "100%", maxWidth: "18rem", marginBottom: "1rem" }}
          alignItems="center"
        />
      </Box>
      <Typography
        component="h1"
        variant="h5"
        fontWeight="bold"
        align="center"
        marginBottom={2}
      >
        Sign In
      </Typography>
      <FormGroup sx={{ gap: 3, marginBottom: 3, width: "100%" }}>
        <FormControl>
          <FormLabel>Email Address</FormLabel>
          <TextField
            placeholder="youremail@quinnipiac.edu"
            {...register("username", {
              required: "Email is required",
              validate: (value) =>
                value.trim() !== "" || "Email cannot contain spaces",
            })}
            error={!!errors.username}
            helperText={errors.username?.message}
            disabled={loading}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <TextField
            placeholder="Password"
            type="password"
            {...register("password", {
              required: "Password is required",
              validate: (value) =>
                value.trim() !== "" || "Password cannot contain spaces",
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={loading}
          />
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
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
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
          disabled={loading}
        >
          Create Account
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Card>
  );
}
