//Gabby Pierce
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
import { Delete, Add } from "@mui/icons-material";
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
  const [scheduledTimes, setScheduledTimes] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    fetchSectionPatientId();
  }, [sectionId]);

  // Fetch the patient and ADL records
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
      setSectionPatientId(sectionPatient.id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = async (time, category, value) => {
    // Find the current record (it may be stale, so we immediately compute an updated copy)
    const record = adlRecords.find((r) => r.created_date === time);
    if (!record) return;
    // Create an updated record with the new value
    const updatedRecord = { ...record, [category]: value };

    // Optimistically update the UI state using the computed updated record
    setAdlRecords((prevRecords) =>
      prevRecords.map((r) =>
        r.created_date === time ? updatedRecord : r
      )
    );

    // Prepare the formatted data for the API call using updatedRecord
    const formattedData = {
      has_oral_care: updatedRecord.has_oral_care ? 1 : 0,
      has_bathed: updatedRecord.has_bathed ? 1 : 0,
      reposition: updatedRecord.reposition || "",
      elimination_needed: updatedRecord.elimination_needed || "",
      is_meal_given: updatedRecord.is_meal_given ? 1 : 0,
      amount_meal_consumed:
        updatedRecord.amount_meal_consumed !== undefined
          ? parseFloat(updatedRecord.amount_meal_consumed).toFixed(2)
          : "0.00",
    };

    try {
      if (updatedRecord.id != null) {
        // Update the record if it exists in the DB
        await updateADLRecord(sectionPatientId, updatedRecord.id, formattedData);
      } else {
        // If the record is new, add it and update the state with its new ID
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


  // Open the menu for delete action
  const handleMenuOpen = (event, time) => {
    setAnchorEl(event.currentTarget);
    setSelectedTime(time);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTime(null);
  };

  // New function to delete a record
  const handleDeleteRecord = async (time) => {
    try {
      const record = adlRecords.find((r) => r.created_date === time);
      if (!record) return;
      if (record.id != null) {
        await deleteADLRecord(sectionPatientId, record.id);
      }
      // Remove the record and its corresponding scheduled time
      setAdlRecords((prevRecords) =>
        prevRecords.filter((r) => r.created_date !== time)
      );
      setScheduledTimes((prevTimes) =>
        prevTimes.filter((t) => t.fullTimestamp !== time)
      );
      handleMenuClose();
    } catch (error) {
      console.error("Error deleting ADL record:", error);
    }
  };

  // Function to add a new ADL record with default values
  const handleAddRecord = () => {
    const newRecord = {
      created_date: dayjs().toISOString(),
      has_oral_care: false,
      has_bathed: false,
      reposition: "",
      elimination_needed: "",
      is_meal_given: false,
      amount_meal_consumed: "0.00",
      id: null,
    };
    // Insert new record at the beginning so it appears at the top
    setAdlRecords((prev) => [newRecord, ...prev]);
    setScheduledTimes((prev) => [
      {
        fullTimestamp: newRecord.created_date,
        displayTime: dayjs(newRecord.created_date).format("HH:mm:ss"),
      },
      ...prev,
    ]);
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
              {scheduledTimes.map((timeObj) => (
                <TableCell key={timeObj.fullTimestamp} align="center">
                  {timeObj.displayTime}
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
                    {/* Removed "Edit" option since inline editing is always allowed */}
                    <MenuItem onClick={() => handleDeleteRecord(selectedTime)}>
                      Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              ))}
              {/* Plus button to create a new record */}
              <TableCell align="center">
                <IconButton onClick={handleAddRecord}>
                  <Add />
                </IconButton>
              </TableCell>
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
                  <TableCell key={`${key}-${record.created_date}`} align="center">
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
                      <Select
                        value={record?.[key] || ""}
                        onChange={(e) =>
                          handleChange(record.created_date, key, e.target.value)
                        }
                        size="small"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {(key === "reposition"
                          ? repositionOptions
                          : eliminationOptions
                        ).map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
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
