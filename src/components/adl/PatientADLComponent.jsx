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
  Menu,
  MenuItem,
  Checkbox,
  TextField,
  Modal,
  Button,
  Typography,
  InputLabel,
} from "@mui/material";
import { Add, Label } from "@mui/icons-material";
import {
  addADLRecord,
  deleteADLRecord,
  getADLRecords,
  updateADLRecord,
} from "../../services/patientADLService";
import { getSectionPatientById } from "../../services/sectionPatientService";
import dayjs from "dayjs";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function PatientADLComponent({ sectionId }) {
  const [sectionPatientId, setSectionPatientId] = useState(null);
  const [adlRecords, setAdlRecords] = useState([]);
  const [scheduledTimes, setScheduledTimes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [newRecord, setNewRecord] = useState({
    has_bathed: false,
    reposition: "",
    elimination_needed: "",
    is_meal_given: false,
    amount_meal_consumed: "0.00",
  });

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

  // Open Add Modal
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  // Close Add Modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setNewRecord({
      has_oral_care: false,
      has_bathed: false,
      reposition: "",
      elimination_needed: "",
      is_meal_given: false,
      amount_meal_consumed: "0.00",
    });
  };

  // Save new ADL record
  const handleSaveRecord = async () => {
    try {
      const formattedData = {
        has_oral_care: 0,
        has_bathed: newRecord.has_bathed ? 1 : 0,
        reposition: newRecord.reposition || "",
        elimination_needed: newRecord.elimination_needed || "",
        is_meal_given: newRecord.is_meal_given ? 1 : 0,
        amount_meal_consumed: parseFloat(
          newRecord.amount_meal_consumed
        ).toFixed(2),
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

  const handleDeleteADLRecord = async (id) => {
    try {
      await deleteADLRecord(sectionPatientId, id);

      // Update UI state by filtering out the deleted record
      setAdlRecords((prevRecords) => prevRecords.filter((r) => r.id !== id));

      // Also update scheduled times to remove the deleted record
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

  const handleUpdateADLRecord = async (id, data) => {
    try {
      const response = await updateADLRecord(sectionPatientId, id, data);
      // update the adl records we display
      setAdlRecords((prevRecords) =>
        prevRecords.map((r) => (r.id === id ? { ...r, ...response } : r))
      );
    } catch (error) {
      console.error(error);
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
          <TableHead>
            <TableRow>
              <TableCell>Patient ADL</TableCell>
              {scheduledTimes.map((timeObj) => (
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
                    open={Boolean(anchorEl) && selectedTime !== null}
                    onClose={handleMenuClose}
                  >
                    {/* Delete Method */}
                    <MenuItem
                      onClick={() => {
                        const recordToDelete = adlRecords.find(
                          (record) => record.created_date === selectedTime
                        );
                        if (recordToDelete) {
                          handleDeleteADLRecord(recordToDelete.id);
                        }
                        handleMenuClose();
                      }}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              ))}
              <TableCell align="center">
                <IconButton onClick={handleOpenModal}>
                  <Add />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {[
              { key: "has_bathed", label: "Bathing" },
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
                    {key === "has_bathed" || key === "is_meal_given" ? (
                      <Checkbox
                        checked={record?.[key] || false}
                        onChange={(e) =>
                          handleUpdateADLRecord(record.id, {
                            [key]: e.target.checked,
                          })
                        }
                      />
                    ) : (
                      <TextField
                        variant="outlined"
                        size="small"
                        value={record?.[key] || ""}
                        onChange={(e) =>
                          setAdlRecords((prevRecords) =>
                            prevRecords.map((r) =>
                              r.id === record.id
                                ? { ...r, [key]: e.target.value }
                                : r
                            )
                          )
                        }
                        onBlur={() =>
                          handleUpdateADLRecord(record.id, {
                            [key]: record[key],
                          })
                        }
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Adding New Record */}
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
            Add New ADL Record
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Checkbox
              checked={newRecord.has_bathed}
              onChange={(e) =>
                setNewRecord({ ...newRecord, has_bathed: e.target.checked })
              }
            />
            <Typography variant="body1">Has Bathed</Typography>
          </Box>

          <TextField
            label="Reposition"
            fullWidth
            margin="normal"
            value={newRecord.reposition}
            onChange={(e) =>
              setNewRecord({ ...newRecord, reposition: e.target.value })
            }
          />
          <TextField
            label="Elimination Need"
            fullWidth
            margin="normal"
            value={newRecord.elimination_needed}
            onChange={(e) =>
              setNewRecord({ ...newRecord, elimination_needed: e.target.value })
            }
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Checkbox
              checked={newRecord.is_meal_given}
              onChange={(e) =>
                setNewRecord({ ...newRecord, is_meal_given: e.target.checked })
              }
            />
            <Typography variant="body1">Meal Given</Typography>
          </Box>

          <TextField
            label="% of Meal Consumed"
            fullWidth
            margin="normal"
            value={newRecord.amount_meal_consumed}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                amount_meal_consumed: e.target.value,
              })
            }
          />
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              onClick={handleCloseModal}
              color="error"
              sx={{ marginRight: 1 }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveRecord} color="primary">
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
