/*
Name: Dylan Bellinger
Date: 2/10/2025 
Remarks: The Patient History component for displaying patient history data.
useImperativeHandle and useRef: https://vinodht.medium.com/call-child-component-method-from-parent-react-bb8db1112f55
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
import { getSectionPatientById } from "../../services/sectionPatientService";
import {
  getPatientHistory,
  addPatientHistory,
  updatePatientHistory,
  deletePatientHistory,
} from "../../services/patientHistoryService";
import { getUserRole } from "../../services/authService";
import DeleteConfirmationModal from "../utils/DeleteModalComponent";
import { useSnackbar } from "../utils/Snackbar";


export default function PatientHistoryComponent({ sectionId }) {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [histories, setHistories] = useState([]);
  const [patientId, setPatientId] = useState("");
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  
  const [display, setDisplay] = useState(false);
  const [newHistoryRecord, setNewHistoryRecord] = useState({
    id: "",
    patient_id: "",
    type: "",
    title: "",
    description: "",
  });

  const [touchedFields, setTouchedFields] = useState({
    type: false,
    title: false,
    description: false,
  });

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const isFormValid =
    (editingRow ||
      (touchedFields.type &&
        touchedFields.title &&
        touchedFields.description)) &&
    newHistoryRecord.type.trim() !== "" &&
    newHistoryRecord.title.trim() !== "" &&
    newHistoryRecord.description.trim() !== "";

  const columns = useMemo(
    () => [
      { accessorKey: "type", header: "History Type", size: 150 },
      { accessorKey: "title", header: "History Title", size: 150 },
      { accessorKey: "description", header: "Description", size: 200 },
      ...(display
        ? [
            {
              accessorKey: "actions",
              header: "Actions",
              maxSize: 50,
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

  // Open modal for add/edit/delete
  const handleOpenModal = (row = null, action = "edit") => {
    if (action === "edit") {
      setEditingRow(row);
      if (row) {
        setNewHistoryRecord({
          id: row.original.id,
          patient_id: row.original.patient_id,
          type: row.original.type,
          title: row.original.title,
          description: row.original.description,
        });
      } else {
        setNewHistoryRecord({
          id: "",
          patient_id: patientId,
          type: "",
          title: "",
          description: "",
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
      if (editingRow) {
        setHistories((prevData) =>
          prevData.map((item) =>
            item.id === editingRow.original.id
              ? { ...item, ...newHistoryRecord }
              : item
          )
        );
        await updatePatientHistory(patientId, editingRow.original.id, {
          type: newHistoryRecord.type,
          title: newHistoryRecord.title,
          description: newHistoryRecord.description,
        });
        showSnackbar("Patient history updated successfully!", "success");
      } else {
        await addPatientHistory(patientId, {
          type: newHistoryRecord.type,
          title: newHistoryRecord.title,
          description: newHistoryRecord.description,
        });
        setHistories((prevData) => [
          ...prevData,
          { ...newHistoryRecord, id: Date.now().toString() },
        ]);
        showSnackbar("Patient history added successfully!", "success");
      }
      setOpenModal(false);
    } catch (error) {
      console.error(error);
      showSnackbar("Error saving information.", "error");
    }
  };

  // Delete user
  const handleDelete = async () => {
    try {
      await deletePatientHistory(patientId, deletingRow.original.id);
      setHistories(
        histories.filter((item) => item.id !== deletingRow.original.id)
      );
      setOpenDeleteModal(false);
      showSnackbar("Patient history deleted successfully!", "success"); 
    } catch (error) {
      console.error(error);
      showSnackbar("Error deleting patient history.", "error"); 
    }
  };
  

  const fetchPatientHistory = async () => {
    try {
      const sectionPatient = await getSectionPatientById(sectionId);
      const patientId = sectionPatient.patient_id;
      const patientData = await getPatientHistory(patientId);
      setHistories(patientData);
      setPatientId(patientId);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (sectionId == null) return;
    const role = getUserRole();
    if (role === "ADMIN" || role === "INSTRUCTOR") {
      setDisplay(true);
    }
    fetchPatientHistory();
  }, [sectionId]);

  const table = useMaterialReactTable({
    columns,
    data: histories,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnFilters: false,
    enableFilterMatchHighlighting: false,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    renderTopToolbarCustomActions: () => (
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}>
        {display && (
          <Tooltip title="Add History Record">
            <IconButton onClick={() => handleOpenModal()}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    ),
  });

  return (
    <Box>
      <MaterialReactTable table={table} />

      {/* Modal for Create/Edit */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle align="center">
          {editingRow ? "Edit Patient History" : "Add Patient History"}
        </DialogTitle>
        <DialogContent>
          <Select
            displayEmpty
            value={newHistoryRecord.type}
            fullWidth
            margin="dense"
            onChange={(e) =>
              setNewHistoryRecord({ ...newHistoryRecord, type: e.target.value })
            }
            onBlur={() => handleBlur("type")}
            error={touchedFields.type && newHistoryRecord.type.trim() === ""}
            renderValue={(selected) =>
              selected ? (
                selected
              ) : (
                <span style={{ color: "#757575" }}>History Type</span>
              )
            }
          >
            <MenuItem value="Primary Admitting Diagnosis">
              Primary Admitting Diagnosis
            </MenuItem>
            <MenuItem value="Family History">Family History</MenuItem>
            <MenuItem value="Social History">Social History</MenuItem>
            <MenuItem value="Medical/Surgical History">
              Medical/Surgical History
            </MenuItem>
          </Select>

          <TextField
            label="History Title"
            fullWidth
            margin="dense"
            value={newHistoryRecord.title}
            onChange={(e) =>
              setNewHistoryRecord({
                ...newHistoryRecord,
                title: e.target.value,
              })
            }
            required
            onBlur={() => handleBlur("title")}
            error={touchedFields.title && newHistoryRecord.title.trim() === ""}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            margin="dense"
            value={newHistoryRecord.description}
            rows={4}
            onChange={(e) =>
              setNewHistoryRecord({
                ...newHistoryRecord,
                description: e.target.value,
              })
            }
            required
            onBlur={() => handleBlur("description")}
            error={touchedFields.description && newHistoryRecord.description.trim() === ""}
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
          <Button onClick={handleSave} color="primary" variant="contained" disabled={!isFormValid}>
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
       {SnackbarComponent}
    </Box>
  );
}
