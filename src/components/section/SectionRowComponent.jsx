/*
Name: Charlize Aponte
Date: 2/1/25
Remarks: Section Row Component (Presentational) for each section row inside the Section Table
*/

import React, { useState } from "react";
import { Box, Select, MenuItem, Button, Typography } from "@mui/material";

export default function SectionRowComponent({
  section,
  patients,
  instructorName,
  onAssignPatient, 
}) {
  const [selectedPatient, setSelectedPatient] = useState(section.assignedPatient);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        alignItems: "center",
        gap: 2,
        border: "1px solid #ccc",
        borderRadius: 1,
        p: 2,
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#1E1E1E" }}>
        Section: {section.section_name} — Instructor: {instructorName}
      </Typography>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          displayEmpty
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
            color: "#333333",
            fontSize: 14,
            fontWeight: "500",
            width: { xs: "100%", sm: "350px" },
            height: "40px",
          }}
        >
          <MenuItem value="" disabled>
            Choose Patient
          </MenuItem>
          {patients.map((patient) => (
            <MenuItem key={patient.id} value={patient.id}>
              {patient.full_name}
            </MenuItem>
          ))}
        </Select>

        <Button
       onClick={() => onAssignPatient(section.id, section.assignedPatient, selectedPatient, section.sectionPatientRecordId)}
          sx={{
            width: { xs: "100%", sm: "350px" },
            height: "40px",
            backgroundColor: "#2196F3",
            color: "white",
            fontSize: 14,
            fontWeight: "500",
            textTransform: "none",
            "&:hover": { backgroundColor: "#1976D2" },
          }}
        >
          Assign Patient
        </Button>
      </Box>
    </Box>
  );
}
