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
  Box,
  Checkbox,
  TextField,
  Modal,
  Button,
  Typography,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addADLRecord,
  deleteADLRecord,
  getADLRecords,
  updateADLRecord,
} from "../../services/patientADLService";
import { getSectionPatientById } from "../../services/sectionPatientService";
import dayjs from "dayjs";

export default function PatientADLComponent({ sectionId }) {
  // State for patient/records
  const [sectionPatientId, setSectionPatientId] = useState(null);
  const [adlRecords, setAdlRecords] = useState([]);
  const [scheduledTimes, setScheduledTimes] = useState([]);
  // Modal state & record state
  const [modalOpen, setModalOpen] = useState(false);
  // newRecord for adding and editing; when editing, editingRecord will be non-null.
  const [newRecord, setNewRecord] = useState({
    has_oral_care: false,
    has_bathed: false,
    has_foley_care: false,
    reposition: "",
    elimination_needed: "",
    is_meal_given: false,
    amount_meal_consumed: "0.00",
  });
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    fetchSectionPatientId();
  }, [sectionId]);

  // Get the section patient ID and ADL records
  const fetchSectionPatientId = async () => {
    try {
      const sectionPatient = await getSectionPatientById(sectionId);
      const records = await getADLRecords(sectionPatient.id);
      setAdlRecords(records);
      setScheduledTimes(
        records.map((record) => ({
          fullTimestamp: record.created_date,
          displayTime: dayjs(record.created_date).format("HH:mm:ss"),
        }))
      );
      setSectionPatientId(sectionPatient.id);
    } catch (error) {
      console.error(error);
    }
  };

  // Open modal in add mode
  const handleOpenModal = () => {
    setEditingRecord(null);
    setNewRecord({
      has_oral_care: false,
      has_bathed: false,
      has_foley_care: false,
      reposition: "",
      elimination_needed: "",
      is_meal_given: false,
      amount_meal_consumed: "0.00",
    });
    setModalOpen(true);
  };

  // Open modal in edit mode for a specific record
  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setModalOpen(true);
  };

  // Close modal and reset record state
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
    setNewRecord({
      has_oral_care: false,
      has_bathed: false,
      has_foley_care: false,
      reposition: "",
      elimination_needed: "",
      is_meal_given: false,
      amount_meal_consumed: "0.00",
    });
  };

  // Save new record (from add mode)
  const handleSaveRecord = async () => {
    try {
      const formattedData = {
        has_oral_care: newRecord.has_oral_care ? 1 : 0,
        has_bathed: newRecord.has_bathed ? 1 : 0,
        has_foley_care: newRecord.has_foley_care ? 1 : 0,
        reposition: newRecord.reposition || "",
        elimination_needed: newRecord.elimination_needed || "",
        is_meal_given: newRecord.is_meal_given ? 1 : 0,
        amount_meal_consumed: parseFloat(newRecord.amount_meal_consumed).toFixed(2),
      };

      const response = await addADLRecord(sectionPatientId, formattedData);

      setAdlRecords((prevRecords) => [
        ...prevRecords,
        {
          ...formattedData,
          created_date: dayjs().toISOString(),
          id: response.id,
        },
      ]);

      setScheduledTimes((prevTimes) => [
        ...prevTimes,
        {
          fullTimestamp: dayjs().toISOString(),
          displayTime: dayjs().format("HH:mm:ss"),
        },
      ]);

      handleCloseModal();
    } catch (error) {
      console.error("Error adding ADL record:", error);
    }
  };

  // Save edits from modal (edit mode)
  const handleSaveEditRecord = async () => {
    try {
      const updatedData = {
        has_oral_care: editingRecord.has_oral_care ? 1 : 0,
        has_bathed: editingRecord.has_bathed ? 1 : 0,
        has_foley_care: editingRecord.has_foley_care ? 1 : 0,
        reposition: editingRecord.reposition || "",
        elimination_needed: editingRecord.elimination_needed || "",
        is_meal_given: editingRecord.is_meal_given ? 1 : 0,
        amount_meal_consumed: parseFloat(editingRecord.amount_meal_consumed).toFixed(2),
      };

      const response = await updateADLRecord(sectionPatientId, editingRecord.id, updatedData);
      // Update local state for the record
      setAdlRecords((prevRecords) =>
        prevRecords.map((r) => (r.id === editingRecord.id ? { ...r, ...response } : r))
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error updating ADL record:", error);
    }
  };

  // Delete a record
  const handleDeleteADLRecord = async (id) => {
    try {
      await deleteADLRecord(sectionPatientId, id);
      setAdlRecords((prevRecords) => prevRecords.filter((r) => r.id !== id));
      setScheduledTimes((prevTimes) =>
        prevTimes.filter(
          (t) =>
            !adlRecords.some(
              (r) => r.id === id && r.created_date === t.fullTimestamp
            )
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Helper to update field value in modal (whether in add or edit mode)
  const updateField = (key, value) => {
    if (editingRecord) {
      setEditingRecord({ ...editingRecord, [key]: value });
    } else {
      setNewRecord({ ...newRecord, [key]: value });
    }
  };

  // Determine if we are editing an existing record or adding a new one
  const isEditing = editingRecord !== null;
  const recordData = isEditing ? editingRecord : newRecord;

  return (
    <Box sx={{ position: "relative", backgroundColor: "white", borderRadius: 2, padding: 2 }}>
      {/* Top bar: Add button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <IconButton onClick={handleOpenModal}>
          <Add />
        </IconButton>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient ADL</TableCell>
              {scheduledTimes.map((timeObj) => {
                const record = adlRecords.find(
                  (r) => r.created_date === timeObj.fullTimestamp
                );
                return (
                  <TableCell key={timeObj.fullTimestamp} align="center">
                    {timeObj.displayTime}
                    {record && (
                      <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                        <IconButton size="small" onClick={() => handleEditRecord(record)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteADLRecord(record.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </TableCell>
                );
              })}
              <TableCell align="center">{/* Extra cell not used */}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {[
              { key: "has_bathed", label: "Bathing" },
              { key: "has_foley_care", label: "Foley Care" },
              { key: "reposition", label: "Reposition" },
              { key: "elimination_needed", label: "Elimination Need" },
              { key: "is_meal_given", label: "Meal Given" },
              { key: "amount_meal_consumed", label: "% of Meal Consumed" },
            ].map(({ key, label }) => (
              <TableRow key={key}>
                <TableCell>{label}</TableCell>
                {adlRecords.map((record) => (
                  <TableCell key={`${key}-${record.created_date}`} align="center">
                    {
                      (key === "has_bathed" || key === "is_meal_given" || key === "has_foley_care")
                        ? (
                          <Checkbox checked={record?.[key] || false} disabled />
                        ) : (
                          <Typography variant="body2">
                            {record?.[key] || ""}
                          </Typography>
                        )
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Adding or Editing ADL Record */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            width: 400,
            padding: 3,
            backgroundColor: "white",
            margin: "auto",
            marginTop: "10%",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" gutterBottom textAlign="center">
            {isEditing ? "Edit ADL Record" : "Add New ADL Record"}
          </Typography>

          {/* Has Bathed Checkbox */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Checkbox
              checked={recordData.has_bathed}
              onChange={(e) => updateField("has_bathed", e.target.checked)}
            />
            <Typography variant="body1">Has Bathed</Typography>
          </Box>

          {/* Has Foley Care Checkbox */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Checkbox
              checked={recordData.has_foley_care}
              onChange={(e) => updateField("has_foley_care", e.target.checked)}
            />
            <Typography variant="body1">Foley Care</Typography>
          </Box>

          {/* Oral Care Checkbox */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Checkbox
              checked={recordData.has_oral_care}
              onChange={(e) => updateField("has_oral_care", e.target.checked)}
            />
            <Typography variant="body1">Oral Care</Typography>
          </Box>

          {/* Reposition Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Reposition</InputLabel>
            <Select
              value={recordData.reposition}
              onChange={(e) => updateField("reposition", e.target.value)}
              label="Reposition"
            >
              <MenuItem value="turn left">Turn Left</MenuItem>
              <MenuItem value="turn right">Turn Right</MenuItem>
              <MenuItem value="back">Back</MenuItem>
              <MenuItem value="self turn">Self Turn</MenuItem>
            </Select>
          </FormControl>

          {/* Elimination Given Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Elimination Given</InputLabel>
            <Select
              value={recordData.elimination_needed}
              onChange={(e) => updateField("elimination_needed", e.target.value)}
              label="Elimination Given"
            >
              <MenuItem value="urinal">Urinal</MenuItem>
              <MenuItem value="bedpan">Bedpan</MenuItem>
              <MenuItem value="commode">Commode</MenuItem>
            </Select>
          </FormControl>

          {/* Meal Given Checkbox */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Checkbox
              checked={recordData.is_meal_given}
              onChange={(e) => updateField("is_meal_given", e.target.checked)}
            />
            <Typography variant="body1">Meal Given</Typography>
          </Box>

          {/* % of Meal Consumed */}
          <TextField
            label="% of Meal Consumed"
            fullWidth
            margin="normal"
            value={recordData.amount_meal_consumed}
            onChange={(e) => updateField("amount_meal_consumed", e.target.value)}
          />

          <Box display="flex" justifyContent="center" mt={2}>
            <Button onClick={handleCloseModal} color="error" sx={{ marginRight: 1 }}>
              Cancel
            </Button>
            <Button
              onClick={isEditing ? handleSaveEditRecord : handleSaveRecord}
              color="primary"
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
