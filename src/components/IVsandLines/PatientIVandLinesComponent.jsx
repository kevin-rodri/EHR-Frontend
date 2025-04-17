/*
Name: Charlize Aponte
Date: 2/22/25 
Remarks: This is the Iv and Lines component for the Iv and lines page 
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
  Checkbox,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { getSectionPatientById } from "../../services/sectionPatientService";
import {
  getPatientIVLine,
  addPatientIVLine,
  updatePatientIVLine,
  deletePatientIVLine,
} from "../../services/IVandLinesService";
import DeleteConfirmationModal from "../utils/DeleteModalComponent";

const PatientIVandLinesComponent = ({ sectionId }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [ivsAndLines, setIVsAndLines] = useState([]);
  const [sectionPatientId, setSectionPatientId] = useState(null);
  const [newIVLine, setNewIVLine] = useState({
    id: "",
    section_patient_id: "",
    iv_type: "",
    size: "",
    location: "",
    fluid_or_med_name: "",
    fluid_or_med_rate: "",
    patent: false,
    is_clinical_documentation_improvement: false,
  });

  const [touchedFields, setTouchedFields] = useState({
    iv_type: false,
    size: false,
    location: false,
    fluid_or_med_name: false,
    fluid_or_med_rate: false,
  });

  const isFormValid =
    (editingRow ||
      (touchedFields.iv_type &&
        touchedFields.size &&
        touchedFields.location &&
        touchedFields.fluid_or_med_name &&
        touchedFields.fluid_or_med_rate)) &&
    newIVLine.iv_type &&
    newIVLine.size.trim() &&
    newIVLine.location.trim() &&
    newIVLine.fluid_or_med_name.trim() &&
    newIVLine.fluid_or_med_rate.trim();

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const columns = useMemo(
    () => [
      { accessorKey: "iv_type", header: "Type", size: 150 },
      { accessorKey: "size", header: "Size", size: 150 },
      { accessorKey: "location", header: "Location", size: 150 },
      {
        accessorKey: "fluid_or_med_name",
        header: "Fluid or Med Name",
        size: 150,
      },
      {
        accessorKey: "fluid_or_med_rate",
        header: "Fluid or Med Rate",
        size: 150,
      },
      {
        accessorKey: "patent",
        header: "Patent",
        size: 100,
        enableSorting: false,
        Cell: ({ row }) => <Checkbox checked={row.original.patent} disabled />,
      },
      {
        accessorKey: "is_clinical_documentation_improvement",
        header: "CDI",
        size: 100,
        enableSorting: false,
        Cell: ({ row }) => (
          <Checkbox
            checked={row.original.is_clinical_documentation_improvement}
            disabled
          />
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 150,
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
    ],
    []
  );

  // Fetching IV lines data when sectionPatientId changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionPatient = await getSectionPatientById(sectionId);
        const patientId = sectionPatient.id;
        const data = await getPatientIVLine(patientId);
        setIVsAndLines(data);
        setSectionPatientId(patientId);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [sectionId]);

  // Deleting an IV line
  const handleDelete = async () => {
    await deletePatientIVLine(sectionPatientId, deletingRow.original.id);
    setIVsAndLines(
      ivsAndLines.filter((row) => row.id !== deletingRow.original.id)
    );
    setOpenDeleteModal(false);
  };

  const handleOpenModal = (row = null, action = "edit") => {
    if (action === "edit") {
      setEditingRow(row);
      if (row) {
        setNewIVLine({
          id: row.original.id,
          section_patient_id: row.original.section_patient_id,
          iv_type: row.original.iv_type,
          size: row.original.size,
          location: row.original.location,
          fluid_or_med_name: row.original.fluid_or_med_name,
          fluid_or_med_rate: row.original.fluid_or_med_rate,
          patent: row.original.patent,
          is_clinical_documentation_improvement:
            row.original.is_clinical_documentation_improvement,
        });
      } else {
        setNewIVLine({
          id: "",
          section_patient_id: sectionPatientId,
          iv_type: "",
          size: "",
          location: "",
          fluid_or_med_name: "",
          fluid_or_med_rate: "",
          patent: false,
          is_clinical_documentation_improvement: false,
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
      const payload = {
        iv_type: newIVLine.iv_type,
        size: newIVLine.size,
        location: newIVLine.location,
        fluid_or_med_name: newIVLine.fluid_or_med_name,
        fluid_or_med_rate: newIVLine.fluid_or_med_rate,
        patent: newIVLine.patent,
        is_clinical_documentation_improvement:
          newIVLine.is_clinical_documentation_improvement,
      };

      if (editingRow) {
        await updatePatientIVLine(
          sectionPatientId,
          editingRow.original.id,
          payload
        );
        setIVsAndLines((prevData) =>
          prevData.map((item) =>
            item.id === editingRow.original.id ? { ...item, ...payload } : item
          )
        );
      } else {
        const response = await addPatientIVLine(sectionPatientId, payload);
        if (response && response.id) {
          setIVsAndLines((prevData) => [
            ...prevData,
            { ...payload, id: response.id },
          ]);
        }
      }
      setOpenModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: ivsAndLines,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnFilters: false,
    enableFilterMatchHighlighting: false,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    renderTopToolbarCustomActions: () => (
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title="Add IV and Line">
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
          {editingRow ? "Edit IV and Line" : "Add IV and Line"}
        </DialogTitle>
        <DialogContent>
          <Select
            displayEmpty
            value={newIVLine.iv_type}
            fullWidth
            margin="dense"
            required
            error={touchedFields.iv_type && newIVLine.iv_type === ""}
            onChange={(e) =>
              setNewIVLine({
                ...newIVLine,
                iv_type: e.target.value,
              })
            }
            onBlur={() => handleBlur("iv_type")}
            renderValue={(selected) =>
              selected ? (
                selected
              ) : (
                <span style={{ color: "#757575" }}>
                  Select IV and Line Type{" "}
                </span>
              )
            }
          >
            <MenuItem value="Peripheral">Peripheral</MenuItem>
            <MenuItem value="Central-line">Central Line</MenuItem>
            <MenuItem value="I/O">I/O</MenuItem>
            <MenuItem value="Permacath">Permacath</MenuItem>
            <MenuItem value="Midline">Midline</MenuItem>
            <MenuItem value="PICC">PICC</MenuItem>
            <MenuItem value="Hickman">Hickman</MenuItem>
          </Select>
          <TextField
            label="Size"
            value={newIVLine.size}
            onChange={(e) =>
              setNewIVLine({ ...newIVLine, size: e.target.value })
            }
            fullWidth
            margin="dense"
            required
            onBlur={() => handleBlur("size")}
            error={touchedFields.size && newIVLine.size === ""}
            sx={{ backgroundColor: "white", mt: 1 }}
          />

          <TextField
            label="Location"
            value={newIVLine.location}
            onChange={(e) =>
              setNewIVLine({ ...newIVLine, location: e.target.value })
            }
            fullWidth
            margin="dense"
            onBlur={() => handleBlur("location")}
            required
            error={touchedFields.location && newIVLine.location === ""}
          />

          <TextField
            label="Fluid or Medication Name"
            value={newIVLine.fluid_or_med_name}
            onChange={(e) =>
              setNewIVLine({ ...newIVLine, fluid_or_med_name: e.target.value })
            }
            fullWidth
            margin="dense"
            required
            onBlur={() => handleBlur("fluid_or_med_name")}
            error={
              touchedFields.fluid_or_med_name &&
              newIVLine.fluid_or_med_name === ""
            }
          />

          <TextField
            label="Fluid or Medication Rate"
            value={newIVLine.fluid_or_med_rate}
            onChange={(e) =>
              setNewIVLine({ ...newIVLine, fluid_or_med_rate: e.target.value })
            }
            fullWidth
            margin="dense"
            required
            onBlur={() => handleBlur("fluid_or_med_rate")}
            error={
              touchedFields.fluid_or_med_rate &&
              newIVLine.fluid_or_med_rate === ""
            }
          />

          <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
            <Tooltip title="Patent">
              <Checkbox
                checked={newIVLine.patent}
                onChange={(e) =>
                  setNewIVLine({ ...newIVLine, patent: e.target.checked })
                }
              />
            </Tooltip>
            <Typography>Patent</Typography>
          </Box>

          <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
            <Tooltip title="Clinical Documentation Improvement">
              <Checkbox
                checked={newIVLine.is_clinical_documentation_improvement}
                onChange={(e) =>
                  setNewIVLine({
                    ...newIVLine,
                    is_clinical_documentation_improvement: e.target.checked,
                  })
                }
              />
            </Tooltip>
            <Typography>Clinical Documentation Improvement</Typography>
          </Box>
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
};

export default PatientIVandLinesComponent;
