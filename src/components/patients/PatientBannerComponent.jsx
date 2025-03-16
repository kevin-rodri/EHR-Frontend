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
  FormGroup,
  FormLabel,
  TextField,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  Card,
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
  // used to get the patient along with checking to see if user has permission to edit information
  const [patient, setPatient] = useState(null);
  const [modify, setModify] = useState(false);

  useEffect(() => {
    if (sectionId == null) return;
    // chek if user will have permission
    const role = getUserRole();
    if (role === "ADMIN" || role === "INSTRUCTOR") {
      setModify(true);
    }

    // gets the patient info
    const fetchPatientInfo = async () => {
      try {
        const sectionPatient = await getSectionPatientById(sectionId);
        const patientId = sectionPatient.patient_id;
        const patientData = await getPatientById(patientId);
        if (patientData != null) {
          setPatient(patientData);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatientInfo();
  }, [sectionId]);

  if (patient == null) return;

  const handleFieldChange = (field, value) => {
    setPatient((prev) => ({ ...prev, [field]: value }));
  };

  // this what we send to the backend
  // fields should match the column that needs to be updated
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
    <Card>
      <FormGroup
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          padding: 1,
          gap: 1
        }}
      >
        <FormControl
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <FormLabel
            sx={{ fontWeight: "bold", color: "black", marginRight: 1 }}
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

        <FormControl
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
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

        <FormControl
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <FormLabel
            sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
          >
            Date of Birth:
          </FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
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

        <FormControl
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <FormLabel
            sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
          >
            Weight:
          </FormLabel>
          <TextField
            variant="outlined"
            type="number"
            value={patient.weight ? `${patient.weight}` : "N/A"}
            disabled={!modify}
            size="small"
            onChange={(e) => handleFieldChange("weight", e.target.value)}
            onBlur={() => handleFieldBlur("weight")}
          />
          <Typography variant="body2" sx={{ ml: 1 }}>
            lbs
          </Typography>
        </FormControl>

        <FormControl
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
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
          <Typography variant="body2" sx={{ ml: 1 }}>
            cm
          </Typography>
        </FormControl>

        <FormControl
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <FormLabel
            sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
          >
            Allergies:
          </FormLabel>
          <TextField
            variant="outlined"
            value={
              Array.isArray(patient.allergies)
                ? patient.allergies.length
                  ? patient.allergies.join(", ")
                  : "NONE"
                : "NONE"
            }
            disabled={!modify}
            size="small"
            onChange={(e) => {
              const input = e.target.value;
              const array = input
                ? input.split(",").map((item) => item.trim())
                : [];
              handleFieldChange("allergies", array);
            }}
            onBlur={() => handleFieldBlur("allergies")}
          />
        </FormControl>
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

        <FormControl
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
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
            fullWidth
          >
            <MenuItem value="PRECAUTIONS">Precautions</MenuItem>
            <MenuItem value="CONTACT">Contact</MenuItem>
            <MenuItem value="DROPLET">Droplet</MenuItem>
            <MenuItem value="TUBERCULOSIS">Tuberculosis</MenuItem>
            <MenuItem value="AIRBORNE">Airborne</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
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

        <FormControl
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
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
      </FormGroup>
    </Card>
  );
}
