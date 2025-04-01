/*
Name: Dylan Bellinger
Date: 3/30/2025
Remarks: The Patient AtHome component for displaying patient at home medication.
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
    getPatientAtHomeMedication,
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
  dayjs.extend(utc);

  export default function PatientAtHomeTableComponent({sectionId}) {
      const [openModal, setOpenModal] = useState(false);
      const [openDeleteModal, setOpenDeleteModal] = useState(false);
      const [editingRow, setEditingRow] = useState(null);
      const [deletingRow, setDeletingRow] = useState(null);
      const [patientMeds, setPatientMeds] = useState([]);
      const [patient, setPatient] = useState(null);
      const [medications, setMedications] = useState([]);
      const [sectionPatientId, setSectionPatientId] = useState(null);
      const [display, setDisplay] = useState(false);

      const [newAtHomeRecord, setNewAtHomeRecord] = useState({
          id: "",
          section_patient_id: "",
          medication_id: "",
          medication_type: "AT-HOME",
          scheduled_time: "",
          dose: "",
          route: "",
          dose_frequency: "",
        });

        const columns = useMemo(
          () => [
            { accessorKey: "drugName", header: "Drug Name", size: 150 },
            {
              accessorKey: "scheduled_time",
              header: "Date and Time Given",
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

        const fetchAtHomeMedications = async () => {
            try {
              const sectionPatient = await getSectionPatientById(sectionId);
              const sectionPatientId = sectionPatient.id;
              const patientMedData = await getPatientAtHomeMedication(
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
              console.error("Error fetching at home medications:", err);
            }
          };

          useEffect(() => {
              if (sectionId == null) return;
              const role = getUserRole();
              if (role === "ADMIN" || role === "INSTRUCTOR") {
                setDisplay(true);
              }
              fetchAtHomeMedications();
            }, [sectionId]);

            const handleOpenModal = (row = null, action = "edit") => {
              if (action === "edit") {
                setEditingRow(row);
                if (row) {
                  setNewAtHomeRecord({
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
                  setNewAtHomeRecord({
                    id: "",
                    section_patient_id: sectionPatientId,
                    medication_id: "",
                    medication_type: "AT-HOME",
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

            const handleSave = async () => {
                try {
                  const formattedAtHomeTime = dayjs(newAtHomeRecord.scheduled_time)
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss");
            
                  const recordToSend = {
                    section_patient_id: sectionPatientId,
                    medication_id: newAtHomeRecord.medication_id,
                    medication_type: "AT-HOME",
                    scheduled_time: formattedAtHomeTime,
                    dose: newAtHomeRecord.dose.trim(),
                    route: newAtHomeRecord.route.trim(),
                    dose_frequency: newAtHomeRecord.dose_frequency.trim(),
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
                  console.error("Error saving at home medication:", error);
                }
              };

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
                        <Tooltip title="Add At Home Medication">
                          <IconButton onClick={() => handleOpenModal()}>
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                    </Box>
                  ),
                });

          return(
            <Box>
              <MaterialReactTable table={table} />
              <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                      <DialogTitle align="center">
                        {editingRow
                          ? "Edit Patient At Home Medication"
                          : "Add Patient At Home Medication"}
                      </DialogTitle>
                      <DialogContent>
                        <Select
                          displayEmpty
                          value={newAtHomeRecord.medication_id}
                          fullWidth
                          margin="dense"
                          onChange={(e) =>
                            setNewAtHomeRecord({
                              ...newAtHomeRecord,
                              medication_id: e.target.value,
                            })
                          }
                          renderValue={(selected) =>
                            selected ? (
                              medications.find((med) => med.id === selected)?.drug_name
                            ) : (
                              <span style={{ color: "#757575" }}>Select Medication </span>
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
                            label="Date and Time Taken"
                            sx={{ marginTop: 1 }}
                            value={
                              newAtHomeRecord.scheduled_time
                                ? dayjs(newAtHomeRecord.scheduled_time)
                                : null
                            }
                            onChange={(newDate) =>
                              setNewAtHomeRecord({
                                ...newAtHomeRecord,
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
                          value={newAtHomeRecord.route}
                          fullWidth
                          sx={{ marginTop: 1 }}
                          margin="dense"
                          onChange={(e) =>
                            setNewAtHomeRecord({
                              ...newAtHomeRecord,
                              route: e.target.value,
                            })
                          }
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
                          value={newAtHomeRecord.dose}
                          onChange={(e) =>
                            setNewAtHomeRecord({
                              ...newAtHomeRecord,
                              dose: e.target.value,
                            })
                          }
                          fullWidth
                          margin="dense"
                        />
              
                        <TextField
                          label="Dose Frequency"
                          value={newAtHomeRecord.dose_frequency}
                          onChange={(e) =>
                            setNewAtHomeRecord({
                              ...newAtHomeRecord,
                              dose_frequency: e.target.value,
                            })
                          }
                          fullWidth
                          sx={{ marginTop: 1 }}
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
                        <Button onClick={handleSave} color="primary" variant="contained">
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
          )
    
  }
  
