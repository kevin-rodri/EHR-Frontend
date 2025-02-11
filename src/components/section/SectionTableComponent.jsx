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
      width: "75%", // Keeps the white box at a proper width
      marginLeft: "auto", // Moves the white box slightly to the right
      backgroundColor: "white",
      padding: 4,
      borderRadius: 8,
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow effect
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start", // Aligns all content to the left
      gap: 3,
    }}
  >
    {/* Loop through each section and render SectionRowComponent */}
    {sections.map((section) => (
      <Box
        key={section.id}
        sx={{
          width: "100%", // Makes sure it spans the full width of the white box
          display: "flex",
          justifyContent: "flex-start", // Ensures content starts at the left
        }}
      >
        <SectionRowComponent sectionId={section.id} />
      </Box>
    ))}
  </Box>
  
    );
    
}
