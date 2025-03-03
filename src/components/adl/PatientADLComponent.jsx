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
  Menu,
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
import dayjs from "dayjs";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const repositionOptions = ["Turn Left", "Turn Right", "Back", "Self Turn"];
const eliminationOptions = ["Urinal", "Bedpan", "Commode"];

export default function PatientADLComponent({ sectionId }) {
  const [sectionPatientId, setSectionPatientId] = useState(null);
  const [adlRecords, setAdlRecords] = useState([]);
  const [sceduledTimes, setScheduledTimes] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    fetchSectionPatientId();
  }, [sectionId]);

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
      setAdlRecords(records);
      const times = records.map((record) => ({
        fullTimestamp: record.created_date,
        displayTime: dayjs(record.created_date).format("HH:mm:ss"),
      }));
      setScheduledTimes(times);
      console.log(times);
      setSectionPatientId(sectionPatient.id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = async (time, category, value) => {
    setAdlRecords((prevRecords) => {
      return prevRecords.map((record) =>
        record.created_date === time ? { ...record, [category]: value } : record
      );
    });

    try {
      const record = adlRecords.find((r) => r.created_date === time);
      if (!record) return;

      const formattedData = {
        has_oral_care: record.has_oral_care ? 1 : 0,
        has_bathed: record.has_bathed ? 1 : 0,
        reposition: record.reposition || "",
        elimination_needed: record.elimination_needed || "",
        is_meal_given: record.is_meal_given ? 1 : 0,
        amount_meal_consumed:
          record.amount_meal_consumed !== undefined
            ? parseFloat(record.amount_meal_consumed).toFixed(2)
            : "0.00",
      };

      if (record.id != null) {
        await updateADLRecord(sectionPatientId, record.id, formattedData);
      } else {
        const response = await addADLRecord(sectionPatientId, formattedData);
        setAdlRecords((prevRecords) =>
          prevRecords.map((r) =>
            r.created_date === time ? { ...r, id: response.id } : r
          )
        );
      }
    } catch (error) {
      console.error("Error updating ADL record:", error);
    }
  };

  const handleMenuOpen = (event, time) => {
    setAnchorEl(event.currentTarget);
    setSelectedTime(time);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTime(null);
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
          {/* ==== Table Headers ==== */}
          <TableHead>
            <TableRow>
              <TableCell>Patient ADL</TableCell>
              {sceduledTimes.map((timeObj) => (
                <TableCell key={timeObj.fullTimestamp} align="center">
                  {timeObj.displayTime}

                  {/* A change in the Figma: It probably makes sense to make the cell an update */}
                  <IconButton
                    size="small"
                    onClick={(event) =>
                      handleMenuOpen(event, timeObj.fullTimestamp)
                    }
                  >
                    <MoreVertIcon />
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={
                      Boolean(anchorEl) &&
                      selectedTime === timeObj.fullTimestamp
                    }
                    onClose={handleMenuClose}
                  >
                    {/* TO-DO: Add a method that should edit the specifc record*/}
                    <MenuItem
                      onClick={() => console.log(`Editing ${selectedTime}`)}
                    >
                      Edit
                    </MenuItem>
                    {/* TO-DO: Add a method that should remove the specifc record*/}
                    <MenuItem
                      onClick={() => console.log(`Deleting ${selectedTime}`)}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              ))}
              {/* TO-DO: Let's add a plus icon that allows the user to add a new row. */}
              <TableCell>ADD</TableCell>
            </TableRow>
          </TableHead>

          {/* ==== Table Body ==== */}
          <TableBody>
            {[
              { key: "has_bathed", label: "Bathing" },
              { key: "has_oral_care", label: "Oral Care" },
              { key: "reposition", label: "Reposition" },
              { key: "elimination_needed", label: "Elimination Need" },
              { key: "is_meal_given", label: "Meal Given" },
              { key: "amount_meal_consumed", label: "% of Meal Consumed" },
            ].map(({ key, label }) => (
              <TableRow key={key}>
                <TableCell>{label}</TableCell>

                {adlRecords.map((record) => (
                  <TableCell
                    key={`${key}-${record.created_date}`}
                    align="center"
                  >
                    {key === "has_oral_care" ||
                    key === "has_bathed" ||
                    key === "is_meal_given" ? (
                      <Checkbox
                        checked={record?.[key] || false}
                        onChange={(e) =>
                          handleChange(
                            record.created_date,
                            key,
                            e.target.checked
                          )
                        }
                      />
                    ) : key === "reposition" || key === "elimination_needed" ? (
                      <TextField
                        variant="outlined"
                        size="small"
                        value={record?.[key] || ""}
                        onChange={(e) =>
                          handleChange(record.created_date, key, e.target.value)
                        }
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    ) : key === "amount_meal_consumed" ? (
                      <TextField
                        variant="outlined"
                        size="small"
                        type="text"
                        placeholder="%"
                        sx={{ width: 60 }}
                        value={record?.amount_meal_consumed || ""}
                        onChange={(e) =>
                          handleChange(record.created_date, key, e.target.value)
                        }
                      />
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
