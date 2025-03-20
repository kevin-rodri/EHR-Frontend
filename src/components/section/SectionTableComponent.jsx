/*
Name: Charlize Aponte
Date: 2/1/25
Remarks: Section TABLE Component to be displayed throughout the PATIENT ASSIGNMENT PAGE
*/
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, useMediaQuery } from "@mui/material";
import SectionRowComponent from "./SectionRowComponent";
import { getAllSections } from "../../services/sectionService";
import { getUserRole, getAllFacultyUsers } from "../../services/authService";
import { getAllPatients } from "../../services/patientService";
import { getSectionPatientById } from "../../services/sectionPatientService";
import UnauthorizedComponent from "../auth/UnauthorizedComponent";

export default function SectionTableComponent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sections, setSections] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [authorized, setAuthorized] = useState(true);
  const [patients, setPatients] = useState([]);
  const [facultyUsers, setFacultyUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const sectionsData = await getAllSections();
        const role = await getUserRole();
        const allPatients = await getAllPatients();
        const faculty = await getAllFacultyUsers();

        if (role === "ADMIN" || role === "INSTRUCTOR") {
          setUserRole(role);
          setAuthorized(true);
          setFacultyUsers(faculty);

          // Fetch assigned patients for each section
          const sectionsWithDetails = await Promise.all(
            sectionsData.map(async (section) => {
              try {
                const sectionPatient = await getSectionPatientById(section.id);

                // Match instructor_id with user.id to get the instructor's full name
                const instructor = faculty.find(
                  (user) => user.id === section.instructor_id
                );
                const instructorName = instructor
                  ? instructor.full_name
                  : "Unknown Instructor";

                return {
                  ...section,
                  assignedPatient: sectionPatient
                    ? sectionPatient.patient_id
                    : null,
                  instructorName,
                };
              } catch (err) {
                console.error(err);
              }
            })
          );

          setSections(sectionsWithDetails);
          setPatients(allPatients);
        } else {
          setAuthorized(false);
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    }
    fetchData();
  }, [isMobile]);

  if (!authorized) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <UnauthorizedComponent />
      </Box>
    );
  }
  

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      {sections.map((section) => (
        <Box key={section.id}>
          <SectionRowComponent
            section={section}
            patients={patients}
            instructorName={section.instructorName}
          />
        </Box>
      ))}
    </Box>
  );
}
