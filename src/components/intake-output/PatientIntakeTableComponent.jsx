/*
Name: Dylan Bellinger
Date: 4/1/2025
Remarks: The Patient Intake component for displaying patient intake information.
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
    getPatientIntake,
    addPatientInputOutput,
    updatePatientInputOutput,
    deletePatientInputOutput
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

     export default function PatientIntakeTableComponent({sectionId}) {
        const [openModal, setOpenModal] = useState(false);
        const [openDeleteModal, setOpenDeleteModal] = useState(false);
        const [editingRow, setEditingRow] = useState(null);
        const [deletingRow, setDeletingRow] = useState(null);
        const [intakes, setIntakes] = useState([]);
        const [patient, setPatient] = useState(null);
        const [medications, setMedications] = useState([]);
        const [sectionPatientId, setSectionPatientId] = useState(null);
        const [display, setDisplay] = useState(false);

        const [newIntake, setNewIntake] = useState({
                  id: "",
                  section_patient_id: "",
                  type: "",
                  intake_or_output: "INTAKE",
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

        const fetchIntakeRecords = async () => {
                    try {
                      const sectionPatient = await getSectionPatientById(sectionId);
                      const sectionPatientId = sectionPatient.id;
                      const patientData = await getPatientIntake(
                        sectionPatientId
                      );
                      const patientInfo = await getPatientById(sectionPatient.patient_id);
                      setIntakes(patientData);
                      setPatient(patientInfo);
                      setSectionPatientId(sectionPatientId);
                    } catch (err) {
                      console.error("Error fetching intake records:", err);
                    }
                  };

                  useEffect(() => {
                        if (sectionId == null) return;
                        const role = getUserRole();
                        if (role === "STUDENT" || role === "ADMIN" || role === "INSTRUCTOR") {
                            setDisplay(true);
                        }
                        fetchIntakeRecords();
                    }, [sectionId]);

                    const handleOpenModal = (row = null, action = "edit") => {
                        if (action === "edit") {
                          setEditingRow(row);
                          if (row) {
                            setNewIntake({
                              id: row.original.id,
                              section_patient_id: row.original.section_patient_id,
                              type: row.original.type,
                              amount: row.original.amount,
                              date_and_time_taken: row.original.date_and_time_taken 
                            });
                          } else {
                            setNewIntake({
                                id: "",
                                section_patient_id: sectionPatientId,
                                type: "",
                                intake_or_output: "INTAKE",
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
                            const formattedIntakeTime = dayjs(newIntake.date_and_time_taken)
                                .utc()
                                .format("YYYY-MM-DD HH:mm:ss");
                                  
                                const recordToSend = {
                                    section_patient_id: sectionPatientId,
                                    type: newIntake.type,
                                    intake_or_output: "INTAKE",
                                    amount: newIntake.amount,
                                    date_and_time_taken: formattedIntakeTime,
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
                                  
                                setIntakes((prevData) =>
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
                                  
                            setIntakes((prevData) => [...prevData, newRecordWithDetails]);
                            } else {
                                console.error(
                                "Error: API did not return an ID for the created record."
                            );
                                return;
                            }
                        }
                        setOpenModal(false);
                        } catch (error) {
                        console.error("Error saving intake record:", error);
                    }
                };

                const handleDelete = async () => {
                    await deletePatientInputOutput(sectionPatientId, deletingRow.original.id);
                    setIntakes(
                    intakes.filter((item) => item.id !== deletingRow.original.id)
                );
                    setOpenDeleteModal(false);
                };

                const table = useMaterialReactTable({
                    columns,
                    data: intakes,
                    enableColumnActions: false,
                    enableDensityToggle: false,
                    enableFullScreenToggle: false,
                    enableColumnFilters: false,
                    enableFilterMatchHighlighting: false,
                    renderTopToolbarCustomActions: () => (
                        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}>
                            <Tooltip title="Add Intake Record">
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
                        ? "Edit Patient Intake Record"
                        : "Add Patient Intake Record"}
                        </DialogTitle>
                        <DialogContent>
                        <Select
                        displayEmpty
                        value={newIntake.type}
                        fullWidth
                        sx={{ marginTop: 1 }}
                        margin="dense"
                        onChange={(e) =>
                        setNewIntake({
                             ...newIntake,
                            type: e.target.value,
                        })
                        }
                        renderValue={(selected) =>
                                selected ? (
                                selected
                                ) : (
                                <span style={{ color: "#757575" }}>Select Type</span>
                             )
                            }
                        >
                        <MenuItem value="PO">PO</MenuItem>
                        <MenuItem value="TUBE-FEEDING">TUBE FEEDING</MenuItem>
                        <MenuItem value="IV">IV</MenuItem>
                        </Select>
                            <TextField
                              label="Amount"
                              value={newIntake.amount}
                              onChange={(e) =>
                                setNewIntake({
                                  ...newIntake,
                                  amount: e.target.value,
                                })
                              }
                              fullWidth
                              margin="dense"
                            />
<LocalizationProvider dateAdapter={AdapterDayjs}>
                          <MobileDateTimePicker
                            label="Date and Time"
                            sx={{ marginTop: 1 }}
                            value={
                              newIntake.date_and_time_taken
                                ? dayjs(newIntake.date_and_time_taken)
                                : null
                            }
                            onChange={(newDate) =>
                              setNewIntake({
                                ...newIntake,
                                date_and_time_taken: newDate
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

