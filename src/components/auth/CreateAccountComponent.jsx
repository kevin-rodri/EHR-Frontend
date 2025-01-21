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
import { addUserToSectionRoster } from "../../services/sectionRosterService";

export default function CreateAccountComponent() {
  // https://react-hook-form.com/docs/useform/setvalue and https://react-hook-form.com/docs/useform
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [sections, setSections] = useState([]);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // get all the sections to display on the form
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await getAllSections();
        setSections(data);
      } catch (error) {
        throw error;
      }
    };
    fetchSections();
  }, []);

  // make calls to our respective services (in this case, user and section roster)
  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      // I hope this doesn't slow things down in the long run..
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser = await registerUser({
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name,
        role: formData.role,
      });

      await addUserToSectionRoster(formData.section_id, {
        user_id: newUser.id,
        role: formData.role,
      });

      navigate("/");
    } catch (err) {
      setError("Failed to create an account, please try again.");
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup sx={{ gap: 2, marginBottom: 3 }}>
          <FormControl>
            <FormLabel>Email Address</FormLabel>
            <TextField
              placeholder="youremail@quinnipiac.edu"
              {...register("username", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@(quinnipiac\.edu|qu\.edu)$/,
                  message: "Enter a valid Quinnipiac email address",
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
            <FormLabel>Role</FormLabel>
            <Select
              {...register("role", { required: "Please select a role" })}
              error={!!errors.role}
              onChange={(e) => setValue("role", e.target.value)}
              disabled={loading}
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="INSTRUCTOR">Instructor</MenuItem>
              <MenuItem value="STUDENT">Student</MenuItem>
            </Select>
            {errors.role && (
              <Typography variant="body2" color="error">
                {errors.role.message}
              </Typography>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>Section</FormLabel>
            <Select
              {...register("section_id", {
                required: "Please select a section",
              })}
              defaultValue=""
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
            {errors.section_id && (
              <Typography variant="body2" color="error">
                {errors.section_id.message}
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
            type="submit"
            variant="outlined"
            sx={{
              color: "black",
              borderColor: "black",
              backgroundColor: "lightgray",
              "&:hover": {
                backgroundColor: "white",
              },
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Account"
            )}
          </Button>
        </Box>
      </form>
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
