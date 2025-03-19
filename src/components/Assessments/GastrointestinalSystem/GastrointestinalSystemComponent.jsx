/* Name: Charlize Aponte 
   Date: 3/14/25 
   Remarks: Gastrointestinal System Component to be displayed throughout the PATIENT ASSIGNMENT PAGE 
*/
import React, { useState, useEffect } from "react";
import { Box, Typography, Checkbox, Button, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import utc from "dayjs/plugin/utc"
import { getSectionPatientById } from "../../../services/sectionPatientService";
import { getGastrointestinalInfoFromPatient,
          addGastrointestinalInfoToPatient,
          updateGastrointestinalInfoForPatient,
 } from "../../../services/GastrointestinalInfoService";  
 dayjs.extend(utc);
const GastrointestinalSystemComponent = ({ sectionId }) => {
  const [gastroData, setGastroData] = useState({
    id:"",
    right_upper_quadrant: "",
    right_lower_quadrant: "",
    lower_upper_quadrant: "",
    lower_lower_quadrant: "",
    stool: "",
    last_bowel_movement: "",
    gastric_tubic_note: "",
    nausea: false,
    diarrhea: false,
    abdomen_description: "",
  });
  const [isEditingAbdomen, setIsEditingAbdomen] = useState(false);
  const [isEditingGastric, setIsEditingGastric] = useState(false);
  const [patientId, setPatientId] = useState(null); // State to hold the patient ID
  const [time, setTime] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sectionPatient and retrieve the patientId
        const sectionPatient = await getSectionPatientById(sectionId);
        const fetchedPatientId = sectionPatient.id;
        setPatientId(fetchedPatientId); // Set the patientId state

        // Fetch gastrointestinal data for the patient
        const data = await getGastrointestinalInfoFromPatient(fetchedPatientId);
        setGastroData(data);
      } catch (error) {
        console.error("Error fetching gastrointestinal data:", error);
      }
    };

    if (sectionId) {
      fetchData();
    }
  }, [sectionId]);

  function handleTime(newTime) {
    setTime(newTime);
  }

  const handleChange = (e, field) => {
    setGastroData({ ...gastroData, [field]: e.target.value });
  };

  const handleSave = async () => {
    try {
  
      const date = new Date(time.$d);
      const isoString = date.toISOString().slice(0, 19);
      
      let response;
  
      if (patientId && !gastroData.id) {
        response = await addGastrointestinalInfoToPatient(patientId, {
          ...gastroData,
          last_bowel_movement: isoString,
        });
      } else if (patientId && gastroData.id) {
        console.log("Updating gastrointestinal record:", gastroData.id);
        response = await updateGastrointestinalInfoForPatient(patientId, gastroData.id, {
          ...gastroData,
          last_bowel_movement: isoString,
        });
        console.log("Record updated:", response);
      } 
    } catch (error) {
      console.error("Error saving gastrointestinal data:", error);
    }
  };


  

  return (
    <Box sx={{ backgroundColor: "white", padding: 3, borderRadius: 4 }}>
      <Typography variant="h6">Bowel Sounds</Typography>
      <Box sx={{ display: "flex", gap: 2, my: 2 }}>
        {["right_upper_quadrant", "right_lower_quadrant", "lower_upper_quadrant", "lower_lower_quadrant"].map((region) => (
          <Box key={region} sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" fontWeight="bold" sx={{ marginRight: 1 }}>
              {region.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}
            </Typography>
            <TextField 
              value={gastroData[region]} 
              onChange={(e) => handleChange(e, region)} 
              size="small" 
              sx={{ width: "150px" }} 
            />
          </Box>
        ))}
      </Box>

      <Typography variant="h6" sx={{ mt: 2 }}>Abdomen Description</Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {isEditingAbdomen ? (
          <TextField 
            fullWidth 
            multiline 
            rows={4} 
            value={gastroData.abdomen_description} 
            onChange={(e) => handleChange(e, "abdomen_description")} 
          />
        ) : (
          <Typography>{gastroData.abdomen_description}</Typography>
        )}
        <IconButton onClick={() => setIsEditingAbdomen(!isEditingAbdomen)}>
          <EditIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <Typography variant="body1">Nausea</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Checkbox 
            checked={gastroData.nausea === true} 
            onChange={(e) => handleChange({ target: { value: e.target.checked } }, "nausea")} 
          />
          <Typography variant="body2">Yes</Typography>
          <Checkbox 
            checked={gastroData.nausea === false} 
            onChange={(e) => handleChange({ target: { value: e.target.checked } }, "nausea")} 
          />
          <Typography variant="body2">No</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4 }}>Diarrhea</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Checkbox 
            checked={gastroData.diarrhea === true} 
            onChange={(e) => handleChange({ target: { value: e.target.checked } }, "diarrhea")} 
          />
          <Typography variant="body2">Yes</Typography>
          <Checkbox 
            checked={gastroData.diarrhea === false} 
            onChange={(e) => handleChange({ target: { value: e.target.checked } }, "diarrhea")} 
          />
          <Typography variant="body2">No</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4 }}>Stool</Typography>
        <TextField value={gastroData.stool} onChange={(e) => handleChange(e, "stool")} size="small" sx={{ ml: 1, width: "100px" }} />
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Last BM"
                value={time}
                onChange= {handleTime}
              />
            </LocalizationProvider> 
      </Box>

      <Typography variant="h6" sx={{ mt: 2 }}>Gastric Tubes Notes</Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {isEditingGastric ? (
          <TextField 
            fullWidth 
            multiline 
            rows={4} 
            value={gastroData.gastric_tubic_note} 
            onChange={(e) => handleChange(e, "gastric_tubic_note")} 
          />
        ) : (
          <Typography>{gastroData.gastric_tubic_note}</Typography>
        )}
        <IconButton onClick={() => setIsEditingGastric(!isEditingGastric)}>
          <EditIcon />
        </IconButton>
      </Box>

      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSave}>Save</Button>
    </Box>
  );
};

export default GastrointestinalSystemComponent;
