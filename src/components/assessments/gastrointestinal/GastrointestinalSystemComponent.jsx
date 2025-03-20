/* Name: Charlize Aponte 
   Date: 3/14/25 
   Remarks: Gastrointestinal System Component to be displayed throughout the PATIENT ASSIGNMENT PAGE 
// */
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Checkbox,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getSectionPatientById } from "../../../services/sectionPatientService";
import {
  getGastrointestinalInfoFromPatient,
  addGastrointestinalInfoToPatient,
  updateGastrointestinalInfoForPatient,
} from "../../../services/gastrointestinalInfoService";

dayjs.extend(utc);

const GastrointestinalSystemComponent = ({ sectionId }) => {
  const [gastroData, setGastroData] = useState({
    id: "",
    right_upper_quadrant: "",
    right_lower_quadrant: "",
    lower_upper_quadrant: "",
    lower_lower_quadrant: "",
    stool: "",
    last_bowel_movement: dayjs().utc().toISOString(),
    gastric_tubic_note: "",
    nausea: false,
    diarrhea: false,
    abdomen_description: "",
  });

  const [patientId, setPatientId] = useState(null);
  const [time, setTime] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionPatient = await getSectionPatientById(sectionId);
        const fetchedPatientId = sectionPatient.id;
        setPatientId(fetchedPatientId);

        if (fetchedPatientId) {
          const data = await getGastrointestinalInfoFromPatient(
            fetchedPatientId
          );

          if (data) {
            setGastroData({
              ...data,
              last_bowel_movement: data.last_bowel_movement
                ? dayjs
                    .utc(data.last_bowel_movement)
                    .format("YYYY-MM-DD HH:mm:ss")
                : null,
              abdomen_description: data.abdomen_description
                ? data.abdomen_description
                    .split(", ")
                    .map((item) => item.trim())
                : [],
            });

            setTime(
              data.last_bowel_movement
                ? dayjs.utc(data.last_bowel_movement)
                : null
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (sectionId) {
      fetchData();
    }
  }, [sectionId]);

  const handleChange = (e, field) => {
    const { value, type, checked } = e.target;
    setGastroData((prevData) => ({
      ...prevData,
      [field]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTime = (newTime) => {
    setTime(newTime);
    setGastroData((prevData) => ({
      ...prevData,
      last_bowel_movement: newTime
        ? dayjs(newTime).utc().format("YYYY-MM-DD HH:mm:ss")
        : dayjs().utc().format("YYYY-MM-DD HH:mm:ss"),
    }));
  };

  const handleSave = async () => {
    try {
      let response;

      const formattedTime = time
        ? dayjs(time).utc().format("YYYY-MM-DD HH:mm:ss")
        : dayjs().utc().format("YYYY-MM-DD HH:mm:ss");

      const formattedCreatedDate = dayjs().utc().format("YYYY-MM-DD HH:mm:ss");
      const formattedModifiedDate = dayjs().utc().format("YYYY-MM-DD HH:mm:ss");

      const formattedAbdomenDescription = Array.isArray(
        gastroData.abdomen_description
      )
        ? gastroData.abdomen_description.join(", ")
        : gastroData.abdomen_description;

      if (patientId && !gastroData.id) {
        const { id, ...dataWithoutId } = gastroData;

        response = await addGastrointestinalInfoToPatient(patientId, {
          ...dataWithoutId,
          last_bowel_movement: formattedTime,
          created_date: formattedCreatedDate,
          modified_date: formattedModifiedDate,
          abdomen_description: formattedAbdomenDescription,
        });
      } else if (patientId && gastroData.id) {
        response = await updateGastrointestinalInfoForPatient(
          patientId,
          gastroData.id,
          {
            ...gastroData,
            last_bowel_movement: formattedTime,
            created_date: formattedCreatedDate,
            modified_date: formattedModifiedDate,
            abdomen_description: formattedAbdomenDescription,
          }
        );
      }

      if (response) {
        setGastroData({
          ...response,
          abdomen_description: response.abdomen_description
            ? response.abdomen_description
                .split(", ")
                .map((item) => item.trim())
            : [],
        });
      }
    } catch (error) {
      console.error("Error saving gastrointestinal data:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: 3,
        borderRadius: 4,
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Bowel Sounds
      </Typography>

      {/* Quadrants */}
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}
      >
        {[
          "right_upper_quadrant",
          "right_lower_quadrant",
          "lower_upper_quadrant",
          "lower_lower_quadrant",
        ].map((region) => (
          <Box
            key={region}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Typography variant="body1" fontWeight="bold">
              {region.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={gastroData[region] || ""}
                onChange={(e) => handleChange(e, region)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select an option
                </MenuItem>
                <MenuItem value="Hypoactive">Hypoactive</MenuItem>
                <MenuItem value="Hyperactive">Hyperactive</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ))}
      </Box>

      <Typography variant="h6" sx={{ mt: 3 }}>
        Abdomen Description
      </Typography>
      <FormControl fullWidth sx={{ mt: 1 }}>
        <Select
          multiple
          value={
            Array.isArray(gastroData.abdomen_description)
              ? gastroData.abdomen_description
              : []
          } // ✅ Ensure array
          onChange={(e) =>
            setGastroData({
              ...gastroData,
              abdomen_description: Array.isArray(e.target.value)
                ? e.target.value
                : e.target.value.split(", "),
            })
          }
          renderValue={(selected) =>
            Array.isArray(selected) ? selected.join(", ") : ""
          } 
        >
          <MenuItem value="soft">Soft</MenuItem>
          <MenuItem value="rigid">Rigid</MenuItem>
          <MenuItem value="distended">Distended</MenuItem>
          <MenuItem value="guarding">Guarding</MenuItem>
          <MenuItem value="obese">Obese</MenuItem>
          <MenuItem value="ascites">Ascites</MenuItem>
          <MenuItem value="tender">Tender</MenuItem>
        </Select>
      </FormControl>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1,
          mt: 3,
        }}
      >
        {/* Nausea */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body1">Nausea</Typography>
          <Checkbox
            checked={gastroData.nausea}
            onChange={(e) => handleChange(e, "nausea")}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body1">Diarrhea</Typography>
          <Checkbox
            checked={gastroData.diarrhea}
            onChange={(e) => handleChange(e, "diarrhea")}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body1">Stool</Typography>
          <FormControl fullWidth>
            <Select
              value={gastroData.stool || ""}
              onChange={(e) => handleChange(e, "stool")}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select stool type
              </MenuItem>
              <MenuItem value="loose">Loose</MenuItem>
              <MenuItem value="liquid">Liquid</MenuItem>
              <MenuItem value="blood">Blood</MenuItem>
              <MenuItem value="clay like">Clay-like</MenuItem>
              <MenuItem value="mucous">Mucous</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body1">Last BM</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker value={time} onChange={handleTime} />
          </LocalizationProvider>
        </Box>
      </Box>

      <Typography variant="h6" sx={{ mt: 3 }}>
        Gastric Tubes Notes
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={gastroData.gastric_tubic_note}
        onChange={(e) => handleChange(e, "gastric_tubic_note")}
        sx={{ mt: 1 }}
      />

      {/* Save Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        onClick={handleSave}
      >
        Submit
      </Button>
    </Box>
  );
};

export default GastrointestinalSystemComponent;
