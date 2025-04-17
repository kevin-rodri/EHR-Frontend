/* Name: Charlize Aponte 
   Date: 3/28/25 
   Remarks:  Lab Values Component to be displayed on the Lab Values page  
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { getSectionPatientById } from "../../services/sectionPatientService";
import {
  getPatientLabValues,
  addPatientLabValues,
  updatePatientLabValue,
  deletePatientLabValue,
} from "../../services/LabValuesService";
import { formatDateTime } from "../../utils/date-time-formatter";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import DeleteConfirmationModal from "../utils/DeleteModalComponent";
import { getUserRole } from "../../services/authService";

dayjs.extend(utc);
dayjs.extend(timezone);

export function PatientLabValuesComponent({ sectionId }) {
  const [display, setDisplay] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [labs, setLabs] = useState([]);
  const [newLabValue, setLabValue] = useState({
    id: "",
    section_patient_id: "",
    element_name: "",
    element_value: "",
    modified_date: "",
  });

  const [touchedFields, setTouchedFields] = useState({
    element_name: false,
    element_value: false,
    modified_date: false,
  });

  const isFormValid =
    touchedFields.element_name &&
    touchedFields.element_value &&
    newLabValue.element_name.trim() !== "" &&
    newLabValue.element_value.trim() !== "";

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const columns = useMemo(
    () => [
      { accessorKey: "element_name", header: "Element Name" },
      { accessorKey: "element_value", header: "Element Value" },
      {
        accessorKey: "modified_date",
        header: "Timestamp",
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

  // Fetch orders for the specific patient
  useEffect(() => {
    if (sectionId == null) return;
    const role = getUserRole();
    if (role === "ADMIN" || role === "INSTRUCTOR") {
      setDisplay(true);
    }
    async function fetchLabs() {
      try {
        const sectionPatient = await getSectionPatientById(sectionId);
        const sectionPatientId = sectionPatient.id;
        console.log(sectionPatientId);
        setPatientId(sectionPatientId);
        const labValues = await getPatientLabValues(sectionPatientId);
        setLabs(labValues);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLabs();
  }, [sectionId]);

  const handleOpenModal = (row = null, action = "edit") => {
    if (action === "edit") {
      setEditingRow(row);
      if (row) {
        setLabValue({
          id: row.original.id,
          section_patient_id: row.original.section_patient_id,
          element_name: row.original.element_name,
          element_value: row.original.element_value,
          modified_date: row.original.modified_date,
        });
      } else {
        setLabValue({
          id: "",
          section_patient_id: patientId,
          element_name: "",
          element_value: "",
          modified_date: "",
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
      const formattedTime = dayjs()
        .tz("America/New_York")
        .format("YYYY-MM-DD HH:mm:ss");

      if (editingRow) {
        await updatePatientLabValue(patientId, editingRow.original.id, {
          element_name: newLabValue.element_name,
          element_value: newLabValue.element_value,
          modified_date: formattedTime,
        });

        setLabs((prevData) =>
          prevData.map((item) =>
            item.id === editingRow.original.id
              ? {
                  ...item,
                  ...newLabValue,
                  modified_date: formattedTime,
                }
              : item
          )
        );
      } else {
        const response = await addPatientLabValues(patientId, {
          element_name: newLabValue.element_name,
          element_value: newLabValue.element_value,
          modified_date: formattedTime,
        });

        if (response && response.id) {
          const newLab = {
            id: response.id,
            section_patient_id: patientId,
            element_name: newLabValue.element_name,
            element_value: newLabValue.element_value,
            modified_date: formattedTime,
          };

          setLabs((prevData) => [...prevData, newLab]);
        }
      }
      setOpenModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    await deletePatientLabValue(patientId, deletingRow.original.id);
    setLabs(labs.filter((item) => item.id !== deletingRow.original.id));
    setOpenDeleteModal(false);
  };

  const table = useMaterialReactTable({
    columns,
    data: labs,
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
          <Tooltip title="Add Lab Value">
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
      {/* Render MaterialReactTable without the default toolbar */}
      <MaterialReactTable table={table} />
      {/* Modal for Create/Edit */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle align="center">
          {editingRow ? "Edit Lab Value" : "Add Lab Value"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Element Name"
            fullWidth
            margin="dense"
            value={newLabValue.element_name}
            onChange={(e) =>
              setLabValue({
                ...newLabValue,
                element_name: e.target.value,
              })
            }
            required
            onBlur={() => handleBlur("element_name")}
            error={
              touchedFields.element_name && newLabValue.element_name === ""
            }
          />
          <TextField
            label="Element Value"
            fullWidth
            multiline
            margin="dense"
            marginTop={2}
            value={newLabValue.element_value}
            onChange={(e) =>
              setLabValue({
                ...newLabValue,
                element_value: e.target.value,
              })
            }
            required
            onBlur={() => handleBlur("element_value")}
            error={
              touchedFields.element_value && newLabValue.element_value === ""
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
