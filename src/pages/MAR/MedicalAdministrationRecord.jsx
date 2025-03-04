/*
Name: Dylan Bellinger
Remarks: The page for the Medical Administration Record.
*/
import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import PatientScheduledTableComponent from "../../components/MAR/PatientScheduledTableComponent";
import PatientPRNTableComponent from "../../components/MAR/PatientPRNTableComponent";
import NavBar from "../../components/nav/SideNavComponent";
import { PatientBannerComponent } from "../../components/patients/PatientBannerComponent";

export default function MedicalAdministrationRecord() {
    const { sectionId } = useParams();

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
                >
                Medical Administration Record
                </Typography>
                <Typography
                    variant="h5"
                    fontFamily={"Roboto"}
                    color="white"
                    marginBottom={1}
                >
                Scheduled Medications
                </Typography>
                <PatientScheduledTableComponent sectionId={sectionId}/>
                <Typography
                    variant="h5"
                    fontFamily={"Roboto"}
                    color="white"
                    marginTop={4}
                    marginBottom={1}
                >
                PRN Medications
                </Typography>
                <PatientPRNTableComponent sectionId={sectionId}/>
                
            </Box> 
        </Box>
    )
}
