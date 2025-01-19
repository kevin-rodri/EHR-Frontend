/* 
Name: Kevin Rodriguez
Date: 1/16/25
Remarks: Create account component for students to sign up and create an account. 
*/
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormGroup,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { getAllSections } from "../../services/sectionService";

export default function CreateAccountComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [sections, setSections] = useState([]);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await getAllSections();
        setSections(data);
      } catch (error) {
        console.error(error); // we'll do this for the time being...
      }
    };
    fetchSections();
  }, []);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await registerUser(formData);
      navigate("/");
    } catch (err) {
      setError("Account creation failed. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Card variant="outlined" sx={{ padding: 2 }}>
      <Typography
        component="h1"
        variant="h4"
        fontWeight="bold"
        align="center"
        padding={2}
      >
        Create an Account
      </Typography>
      <FormGroup sx={{ gap: 2, marginBottom: 3 }}>
        <FormControl>
          <FormLabel>Email Address</FormLabel>
          <TextField
            placeholder="youremail@quinnipiac.edu"
            {...register("username", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@(quinnipiac\.edu|qu\.edu)$/,
                message: "Enter a valid quinnipiac email address",
              },
            })}
            error={!!errors.username}
            helperText={errors.username?.message}
            disabled={loading}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <TextField
            placeholder="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={loading}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Full Name</FormLabel>
          <TextField
            placeholder="e.g Mary Smith"
            {...register("full_name", { required: "Full name is required" })}
            error={!!errors.full_name}
            helperText={errors.full_name?.message}
            disabled={loading}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Section</FormLabel>
          <Select
            {...register("section_id", { required: "Please select a section" })}
            error={!!errors.section_id}
            disabled={loading}
          >
            {sections.length > 0 ? (
              sections.map((section) => (
                <MenuItem key={section.id} value={section.id}>
                  {section.section_name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No Sections Available</MenuItem>
            )}
          </Select>
          {errors.section && (
            <Typography variant="body2" color="error">
              {errors.section.message}
            </Typography>
          )}
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
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Create Account"
          )}
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
