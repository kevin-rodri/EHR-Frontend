//Gabby Pierce
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
import {
  getNotesForPatient,
  deleteNoteForPatient,
  addNoteForPatient,
  updateNoteForPatient,
} from "../../services/PatientNotesService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { getSectionPatientById } from "../../services/sectionPatientService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { formatDateTime } from "../../utils/date-time-formatter";
import DeleteConfirmationModal from "../utils/DeleteModalComponent";
// This is so that we are properly passing the day and time correctly.
// We want FE to display the date and time properly but pass it to the BE correctly.
dayjs.extend(utc);
dayjs.extend(timezone);

function PatientNotesTableComponent({ sectionId }) {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [notes, setNotes] = useState([]);
  const [sectionPatientId, setSectionPatientId] = useState(null);
  const [newPatientNoteRecord, setNewPatientNoteRecord] = useState({
    id: "",
    section_patient_id: "",
    title: "",
    description: "",
    modified_date: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const columns = useMemo(() => [
    { accessorKey: "title", header: "Title"},
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "modified_date",
      header: "Timestamp",
      size: 150,
      Cell: ({ cell }) => formatDateTime(cell.getValue()),
    },
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
  ]);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const sectionPatient = await getSectionPatientById(sectionId);
        const sectionPatientId = sectionPatient.id;
        const notesData = await getNotesForPatient(sectionPatientId);
        setNotes(notesData);
        setSectionPatientId(sectionPatientId);
      } catch (error) {
        console.error(error);
      }
    }
    fetchNotes();
  }, [sectionId]);

  // Open modal for add/edit/delete
  const handleOpenModal = (row = null, action = "edit") => {
    setFormSubmitted(false);

    if (action === "edit") {
      setEditingRow(row);
      if (row) {
        setNewPatientNoteRecord({
          id: row.original.id,
          section_patient_id: row.original.section_patient_id,
          title: row.original.title,
          description: row.original.description,
          modified_date: row.original.modified_date,
        });
      } else {
        setNewPatientNoteRecord({
          id: "",
          section_patient_id: sectionPatientId,
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

  const handleSave = async () => {
    try {
      const formattedTime = dayjs()
        .tz("America/New_York")
        .format("YYYY-MM-DD HH:mm:ss");

      if (editingRow) {
        await updateNoteForPatient(sectionPatientId, editingRow.original.id, {
          title: newPatientNoteRecord.title,
          description: newPatientNoteRecord.description,
        });

        setNotes((prevData) =>
          prevData.map((item) =>
            item.id === editingRow.original.id
              ? {
                  ...item,
                  ...newPatientNoteRecord,
                  modified_date: formattedTime,
                }
              : item
          )
        );
      } else {
        const response = await addNoteForPatient(sectionPatientId, {
          title: newPatientNoteRecord.title,
          description: newPatientNoteRecord.description,
        });

        if (response && response.id) {
          const newNote = {
            id: response.id,
            section_patient_id: sectionPatientId,
            title: newPatientNoteRecord.title,
            description: newPatientNoteRecord.description,
            modified_date: formattedTime,
          };

          setNotes((prevData) => [...prevData, newNote]);
        }
      }
      setOpenModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    await deleteNoteForPatient(sectionPatientId, deletingRow.original.id);
    setNotes(notes.filter((item) => item.id !== deletingRow.original.id));
    setOpenDeleteModal(false);
  };

  const table = useMaterialReactTable({
    columns,
    data: notes,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnFilters: false,
    enableFilterMatchHighlighting: false,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    renderTopToolbarCustomActions: () => (
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title="Add Patient Note">
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
          {editingRow ? "Edit Patient Note" : "Add Patient Note"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Note Title"
            fullWidth
            margin="dense"
            required
            value={newPatientNoteRecord.title}
            error={formSubmitted && newPatientNoteRecord.title.trim() === ""}
              helperText={
                formSubmitted && newPatientNoteRecord.title.trim() === ""
                  ? "Required Field"
                  : ""
              }
            onChange={(e) =>
              setNewPatientNoteRecord({
                ...newPatientNoteRecord,
                title: e.target.value,
              })
            }
            InputLabelProps={{ required: false }}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            margin="dense"
            value={newPatientNoteRecord.description}
            rows={4}
            required
            error={formSubmitted && newPatientNoteRecord.description.trim() === ""}
              helperText={
                formSubmitted && newPatientNoteRecord.description.trim() === ""
                  ? "Required Field"
                  : ""
              }
            onChange={(e) =>
              setNewPatientNoteRecord({
                ...newPatientNoteRecord,
                description: e.target.value,
              })
            }
            InputLabelProps={{ required: false }}
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
            onClick={async () => {
              setFormSubmitted(true);

              const { title, description } = newPatientNoteRecord;
              if (title.trim() === "" || description.trim() === "") {
                return;
              }

              await handleSave();
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

export default PatientNotesTableComponent;
