/*
Name: Kevin Rodriguez
Date: 2/1/25
Remarks: Patient Banner Component to be displayed throughout the application
CSS classes were overwritten: https://mui.com/material-ui/customization/how-to-customize/?srsltid=AfmBOorxpAY72LpcRBgqKwauvw-MzSIiJxIWPgCiU7RRokymfZq5eTJA
Ideally, not something we want to do, but for the sake of sticking to the design, this change was needed.
Blur changes seemed relevant for this: https://legacy.reactjs.org/docs/events.html
*/

import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  Card,
  Grid,
  Bpx,
} from "@mui/material";
import { getSectionPatientById } from "../../services/sectionPatientService";
import {
  getPatientById,
  patchPatientInfo,
} from "../../services/patientService";
import { getUserRole } from "../../services/authService";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export function PatientBannerComponent({ sectionId }) {
  const [patient, setPatient] = useState(null);
  const [modify, setModify] = useState(false);

  useEffect(() => {
    if (sectionId == null) return;
    /*
    Process to get the patient: 
    1. Find out who the patient is based on the section id
    2. Once we have the patient's id, let's get their data.
    */
    const role = getUserRole();
    if (role === "ADMIN" || role === "INSTRUCTOR") {
      setModify(true);
    }

    const fetchPatientInfo = async () => {
      try {
        const sectionPatient = await getSectionPatientById(sectionId);
        const patientId = sectionPatient.patient_id;
        const patientData = await getPatientById(patientId);
        if (patientData) {
          setPatient(patientData);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatientInfo();
  }, [sectionId]);

  // If we found no patient, then there should be nothing that gets display. Otherwise, let display the banner (this is to prevent the app from throwing null errors, etc)
  if (patient == null) return null;

  const handleFieldChange = (field, value) => {
    setPatient((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldBlur = async (field) => {
    try {
      let updatedValue = patient[field];
      await patchPatientInfo(patient.id, { [field]: updatedValue });

      setPatient((prev) => ({
        ...prev,
        [field]: updatedValue,
      }));
    } catch (error) {
      throw error;
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: "white",
        padding: 2,
        borderRadius: 2,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Grid container spacing={1}>
        {/* Patient Name */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <FormLabel
              sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
            >
              Patient Name:
            </FormLabel>
            <TextField
              variant="outlined"
              value={patient.full_name || "NONE"}
              disabled={!modify}
              size="small"
              onChange={(e) => handleFieldChange("full_name", e.target.value)}
              onBlur={() => handleFieldBlur("full_name")}
            />
          </FormControl>
        </Grid>

        {/* MRN */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <FormLabel
              sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
            >
              MRN:
            </FormLabel>
            <TextField
              variant="outlined"
              value={patient.medical_registration_number || "N/A"}
              disabled={!modify}
              size="small"
              onChange={(e) =>
                handleFieldChange("medical_registration_number", e.target.value)
              }
              onBlur={() => handleFieldBlur("medical_registration_number")}
            />
          </FormControl>
        </Grid>
        {/* Weight */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <FormLabel
              sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
            >
              Weight:
            </FormLabel>
            <TextField
              variant="outlined"
              type="number"
              value={patient.weight || "N/A"}
              disabled={!modify}
              size="small"
              onChange={(e) => handleFieldChange("weight", e.target.value)}
              onBlur={() => handleFieldBlur("weight")}
            />
          </FormControl>
        </Grid>

        {/* Height */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <FormLabel
              sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
            >
              Height:
            </FormLabel>
            <TextField
              variant="outlined"
              type="number"
              value={patient.height || "N/A"}
              disabled={!modify}
              size="small"
              onChange={(e) => handleFieldChange("height", e.target.value)}
              onBlur={() => handleFieldBlur("height")}
            />
          </FormControl>
        </Grid>

        {/* Allergies */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <FormLabel
              sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
            >
              Allergies:
            </FormLabel>
            <TextField
              variant="outlined"
              value={
                Array.isArray(patient.allergies)
                  ? patient.allergies.join(", ")
                  : "NONE"
              }
              disabled={!modify}
              size="small"
              onChange={(e) =>
                handleFieldChange(
                  "allergies",
                  e.target.value.split(",").map((a) => a.trim())
                )
              }
              onBlur={() => handleFieldBlur("allergies")}
            />
          </FormControl>
        </Grid>

        {/* Date of Birth */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <FormLabel
              sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
            >
              Date of Birth:
            </FormLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={
                  patient.date_of_birth ? dayjs(patient.date_of_birth) : null
                }
                onChange={(newDate) =>
                  handleFieldChange(
                    "date_of_birth",
                    newDate ? newDate.format("YYYY-MM-DD") : ""
                  )
                }
                disabled={!modify}
                renderInput={(params) => <TextField {...params} size="small" />}
                onClose={() => handleFieldBlur("date_of_birth")}
              />
            </LocalizationProvider>
          </FormControl>
        </Grid>

        {/* Precautions */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <FormLabel
              sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
            >
              Precautions:
            </FormLabel>
            <Select
              value={patient.precautions}
              onChange={(e) => handleFieldChange("precautions", e.target.value)}
              onBlur={() => handleFieldBlur("precautions")}
              disabled={!modify}
            >
              <MenuItem value="PRECAUTIONS">Precautions</MenuItem>
              <MenuItem value="CONTACT">Contact</MenuItem>
              <MenuItem value="DROPLET">Droplet</MenuItem>
              <MenuItem value="TUBERCULOSIS">Tuberculosis</MenuItem>
              <MenuItem value="AIRBORNE">Airborne</MenuItem>
            </Select>
          </FormControl>
        </Grid>


        {/* Code Status */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <FormLabel
              sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
            >
              Code Status:
            </FormLabel>
            <Select
              value={patient.code_status}
              onChange={(e) => handleFieldChange("code_status", e.target.value)}
              onBlur={() => handleFieldBlur("code_status")}
              disabled={!modify}
            >
              <MenuItem value="FULL_CODE">Full Code</MenuItem>
              <MenuItem value="DOES-NOT-RESUSCITATE">
                Does Not Resuscitate
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Has Insurance */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
            fullWidth
          >
            <FormLabel
              sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
            >
              Has Insurance:
            </FormLabel>
            <Checkbox
              checked={patient.has_insurance || false}
              onChange={(e) =>
                handleFieldChange("has_insurance", e.target.checked)
              }
              onBlur={() => handleFieldBlur("has_insurance")}
              disabled={!modify}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <FormLabel
              sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
            >
              Has Advanced Directives:
            </FormLabel>
            <Checkbox
              checked={patient.has_advanced_directives || false}
              onChange={(e) =>
                handleFieldChange("has_advanced_directives", e.target.checked)
              }
              onBlur={() => handleFieldBlur("has_advanced_directives")}
              disabled={!modify}
            />
          </FormControl>
        </Grid>
      </Grid>
    </Card>
  );
}
