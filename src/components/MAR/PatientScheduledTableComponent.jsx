/*
Name: Dylan Bellinger
Date: 3/3/2025
Remarks: The Patient Scheduled component for displaying patient scheduled medication.
https://mui.com/material-ui/react-table/
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
  getPatientScheduledMedication,
  addPatientMedication,
  updatePatientMedication,
  deletePatientMedication,
} from "../../services/patientMedicationsService";
import { getSectionPatientById } from "../../services/sectionPatientService";
import {
  getMedications,
  getMedicationById,
} from "../../services/medicationsService";
import { getUserRole } from "../../services/authService";
import { getPatientById } from "../../services/patientService";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { formatDateTime } from "../../utils/date-time-formatter";
import DeleteConfirmationModal from "../utils/DeleteModalComponent";
// This is so that we are properly passing the day and time correctly.
// We want FE to display the date and time properly but pass it to the BE correctly.
dayjs.extend(utc);

export default function PatientScheduledTableComponent({ sectionId }) {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [patientMeds, setPatientMeds] = useState([]);
  const [patient, setPatient] = useState(null);
  const [medications, setMedications] = useState([]);
  const [sectionPatientId, setSectionPatientId] = useState(null);
  const [display, setDisplay] = useState(false);

  const [newScheduledRecord, setNewScheduledRecord] = useState({
    id: "",
    section_patient_id: "",
    medication_id: "",
    medication_type: "SCHEDULED",
    scheduled_time: "",
    dose: "",
    route: "",
    dose_frequency: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const columns = useMemo(
    () => [
      { accessorKey: "drugName", header: "Drug Name", size: 150 },
      {
        accessorKey: "scheduled_time",
        header: "Scheduled Time",
        size: 150,
        Cell: ({ cell }) => formatDateTime(cell.getValue()),
      },
      { accessorKey: "dose", header: "Dose", size: 150 },
      { accessorKey: "route", header: "Route", size: 150 },
      { accessorKey: "genericName", header: "Scanned Med", size: 150 },
      {
        accessorKey: "patient_full_name",
        header: "Scanned Patient",
        size: 150,
        enableSorting: false,
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

  const fetchScheduledMedications = async () => {
    try {
      const sectionPatient = await getSectionPatientById(sectionId);
      const sectionPatientId = sectionPatient.id;
      const patientMedData = await getPatientScheduledMedication(
        sectionPatientId
      );
      const patientInfo = await getPatientById(sectionPatient.patient_id);
      const medications = await getMedications();

      setMedications(medications);

      const medDetails = await Promise.all(
        patientMedData.map(async (med) => {
          const medication = await getMedicationById(med.medication_id);
          return {
            ...med,
            drugName: medication.drug_name,
            genericName: medication.generic_name,
            patient_full_name: `${patientInfo.full_name}`,
          };
        })
      );

      setPatientMeds(medDetails);
      setPatient(patientInfo);
      setSectionPatientId(sectionPatientId);
    } catch (err) {
      console.error("Error fetching scheduled medications:", err);
    }
  };

  useEffect(() => {
    if (sectionId == null) return;
    const role = getUserRole();
    if (role === "ADMIN" || role === "INSTRUCTOR") {
      setDisplay(true);
    }
    fetchScheduledMedications();
  }, [sectionId]);

  // Open modal for add/edit/delete
  const handleOpenModal = (row = null, action = "edit") => {
    setFormSubmitted(false);

    if (action === "edit") {
      setEditingRow(row);
      if (row) {
        setNewScheduledRecord({
          id: row.original.id,
          section_patient_id: row.original.section_patient_id,
          medication_id: row.original.medication_id,
          medication_type: row.original.medication_type,
          scheduled_time: row.original.scheduled_time,
          dose: row.original.dose,
          route: row.original.route,
          dose_frequency: row.original.dose_frequency,
        });
      } else {
        setNewScheduledRecord({
          id: "",
          section_patient_id: sectionPatientId,
          medication_id: "",
          medication_type: "SCHEDULED",
          scheduled_time: "",
          dose: "",
          route: "",
          dose_frequency: "",
        });
      }
      setOpenModal(true);
    } else if (action === "delete") {
      setDeletingRow(row);
      setOpenDeleteModal(true);
    }
  };

  // Save user data (create/update)
  const handleSave = async () => {
    try {
      const formattedScheduledTime = dayjs(newScheduledRecord.scheduled_time)
        .utc()
        .format("YYYY-MM-DD HH:mm:ss");

      const recordToSend = {
        section_patient_id: sectionPatientId,
        medication_id: newScheduledRecord.medication_id,
        medication_type: "SCHEDULED",
        scheduled_time: formattedScheduledTime,
        dose: newScheduledRecord.dose.trim(),
        route: newScheduledRecord.route.trim(),
        dose_frequency: newScheduledRecord.dose_frequency.trim(),
      };

      if (editingRow) {
        await updatePatientMedication(
          sectionPatientId,
          editingRow.original.id,
          recordToSend
        );

        const medication = await getMedicationById(recordToSend.medication_id);
        const patientInfo = await getPatientById(patient.id);

        const updatedRecordWithDetails = {
          ...recordToSend,
          id: editingRow.original.id,
          drugName: medication.drug_name,
          genericName: medication.generic_name,
          patient_full_name: patientInfo.full_name,
        };

        setPatientMeds((prevData) =>
          prevData.map((item) =>
            item.id === editingRow.original.id ? updatedRecordWithDetails : item
          )
        );
      } else {
        const response = await addPatientMedication(
          sectionPatientId,
          recordToSend
        );

        if (response && response.id) {
          const medication = await getMedicationById(
            recordToSend.medication_id
          );
          const patientInfo = await getPatientById(patient.id);

          const newRecordWithDetails = {
            ...recordToSend,
            id: response.id,
            drugName: medication.drug_name,
            genericName: medication.generic_name,
            patient_full_name: patientInfo.full_name,
          };

          setPatientMeds((prevData) => [...prevData, newRecordWithDetails]);
        } else {
          console.error(
            "Error: API did not return an ID for the created record."
          );
          return;
        }
      }
      setOpenModal(false);
    } catch (error) {
      console.error("Error saving scheduled medication:", error);
    }
  };

  // Delete user
  const handleDelete = async () => {
    await deletePatientMedication(sectionPatientId, deletingRow.original.id);
    setPatientMeds(
      patientMeds.filter((item) => item.id !== deletingRow.original.id)
    );
    setOpenDeleteModal(false);
  };

  const table = useMaterialReactTable({
    columns,
    data: patientMeds,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnFilters: false,
    enableFilterMatchHighlighting: false,
    renderTopToolbarCustomActions: () => (
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}>
          <Tooltip title="Add Scheduled Medication">
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

      {/* Modal for Create/Edit */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle align="center">
          {editingRow ? "Edit Scheduled Medication" : "Add Scheduled Medication"}
        </DialogTitle>
        <DialogContent>
          <Select
            displayEmpty
            value={newScheduledRecord.medication_id}
            fullWidth
            required
            error={formSubmitted && newScheduledRecord.medication_id === ""}
            onChange={(e) =>
              setNewScheduledRecord({
                ...newScheduledRecord,
                medication_id: e.target.value,
              })
            }
            renderValue={(selected) =>
              selected
                ? medications.find((m) => m.id === selected)?.drug_name
                : <span style={{ color: "#757575" }}>Select Medication</span>
            }
            sx={{ backgroundColor: "white", mt: 1 }}
          >
            {medications.map((med) => (
              <MenuItem key={med.id} value={med.id}>
                {med.drug_name}
              </MenuItem>
            ))}
          </Select>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
              label="Scheduled Time"
              sx={{ marginTop: 1 }}
              value={
                newScheduledRecord.scheduled_time
                  ? dayjs(newScheduledRecord.scheduled_time)
                  : null
              }
              onChange={(newDate) =>
                setNewScheduledRecord({
                  ...newScheduledRecord,
                  scheduled_time: newDate
                    ? dayjs(newDate).format("YYYY-MM-DD HH:mm:ss")
                    : "",
                })
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: formSubmitted && newScheduledRecord.scheduled_time === "",
                  helperText:
                    formSubmitted && newScheduledRecord.scheduled_time === ""
                      ? "Required Field"
                      : "",
                  InputLabelProps: { required: false },
                  sx: { backgroundColor: "white" },
                },
              }}
            />
          </LocalizationProvider>

          <TextField
            label="Dose"
            fullWidth
            required
            error={formSubmitted && newScheduledRecord.dose === ""}
            helperText={
              formSubmitted && newScheduledRecord.dose === "" ? "Required Field" : ""
            }
            value={newScheduledRecord.dose}
            onChange={(e) =>
              setNewScheduledRecord({
                ...newScheduledRecord,
                dose: e.target.value,
              })
            }
            InputLabelProps={{ required: false }}
            sx={{ backgroundColor: "white", mt: 1 }}
          />

          <Select
            displayEmpty
            value={newScheduledRecord.route}
            fullWidth
            required
            error={formSubmitted && newScheduledRecord.route === ""}
            onChange={(e) =>
              setNewScheduledRecord({
                ...newScheduledRecord,
                route: e.target.value,
              })
            }
            sx={{ backgroundColor: "white", mt: 1 }}
            renderValue={(selected) =>
              selected ? selected : <span style={{ color: "#757575" }}>Select Route</span>
            }
          >
            <MenuItem value="PO">PO</MenuItem>
            <MenuItem value="TUBE-FEEDING">TUBE FEEDING</MenuItem>
            <MenuItem value="IV">IV</MenuItem>
          </Select>

          <TextField
            label="Dose Frequency"
            fullWidth
            required
            error={formSubmitted && newScheduledRecord.dose_frequency === ""}
            helperText={
              formSubmitted && newScheduledRecord.dose_frequency === ""
                ? "Required Field"
                : ""
            }
            value={newScheduledRecord.dose_frequency}
            onChange={(e) =>
              setNewScheduledRecord({
                ...newScheduledRecord,
                dose_frequency: e.target.value,
              })
            }
            InputLabelProps={{ required: false }}
            sx={{ backgroundColor: "white", mt: 1 }}
          />
        </DialogContent>

        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={() => setOpenModal(false)} color="error" variant="contained">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setFormSubmitted(true);

              const isFormValid =
                newScheduledRecord.medication_id &&
                newScheduledRecord.scheduled_time &&
                newScheduledRecord.dose &&
                newScheduledRecord.route &&
                newScheduledRecord.dose_frequency;

              if (!isFormValid) return;

              const cleaned = {
                section_patient_id: sectionPatientId,
                medication_id: newScheduledRecord.medication_id,
                medication_type: "SCHEDULED",
                scheduled_time:
                  newScheduledRecord.scheduled_time ||
                  dayjs().format("YYYY-MM-DD HH:mm:ss"),
                dose: newScheduledRecord.dose.trim() || "N/A",
                route: newScheduledRecord.route.trim() || "PO",
                dose_frequency: newScheduledRecord.dose_frequency.trim() || "N/A",
              };

              await handleSave(cleaned);
            }}
            color="primary"
            variant="contained"
          >
            {editingRow ? "Save" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>


      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
      />

    </Box>
  );
}
