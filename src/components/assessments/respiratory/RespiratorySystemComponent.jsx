//gabby pierce
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { getSectionPatientById } from "../../../services/sectionPatientService";
import {
  getRespiratoryInfo,
  addRespiratoryInfo,
  updateRespiratoryInfo,
  deleteRespiratoryInfo,
} from "../../../services/respiratoryInfoService";
import lungsImage from "../../../assets/lungs.png";

const RespiratorySystemComponent = ({ sectionId }) => {
  const initialState = {
    breathing_pattern: "",
    breathing_effort: "",
    anterior_right_upper_lobe: "",
    posterior_right_upper_lobe: "",
    anterior_lower_upper_lobe: "",
    posterior_lower_upper_lobe: "",
    anterior_right_middle_lobe: "",
    posterior_right_middle_lobe: "",
    anterior_right_lower_lobe: "",
    posterior_right_lower_lobe: "",
    anterior_left_lower_lobe: "",
    posterior_left_lower_lobe: "",
    has_continuous_oxygen_pulse: false,
    has_oxygen_support: false,
    oxygen_support_device: "",
    oxygen_flow_rate: "",
    sputum_amount: "",
    sputum_color: "",
    has_incentive_spirometer_use: false,
    chest_tube_location: "",
    chest_tube_suction: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [respiratoryInfo, setRespiratoryInfo] = useState(null);
  const [sectionPatientId, setSectionPatientId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionPatient = await getSectionPatientById(sectionId);
        const spId = sectionPatient.id;
        setSectionPatientId(spId);

        const data = await getRespiratoryInfo(spId);
        if (data) {
          setRespiratoryInfo(data);
          setFormData(data);
        }
      } catch (error) {
        console.error("Error fetching respiratory info:", error);
      }
    };

    if (sectionId) {
      fetchData();
    }
  }, [sectionId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    delete payload.id;
    delete payload.section_patient_id;
    delete payload.created_by;
    delete payload.created_date;
    delete payload.modified_by;
    delete payload.modified_date;

    const parsedSputum = parseFloat(payload.sputum_amount);
    payload.sputum_amount = isNaN(parsedSputum) ? 0.0 : parsedSputum;
    payload.breathing_pattern = payload.breathing_pattern || "Normal";
    payload.oxygen_support_device = payload.oxygen_support_device || "None";
    payload.oxygen_flow_rate = payload.oxygen_flow_rate || "0";
    payload.sputum_color = payload.sputum_color || "None";

    payload.has_oxygen_support = !!payload.has_oxygen_support;
    payload.has_continuous_oxygen_pulse = !!payload.has_continuous_oxygen_pulse;
    payload.has_incentive_spirometer_use =
      !!payload.has_incentive_spirometer_use;

    console.log("Updating respiratory info with payload:", payload);
    try {
      if (respiratoryInfo && respiratoryInfo.id) {
        await updateRespiratoryInfo(
          sectionPatientId,
          respiratoryInfo.id,
          payload
        );
      } else {
        await addRespiratoryInfo(sectionPatientId, payload);
      }
    } catch (error) {
      console.error("Error saving respiratory info:", error);
    }
  };

  const handleDelete = async () => {
    if (respiratoryInfo && respiratoryInfo.id) {
      try {
        await deleteRespiratoryInfo(sectionPatientId, respiratoryInfo.id);
        setRespiratoryInfo(null);
        setFormData(initialState);
      } catch (error) {
        console.error("Error deleting respiratory info:", error);
      }
    }
  };

  return (
    <Paper elevation={3} style={{ padding: 20 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Respiratory Assessment
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Top row: Breathing Pattern & Breathing Effort */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Breathing Pattern"
              name="breathing_pattern"
              value={formData.breathing_pattern}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Breathing Effort"
              name="breathing_effort"
              value={formData.breathing_effort}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {/* Middle row: Left fields, Center Image, Right fields */}
          <Grid item xs={12} sm={4}>
            {/* Left lung fields */}
            <TextField
              label="Anterior Left Upper Lobe"
              name="anterior_lower_upper_lobe"
              margin="dense"
              value={formData.anterior_lower_upper_lobe}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Posterior Left Upper Lobe"
              name="posterior_lower_upper_lobe"
              margin="dense"
              value={formData.posterior_lower_upper_lobe}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Anterior Left Lower Lobe"
              name="anterior_left_lower_lobe"
              margin="dense"
              value={formData.anterior_left_lower_lobe}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Posterior Left Lower Lobe"
              name="posterior_left_lower_lobe"
              margin="dense"
              value={formData.posterior_left_lower_lobe}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Anterior Right Upper Lobe"
              name="anterior_right_upper_lobe"
              margin="dense"
              value={formData.anterior_right_upper_lobe}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={4}
            container
            justifyContent="center"
            alignItems="center"
          >
            {/* Center: Lungs image */}
            <img
              src={lungsImage}
              alt="Lungs Diagram"
              style={{ width: "200px" }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Posterior Right Upper Lobe"
              name="posterior_right_upper_lobe"
              margin="dense"
              value={formData.posterior_right_upper_lobe}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Anterior Right Middle Lobe"
              name="anterior_right_middle_lobe"
              margin="dense"
              value={formData.anterior_right_middle_lobe}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Posterior Right Middle Lobe"
              name="posterior_right_middle_lobe"
              margin="dense"
              value={formData.posterior_right_middle_lobe}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Anterior Right Lower Lobe"
              name="anterior_right_lower_lobe"
              margin="dense"
              value={formData.anterior_right_lower_lobe}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Posterior Right Lower Lobe"
              name="posterior_right_lower_lobe"
              margin="dense"
              value={formData.posterior_right_lower_lobe}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* Bottom row: Oxygen, Sputum and Other Fields */}
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.has_continuous_oxygen_pulse}
                  onChange={handleChange}
                  name="has_continuous_oxygen_pulse"
                />
              }
              label="Continuous Oxygen Pulse"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.has_oxygen_support}
                  onChange={handleChange}
                  name="has_oxygen_support"
                />
              }
              label="Oxygen Support"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Oxygen Support Device"
              name="oxygen_support_device"
              value={formData.oxygen_support_device}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Oxygen Flow Rate"
              name="oxygen_flow_rate"
              value={formData.oxygen_flow_rate}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Sputum Amount"
              name="sputum_amount"
              value={formData.sputum_amount}
              onChange={handleChange}
              fullWidth
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Sputum Color"
              name="sputum_color"
              value={formData.sputum_color}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.has_incentive_spirometer_use}
                  onChange={handleChange}
                  name="has_incentive_spirometer_use"
                />
              }
              label="Incentive Spirometer Use"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Chest Tube Location"
              name="chest_tube_location"
              value={formData.chest_tube_location}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Chest Tube Suction"
              name="chest_tube_suction"
              value={formData.chest_tube_suction}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Action Buttons */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              {respiratoryInfo && respiratoryInfo.id ? "Update" : "Save"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default RespiratorySystemComponent;
