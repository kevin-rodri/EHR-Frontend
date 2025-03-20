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
  getPatientOrders,
  createPatientOrder,
  updatePatientOrder,
  deletePatientOrder,
} from "../../services/patientOrdersSerive";
import { formatDateTime } from "../../utils/date-time-formatter";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import DeleteConfirmationModal from "../utils/DeleteModalComponent";
import { getUserRole } from "../../services/authService";
// This is so that we are properly passing the day and time correctly.
// We want FE to display the date and time properly but pass it to the BE correctly.
dayjs.extend(utc);
dayjs.extend(timezone);

export function PatientOrderComponent({ sectionId }) {
  const [display, setDisplay] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [newPatientOrderRecord, setPatientOrderRecord] = useState({
    id: "",
    patient_id: "",
    order_title: "",
    description: "",
    modified_date: "",
  });

  const columns = useMemo(() => [
    { accessorKey: "order_title", header: "Title" },
    { accessorKey: "description", header: "Description" },
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

  const fetchOrders = async () => {
    try {
      const sectionPatient = await getSectionPatientById(sectionId);
      console.log(sectionPatient);
      const data = await getPatientOrders(sectionPatient.patient_id);
      setOrders(data);
      setPatientId(sectionPatient.patient_id);
      const role = getUserRole();
      if (role === "ADMIN" || role === "INSTRUCTOR") {
        setDisplay(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch orders for the specific patient
  useEffect(() => {
    fetchOrders();
  }, [sectionId]);

  const handleOpenModal = (row = null, action = "edit") => {
    if (action === "edit") {
      setEditingRow(row);
      if (row) {
        setPatientOrderRecord({
          id: row.original.id,
          patient_id: row.original.patient_id,
          order_title: row.original.order_title,
          description: row.original.description,
          modified_date: row.original.modified_date,
        });
      } else {
        setPatientOrderRecord({
          id: "",
          patient_id: patientId,
          order_title: "",
          description: "",
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
        await updatePatientOrder(patientId, editingRow.original.id, {
          order_title: newPatientOrderRecord.order_title,
          description: newPatientOrderRecord.description,
        });

        setOrders((prevData) =>
          prevData.map((item) =>
            item.id === editingRow.original.id
              ? {
                  ...item,
                  ...newPatientOrderRecord,
                  modified_date: formattedTime,
                }
              : item
          )
        );
      } else {
        const response = await createPatientOrder(patientId, {
          order_title: newPatientOrderRecord.order_title,
          description: newPatientOrderRecord.description,
        });

        if (response && response.id) {
          const newOrder = {
            id: response.id,
            patient_id: patientId,
            order_title: newPatientOrderRecord.order_title,
            description: newPatientOrderRecord.description,
            modified_date: formattedTime,
          };

          setOrders((prevData) => [...prevData, newOrder]);
        }
      }
      setOpenModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    await deletePatientOrder(patientId, deletingRow.original.id);
    setOrders(orders.filter((item) => item.id !== deletingRow.original.id));
    setOpenDeleteModal(false);
  };

  const table = useMaterialReactTable({
    columns,
    data: orders,
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
          <Tooltip title="Add Patient Order">
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
          {editingRow ? "Edit Patient Order" : "Add Patient Order"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Order Title"
            fullWidth
            margin="dense"
            value={newPatientOrderRecord.order_title}
            onChange={(e) =>
              setPatientOrderRecord({
                ...newPatientOrderRecord,
                order_title: e.target.value,
              })
            }
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            margin="dense"
            value={newPatientOrderRecord.description}
            rows={4}
            onChange={(e) =>
              setPatientOrderRecord({
                ...newPatientOrderRecord,
                description: e.target.value,
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
