/*
Name: TO-DO
Date: TO-DO
Remark: Patient ADL Component that's responsible for adding a patient's ADL information
*/
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Select,
  MenuItem,
  Checkbox,
  TextField,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import {
  addADLRecord,
  getADLRecords,
  updateADLRecord,
  deleteADLRecord,
} from "../../services/patientADLService";
import { getSectionPatientById } from "../../services/sectionPatientService";

const SCHEDULED_TIMES = [
  "04:00",
  "06:00",
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
];
const repositionOptions = ["Turn Left", "Turn Right", "Back", "Self Turn"];
const eliminationOptions = ["Urinal", "Bedpan", "Commode"];

export default function PatientADLComponent({ sectionId }) {
  const [sectionPatientId, setSectionPatientId] = useState(null);
  const [adlRecords, setAdlRecords] = useState([]);

  useEffect(() => {
      fetchSectionPatientId();
  }, []);

  /*
  For educational purposes: This is the process behind getting data from our endpoints: 
  1. We get the section id from the url. 
  2. We set the section patient based on what we get from the backend
  3. We call the endpoint we're interested in (i.e. ADL record) and pass in the retrieved section patient id.
  */
  const fetchSectionPatientId = async () => {
    try {
      const sectionPatient = await getSectionPatientById(sectionId);
      const records = await getADLRecords(sectionPatient.id);
      console.log(records);
      setSectionPatientId(sectionPatient.id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = async (time, category, value) => {
    let updatedRecords = [...adlRecords];
    let recordIndex = updatedRecords.findIndex((rec) => rec.timestamp === time);

    if (recordIndex === -1) {
      const newRecord = {
        timestamp: time,
        section_patient_id: sectionPatientId,
        oralCare: false,
        bathing: false,
        reposition: "",
        eliminationNeed: "",
        mealGiven: false,
        percentMealConsumed: "",
      };
      updatedRecords.push(newRecord);
      recordIndex = updatedRecords.length - 1;
    }

    updatedRecords[recordIndex] = {
      ...updatedRecords[recordIndex],
      [category]: value,
    };

    setAdlRecords(updatedRecords);

    try {
      const record = updatedRecords[recordIndex];

      const formattedData = {
        section_patient_id: sectionPatientId,
        has_oral_care: record.oralCare ? 1 : 0,
        has_bathed: record.bathing ? 1 : 0,
        reposition: record.reposition || "",
        elimination_needed: record.eliminationNeed || "",
        is_meal_given: record.mealGiven ? 1 : 0,
        amount_meal_consumed:
          record.percentMealConsumed !== undefined
            ? parseFloat(record.percentMealConsumed).toFixed(2)
            : "0.00",
        created_by: localStorage.getItem("USER_ID")
          ? JSON.parse(localStorage.getItem("USER_ID")).id
          : null,
        modified_by: localStorage.getItem("USER_ID")
          ? JSON.parse(localStorage.getItem("USER_ID")).id
          : null,
      };

      if (record.id) {
        console.log(`Updating ADL Record [ID: ${record.id}]`);
        await updateADLRecord(sectionPatientId, record.id, formattedData);
      } else {
        console.log("Creating New ADL Record...");
        const response = await addADLRecord(sectionPatientId, formattedData);
        updatedRecords[recordIndex].id = response.id;
      }
    } catch (error) {
      console.error("Error updating ADL record:", error);
    }
  };

  return (
      <Box
        sx={{
          position: "relative",
          backgroundColor: "white",
          borderRadius: 2,
          padding: 2,
        }}
      >
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient ADL</TableCell>
                {SCHEDULED_TIMES.map((time) => (
                  <TableCell key={time} align="center">
                    {time}
                  </TableCell>
                ))}
                <TableCell align="center">Actions</TableCell>
                {/* TO-DO: Let's add a plus icon that allows the user to add a new row. */}
                <TableCell>ADD</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                "bathing",
                "oralCare",
                "reposition",
                "eliminationNeed",
                "mealGiven",
                "percentMealConsumed",
              ].map((category) => (
                <TableRow key={category}>
                  <TableCell>
                    {category === "oralCare"
                      ? "Oral Care"
                      : category === "bathing"
                      ? "Bathing"
                      : category === "reposition"
                      ? "Reposition"
                      : category === "eliminationNeed"
                      ? "Elimination Need"
                      : category === "mealGiven"
                      ? "Meal Given"
                      : "% of Meal Consumed"}
                  </TableCell>
                  {SCHEDULED_TIMES.map((time) => (
                    <TableCell key={`${category}-${time}`} align="center">
                      {category === "oralCare" ||
                      category === "bathing" ||
                      category === "mealGiven" ? (
                        <Checkbox
                          checked={
                            adlRecords?.find((r) => r.timestamp === time)?.[
                              category
                            ] || false
                          }
                          onChange={(e) =>
                            handleChange(time, category, e.target.checked)
                          }
                        />
                      ) : category === "reposition" ? (
                        <Select
                          value={
                            adlRecords?.find((r) => r.timestamp === time)
                              ?.reposition || ""
                          }
                          onChange={(e) =>
                            handleChange(time, category, e.target.value)
                          }
                          size="small"
                        >
                          {repositionOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : category === "eliminationNeed" ? (
                        <Select
                          value={
                            adlRecords?.find((r) => r.timestamp === time)
                              ?.eliminationNeed || ""
                          }
                          onChange={(e) =>
                            handleChange(time, category, e.target.value)
                          }
                          size="small"
                        >
                          {eliminationOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : category === "percentMealConsumed" ? (
                        <TextField
                          variant="outlined"
                          size="small"
                          type="text"
                          placeholder="%"
                          sx={{ width: 60 }}
                          value={
                            adlRecords?.find((r) => r.timestamp === time)
                              ?.percentMealConsumed || ""
                          }
                          onChange={(e) =>
                            handleChange(time, category, e.target.value)
                          }
                        />
                      ) : null}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <IconButton color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
  );
}
