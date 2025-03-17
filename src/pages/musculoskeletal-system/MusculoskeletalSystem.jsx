import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { PatientBannerComponent } from "../../components/patients/PatientBannerComponent";
import NavBar from "../../components/nav/SideNavComponent";
import { isAuthenticated } from "../../services/authService";
import {  useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MusculoskeletalSystemComponent from "../../components/assessments/musculoskeletal-system/MusculoskeletalSystemComponent";

export default function MusculoskeletalSystem() {
    const {sectionId} = useParams();
    const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const authStatus = await isAuthenticated(navigate);
    }
    checkAuth();
  }, [navigate]);

    return(
            <Box sx={{
                display: "flex",
              }}>
                <NavBar />
                <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    paddingLeft: 24,
                }}
                >
                    <PatientBannerComponent sectionId={sectionId} />
                    <Typography
                        variant="h2"
                        fontFamily={"Roboto"}
                        color="white"
                        marginBottom={5}
                        marginTop={5}
                        marginLeft={10}
                    >
                    Musculoskeletal System
                    </Typography>
                    <MusculoskeletalSystemComponent sectionId={sectionId}/>
                </Box> 
            </Box>
        )
}

