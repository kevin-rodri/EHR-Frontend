/*
Name: Charlize Aponte
Date: 2/1/25
Remarks: Section TABLE Component to be displayed throughout the PATIENT ASSIGNMENT PAGE
*/

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import SectionRowComponent from "./SectionRowComponent";
import { getAllSections } from "../../services/sectionService";
import { getUserRole } from "../../services/authService";
import UnauthorizedComponent from "../auth/UnauthorizedComponent";

export default function SectionTableComponent() {
  const [sections, setSections] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    async function fetchSectionsAndRole() {
      try {
        const sectionsData = await getAllSections(); // Fetch all sections
        const role = await getUserRole(); // Get user role

        if (role === "ADMIN" || role === "INSTRUCTOR") {
          setSections(sectionsData);
          setUserRole(role);
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchSectionsAndRole();
  }, []);

  if (!authorized) {
    return <UnauthorizedComponent />;
  }

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      {/* Loop through each section and render SectionRowComponent */}
      {sections.map((section) => (
        <Box key={section.id}>
          <SectionRowComponent sectionId={section.id} />
        </Box>
      ))}
    </Box>
  );
}
