import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CircularProgress,
    FormControl,
    FormGroup,
    FormLabel,
    TextField,
    Typography,
    Snackbar,
    Alert,
    Paper,
    Fab,
    TableRow,
    List,
    ListItem,
    ButtonGroup
  } from "@mui/material";
  import { Delete, Edit } from "@mui/icons-material";
  import { Add } from "@mui/icons-material";
  import { useForm } from "react-hook-form";
  import { useNavigate } from "react-router-dom";
import { getPatientById } from "../../services/patientService";
import { getPatientHistory, updatePatientHistory } from "../../services/patientHistoryService";
import PatientHistoryModalComponent from "./PatientHistoryModalComponent";

  export default function PatientHistoryComponent() {

    const {
        handleSubmit,
        formState: { errors },
      } = useForm();

    /*  useEffect(() => {
          const fetchHistory = async () => {
            try {
              const data = await getPatientHistory();
              setHistory(data);
            } catch (error) {
              throw error;
            }
          };
          fetchHistory();
        }, []); */

    const [modal, setModal] = useState(false);
    const [histories, setHistories] = useState([]);

    const patientHistories = [
        {
            type: "Primary Admitting Diagnosis",
            title: "Patient's Primary Admitting Diagnosis",
            descrption: "This is Patients Primary Admitting Diagnosis"
        },
        {
            type: "Family Health History",
            title: "Patient's Family Health History",
            descrption: "This is Patient's Family Health History"
        },
        {
            type: "Social History",
            title: "Patient's Social History",
            descrption: "This is Patient's Social History"
        },
        {
            type: "Medical/Sugical History",
            title: "Patient's Medical/Sugical History",
            descrption: "This is Patient's Medical/Sugical History"
        }
    ]

    return(

        <Box>
            <Box sx={{
                display: "flex",
                padding: 5,
                flexDirection: "column",
                alignItems: "flex-start",
                backgroundColor: "white",
                marginBottom: 10,
                marginLeft: 20,
                marginRight: 30,
                borderRadius: 3
            }}>
                <TableRow>
                        <FormLabel>History Title</FormLabel>
                        <FormLabel sx={{marginLeft: 25}}>Orders</FormLabel>
                    <Fab aria-label="add" sx={{marginLeft: 100}}><Add /></Fab>
                </TableRow>
                <List>
                    {patientHistories.map((patientHistory, index) =>
                    <ListItem>
                        {patientHistory.type}
                        <text sx={{marginLeft: 20}}>{patientHistory.descrption}</text>
                        <ButtonGroup>
                        <Fab><Edit/></Fab>
                        <Fab><Delete/></Fab>
                        </ButtonGroup>
                    </ListItem>
                    )}
                </List>
                <Button sx={{
                    display: "flex",
                    width: 143,
                    height: 49
                }} variant="contained">Save</Button>
            </Box>
            <PatientHistoryModalComponent />
        </Box>
    );
  }