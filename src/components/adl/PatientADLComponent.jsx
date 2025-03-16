//Gabby Pierce
import React, { useState, useEffect, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  MenuItem,
  Checkbox,
  TextField,
  Modal,
  Button,
  Typography,
  Tooltip,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  Select,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  addADLRecord,
  deleteADLRecord,
  getADLRecords,
  updateADLRecord,
} from "../../services/patientADLService";
import { getSectionPatientById } from "../../services/sectionPatientService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { formatDateTime } from "../../utils/date-time-formatter";
// This is so that we are properly passing the day and time correctly.
// We want FE to display the date and time properly but pass it to the BE correctly.
dayjs.extend(utc);
dayjs.extend(timezone);

export default function PatientADLComponent({ sectionId }) {
  const [sectionPatientId, setSectionPatientId] = useState(null);
  const [adlRecords, setAdlRecords] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [newRecord, setNewRecord] = useState({
    id: "",
    section_patient_id: "",
    has_bathed: false,
    reposition: "",
    elimination_needed: "",
    is_meal_given: false,
    amount_meal_consumed: "0.00",
    created_date: "",
  });

  const columns = useMemo(() => [
    {
      accessorKey: "has_bathed",
      header: "Bathing",
      enableSorting: false,
      Cell: ({ row }) => (
        <Checkbox checked={row.original.has_bathed} disabled />
      ),
    },
    { accessorKey: "reposition", header: "Reposition" },
    { accessorKey: "elimination_needed", header: "Elimination Need" },
    {
      accessorKey: "is_meal_given",
      header: "Meal Given",
      enableSorting: false,
      Cell: ({ row }) => (
        <Checkbox checked={row.original.is_meal_given} disabled />
      ),
    },
    { accessorKey: "amount_meal_consumed", header: "% of Meal Consumed" },
    {
      accessorKey: "created_date",
      header: "Timestamp",
      enableSorting: false,
      Cell: ({ cell }) => formatDateTime(cell.getValue()),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      maxSize: 100,
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
    fetchSectionPatientId();
  }, [sectionId]);

  /*
  For educational purposes: This is the process behind getting data from our endpoints: 
  1. We get the section id from the url. 
  2. We set the section patient based on what we get from the backend
  3. We call the endpoint we're interested in (i.e. ADL record) and pass in the retrieved section patient id.
  */
  const fetchSectionPatientId = async () => {
    try {
      const sectionPatient = await getSectionPatientById(sectionId);
      const records = await getADLRecords(sectionPatient.id);
      setAdlRecords(records);
      setSectionPatientId(sectionPatient.id);
    } catch (error) {
      console.error(error);
    }
  };

  // Open modal for add/edit/delete
  const handleOpenModal = (row = null, action = "edit") => {
    if (action === "edit") {
      setEditingRow(row);
      if (row) {
        setNewRecord({
          id: row.original.id,
          section_patient_id: row.original.section_patient_id,
          has_bathed: row.original.has_bathed,
          reposition: row.original.reposition,
          elimination_needed: row.original.elimination_needed,
          is_meal_given: row.original.elimination_needed,
          amount_meal_consumed: row.original.amount_meal_consumed,
          created_date: row.original.created_date,
        });
      } else {
        setNewRecord({
          id: "",
          section_patient_id: sectionPatientId,
          has_bathed: false,
          reposition: "",
          elimination_needed: "",
          is_meal_given: false,
          amount_meal_consumed: "",
          created_date: "",
        });
      }
      setOpenModal(true);
    } else if (action === "delete") {
      setDeletingRow(row);
      setOpenDeleteModal(true);
    }
  };

  // Save new ADL record
  const handleSave = async () => {
    try {
      const formattedData = {
        has_oral_care: 0,
        has_bathed: newRecord.has_bathed ? 1 : 0,
        reposition: newRecord.reposition || "",
        elimination_needed: newRecord.elimination_needed || "",
        is_meal_given: newRecord.is_meal_given ? 1 : 0,
        amount_meal_consumed: parseFloat(
          newRecord.amount_meal_consumed
        ).toFixed(2),
      };

      if (editingRow) {
        await updateADLRecord(
          sectionPatientId,
          editingRow.original.id,
          formattedData
        );
        setAdlRecords((prevData) =>
          prevData.map((item) =>
            item.id === editingRow.original.id
              ? {
                  ...item,
                  ...newRecord,
                }
              : item
          )
        );
      } else {
        const formattedTime = dayjs()
          .tz("America/New_York")
          .format("YYYY-MM-DD HH:mm:ss");
        const response = await addADLRecord(sectionPatientId, formattedData);
        if (response && response.id) {
          const data = {
            id: response.id,
            has_oral_care: 0,
            has_bathed: newRecord.has_bathed,
            reposition: newRecord.reposition || "",
            elimination_needed: newRecord.elimination_needed || "",
            is_meal_given: newRecord.is_meal_given ? 1 : 0,
            amount_meal_consumed: parseFloat(
              newRecord.amount_meal_consumed
            ).toFixed(2),
            created_date: formattedTime
          };
          setAdlRecords((prevData) => [...prevData, data]);
        }
      }

      setOpenModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    await deleteADLRecord(sectionPatientId, deletingRow.original.id);
    setAdlRecords(
      adlRecords.filter((item) => item.id !== deletingRow.original.id)
    );
    setOpenDeleteModal(false);
  };

  const table = useMaterialReactTable({
    columns,
    data: adlRecords,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnFilters: false,
    enableFilterMatchHighlighting: false,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    renderTopToolbarCustomActions: () => (
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title="Add Patient ADL">
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
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
        <DialogTitle align="center">
          {editingRow ? "Edit Patient ADL" : "Add Patient ADL"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center">
            <Tooltip title="Has Bathed">
              <Checkbox
                checked={newRecord.has_bathed}
                onChange={(e) =>
                  setNewRecord({
                    ...newRecord,
                    has_bathed: e.target.checked,
                  })
                }
              />
            </Tooltip>
            <Typography>Bathed</Typography>
          </Box>
          <Select
            displayEmpty
            value={newRecord.reposition}
            fullWidth
            sx={{ mt: 1 }}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                reposition: e.target.value,
              })
            }
            renderValue={(selected) =>
              selected ? (
                selected
              ) : (
                <span style={{ color: "#757575" }}>
                  Select ADL Reposition Type
                </span>
              )
            }
          >
            <MenuItem value="Turn-left">Turn Left</MenuItem>
            <MenuItem value="Turn-right">Turn Right</MenuItem>
            <MenuItem value="Back">Back</MenuItem>
            <MenuItem value="Self-turn">Self-turn</MenuItem>
          </Select>
          <Select
            displayEmpty
            value={newRecord.elimination_needed}
            fullWidth
            sx={{ mt: 1 }}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                elimination_needed: e.target.value,
              })
            }
            renderValue={(selected) =>
              selected ? (
                selected
              ) : (
                <span style={{ color: "#757575" }}>
                  Select ADL Elimination Need Type
                </span>
              )
            }
          >
            <MenuItem value="Urinal">Urinal</MenuItem>
            <MenuItem value="Bedpan">Bedpan</MenuItem>
            <MenuItem value="Commode">Commode</MenuItem>
          </Select>
          <Box display="flex" alignItems="center">
            <Tooltip title="Is Meal Given">
              <Checkbox
                checked={newRecord.is_meal_given}
                onChange={(e) =>
                  setNewRecord({
                    ...newRecord,
                    is_meal_given: e.target.checked,
                  })
                }
              />
            </Tooltip>
            <Typography>Meal Given</Typography>
          </Box>
          <TextField
            label="% of Meal Consumed"
            type="number"
            value={newRecord.amount_meal_consumed}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                amount_meal_consumed: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />
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
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle align="center">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </DialogTitle>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={() => setOpenDeleteModal(false)}
            color="error"
            variant="contained"
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
