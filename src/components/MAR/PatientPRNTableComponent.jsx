/*
Name: Dylan Bellinger
Date: 3/3/2025
Remarks: The Patient PRN component for displaying patient PRN medication.
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
  Typography,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  getPatientPRNMedication,
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
import MedicationLiquidIcon from "@mui/icons-material/MedicationLiquid";
import DeleteConfirmationModal from "../utils/DeleteModalComponent";
import { getSectionPatientBarcode } from "../../services/sectionPatientService";
import { getMedicationBarcode } from "../../services/patientMedicationsService";
import { useSnackbar } from "../utils/Snackbar";
// This is so that we are properly passing the day and time correctly.
// We want FE to display the date and time properly but pass it to the BE correctly.
dayjs.extend(utc);

export default function PatientPRNTableComponent({ sectionId }) {
  const [openModal, setOpenModal] = useState(false);
  const [openBarcodeModal, setBarcodeModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [patientMeds, setPatientMeds] = useState([]);
  const [patient, setPatient] = useState(null);
  const [medications, setMedications] = useState([]);
  const [sectionPatientId, setSectionPatientId] = useState(null);
  const [display, setDisplay] = useState(false);
  const [openAdministerModal, setAdminsterModal] = useState(false);

  const [newScheduledRecord, setNewScheduledRecord] = useState({
    id: "",
    section_patient_id: "",
    medication_id: "",
    medication_type: "PRN",
    scheduled_time: "",
    dose: "",
    route: "",
    dose_frequency: "",
  });

  const [touchedFields, setTouchedFields] = useState({
    medication_id: false,
    dose: false,
    route: false,
    dose_frequency: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMedicationForAdminister, setSelectedMedicationForAdminister] =
    useState(null);
  const hiddenInputRef = React.useRef(null);
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const [barcodeBuffer, setBarcodeBuffer] = useState("");
  const [scanStage, setScanStage] = useState("patient");
  const [patientBarcode, setPatientBarcode] = useState("");
  const [medicationBarcode, setMedicationBarcode] = useState("");
  const [administeredValues, setAdministeredValues] = useState({
    dose: "",
    scheduled_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  });

  const handleHiddenInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBarcodeSubmit(barcodeBuffer);
      setBarcodeBuffer("");
    } else {
      setBarcodeBuffer((prev) => prev + e.key); // Append key
    }
  };

  // For this to make sense, refer to the business logic diagram here: https://quinnipiacuniversity-my.sharepoint.com/personal/gdpierce_quinnipiac_edu/_layouts/15/onedrive.aspx?FolderCTID=0x012000F0D4505AAAFF8B45B8E39BB11063F8AE&id=%2Fpersonal%2Fgdpierce%5Fquinnipiac%5Fedu%2FDocuments%2FEHR%20Capstone%2Fscanned%2Dmedication%2Dbusiness%2Dlogic%2Dflow%2Epng&parent=%2Fpersonal%2Fgdpierce%5Fquinnipiac%5Fedu%2FDocuments%2FEHR%20Capstone
  const handleBarcodeSubmit = async (scannedBarcode) => {
    setIsProcessing(true);

    try {
      if (scanStage === "patient") {
        const patientData = await getSectionPatientBarcode(
          sectionPatientId,
          scannedBarcode
        );

        if (patientData) {
          setPatientBarcode(scannedBarcode);
          setScanStage("medication");
        } else {
          setBarcodeModal(false);
        }
      } else if (scanStage === "medication") {
        const medicationData = await getMedicationBarcode(
          sectionPatientId,
          scannedBarcode
        );

        if (medicationData) {
          setMedicationBarcode(scannedBarcode);
          setSelectedMedicationForAdminister({
            dose: medicationData.dose_amount ?? "",
            scheduled_time:
              medicationData.scheduled_time ??
              dayjs().format("YYYY-MM-DD HH:mm:ss"),
            ...medicationData,
          });

          finalizeScan();
        } else {
          setBarcodeModal(false);
        }
      }
    } catch (error) {
      console.error("Barcode handling error:", error);
      setBarcodeModal(false);
    } finally {
      setIsProcessing(false);
      setBarcodeBuffer("");
    }
  };

  const finalizeScan = () => {
    // Here you can trigger your API calls or any logic to save them
    setBarcodeModal(false);
    setAdminsterModal(true);
    setScanStage("patient");
    setBarcodeBuffer("");
    setPatientBarcode("");
    setMedicationBarcode("");
  };
  useEffect(() => {
    if (openBarcodeModal) {
      setTimeout(() => {
        hiddenInputRef.current?.focus();
      }, 100);
    }
  }, [openBarcodeModal]);

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
                  <Tooltip title="Administer">
                    <IconButton color="primary">
                      <MedicationLiquidIcon />
                    </IconButton>
                  </Tooltip>
                  {display && (
                    <>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleOpenModal(row, "edit")}
                        >
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
                    </>
                  )}
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
      const patientMedData = await getPatientPRNMedication(sectionPatientId);
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
      const medicationDose = await getMedicationById(
        newScheduledRecord.medication_id
      );

      const recordToSend = {
        section_patient_id: sectionPatientId,
        medication_id: newScheduledRecord.medication_id,
        medication_type: "PRN",
        scheduled_time: formattedScheduledTime,
        dose: medicationDose.dose_amount,
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

  const handleAdminister = async () => {
    try {
      const dosage = selectedMedicationForAdminister?.dose || "";
      // this will help with getting the value and the unit.
      const match = dosage.match(/^([\d.]+)\s*(.*)$/);

      // get the amount and the dose previously entered
      const scheduledDoseAmount = parseFloat(match[1]);
      const doseUnits = match[2];
      // user will only enter amount, not the unit
      const enteredDoseAmount = parseFloat(administeredValues.dose);

      const answer = scheduledDoseAmount - enteredDoseAmount;
      if (answer < 0) {
        showSnackbar(
          ` Dose entered (${enteredDoseAmount}) exceeds scheduled amount (${scheduledDoseAmount}).`,
          "error"
        );
        return;
      }

      const recordToSubmit = {
        dose: `${answer} ${doseUnits}`,
        scheduled_time: administeredValues.scheduled_time,
      };

      await updatePatientMedication(
        selectedMedicationForAdminister.section_patient_id,
        selectedMedicationForAdminister.id,
        recordToSubmit
      );
      setPatientMeds((prevMeds) =>
        prevMeds.map((med) =>
          med.id === selectedMedicationForAdminister.id
            ? {
                ...med,
                dose: `${administeredValues.dose} ${doseUnits}`,
                scheduled_time: administeredValues.scheduled_time,
              }
            : med
        )
      );

      // Reset UI
      setAdminsterModal(false);
      setSelectedMedicationForAdminister(null);
      setAdministeredValues({
        dose: "",
        scheduled_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      });
    } catch (err) {
      console.error(err);
      showSnackbar(
        "Failed to administer medication. See console for details.",
        "error"
      );
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

      {/* Barcode Modal */}
      <Dialog open={openBarcodeModal} onClose={() => setBarcodeModal(false)}>
        <DialogTitle align="center">
          {scanStage === "patient"
            ? "Scan Patient Barcode"
            : "Scan Medication Barcode"}
        </DialogTitle>
        <DialogContent>
          {/* FIX-ME: This Ideally should be a material ui component */}
          <input
            ref={hiddenInputRef}
            style={{
              position: "absolute",
              opacity: 0,
              height: 0,
              width: 0,
              border: 0,
            }}
            onKeyDown={handleHiddenInputKeyDown}
            onBlur={() => hiddenInputRef.current?.focus()}
          />
          <Typography sx={{ marginTop: 2 }}>
            {scanStage === "patient"
              ? "Please scan the patient's barcode..."
              : "Please scan the medication's barcode..."}
          </Typography>

          {/* Progress spinner - it looks bad without loading */}
          {isProcessing && (
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
            >
              <CircularProgress size={100} />
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={openAdministerModal}
        onClose={() => setAdminsterModal(false)}
      >
        <DialogTitle align="center">Administer Medication</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
              label="Time Given"
              sx={{ marginTop: 1 }}
              value={
                administeredValues
                  ? dayjs(administeredValues.scheduled_time)
                  : null
              }
              onChange={(newDate) =>
                setAdministeredValues((prev) => ({
                  ...prev,
                  scheduled_time: newDate
                    ? dayjs(newDate).format("YYYY-MM-DD HH:mm:ss")
                    : prev.scheduled_time,
                }))
              }
            />
          </LocalizationProvider>

          <TextField
            label="Dose Given"
            value={administeredValues.dose || ""}
            onChange={(e) =>
              setAdministeredValues((prev) => ({
                ...prev,
                dose: e.target.value,
              }))
            }
            fullWidth
            margin="dense"
            required
            type="number"
          />
        </DialogContent>

        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={() => setAdminsterModal(false)}
            color="error"
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdminister}
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for Create/Edit */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle align="center">
          {editingRow
            ? "Edit Patient PRN Medication"
            : "Add Patient PRN Medication"}
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
                <span style={{ color: "#757575" }}>Select Route</span>
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
            error={
              touchedFields.dose_frequency &&
              newScheduledRecord.dose_frequency.trim() === ""
            }
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
