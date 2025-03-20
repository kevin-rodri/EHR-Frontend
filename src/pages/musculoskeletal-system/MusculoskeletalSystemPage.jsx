import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { isAuthenticated } from "../../services/authService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MusculoskeletalSystemComponent from "../../components/assessments/musculoskeletal/MusculoskeletalSystemComponent"; 

export default function MusculoskeletalSystem() {
  const { sectionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const authStatus = await isAuthenticated(navigate);
    }
    checkAuth();
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h2"
        fontFamily={"Roboto"}
        color="white"
        marginBottom={5}
        marginTop={5}
        alignSelf={"center"}
      >
        Musculoskeletal System
      </Typography>
      <MusculoskeletalSystemComponent sectionId={sectionId} />
    </Box>
  );
}
