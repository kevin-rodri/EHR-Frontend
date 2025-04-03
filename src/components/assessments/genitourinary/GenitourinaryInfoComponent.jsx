//gabby pierce
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  Tooltip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import DeleteConfirmationModal from "../../utils/DeleteModalComponent";
import {
  getGenitourinaryInfo,
  addGenitourinaryInfo,
  updateGenitourinaryInfo,
  deleteGenitourinaryInfo
} from "../../../services/GenitourinaryInfoService";
import { getSectionPatientById } from "../../../services/sectionPatientService";

dayjs.extend(utc);
dayjs.extend(timezone);


export default function GenitourinaryInfoComponent({ sectionId }) {
  const [sectionPatientId, setSectionPatientId] = useState("");
  //const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    urinary_assessment: "",
    urinary_diversion_notes: "",
    urinary_route: "",
    urine_color: "",
    urine_characteristics: "",
    urine_odor: "",
    has_dialysis: false,
    date_of_last_treatment: dayjs().utc().toISOString(),
    dialysis_access_type: "",
    has_dialysis_access_dressing_cdi: false,
    foley_catheter: "",
    foley_removed: dayjs().utc().toISOString(),
  });

  // Fetch the section patient record using the section ID from the URL
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionPatient = await getSectionPatientById(sectionId);
        // Set the correct section patient ID
        setSectionPatientId(sectionPatient.id);

        try {
          const data = await getGenitourinaryInfo(sectionPatient.id);
          setFormData(data);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.warn("Genitourinary info not found; treating as no record found");
          } else {
            console.error("Error fetching Genitourinary info:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching section patient data:", error);
      }
    };

    if (sectionId) {
      fetchData();
    }
  }, [sectionId]);

  // Open modal for add/edit/delete
    const handleOpenModal = (row = null, action = "edit") => {
      if (action === "edit") {
        setEditingRow(row);
        if (row) {
          setFormData({
            id: row.original.id,
            section_patient_id: row.original.section_patient_id,
            urinary_assessment: row.original.urinary_assessment,
            urinary_diversion_notes: row.original.urinary_diversion_notes,
            urinary_route: row.original.urinary_route,
            urine_color: row.original.urine_color,
            urine_characteristics: row.original.urine_characteristics,
            urine_odor: row.original.urine_odor,
            has_dialysis: row.original.has_dialysis,
            date_of_last_treatment: row.original.date_of_last_treatment,
            dialysis_access_type: row.original.dialysis_access_type,
            has_dialysis_access_dressing_cdi: row.original.has_dialysis_access_dressing_cdi,
            foley_catheter: row.original.foley_catheter,
            foley_removed: row.original.foley_removed,
          });
        } else {
          setFormData({
            id: "",
            section_patient_id: sectionPatientId,
            urinary_assessment: "",
            urinary_diversion_notes: "",
            urinary_route: "",
            urine_color: "",
            urine_characteristics: "",
            urine_odor: "",
            has_dialysis: false,
            date_of_last_treatment: dayjs().utc().toISOString(),
            dialysis_access_type: "",
            has_dialysis_access_dressing_cdi: false,
            foley_catheter: "",
            foley_removed: dayjs().utc().toISOString(),
          });
        }
        setOpenModal(true);
      } else if (action === "delete") {
        setDeletingRow(row);
        setOpenDeleteModal(true);
      }
    };

  const handleSubmit = async () => {
    try {
    var response;
      const payload = {
        urinary_assessment: formData.urinary_assessment || "N/A",
        urinary_diversion_notes: formData.urinary_diversion_notes || "N/A",
        urinary_route: formData.urinary_route || "N/A",
        urine_color: formData.urine_color || "N/A",
        urine_characteristics: formData.urine_characteristics || "N/A",
        urine_odor: formData.urine_odor || "N/A",
        has_dialysis: formData.has_dialysis,
        date_of_last_treatment: formData.date_of_last_treatment,
        dialysis_access_type: formData.dialysis_access_type || "N/A",
        has_dialysis_access_dressing_cdi: formData.has_dialysis_access_dressing_cdi,
        foley_catheter: formData.foley_catheter || "N/A",
        foley_removed: formData.foley_removed,
      };

      if (formData && formData.id) {
        response = await updateGenitourinaryInfo(sectionPatientId, formData.id, payload);
      } else {
        response = await addGenitourinaryInfo(sectionPatientId, payload);
      }
      // Re-fetch the record to update UI
      setFormData(response);
      setModalOpen(false);
    } catch (error) {
      console.error("Error submitting Genitourinary info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (formData && formData.id) {
      try {
        await deleteGenitourinaryInfo(sectionPatientId, formData.id);
        // Reset formData to initial state
        setFormData({
          id: "",
          urinary_assessment: "",
          urinary_diversion_notes: "",
          urinary_route: "",
          urine_color: "",
          urine_characteristics: "",
          urine_odor: "",
          has_dialysis: false,
          date_of_last_treatment: dayjs().utc().toISOString(),
          dialysis_access_type: "",
          has_dialysis_access_dressing_cdi: false,
          foley_catheter: "",
          foley_removed: dayjs().utc().toISOString(),
        });
        setDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: "white", p: 2, borderRadius: 2, boxShadow: 1 }}>
      {/* Header with Add/Edit/Delete buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Genitourinary Information</Typography>
        <Box>
          { editingRow ? (
            <>
              <Tooltip title="Edit">
                <IconButton onClick={() => handleOpenModal(true)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => setDeleteModalOpen(true)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal(true)}>
              Add New Entry
            </Button>
          )}
        </Box>
      </Box>

      {/* Display record details if available */}
        <Box>
          <Typography><strong>Urinary Assessment:</strong> {formData.urinary_assessment}</Typography>
          <Typography><strong>Diversion Notes:</strong> {formData.urinary_diversion_notes}</Typography>
          <Typography><strong>Route:</strong> {formData.urinary_route}</Typography>
          <Typography><strong>Urine Color:</strong> {formData.urine_color}</Typography>
          <Typography><strong>Characteristics:</strong> {formData.urine_characteristics}</Typography>
          <Typography><strong>Odor:</strong> {formData.urine_odor}</Typography>
          <Typography><strong>Dialysis:</strong> {formData.has_dialysis ? "Yes" : "No"}</Typography>
          <Typography>
            <strong>Last Treatment:</strong>{" "}
            {formData.date_of_last_treatment ? dayjs(formData.date_of_last_treatment).format("MM/DD/YYYY hh:mm A") : "N/A"}
          </Typography>
          <Typography><strong>Access Type:</strong> {formData.dialysis_access_type}</Typography>
          <Typography>
            <strong>Dressing Change:</strong> {formData.has_dialysis_access_dressing_cdi ? "Yes" : "No"}
          </Typography>
          <Typography><strong>Foley Catheter:</strong> {formData.foley_catheter}</Typography>
          <Typography>
            <strong>Foley Removed:</strong>{" "}
            {formData.foley_removed ? dayjs(formData.foley_removed).format("MM/DD/YYYY hh:mm A") : "N/A"}
          </Typography>
        </Box>
        <Typography>No Genitourinary record found.</Typography>

      {/* Modal for Add/Edit */}
      <Dialog open={modalOpen} onClose={() => setOpenModal(false)} fullWidth>
        <DialogTitle align="center">
          {editingRow ? "Edit Genitourinary Record" : "Add Genitourinary Record"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Urinary Assessment"
            fullWidth
            value={formData.urinary_assessment}
            onChange={(e) =>
              setFormData({ ...formData, urinary_assessment: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Diversion Notes"
            fullWidth
            value={formData.urinary_diversion_notes}
            onChange={(e) =>
              setFormData({ ...formData, urinary_diversion_notes: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Urinary Route"
            fullWidth
            value={formData.urinary_route}
            onChange={(e) =>
              setFormData({ ...formData, urinary_route: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Urine Color"
            fullWidth
            value={formData.urine_color}
            onChange={(e) =>
              setFormData({ ...formData, urine_color: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Urine Characteristics"
            fullWidth
            value={formData.urine_characteristics}
            onChange={(e) =>
              setFormData({ ...formData, urine_characteristics: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Urine Odor"
            fullWidth
            value={formData.urine_odor}
            onChange={(e) =>
              setFormData({ ...formData, urine_odor: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.has_dialysis}
                onChange={(e) =>
                  setFormData({ ...formData, has_dialysis: e.target.checked })
                }
              />
            }
            label="Dialysis"
            sx={{ mt: 2 }}
          />
          <TextField
            label="Date of Last Treatment"
            fullWidth
            type="datetime-local"
            value={dayjs(formData.date_of_last_treatment).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) =>
              setFormData({
                ...formData,
                date_of_last_treatment: dayjs(e.target.value).toISOString(),
              })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Dialysis Access Type"
            fullWidth
            value={formData.dialysis_access_type}
            onChange={(e) =>
              setFormData({ ...formData, dialysis_access_type: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.has_dialysis_access_dressing_change}
                onChange={(e) =>
                  setFormData({ ...formData, has_dialysis_access_dressing_cdi: e.target.checked })
                }
              />
            }
            label="Dialysis Access Dressing Change"
            sx={{ mt: 2 }}
          />
          <TextField
            label="Foley Catheter"
            fullWidth
            value={formData.foley_catheter}
            onChange={(e) =>
              setFormData({ ...formData, foley_catheter: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Foley Removed"
            fullWidth
            type="datetime-local"
            value={dayjs(formData.foley_removed).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) =>
              setFormData({
                ...formData,
                foley_removed: dayjs(e.target.value).toISOString(),
              })
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {editingRow ? "Update" : "Submit"}
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
