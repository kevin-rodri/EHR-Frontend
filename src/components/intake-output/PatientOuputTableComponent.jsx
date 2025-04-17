/*
Name: Dylan Bellinger
Date: 4/2/2025
Remarks: The Patient Output component for displaying patient output information.
*/
import React, { useState, useEffect, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  getPatientOutput,
  addPatientInputOutput,
  updatePatientInputOutput,
  deletePatientInputOutput,
} from "../../services/intakeAndOutputService";
import { getSectionPatientById } from "../../services/sectionPatientService";
import { getUserRole } from "../../services/authService";
import { getPatientById } from "../../services/patientService";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { formatDateTime } from "../../utils/date-time-formatter";
import DeleteConfirmationModal from "../utils/DeleteModalComponent";
dayjs.extend(utc);

export default function PatientOutputTableComponent({ sectionId }) {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [outputs, setOutputs] = useState([]);
  const [patient, setPatient] = useState(null);
  const [medications, setMedications] = useState([]);
  const [sectionPatientId, setSectionPatientId] = useState(null);
  const [display, setDisplay] = useState(false);

  const [newOutput, setNewOutput] = useState({
    id: "",
    section_patient_id: "",
    type: "",
    intake_or_output: "OUTPUT",
    amount: "",
    date_and_time_taken: "",
  });

  const columns = useMemo(
    () => [
      { accessorKey: "type", header: "Type", size: 150 },
      { accessorKey: "amount", header: "Amount", size: 150 },
      {
        accessorKey: "date_and_time_taken",
        header: "Date and Time",
        size: 150,
        Cell: ({ cell }) => formatDateTime(cell.getValue()),
      },
      ...(display
        ? [
            {
              accessorKey: "actions",
              header: "Actions",
              maxSize: 75,
              enableSorting: false,
              Cell: ({ row }) => (
                <Box>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpenModal(row, "edit")}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => handleOpenModal(row, "delete")}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ),
            },
          ]
        : []),
    ],
    [display]
  );

  const fetchOutputRecords = async () => {
    try {
      const sectionPatient = await getSectionPatientById(sectionId);
      const sectionPatientId = sectionPatient.id;
      const patientData = await getPatientOutput(sectionPatientId);
      const patientInfo = await getPatientById(sectionPatient.patient_id);

      setOutputs(patientData);
      setPatient(patientInfo);
      setSectionPatientId(sectionPatientId);
    } catch (err) {
      console.error("Error fetching output records:", err);
    }
  };

  useEffect(() => {
    if (sectionId == null) return;
    const role = getUserRole();
    if (role === "STUDENT" || role === "ADMIN" || role === "INSTRUCTOR") {
      setDisplay(true);
    }
    fetchOutputRecords();
  }, [sectionId]);

  const handleOpenModal = (row = null, action = "edit") => {
    if (action === "edit") {
      setEditingRow(row);
      if (row) {
        setNewOutput({
          id: row.original.id,
          section_patient_id: row.original.section_patient_id,
          type: row.original.type,
          scheduled_time: row.original.scheduled_time,
          amount: row.original.amount,
          date_and_time_taken: row.original.date_and_time_taken,
        });
      } else {
        setNewOutput({
          id: "",
          section_patient_id: sectionPatientId,
          type: "",
          intake_or_output: "OUTPUT",
          amount: "",
          date_and_time_taken: "",
        });
      }
      setOpenModal(true);
    } else if (action === "delete") {
      setDeletingRow(row);
      setOpenDeleteModal(true);
    }
  };

  const handleSave = async () => {
    try {
      const formattedOutputTime = dayjs(newOutput.date_and_time_taken)
        .utc()
        .format("YYYY-MM-DD HH:mm:ss");
        const parsedAmount = parseFloat(newOutput.amount);
  
      const recordToSend = {
        section_patient_id: sectionPatientId,
        type: newOutput.type,
        intake_or_output: "OUTPUT",
        amount: parsedAmount,
        date_and_time_taken: formattedOutputTime,
      };

      if (editingRow) {
        await updatePatientInputOutput(
          sectionPatientId,
          editingRow.original.id,
          recordToSend
        );

        const updatedRecordWithDetails = {
          ...recordToSend,
          id: editingRow.original.id,
        };

        setOutputs((prevData) =>
          prevData.map((item) =>
            item.id === editingRow.original.id ? updatedRecordWithDetails : item
          )
        );
      } else {
        const response = await addPatientInputOutput(
          sectionPatientId,
          recordToSend
        );

        if (response && response.id) {
          const newRecordWithDetails = {
            ...recordToSend,
            id: response.id,
          };

          setOutputs((prevData) => [...prevData, newRecordWithDetails]);
        } else {
          console.error(
            "Error: API did not return an ID for the created record."
          );
          return;
        }
      }
      setOpenModal(false);
    } catch (error) {
      console.error("Error saving output record:", error);
    }
  };

  const handleDelete = async () => {
    await deletePatientInputOutput(sectionPatientId, deletingRow.original.id);
    setOutputs(outputs.filter((item) => item.id !== deletingRow.original.id));
    setOpenDeleteModal(false);
  };

  const table = useMaterialReactTable({
    columns,
    data: outputs,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnFilters: false,
    enableFilterMatchHighlighting: false,
    renderTopToolbarCustomActions: () => (
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title="Add Output Record">
          <IconButton onClick={() => handleOpenModal()}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  return (
    <Box>
      <MaterialReactTable table={table} />
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle align="center">
          {editingRow ? "Edit Patient Output Record" : "Add Patient Output Record"}
        </DialogTitle>
        <DialogContent>
          <Select
            displayEmpty
            value={newOutput.type}
            fullWidth
            sx={{ marginTop: 1 }}
            margin="dense"
            required
            error={newOutput.type === ""}
            onChange={(e) =>
              setNewOutput({
                ...newOutput,
                type: e.target.value,
              })
            }
            renderValue={(selected) =>
              selected ? selected : <span style={{ color: "#757575" }}>Select Type</span>
            }
          >
            <MenuItem value="URINE VOIDED">URINE VOIDED</MenuItem>
            <MenuItem value="FOLEY">FOLEY</MenuItem>
          </Select>

          <TextField
            label="Amount"
            value={newOutput.amount}
            onChange={(e) =>
              setNewOutput({
                ...newOutput,
                amount: e.target.value,
              })
            }
            fullWidth
            required
            error={newOutput.amount === ""}
            InputLabelProps={{ required: false }}
            sx={{ backgroundColor: "white", mt: 1 }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
              label="Date and Time"
              sx={{ marginTop: 1 }}
              value={newOutput.date_and_time_taken ? dayjs(newOutput.date_and_time_taken) : null}
              onChange={(newDate) =>
                setNewOutput({
                  ...newOutput,
                  date_and_time_taken: newDate
                    ? dayjs(newDate).format("YYYY-MM-DD HH:mm:ss")
                    : "",
                })
              }
              minutesStep={1}
              ampm={true}
              views={["year", "day", "hours", "minutes"]}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: newOutput.date_and_time_taken === "",
                  InputLabelProps: { required: false },
                  sx: { backgroundColor: "white" },
                },
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={() => setOpenModal(false)} color="error" variant="contained">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              const cleanedOutput = {
                ...newOutput,
                type: newOutput.type || "N/A",
                amount: newOutput.amount.trim() || "0",
                date_and_time_taken:
                  newOutput.date_and_time_taken || dayjs().format("YYYY-MM-DD HH:mm:ss"),
              };
              setNewOutput(cleanedOutput);
              await handleSave();
            }}
            color="primary"
            variant="contained"
          >
            {editingRow ? "Save" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
