/*
Name: Dylan Bellinger
Remarks: Edit modal for PRN table.
Date Picker: https://mui.com/x/react-date-pickers/date-time-picker/
*/
import {
    Button,
    CardActions,
    CardContent,
    CardHeader,
    FormControl,
    MenuItem,
    Modal,
    Select,
    TextField,
    Typography,
    Card,
  } from "@mui/material";
  import React, { useState, useEffect } from "react";
  import { updatePatientMedication } from "../../services/patientMedicationsService";
  import { getMedications } from "../../services/medicationsService";
  import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
  import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
  import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
  import { useForm } from "react-hook-form";

  export default function PatientPRNEditModalComponent({
    open,
    onClose,
    sectionPatientID,
    editedMed,
    refreshPatientMedication,
  }) {
           const [med, setMed] = useState("");
           const [medications, setMedications] = useState([]);
           const [dose, setDose] = useState("");
           const [route, setRoute] = useState("");
           const [frequency, setFrequency] = useState("");
           const [loading, setLoading] = useState(false);
           const [error, setError] = useState(null);
           const [time, setTime] = useState(null);
         
           const {
             register,
             handleSubmit,
             formState: { errors },
           } = useForm();
         
           const fetchMedications = async () => {
                   try {
                     const medData = await getMedications();
                     setMedications(medData);
                   } catch (err) {
                     throw err;
                   }
               };
       
               useEffect(() => {
                   fetchMedications();
               }, [medications]);
       
           function handleMed(event) {
             setMed(event.target.value);
           };
         
           function handleDose(event) {
             setDose(event.target.value);
           };
         
           function handleRoute(event) {
             setRoute(event.target.value);
           };
       
           function handleFrequency(event) {
               setFrequency(event.target.value);
             };
       
           function handleTime(event) {
               setTime(event.target.value);
             };
         
           const onSubmit = async () => {
             setLoading(true);
             try {
               await new Promise((resolve) => setTimeout(resolve, 1000));
         
               await updatePatientMedication(sectionPatientID, editedMed, {
                 medications_id: med,
                 medication_type: 'PRN',
                 scheduled_time: time,
                 dose: dose,
                 route: route,
                 dose_frequency: frequency
               });
               onClose();
               setMed("");
               setDose("");
               setRoute("");
               setFrequency("");
               setTime(null);
               refreshPatientMedication();
             } catch (err) {
               throw err;
             } finally {
               setLoading(false);
             }
           };
         
           return (
             <Modal
               open={open}
               onClose={onClose}
               sx={{
                 display: "flex",
                 alignItems: "flex-start",
                 justifyContent: "center",
                 marginTop: 10,
               }}
             >
               <Card variant="outlined" sx={{ padding: 2 }}>
                 <CardHeader
                   sx={{
                     display: "flex",
                     alignItems: "center",
                     alignSelf: "stretch",
                   }}
                   title="Edit Patient PRN Medicine"
                 />
                 <CardContent>
                 <div style={{ marginTop: 16 }}>
                     <Typography>Drug Name</Typography>
                     <FormControl fullWidth>
                       <Select
                         value={med}
                         onChange={handleMed}
                       >
                   {medications.map((medication) => (
                         <MenuItem value={medication.id}>
                         {medication.drug_name}
                       </MenuItem>
                           ))}
                       </Select>
                     </FormControl>
                   </div>
                   <div>
                       <Typography>Scheduled Time</Typography>
                       <LocalizationProvider dateAdapter={AdapterDayjs}>
                       <DateTimePicker
                 label="Controlled picker"
                 value={time}
                 onChange={handleTime}
               />
                       </LocalizationProvider>
                   </div>
                   <div>
                     <Typography>Route</Typography>
                     <Select
                       value={route}
                       onChange={handleRoute}
                       fullWidth
                     >
                      <MenuItem value={"PO"}>
                                        PO
                                      </MenuItem>
                                      <MenuItem value={"TUBE-FEEDING"}>TUBE FEEDING</MenuItem>
                                      <MenuItem value={"IV"}>IV</MenuItem> 
                     </Select>
                   </div>
                   <div style={{ marginTop: 16 }}>
                     <Typography>Dose</Typography>
                     <TextField
                       value={dose}
                       onChange={handleDose}
                       fullWidth
                     />
                   </div>
                   <div style={{ marginTop: 16 }}>
                     <Typography>Dose Frequency</Typography>
                     <TextField
                       value={frequency}
                       onChange={handleFrequency}
                       fullWidth
                     />
                   </div>
                 </CardContent>
                 <CardActions
                   sx={{
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                   }}
                 >
                   <Button color="error" variant="contained" onClick={onClose}>
                     Cancel
                   </Button>
                   <Button
                     type="submit"
                     color="primary"
                     variant="contained"
                     onClick={onSubmit}
                   >
                     Save
                   </Button>
                 </CardActions>
               </Card>
             </Modal>
           ); 
  }