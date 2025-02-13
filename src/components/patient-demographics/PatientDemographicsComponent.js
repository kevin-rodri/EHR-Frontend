/*
Name: Gabby Pierce
Date: 2/12/25
Remarks: PatientDemographicsPage
*/

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatientById, updatePatient } from "../../services/patientService";
import { MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledCard = styled(Card)({
  maxWidth: "90%",
  margin: "auto",
  marginTop: 20,
  padding: 40,
  backgroundColor: "#ffffff",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
});

const StyledButton = styled(Button)({
  marginTop: 30,
  padding: "12px 25px",
  fontSize: "16px",
  backgroundColor: "#007BFF",
  color: "white",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "#0056b3",
  },
});

const Title = styled(Typography)({
  color: "white",
  marginBottom: 20,
  fontSize: "40px",
  textAlign: "center",
});

const PatientDemographicsComponent = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    religion: "",
    weight: "",
    height: "",
    allergies: "",
    precautions: "",
    code_status: "",
    has_advanced_directives: false,
    has_insurance: false,
    emergency_contact_full_name: "",
    emergency_contact_phone_number: "",
  });
  const [loading, setLoading] = useState(true);
  const [isNew, setIsNew] = useState(!id);
  const [role, setRole] = useState("STUDENT");

  useEffect(() => {
    const storedRole = localStorage.getItem("ROLE");
    if (storedRole) {
      try {
        const parsedRole = JSON.parse(storedRole).role;
        setRole(parsedRole.toUpperCase());
        console.log("User Role:", parsedRole.toUpperCase());
      } catch (error) {
        console.error("Error parsing ROLE from localStorage:", error);
      }
    }

    if (id) {
      async function fetchPatient() {
        try {
          const data = await getPatientById(id);
          setFormData(data);
        } catch (error) {
          console.error("Error fetching patient data:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchPatient();
    } else {
      setLoading(false);
    }
  }, [id]);

  const isStudent = role === "STUDENT";

  const textFieldProps = (key) => ({
    label: key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    name: key,
    value: formData[key],
    fullWidth: true,
    InputLabelProps: {
      sx: { fontSize: "1.2rem", fontWeight: 600, color: "#333" },
    },
    InputProps: isStudent
      ? {
          readOnly: true,
          tabIndex: -1,
          sx: { color: "black", backgroundColor: "#f3f3f3", borderRadius: "4px" },
        }
      : {},
    onChange: !isStudent ? (e) => setFormData({ ...formData, [key]: e.target.value }) : undefined,
  });

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Title>{isNew ? "Add New Patient" : "Patient Demographics"}</Title>
      <StyledCard>
        <CardContent>
          <Divider />
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <TextField {...textFieldProps("full_name")} />
            </Grid>
            <Grid item xs={6}>
              <TextField {...textFieldProps("date_of_birth")} />
            </Grid>
            <Grid item xs={6}>
              <TextField {...textFieldProps("religion")} />
            </Grid>
            <Grid item xs={6}>
              <TextField {...textFieldProps("weight")} />
            </Grid>
            <Grid item xs={6}>
              <TextField {...textFieldProps("height")} />
            </Grid>
            <Grid item xs={6}>
              <TextField {...textFieldProps("allergies")} />
            </Grid>

            {/* Updated Code Status Dropdown */}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: "1.2rem", fontWeight: 500, color: "#333" }}>
                  Code Status
                </InputLabel>
                <Select
                  value={formData.code_status || ""}
                  onChange={
                    !isStudent
                      ? (e) => setFormData({ ...formData, code_status: e.target.value })
                      : undefined
                  }
                  disabled={isStudent}
                  displayEmpty
                  renderValue={(selected) => selected || "Please Choose One"}
                  sx={{
                    backgroundColor: isStudent ? "#f3f3f3" : "white",
                    color: "black",
                    "&.Mui-disabled": {
                      color: "black",
                    },
                    "& .MuiSelect-select.Mui-disabled": {
                      color: "black",
                    },
                  }}
                >
                  <MenuItem value="FULL_CODE" sx={{ color: "black" }}>
                    FULL_CODE
                  </MenuItem>
                  <MenuItem value="DOES-NOT-RESUSCITATE" sx={{ color: "black" }}>
                    DOES-NOT-RESUSCITATE
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: "1.2rem", fontWeight: 500, color: "#333" }}>
                  Precautions
                </InputLabel>
                <Select
                  value={formData.precautions || ""}
                  onChange={
                    !isStudent
                      ? (e) => setFormData({ ...formData, precautions: e.target.value })
                      : undefined
                  }
                  displayEmpty
                  renderValue={(selected) => selected || "Please Choose One"}
                  disabled={isStudent}
                  sx={{
                    backgroundColor: isStudent ? "#f3f3f3" : "white",
                    color: "black",
                    "&.Mui-disabled": {
                      color: "black",
                    },
                    "& .MuiSelect-select.Mui-disabled": {
                      color: "black",
                    },
                  }}
                >
                  <MenuItem value="" sx={{ color: "black" }}>
                    Please Choose One
                  </MenuItem>
                  <MenuItem value="CONTACT" sx={{ color: "black" }}>
                    Contact
                  </MenuItem>
                  <MenuItem value="DROPLET" sx={{ color: "black" }}>
                    Droplet
                  </MenuItem>
                  <MenuItem value="TUBERCULOSIS" sx={{ color: "black" }}>
                    TB
                  </MenuItem>
                  <MenuItem value="AIRBORNE" sx={{ color: "black" }}>
                    Airborne
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Has Advanced Directives */}
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.has_advanced_directives}
                    disabled={isStudent}
                    onChange={
                      !isStudent
                        ? (e) =>
                            setFormData({ ...formData, has_advanced_directives: e.target.checked })
                        : undefined
                    }
                  />
                }
                label={
                  <span style={{ color: "black", fontSize: "1.1rem", fontWeight: 400 }}>
                    Has Advanced Directives
                  </span>
                }
              />
            </Grid>

            {/* Has Insurance */}
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.has_insurance}
                    disabled={isStudent}
                    onChange={
                      !isStudent
                        ? (e) =>
                            setFormData({ ...formData, has_insurance: e.target.checked })
                        : undefined
                    }
                  />
                }
                label={
                  <span style={{ color: "black", fontSize: "1.1rem", fontWeight: 400 }}>
                    Has Insurance
                  </span>
                }
              />
            </Grid>

            <Grid item xs={6}>
              <TextField {...textFieldProps("emergency_contact_full_name")} />
            </Grid>
            <Grid item xs={6}>
              <TextField {...textFieldProps("emergency_contact_phone_number")} />
            </Grid>
          </Grid>

          <Divider />
          {!isStudent && (
            <StyledButton
              variant="contained"
              onClick={async () => {
                try {
                  await updatePatient(id, formData);
                  window.alert("Patient information has been successfully updated!");
                } catch (error) {
                  console.error("Error updating patient:", error);
                  window.alert("Error updating patient. Please try again.");
                }
              }}
            >
              {isNew ? "Add Patient" : "Save"}
            </StyledButton>
          )}
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default PatientDemographicsComponent;
