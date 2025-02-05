import { Button, CardActions, CardContent, CardHeader, FormControl, MenuItem, Modal, Select, TextField } from "@mui/material";
import React, { useState, useForm } from "react";
import ReactModal from "react";
import { addPatientHistory } from "../../services/patientHistoryService";
import { getPatientById } from "../../services/patientService";

export default function PatientHistoryModalComponent() {

   /* const {
            handleSubmit,
            formState: { errors },
            setValue,
          } = useForm();*/

    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [historyType, setHistoryType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [usable, setUsable] = useState(false);

   /* const onSubmit = async (data) => {
        
    } */


    function handleTitle(event){
        setTitle(event.target.value);
    }

    function handleDescription(event){
        setTitle(event.target.value);
    }

    function handleHistoryType(event){
        setTitle(event.target.value);
    } 


    return(

        <div>
            <Modal sx={{
                display: "flex",
                width: 809,
                height: 793,
                flexDirection: "column",
                alignItems: "flex-start"
            }}>
                <CardHeader sx={{
                    display: "flex",
                    padding: 16,
                    alignItems: "center",
                    alignSelf: "stretch"
                }}>
                    Add Patient History
                </CardHeader>
                <CardContent>
                    <div>
                        <text>Title</text>
                        <TextField /*value={title} onSubmit={handleTitle}*//>
                    </div>
                    <div>
                        <text>Description</text>
                        <TextField rows={4} /*value={description} onSubmit={handleDescription}*//>
                    </div>
                    <div>
                        <text>History Type</text>
                        <FormControl>
                        <Select /*value={historyType} onSubmit={handleHistoryType}*/>
                            <MenuItem value={"Primary Admitting Diagnosis"}>Primary Admitting Diagnosis</MenuItem>
                            <MenuItem value={"Family Heath History"}>Family Heath History</MenuItem>
                            <MenuItem value={"Social History"}>Social History</MenuItem>
                            <MenuItem value={"Medical/Surgical History"}>Medical/Surgical History</MenuItem>
                        </Select>
                        </FormControl>
                    </div>
                </CardContent>
                <CardActions>
                    <Button color="red">Cancel</Button>
                    <Button color="blue">Save</Button>
                </CardActions>
            </Modal>
        </div>
    );
  }