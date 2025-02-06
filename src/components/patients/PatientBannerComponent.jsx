// /*
// Name: Kevin Rodriguez
// Date: 2/1/25
// Remarks: Patient Banner Component to be displayed throughout the application
// https://stackoverflow.com/questions/63390568/can-material-ui-textfield-width-be-set-to-match-width-of-input-text
// */
// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   FormControl,
//   FormGroup,
//   FormLabel,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { getSectionPatientById } from "../../services/sectionPatientService";
// import {
//   getPatientById,
//   updatePatientInfo,
// } from "../../services/patientService";
// import { getUserRole } from "../../services/authService";

// export default function PatientBannerComponent({ sectionId }) {
//   const [patient, setPatient] = useState(null);
//   const [modify, setModify] = useState(false);

//   useEffect(() => {
//     if (sectionId == null) return;
//     const role = getUserRole();
//     console.log(role);
//     if (role === "ADMIN" || role === "INSTRUCTOR") {
//       setModify(true);
//     }
//     console.log(modify);
//     /*
//     Process to get the patient: 
//     1. Find out who the patient is based on the section id
//     2. Once we have the patient's id, let's get their data.
//     */
//     const fetchPatientInfo = async () => {
//       try {
//         const sectionPatient = await getSectionPatientById(sectionId);
//         const patientId = sectionPatient.patient_id;
//         const patientData = await getPatientById(patientId);
//         setPatient(patientData);
//       } catch (err) {
//         throw err;
//       }
//     };
//     fetchPatientInfo();
//   }, [sectionId]);
//   // If we found no patient, then there should be nothing that gets display. Otherwise, let display the banner (this is to prevent the app from throwing null errors, etc)
//   if (patient == null) return null;

//   const handleUpdatePatientInfo = async (field, value) => {
//     try {
//       const updatedPatient = { ...patient, [field]: value };
//       setPatient(updatedPatient); // Update UI immediately
//       await updatePatientInfo(updatedPatient); // API call
//     } catch (err) {
//       console.error("Error updating patient info:", err);
//     }
//   };

//   return (
//     <FormGroup
//       sx={{
//         backgroundColor: "white",
//         display: "flex",
//         flexDirection: "row",
//         flexWrap: "wrap",
//         justifyContent: "space-evenly",
//         padding: 1,
//         borderRadius: 1,
//       }}
//     >
//       <FormControl
//         sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
//       >
//         <FormLabel sx={{ fontWeight: "bold", color: "black", marginRight: 1 }}>
//           Patient Name:
//         </FormLabel>
//         <TextField
//           variant="standard"
//           defaultValue={patient.full_name || "NONE"}
//           disabled={modify}
//           size="small"
//           fullWidth={false}
//           sx={{
//             fontSize: "inherit",
//             "& .MuiInput-underline:before, & .MuiInput-underline:after": {
//               display: "none",
//             },
//           }}
//         />
//       </FormControl>

//       <FormControl
//         sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
//       >
//         <FormLabel
//           variant="body2"
//           sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
//         >
//           MRN:
//         </FormLabel>
//         <TextField
//           variant="standard"
//           defaultValue={patient.medical_registration_number || "N/A"}
//           disabled={modify}
//           size="small"
//           sx={{
//             fontSize: "inherit",
//             "& .MuiInput-underline:before, & .MuiInput-underline:after": {
//               display: "none",
//             },
//           }}
//         />
//       </FormControl>

//       <FormControl
//         sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
//       >
//         <FormLabel
//           variant="body2"
//           sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
//         >
//           DOB:
//         </FormLabel>
//         <TextField
//           variant="standard"
//           defaultValue={patient.date_of_birth || "N/A"}
//           disabled={modify}
//           size="small"
//           sx={{
//             fontSize: "inherit",
//             "& .MuiInput-underline:before, & .MuiInput-underline:after": {
//               display: "none",
//             },
//           }}
//         />
//       </FormControl>

//       <FormControl
//         sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
//       >
//         <FormLabel
//           variant="body2"
//           sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
//         >
//           Weight:
//         </FormLabel>
//         <TextField
//           variant="standard"
//           defaultValue={patient.weight ? `${patient.weight} lbs` : "N/A"}
//           disabled={modify}
//           size="small"
//           sx={{
//             fontSize: "inherit",
//             "& .MuiInput-underline:before, & .MuiInput-underline:after": {
//               display: "none",
//             },
//           }}
//         />
//       </FormControl>

//       <FormControl
//         sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
//       >
//         <FormLabel
//           variant="body2"
//           sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
//         >
//           Height:
//         </FormLabel>
//         <TextField
//           variant="standard"
//           defaultValue={patient.height || "N/A"}
//           disabled={modify}
//           size="small"
//           sx={{
//             fontSize: "inherit",
//             "& .MuiInput-underline:before, & .MuiInput-underline:after": {
//               display: "none",
//             },
//           }}
//         />
//       </FormControl>

//       <FormControl
//         sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
//       >
//         <FormLabel
//           variant="body2"
//           sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
//         >
//           Allergies:
//         </FormLabel>
//         <TextField
//           variant="standard"
//           defaultValue={patient.allergies == {} ? patient.allergies : "NONE"}
//           disabled={modify}
//           size="small"
//           sx={{
//             fontSize: "inherit",
//             "& .MuiInput-underline:before, & .MuiInput-underline:after": {
//               display: "none",
//             },
//           }}
//         />
//       </FormControl>

//       <FormControl
//         sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
//       >
//         <FormLabel
//           variant="body2"
//           sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
//         >
//           Advanced Directives:
//         </FormLabel>
//         <TextField
//           variant="standard"
//           defaultValue={patient.has_advanced_directives ? "Yes" : "No"}
//           disabled={modify}
//           size="small"
//           sx={{
//             fontSize: "inherit",
//             "& .MuiInput-underline:before, & .MuiInput-underline:after": {
//               display: "none",
//             },
//           }}
//         />
//       </FormControl>

//       <FormControl
//         sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
//       >
//         <FormLabel
//           variant="body2"
//           sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
//         >
//           Precautions:
//         </FormLabel>
//         <TextField
//           variant="standard"
//           defaultValue={patient.precautions || "N/A"}
//           disabled={modify}
//           size="small"
//           sx={{
//             fontSize: "inherit",
//             "& .MuiInput-underline:before, & .MuiInput-underline:after": {
//               display: "none",
//             },
//           }}
//         />
//       </FormControl>

//       <FormControl
//         sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
//       >
//         <FormLabel
//           variant="body2"
//           sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
//         >
//           Code Status:
//         </FormLabel>
//         <TextField
//           variant="standard"
//           defaultValue={patient.code_status || "N/A"}
//           disabled={modify}
//           size="small"
//           sx={{
//             fontSize: "inherit",
//             "& .MuiInput-underline:before, & .MuiInput-underline:after": {
//               display: "none",
//             },
//           }}
//         />
//       </FormControl>

//       <FormControl
//         sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
//       >
//         <FormLabel
//           variant="body2"
//           sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}
//         >
//           Insurance:
//         </FormLabel>
//         <TextField
//           variant="standard"
//           defaultValue={patient.has_insurance ? "YES" : "NO"}
//           disabled={modify}
//           size="small"
//           sx={{
//             fontSize: "inherit",
//             "& .MuiInput-underline:before, & .MuiInput-underline:after": {
//               display: "none",
//             },
//           }}
//         />
//       </FormControl>
//     </FormGroup>
//   );
// }


import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormGroup,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import { getSectionPatientById } from "../../services/sectionPatientService";
import {
  getPatientById,
  updatePatientInfo,
} from "../../services/patientService";
import { getUserRole } from "../../services/authService";

export default function PatientBannerComponent({ sectionId }) {
  const [patient, setPatient] = useState(null);
  const [modify, setModify] = useState(false);

  useEffect(() => {
    if (sectionId == null) return;
    const role = getUserRole();
    if (role === "ADMIN" || role === "INSTRUCTOR") {
      setModify(true);
    }

    const fetchPatientInfo = async () => {
      try {
        const sectionPatient = await getSectionPatientById(sectionId);
        const patientId = sectionPatient.patient_id;
        const patientData = await getPatientById(patientId);
        setPatient(patientData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatientInfo();
  }, [sectionId]);

  if (patient == null) return null;

  const handleUpdatePatientInfo = async (field, value) => {
    try {
      if (!patient.id) return; // Ensure patient has an ID before updating
      const updatedPatient = { ...patient, [field]: value };
      setPatient(updatedPatient); // Update UI optimistically
      await updatePatientInfo(patient.id, { [field]: value }); // API call
    } catch (err) {
      console.error("Error updating patient info:", err);
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
          onChange={(e) => handleUpdatePatientInfo("full_name", e.target.value)}
          sx={{
            fontSize: "inherit",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
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
            handleUpdatePatientInfo("medical_registration_number", e.target.value)
          }
          sx={{
            fontSize: "inherit",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
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
          onChange={(e) => handleUpdatePatientInfo("date_of_birth", e.target.value)}
          sx={{
            fontSize: "inherit",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
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
          value={patient.weight ? `${patient.weight} lbs` : "N/A"}
          disabled={!modify}
          size="small"
          onChange={(e) =>
            handleUpdatePatientInfo("weight", e.target.value.replace(" lbs", ""))
          }
          sx={{
            fontSize: "inherit",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
            },
          }}
        />
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
          onChange={(e) => handleUpdatePatientInfo("height", e.target.value)}
          sx={{
            fontSize: "inherit",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
            },
          }}
        />
      </FormControl>

      <FormControl
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <FormLabel sx={{ fontWeight: "bold", marginRight: 1, color: "black" }}>
          Allergies:
        </FormLabel>
        <TextField
          variant="standard"
          value={patient.allergies || "NONE"}
          disabled={!modify}
          size="small"
          onChange={(e) => handleUpdatePatientInfo("allergies", e.target.value)}
          sx={{
            fontSize: "inherit",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
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
            handleUpdatePatientInfo("has_advanced_directives", e.target.value === "Yes")
          }
          sx={{
            fontSize: "inherit",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
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
          onChange={(e) => handleUpdatePatientInfo("precautions", e.target.value)}
          sx={{
            fontSize: "inherit",
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              display: "none",
            },
          }}
        />
      </FormControl>
    </FormGroup>
  );
}
