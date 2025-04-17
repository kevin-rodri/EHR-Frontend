import React, { useState, useEffect, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { getScales } from "../../services/patientPainScaleService";
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
import FLACC from "../../assets/flacc-scale.jpg";
import FACES from "../../assets/faces-scale.jpg";
import NUMERICAL from "../../assets/numerical-pain-scale.jpg";
import DeleteConfirmationModal from "../utils/DeleteModalComponent";
import { getSectionPatientById } from "../../services/sectionPatientService";
import {
  getPatientPainScaleResult,
  addPatientPainScaleResult,
  updatePatientPainScaleResult,
  deletePatientPainScaleResult,
} from "../../services/patientPainScaleResultService";
import { formatDateTime } from "../../utils/date-time-formatter";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

export default function PatientPainScaleComponent({ sectionId }) {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [scales, setScales] = useState([]);
  const [scaleResult, setScaleResults] = useState([]);
  const [selectedScale, setSelectedScale] = useState(null);
  const [sectionPatientId, setSectionPatientId] = useState(null);
  const [display, setDisplay] = useState(false);
  const [flaccScores, setFlaccScores] = useState({
    faces: 0,
    legs: 0,
    activity: 0,
    cry: 0,
    consolability: 0,
  });

  // Soley for the patient scale result
  const [newScaleRecord, setNewScaleRecord] = useState({
    id: "",
    section_patient_id: "",
    pain_scale_id: "",
    pain_scale_value: "",
    pain_scale_text: "",
    modified_date: "",
  });
  const [touchedFields, setTouchedFields] = useState({
    pain_scale_value: false,
  });

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };
  const isFLACC = () => {
    const scaleName =
      selectedScale?.scale_name ||
      scales.find((s) => s.id === newScaleRecord.pain_scale_id)?.scale_name;
    return scaleName === "FLACC";
  };

  const isFormValid = isFLACC()
  ? true // FLACC scales are always valid (score is auto-calculated)
  : touchedFields.pain_scale_value &&
    newScaleRecord.pain_scale_value !== "" &&
    !isNaN(Number(newScaleRecord.pain_scale_value)) &&
    Number(newScaleRecord.pain_scale_value) >= 1 &&
    Number(newScaleRecord.pain_scale_value) <= 10;



  const columns = useMemo(() => [
    { accessorKey: "scale_name", header: "Pain Scale Name", size: 150 },
    { accessorKey: "pain_scale_value", header: "Pain Scale Value", size: 150 },
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

  // Open modal for add/edit/delete
  const handleOpenModal = (row = null, action = "edit") => {
    if (action === "edit") {
      setEditingRow(row);
      if (row) {
        setNewScaleRecord({
          id: row.original.id,
          section_patient_id: row.original.section_patient_id,
          pain_scale_id: row.original.pain_scale_id,
          pain_scale_value: row.original.pain_scale_value,
          pain_scale_text: row.original.pain_scale_text,
          modified_date: row.original.modified_date,
        });

        const selected = scales.find(
          (s) => s.id === row.original.pain_scale_id
        );
        setSelectedScale(selected || null);

        if (selected?.scale_name === "FLACC") {
          const stored = row.original.flacc_values;
          setFlaccScores(
            stored && typeof stored === "object"
              ? stored
              : { faces: 0, legs: 0, activity: 0, cry: 0, consolability: 0 }
          );
        }
      } else {
        setNewScaleRecord({
          id: "",
          section_patient_id: sectionPatientId,
          pain_scale_id: "", // Have this be the scale seclected id.
          pain_scale_value: "",
          pain_scale_text: "",
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
    const formattedTime = dayjs()
      .tz("America/New_York")
      .format("YYYY-MM-DD HH:mm:ss");
    if (editingRow) {
      const scale = scales.find((s) => s.id === newScaleRecord.pain_scale_id);

      setScaleResults((prevData) =>
        prevData.map((item) =>
          item.id === editingRow.original.id
            ? {
                ...item,
                ...newScaleRecord,
                modified_date: formattedTime,
                scale_name: scale?.scale_name,
                flacc_values:
                  scale?.scale_name === "FLACC"
                    ? { ...flaccScores }
                    : undefined,
              }
            : item
        )
      );

      await updatePatientPainScaleResult(
        sectionPatientId,
        editingRow.original.id,
        {
          pain_scale_id: newScaleRecord.pain_scale_id,
          pain_scale_value: newScaleRecord.pain_scale_value,
          pain_scale_text: newScaleRecord.pain_scale_text,
          modified_date: formattedTime,
        }
      );
    } else {
      await addPatientPainScaleResult(sectionPatientId, {
        pain_scale_id: newScaleRecord.pain_scale_id,
        pain_scale_value: newScaleRecord.pain_scale_value,
        pain_scale_text: newScaleRecord.pain_scale_text,
        modified_date: formattedTime,
      });
      const scale = scales.find((s) => s.id === newScaleRecord.pain_scale_id);

      setScaleResults((prevData) => [
        ...prevData,
        {
          ...newScaleRecord,
          id: Date.now().toString(),
          modified_date: formattedTime,
          scale_name: scale?.scale_name,
          flacc_values:
            scale?.scale_name === "FLACC" ? { ...flaccScores } : undefined,
        },
      ]);
    }
    setSelectedScale(null);

    setOpenModal(false);
  };

  // Delete user
  const handleDelete = async () => {
    await deletePatientPainScaleResult(
      sectionPatientId,
      deletingRow.original.id
    );
    setScaleResults(
      scaleResult.filter((item) => item.id !== deletingRow.original.id)
    );
    setOpenDeleteModal(false);
  };

  // This just a helper for getting the right scale image
  const getPainScaleImage = (scaleName) => {
    switch (scaleName) {
      case "FLACC":
        return FLACC;
      case "Faces":
        return FACES;
      case "Numerical":
        return NUMERICAL;
      default:
        return "";
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        if (sectionId == null) return;
        const sectionPatient = await getSectionPatientById(sectionId);
        const scales = await getScales();
        const scaleResult = await getPatientPainScaleResult(sectionPatient.id);
        setScales(scales);
        setSectionPatientId(sectionPatient.id);
        const enrichedResults = scaleResult.map((entry) => {
          const scale = scales.find((s) => s.id === entry.pain_scale_id);
          return {
            ...entry,
            scale_name: scale?.scale_name || "Unknown",
          };
        });

        setScaleResults(enrichedResults);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [sectionId]);

  useEffect(() => {
    if (isFLACC()) {
      const total = Object.values(flaccScores).reduce(
        (sum, val) => sum + Number(val || 0),
        0
      );
      setNewScaleRecord((prev) => ({
        ...prev,
        pain_scale_value: total.toString(),
      }));
    }
  }, [flaccScores]);

  const table = useMaterialReactTable({
    columns,
    data: scaleResult,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnFilters: false,
    enableFilterMatchHighlighting: false,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: 1,
      }}
    >
      <Select
        fullWidth
        margin="dense"
        value={selectedScale ? selectedScale.scale_name : ""}
        displayEmpty
        onChange={(e) => {
          const selected = scales.find((s) => s.scale_name === e.target.value);
          setSelectedScale(selected);

          setNewScaleRecord({
            id: "",
            section_patient_id: sectionPatientId,
            pain_scale_id: selected.id,
            pain_scale_value: "",
            pain_scale_text: "",
            modified_date: "",
          });

          if (selected?.scale_name === "FLACC") {
            setFlaccScores({
              faces: 0,
              legs: 0,
              activity: 0,
              cry: 0,
              consolability: 0,
            });
          }

          setEditingRow(null);
          setOpenModal(true);
        }}
      >
        <MenuItem value="" disabled>
          Select Pain Scale
        </MenuItem>
        {scales.map((scale) => (
          <MenuItem key={scale.id} value={scale.scale_name}>
            {scale.scale_name}
          </MenuItem>
        ))}
      </Select>

      <Box sx={{ width: "100%" }}>
        <MaterialReactTable table={table} />
      </Box>

      {/* Modal for Create/Edit */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle align="center">
          {editingRow ? "Edit Scale Result" : "Add Scale Result"}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 2,
            }}
          >
            <img
              src={getPainScaleImage(
                selectedScale?.scale_name ||
                  scales.find((s) => s.id === newScaleRecord.pain_scale_id)
                    ?.scale_name
              )}
              alt="Pain Scale"
              style={{ width: "450px" }}
            />
          </Box>
          {isFLACC() ? (
            <>
              {["faces", "legs", "activity", "cry", "consolability"].map(
                (key) => (
                  <TextField
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    type="number"
                    fullWidth
                    margin="dense"
                    inputProps={{ min: 0, max: 2 }}
                    value={flaccScores[key]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= 0 && value <= 2) {
                        setFlaccScores({ ...flaccScores, [key]: value });
                      }
                    }}
                  />
                )
              )}
            </>
          ) : (
            <TextField
              label="Pain Scale Score"
              fullWidth
              type="number"
              margin="dense"
              inputProps={{ min: 1, max: 10 }}
              value={newScaleRecord.pain_scale_value}
              onChange={(e) =>
                setNewScaleRecord({
                  ...newScaleRecord,
                  pain_scale_value: e.target.value,
                })
              }
              required
              onBlur={() => handleBlur("pain_scale_value")}
              error={
                touchedFields.pain_scale_value &&
                newScaleRecord.pain_scale_value === ""
              }
            />
          )}

          <TextField
            label="Pain Scale Text"
            fullWidth
            margin="dense"
            multiline
            rows={4}
            value={newScaleRecord.pain_scale_text}
            onChange={(e) =>
              setNewScaleRecord({
                ...newScaleRecord,
                pain_scale_text: e.target.value,
              })
            }
          />
        </DialogContent>

        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={() => {
              setOpenModal(false);
              setSelectedScale(null);
            }}
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
