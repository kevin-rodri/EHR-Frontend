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

  const [touchedFields, setTouchedFields] = useState({
    medication_id: false,
    dose: false,
    route: false,
    dose_frequency: false
  });

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const isFormValid =
    (editingRow ||
      (touchedFields.medication_id &&
        touchedFields.dose &&
        touchedFields.route &&
        touchedFields.dose_frequency)) &&
    newScheduledRecord.medication_id !== "" &&
    newScheduledRecord.dose.trim() !== "" &&
    newScheduledRecord.route !== "" &&
    newScheduledRecord.dose_frequency.trim() !== "";

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
          {editingRow
            ? "Edit Patient Scheduled Medication"
            : "Add Patient Scheduled Medication"}
        </DialogTitle>
        <DialogContent>
          <Select
            displayEmpty
            value={newScheduledRecord.medication_id}
            fullWidth
            margin="dense"
            onChange={(e) => {
              setNewScheduledRecord({
                ...newScheduledRecord,
                medication_id: e.target.value,
              });
              handleBlur("medication_id");
            }}
            onBlur={() => handleBlur("medication_id")}
            error={
              touchedFields.medication_id &&
              newScheduledRecord.medication_id === ""
            }
            required
            renderValue={(selected) =>
              selected ? (
                medications.find((med) => med.id === selected)?.drug_name
              ) : (
                <span style={{ color: "#757575" }}>Select Medication</span>
              )
            }
          >
            {medications.map((medication) => (
              <MenuItem key={medication.id} value={medication.id}>
                {medication.drug_name}
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
              minutesStep={1}
              ampm={true}
              views={["year", "day", "hours", "minutes"]}
              slotProps={{
                textField: { fullWidth: true },
              }}
            />
          </LocalizationProvider>

          <Select
            displayEmpty
            value={newScheduledRecord.route}
            fullWidth
            sx={{ marginTop: 1 }}
            margin="dense"
            onChange={(e) => {
              setNewScheduledRecord({
                ...newScheduledRecord,
                route: e.target.value,
              });
              handleBlur("route");
            }}
            onBlur={() => handleBlur("route")}
            error={touchedFields.route && newScheduledRecord.route === ""}
            renderValue={(selected) =>
              selected ? (
                selected
              ) : (
                <span style={{ color: "#757575" }}>Select Route </span>
              )
            }
          >
            <MenuItem value="PO">PO</MenuItem>
            <MenuItem value="TUBE-FEEDING">TUBE FEEDING</MenuItem>
            <MenuItem value="IV">IV</MenuItem>
          </Select>

          <TextField
            label="Dose"
            value={newScheduledRecord.dose}
            onChange={(e) =>
              setNewScheduledRecord({
                ...newScheduledRecord,
                dose: e.target.value,
              })
            }
            fullWidth
            margin="dense"
            required
            onBlur={() => handleBlur("dose")}
            error={touchedFields.dose && newScheduledRecord.dose.trim() === ""}
          />

          <TextField
            label="Dose Frequency"
            value={newScheduledRecord.dose_frequency}
            onChange={(e) =>
              setNewScheduledRecord({
                ...newScheduledRecord,
                dose_frequency: e.target.value,
              })
            }
            fullWidth
            sx={{ marginTop: 1 }}
            required
            onBlur={() => handleBlur("dose_frequency")}
            error={touchedFields.dose_frequency && newScheduledRecord.dose_frequency.trim() === ""}
          />
        </DialogContent>

        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={() => setOpenModal(false)}
            color="error"
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={!isFormValid}
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
