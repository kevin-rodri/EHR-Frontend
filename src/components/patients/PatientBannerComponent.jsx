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
} from "@mui/material";
import { getSectionPatientById } from "../../services/sectionPatientService";
import {
  getPatientById,
  patchPatientInfo,
} from "../../services/patientService";
import { getUserRole } from "../../services/authService";

export default function PatientBannerComponent({ sectionId }) {
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
    //   if (field === "has_advanced_directives" || field === "has_insurance") {
    //     const userInput = updatedValue.toString().trim().toLowerCase();
    //     updatedValue = userInput === "yes" ? 1 : 0;
    //   }

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
    <FormGroup
      sx={{
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        padding: 1,
        borderRadius: 1,
      }}
    >
      <FormControl
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <FormLabel sx={{ fontWeight: "bold", color: "black", marginRight: 1 }}>
          Patient Name:
        </FormLabel>
        <TextField
          variant="standard"
          value={patient.full_name || "NONE"}
          disabled={!modify}
          size="small"
          onChange={(e) => handleFieldChange("full_name", e.target.value)}
          onBlur={() => handleFieldBlur("full_name")}
          sx={{
            width: "auto",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
            },
            "& .MuiInputBase-input": {
              width: `${
                (patient.weight || "").toString().length * 1.5 || 1
              }rem`,
            },
          }}
        />
      </FormControl>

      <FormControl
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <FormLabel sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}>
          MRN:
        </FormLabel>
        <TextField
          variant="standard"
          value={patient.medical_registration_number || "N/A"}
          disabled={!modify}
          size="small"
          onChange={(e) =>
            handleFieldChange("medical_registration_number", e.target.value)
          }
          onBlur={() => handleFieldBlur("medical_registration_number")}
          sx={{
            width: "auto",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
            },
            "& .MuiInputBase-input": {
              width: `${
                (patient.medical_registration_number || "").toString().length -
                  1 || 1
              }rem`,
            },
          }}
        />
      </FormControl>

      <FormControl
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <FormLabel sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}>
          DOB:
        </FormLabel>
        <TextField
          variant="standard"
          value={patient.date_of_birth || "N/A"}
          disabled={!modify}
          size="small"
          onChange={(e) => handleFieldChange("date_of_birth", e.target.value)}
          onBlur={() => handleFieldBlur("date_of_birth")}
          sx={{
            width: "auto",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
            },
            "& .MuiInputBase-input": {
              width: `${
                (patient.date_of_birth || "").toString().length || 1
              }ch`,
            },
          }}
        />
      </FormControl>

      <FormControl
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <FormLabel sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}>
          Weight:
        </FormLabel>
        <TextField
          variant="standard"
          value={patient.weight ? `${patient.weight}` : "N/A"}
          disabled={!modify}
          size="small"
          onChange={(e) => handleFieldChange("weight", e.target.value)}
          onBlur={() => handleFieldBlur("weight")}
          sx={{
            width: "auto",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
            },
            "& .MuiInputBase-input": {
              width: `${(patient.weight || "").toString().length || 1}ch`,
            },
          }}
        />
        <Typography variant="body2" sx={{ ml: 1 }}>
          lbs
        </Typography>
      </FormControl>

      <FormControl
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <FormLabel sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}>
          Height:
        </FormLabel>
        <TextField
          variant="standard"
          value={patient.height || "N/A"}
          disabled={!modify}
          size="small"
          onChange={(e) => handleFieldChange("height", e.target.value)}
          onBlur={() => handleFieldBlur("height")}
          sx={{
            width: "auto",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
            },
            "& .MuiInputBase-input": {
              width: `${(patient.height || "").toString().length || 1}ch`,
            },
          }}
        />
        <Typography variant="body2" sx={{ ml: 1 }}>
          cm
        </Typography>
      </FormControl>

      <FormControl
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <FormLabel sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}>
          Allergies:
        </FormLabel>

        <TextField
          variant="standard"
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
          sx={{
            width: "auto",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
            },
            "& .MuiInputBase-input": {
              width: `${
                (Array.isArray(patient.allergies)
                  ? patient.allergies.length
                    ? patient.allergies.join(", ")
                    : "NONE"
                  : "NONE"
                ).length || 1
              }ch`,
            },
          }}
        />
      </FormControl>
      <FormControl
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <FormLabel sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}>
          Advanced Directives:
        </FormLabel>
        <TextField
          variant="standard"
          value={patient.has_advanced_directives ? "Yes" : "No"}
          disabled={!modify}
          size="small"
          onChange={(e) =>
            handleFieldChange("has_advanced_directives", e.target.value)
          }
          onBlur={() => handleFieldBlur("has_advanced_directives")}
          sx={{
            width: "auto",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
            },
            "& .MuiInputBase-input": {
              width: `${
                (patient.has_advanced_directives || "").toString().length + 5 ||
                1
              }ch`,
            },
          }}
        />
      </FormControl>

      <FormControl
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <FormLabel sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}>
          Precautions:
        </FormLabel>
        <TextField
          variant="standard"
          value={patient.precautions || "N/A"}
          disabled={!modify}
          size="small"
          onChange={(e) => handleFieldChange("precautions", e.target.value)}
          onBlur={() => handleFieldBlur("precautions")}
          sx={{
            width: "auto",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
            },
            "& .MuiInputBase-input": {
              width: `${
                (patient.precautions || "").toString().length + 2 || 1
              }ch`,
            },
          }}
        />
      </FormControl>

      <FormControl
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <FormLabel sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}>
          Code Status:
        </FormLabel>
        <TextField
          variant="standard"
          value={patient.code_status || "N/A"}
          disabled={!modify}
          size="small"
          onChange={(e) => handleFieldChange("code_status", e.target.value)}
          onBlur={() => handleFieldBlur("code_status")}
          sx={{
            width: "auto",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
            },
            "& .MuiInputBase-input": {
              width: `${
                (patient.code_status || "").toString().length + 2 || 1
              }ch`,
            },
          }}
        />
      </FormControl>

      <FormControl
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <FormLabel sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}>
          Insurance:
        </FormLabel>
        <TextField
          variant="standard"
          value={patient.has_insurance ? "Yes" : "No"}
          disabled={!modify}
          size="small"
          onChange={(e) => handleFieldChange("has_insurance", e.target.value)}
          onBlur={() => handleFieldBlur("has_insurance")}
          sx={{
            fontSize: "inherit",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
            },
            "& .MuiInputBase-input": {
              width: `${
                (patient.has_insurance || "").toString().length + 5 || 1
              }ch`,
            },
          }}
        />
      </FormControl>
    </FormGroup>
  );
}
