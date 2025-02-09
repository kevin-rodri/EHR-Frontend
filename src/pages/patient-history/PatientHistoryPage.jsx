import React from "react";
import PatientHistoryComponent from "../../components/patient-history/PatientHistoryComponent";
import { Box, Typography } from "@mui/material";

export default function PatientHistory() {
    return(
        
        <Box>
            <Typography variant="h2" fontFamily={"Roboto"} color="white" textAlign={"left"} marginBottom={5} marginTop={5} marginLeft={20}>
            Patient History
            </Typography>
            <PatientHistoryComponent sectionId={'032c51d8-dea1-11ef-b75f-fa63d398c461'}/>
        </Box>
    );
};