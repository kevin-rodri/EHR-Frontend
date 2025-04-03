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

  const columns = useMemo(() => [
    { accessorKey: "element_name", header: "Element" },
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
  ]);

  const fetchLabs = async () => {
    try {
      console.log("Fetching sectionPatient with sectionId:", sectionId);
      const sectionPatient = await getSectionPatientById(sectionId);
      console.log("Fetched sectionPatient:", sectionPatient);

     
      const data = await getPatientLabValues(sectionPatient.id);
      console.log("Fetched lab values:", data);

      setLabs(data);
      setPatientId(sectionPatient.id);

      // Log the role to verify it's being fetched correctly
      const role = await getUserRole();
      console.log("Fetched user role:", role);

      if (role === "ADMIN" || role === "INSTRUCTOR") {
        setDisplay(true);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  // Fetch orders for the specific patient
  useEffect(() => {
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
          modified_date: formattedTime
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
        <Tooltip title="Add Lab Value">
          <IconButton onClick={() => handleOpenModal()} disabled={!display}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    muiTableToolbarProps: {
      sx: {
        display: 'flex',
        justifyContent: 'flex-end',
      },
      children: (toolbarChildren) =>
        toolbarChildren.filter(
          (child) => child.props.children !== "Search" 
        ),
    },
    enableGlobalFilter: false, 
    enableHiding: display, 
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
            label="Lab Value"
            fullWidth
            margin="dense"
            value={newLabValue.element_name}
            onChange={(e) =>
              setLabValue({
                ...newLabValue,
                element_name: e.target.value,
              })
            }
          />
          <TextField
            label="Element Value"
            fullWidth
            multiline
            margin="dense"
            value={newLabValue.element_value}
            rows={4}
            onChange={(e) =>
              setLabValue({
                ...newLabValue,
                element_value: e.target.value,
              })
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
          <Button onClick={handleSave} color="primary" variant="contained">
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