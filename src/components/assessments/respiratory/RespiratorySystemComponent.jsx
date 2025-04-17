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
  Box,
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

  const requiredFields = [
    "breathing_pattern",
    "breathing_effort",
    "anterior_right_upper_lobe",
    "posterior_right_upper_lobe",
    "anterior_lower_upper_lobe",
    "posterior_lower_upper_lobe",
    "anterior_right_middle_lobe",
    "posterior_right_middle_lobe",
    "anterior_right_lower_lobe",
    "posterior_right_lower_lobe",
    "anterior_left_lower_lobe",
    "posterior_left_lower_lobe",
    "oxygen_support_device",
    "oxygen_flow_rate",
    "sputum_amount",
    "sputum_color",
    "chest_tube_location",
    "chest_tube_suction",
  ];

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

  const handleSubmit = async () => {
    const updatedFormData = { ...formData };

    requiredFields.forEach((field) => {
      if (!updatedFormData[field] || updatedFormData[field].trim() === "") {
        updatedFormData[field] =
          field === "sputum_amount" || field === "oxygen_flow_rate" ? "0" : "N/A";
      }
    });

    setFormData(updatedFormData);

    const payload = {
      ...updatedFormData,
      has_oxygen_support: !!updatedFormData.has_oxygen_support,
      has_continuous_oxygen_pulse: !!updatedFormData.has_continuous_oxygen_pulse,
      has_incentive_spirometer_use: !!updatedFormData.has_incentive_spirometer_use,
    };

    try {
      if (respiratoryInfo && respiratoryInfo.id) {
        await updateRespiratoryInfo(sectionPatientId, respiratoryInfo.id, payload);
      } else {
        await addRespiratoryInfo(sectionPatientId, payload);
      }
    } catch (error) {
      console.error("Error saving respiratory info:", error);
    }
  };

  const renderField = (label, name, type = "text") => (
    <TextField
      label={label}
      name={name}
      value={formData[name]}
      onChange={handleChange}
      fullWidth
      required
      type={type}
      InputLabelProps={{ required: false }}
      error={formData[name] === ""}
      margin="dense"
      sx={{ backgroundColor: "white" }}
    />
  );

  return (
    <Paper elevation={3} style={{ padding: 20 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Respiratory Assessment
      </Typography>

      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {renderField("Breathing Pattern", "breathing_pattern")}
          </Grid>
          <Grid item xs={12} sm={6}>
            {renderField("Breathing Effort", "breathing_effort")}
          </Grid>

          <Grid item xs={12} sm={4}>
            {renderField("Anterior Left Upper Lobe", "anterior_lower_upper_lobe")}
            {renderField("Posterior Left Upper Lobe", "posterior_lower_upper_lobe")}
            {renderField("Anterior Left Lower Lobe", "anterior_left_lower_lobe")}
            {renderField("Posterior Left Lower Lobe", "posterior_left_lower_lobe")}
            {renderField("Anterior Right Upper Lobe", "anterior_right_upper_lobe")}
          </Grid>

          <Grid item xs={12} sm={4} container justifyContent="center" alignItems="center">
            <img src={lungsImage} alt="Lungs Diagram" style={{ width: "350px" }} />
          </Grid>

          <Grid item xs={12} sm={4}>
            {renderField("Posterior Right Upper Lobe", "posterior_right_upper_lobe")}
            {renderField("Anterior Right Middle Lobe", "anterior_right_middle_lobe")}
            {renderField("Posterior Right Middle Lobe", "posterior_right_middle_lobe")}
            {renderField("Anterior Right Lower Lobe", "anterior_right_lower_lobe")}
            {renderField("Posterior Right Lower Lobe", "posterior_right_lower_lobe")}
          </Grid>

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
            {renderField("Oxygen Support Device", "oxygen_support_device")}
          </Grid>
          <Grid item xs={12} sm={6}>
            {renderField("Oxygen Flow Rate", "oxygen_flow_rate")}
          </Grid>
          <Grid item xs={12} sm={6}>
            {renderField("Sputum Amount", "sputum_amount", "number")}
          </Grid>
          <Grid item xs={12} sm={6}>
            {renderField("Sputum Color", "sputum_color")}
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
            {renderField("Chest Tube Location", "chest_tube_location")}
          </Grid>
          <Grid item xs={12} sm={6}>
            {renderField("Chest Tube Suction", "chest_tube_suction")}
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
              {respiratoryInfo && respiratoryInfo.id ? "Update" : "Save"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default RespiratorySystemComponent;
