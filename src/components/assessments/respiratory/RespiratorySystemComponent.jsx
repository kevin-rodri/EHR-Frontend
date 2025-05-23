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
  Select,
  MenuItem,
} from "@mui/material";
import { getSectionPatientById } from "../../../services/sectionPatientService";
import {
  getRespiratoryInfo,
  addRespiratoryInfo,
  updateRespiratoryInfo,
  deleteRespiratoryInfo,
} from "../../../services/respiratoryInfoService";
import lungsImage from "../../../assets/lungs.png";
import { useSnackbar } from "../../utils/Snackbar";

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
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const [touchedFields, setTouchedFields] = useState({
    breathing_pattern: false,
    breathing_effort: false,
    anterior_right_upper_lobe: false,
    posterior_right_upper_lobe: false,
    anterior_lower_upper_lobe: false,
    posterior_lower_upper_lobe: false,
    anterior_right_middle_lobe: false,
    posterior_right_middle_lobe: false,
    anterior_right_lower_lobe: false,
    posterior_right_lower_lobe: false,
    anterior_left_lower_lobe: false,
    posterior_left_lower_lobe: false,
    oxygen_support_device: false,
    oxygen_flow_rate: false,
    sputum_amount: false,
    sputum_color: false,
    chest_tube_location: false,
    chest_tube_suction: false,
  });
  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const isFormValid = () => {
    return (
      touchedFields.breathing_pattern &&
      touchedFields.breathing_effort &&
      touchedFields.anterior_right_upper_lobe &&
      touchedFields.posterior_right_upper_lobe &&
      touchedFields.anterior_lower_upper_lobe &&
      touchedFields.posterior_lower_upper_lobe &&
      touchedFields.anterior_right_middle_lobe &&
      touchedFields.posterior_right_middle_lobe &&
      touchedFields.anterior_right_lower_lobe &&
      touchedFields.posterior_right_lower_lobe &&
      touchedFields.anterior_left_lower_lobe &&
      touchedFields.posterior_left_lower_lobe &&
      touchedFields.oxygen_support_device &&
      touchedFields.oxygen_flow_rate &&
      touchedFields.sputum_amount &&
      touchedFields.sputum_color &&
      touchedFields.chest_tube_location &&
      touchedFields.chest_tube_suction
    );
  };

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

  useEffect(() => {
    const updatedTouched = {};
    Object.keys(touchedFields).forEach((key) => {
      updatedTouched[key] = !!formData[key];
    });
    setTouchedFields(updatedTouched);
  }, [formData]);

  
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
        showSnackbar(
          "Respiratory information updated successfully!",
          "success"
        );
      } else {
        await addRespiratoryInfo(sectionPatientId, payload);
        showSnackbar(
          "Respiratory information updated successfully!",
          "success"
        );
      }
    } catch (error) {
      console.error("Error saving respiratory info:", error);
      showSnackbar("Error saving respiratory information", "error");
    }
  };

  const handleDelete = async () => {
    if (respiratoryInfo && respiratoryInfo.id) {
      try {
        await deleteRespiratoryInfo(sectionPatientId, respiratoryInfo.id);
        setRespiratoryInfo(null);
        setFormData(initialState);
        showSnackbar(
          "Respiratory information updated successfully!",
          "success"
        );
      } catch (error) {
        console.error("Error deleting respiratory info:", error);
        showSnackbar("Error deleting respiratory information", "error");
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
            <Select
              displayEmpty
              label="Breathing Pattern"
              name="breathing_pattern"
              value={formData.breathing_pattern}
              onChange={(e) => {
                handleChange(e);
                handleBlur("breathing_pattern");
              }}
              fullWidth
              required
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Breathing Pattern
                  </span>
                )
              }
            >
              <MenuItem value={"Uneven"}>Uneven</MenuItem>
              <MenuItem value={"Labored"}>Labored</MenuItem>
              <MenuItem value={"Deep"}>Deep</MenuItem>
              <MenuItem value={"Apnic"}>Apnic</MenuItem>
              <MenuItem value={"Tachypneic"}>Tachypneic</MenuItem>
              <MenuItem value={"Bradypneic"}>Bradypneic</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              displayEmpty
              label="Breathing Effort"
              name="breathing_effort"
              value={formData.breathing_effort}
              onChange={(e) => {
                handleChange(e);
                handleBlur("breathing_effort");
              }}
              fullWidth
              required
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Breathing Effort
                  </span>
                )
              }
            >
              <MenuItem value={"Use-Of-Accessory-Muscles"}>
                Use Of Accessory Muscles
              </MenuItem>
              <MenuItem value={"Retractions"}>Retractions</MenuItem>
              <MenuItem value={"Pursed-Lips"}>Pursed Lips</MenuItem>
              <MenuItem value={"Abdominal-Breathing"}>
                Abdominal Breathing
              </MenuItem>
            </Select>
          </Grid>

          {/* Middle row: Left fields, Center Image, Right fields */}
          <Grid item xs={12} sm={4}>
            {/* Left lung fields */}
            <Select
              displayEmpty
              label="Anterior Left Upper Lobe"
              name="anterior_lower_upper_lobe"
              margin="dense"
              value={formData.anterior_lower_upper_lobe}
              onChange={(e) => {
                handleChange(e);
                handleBlur("anterior_lower_upper_lobe");
              }}
              fullWidth
              required
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Anterior Left Upper Lobe
                  </span>
                )
              }
            >
              <MenuItem value={"Coarse-Crakles"}>Coarse Crakles</MenuItem>
              <MenuItem value={"Fine-Crakles"}>Fine Crakles</MenuItem>
              <MenuItem value={"Ronchi"}>Ronchi</MenuItem>
              <MenuItem value={"Inspiratory-Wheezing"}>
                Inspiratory Wheezing
              </MenuItem>
              <MenuItem value={"Expiratory-Wheezing"}>
                Expiratory Wheezing
              </MenuItem>
              <MenuItem value={"Rales"}>Rales</MenuItem>
              <MenuItem value={"Diminished"}>Diminished</MenuItem>
              <MenuItem value={"Absent"}>Absent</MenuItem>
            </Select>
            <Select
              displayEmpty
              label="Posterior Left Upper Lobe"
              name="posterior_lower_upper_lobe"
              margin="dense"
              value={formData.posterior_lower_upper_lobe}
              onChange={(e) => {
                handleChange(e);
                handleBlur("posterior_lower_upper_lobe");
              }}
              fullWidth
              required
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Posterior Left Upper Lobe
                  </span>
                )
              }
            >
              <MenuItem value={"Coarse-Crakles"}>Coarse Crakles</MenuItem>
              <MenuItem value={"Fine-Crakles"}>Fine Crakles</MenuItem>
              <MenuItem value={"Ronchi"}>Ronchi</MenuItem>
              <MenuItem value={"Inspiratory-Wheezing"}>
                Inspiratory Wheezing
              </MenuItem>
              <MenuItem value={"Expiratory-Wheezing"}>
                Expiratory Wheezing
              </MenuItem>
              <MenuItem value={"Rales"}>Rales</MenuItem>
              <MenuItem value={"Diminished"}>Diminished</MenuItem>
              <MenuItem value={"Absent"}>Absent</MenuItem>
            </Select>
            <Select
              displayEmpty
              label="Anterior Left Lower Lobe"
              name="anterior_left_lower_lobe"
              margin="dense"
              value={formData.anterior_left_lower_lobe}
              onChange={(e) => {
                handleChange(e);
                handleBlur("anterior_left_lower_lobe");
              }}
              fullWidth
              required
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Anterior Left Lower Lobe
                  </span>
                )
              }
            >
              <MenuItem value={"Coarse-Crakles"}>Coarse Crakles</MenuItem>
              <MenuItem value={"Fine-Crakles"}>Fine Crakles</MenuItem>
              <MenuItem value={"Ronchi"}>Ronchi</MenuItem>
              <MenuItem value={"Inspiratory-Wheezing"}>
                Inspiratory Wheezing
              </MenuItem>
              <MenuItem value={"Expiratory-Wheezing"}>
                Expiratory Wheezing
              </MenuItem>
              <MenuItem value={"Rales"}>Rales</MenuItem>
              <MenuItem value={"Diminished"}>Diminished</MenuItem>
              <MenuItem value={"Absent"}>Absent</MenuItem>
            </Select>
            <Select
              displayEmpty
              label="Posterior Left Lower Lobe"
              name="posterior_left_lower_lobe"
              margin="dense"
              value={formData.posterior_left_lower_lobe}
              onChange={(e) => {
                handleChange(e);
                handleBlur("posterior_left_lower_lobe");
              }}
              fullWidth
              required
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Posterior Left Lower Lobe
                  </span>
                )
              }
            >
              <MenuItem value={"Coarse-Crakles"}>Coarse Crakles</MenuItem>
              <MenuItem value={"Fine-Crakles"}>Fine Crakles</MenuItem>
              <MenuItem value={"Ronchi"}>Ronchi</MenuItem>
              <MenuItem value={"Inspiratory-Wheezing"}>
                Inspiratory Wheezing
              </MenuItem>
              <MenuItem value={"Expiratory-Wheezing"}>
                Expiratory Wheezing
              </MenuItem>
              <MenuItem value={"Rales"}>Rales</MenuItem>
              <MenuItem value={"Diminished"}>Diminished</MenuItem>
              <MenuItem value={"Absent"}>Absent</MenuItem>
            </Select>
            <Select
              displayEmpty
              label="Anterior Right Upper Lobe"
              name="anterior_right_upper_lobe"
              margin="dense"
              value={formData.anterior_right_upper_lobe}
              onChange={(e) => {
                handleChange(e);
                handleBlur("anterior_right_upper_lobe");
              }}
              fullWidth
              required
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Anterior Right Upper Lobe
                  </span>
                )
              }
            >
              <MenuItem value={"Coarse-Crakles"}>Coarse Crakles</MenuItem>
              <MenuItem value={"Fine-Crakles"}>Fine Crakles</MenuItem>
              <MenuItem value={"Ronchi"}>Ronchi</MenuItem>
              <MenuItem value={"Inspiratory-Wheezing"}>
                Inspiratory Wheezing
              </MenuItem>
              <MenuItem value={"Expiratory-Wheezing"}>
                Expiratory Wheezing
              </MenuItem>
              <MenuItem value={"Rales"}>Rales</MenuItem>
              <MenuItem value={"Diminished"}>Diminished</MenuItem>
              <MenuItem value={"Absent"}>Absent</MenuItem>
            </Select>
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
            <Select
              displayEmpty
              label="Posterior Right Upper Lobe"
              name="posterior_right_upper_lobe"
              margin="dense"
              value={formData.posterior_right_upper_lobe}
              onChange={(e) => {
                handleChange(e);
                handleBlur("posterior_right_upper_lobe");
              }}
              fullWidth
              required
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Posterior Right Upper Lobe
                  </span>
                )
              }
            >
              <MenuItem value={"Coarse-Crakles"}>Coarse Crakles</MenuItem>
              <MenuItem value={"Fine-Crakles"}>Fine Crakles</MenuItem>
              <MenuItem value={"Ronchi"}>Ronchi</MenuItem>
              <MenuItem value={"Inspiratory-Wheezing"}>
                Inspiratory Wheezing
              </MenuItem>
              <MenuItem value={"Expiratory-Wheezing"}>
                Expiratory Wheezing
              </MenuItem>
              <MenuItem value={"Rales"}>Rales</MenuItem>
              <MenuItem value={"Diminished"}>Diminished</MenuItem>
              <MenuItem value={"Absent"}>Absent</MenuItem>
            </Select>
            <Select
              displayEmpty
              label="Anterior Right Middle Lobe"
              name="anterior_right_middle_lobe"
              margin="dense"
              value={formData.anterior_right_middle_lobe}
              onChange={(e) => {
                handleChange(e);
                handleBlur("anterior_right_middle_lobe");
              }}
              fullWidth
              required
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Anterior Right Middle Lobe
                  </span>
                )
              }
            >
              <MenuItem value={"Coarse-Crakles"}>Coarse Crakles</MenuItem>
              <MenuItem value={"Fine-Crakles"}>Fine Crakles</MenuItem>
              <MenuItem value={"Ronchi"}>Ronchi</MenuItem>
              <MenuItem value={"Inspiratory-Wheezing"}>
                Inspiratory Wheezing
              </MenuItem>
              <MenuItem value={"Expiratory-Wheezing"}>
                Expiratory Wheezing
              </MenuItem>
              <MenuItem value={"Rales"}>Rales</MenuItem>
              <MenuItem value={"Diminished"}>Diminished</MenuItem>
              <MenuItem value={"Absent"}>Absent</MenuItem>
            </Select>
            <Select
              displayEmpty
              label="Posterior Right Middle Lobe"
              name="posterior_right_middle_lobe"
              margin="dense"
              value={formData.posterior_right_middle_lobe}
              onChange={(e) => {
                handleChange(e);
                handleBlur("posterior_right_middle_lobe");
              }}
              fullWidth
              required
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Posterior Right Middle Lobe
                  </span>
                )
              }
            >
              <MenuItem value={"Coarse-Crakles"}>Coarse Crakles</MenuItem>
              <MenuItem value={"Fine-Crakles"}>Fine Crakles</MenuItem>
              <MenuItem value={"Ronchi"}>Ronchi</MenuItem>
              <MenuItem value={"Inspiratory-Wheezing"}>
                Inspiratory Wheezing
              </MenuItem>
              <MenuItem value={"Expiratory-Wheezing"}>
                Expiratory Wheezing
              </MenuItem>
              <MenuItem value={"Rales"}>Rales</MenuItem>
              <MenuItem value={"Diminished"}>Diminished</MenuItem>
              <MenuItem value={"Absent"}>Absent</MenuItem>
            </Select>
            <Select
              displayEmpty
              label="Anterior Right Lower Lobe"
              name="anterior_right_lower_lobe"
              margin="dense"
              value={formData.anterior_right_lower_lobe}
              onChange={(e) => {
                handleChange(e);
                handleBlur("anterior_right_lower_lobe");
              }}
              fullWidth
              required
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Anterior Right Lower Lobe
                  </span>
                )
              }
            >
              <MenuItem value={"Coarse-Crakles"}>Coarse Crakles</MenuItem>
              <MenuItem value={"Fine-Crakles"}>Fine Crakles</MenuItem>
              <MenuItem value={"Ronchi"}>Ronchi</MenuItem>
              <MenuItem value={"Inspiratory-Wheezing"}>
                Inspiratory Wheezing
              </MenuItem>
              <MenuItem value={"Expiratory-Wheezing"}>
                Expiratory Wheezing
              </MenuItem>
              <MenuItem value={"Rales"}>Rales</MenuItem>
              <MenuItem value={"Diminished"}>Diminished</MenuItem>
              <MenuItem value={"Absent"}>Absent</MenuItem>
            </Select>
            <Select
              displayEmpty
              label="Posterior Right Lower Lobe"
              name="posterior_right_lower_lobe"
              margin="dense"
              value={formData.posterior_right_lower_lobe}
              onChange={(e) => {
                handleChange(e);
                handleBlur("posterior_right_lower_lobe");
              }}
              fullWidth
              required
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Posterior Right Lower Lobe
                  </span>
                )
              }
            >
              <MenuItem value={"Coarse-Crakles"}>Coarse Crakles</MenuItem>
              <MenuItem value={"Fine-Crakles"}>Fine Crakles</MenuItem>
              <MenuItem value={"Ronchi"}>Ronchi</MenuItem>
              <MenuItem value={"Inspiratory-Wheezing"}>
                Inspiratory Wheezing
              </MenuItem>
              <MenuItem value={"Expiratory-Wheezing"}>
                Expiratory Wheezing
              </MenuItem>
              <MenuItem value={"Rales"}>Rales</MenuItem>
              <MenuItem value={"Diminished"}>Diminished</MenuItem>
              <MenuItem value={"Absent"}>Absent</MenuItem>
            </Select>
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
            <Select
              displayEmpty
              label="Oxygen Support Device"
              name="oxygen_support_device"
              value={formData.oxygen_support_device}
              onChange={(e) => {
                handleChange(e);
                handleBlur("oxygen_support_device");
              }}
              fullWidth
              required
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Oxygen Support Device
                  </span>
                )
              }
            >
              <MenuItem value={"Nasal-Cannula"}>Nasal Cannula</MenuItem>
              <MenuItem value={"NRB"}>NRB</MenuItem>
              <MenuItem value={"Venti-Mask"}>Venti-Mask</MenuItem>
              <MenuItem value={"Ventialator"}>Ventialator</MenuItem>
              <MenuItem value={"BiPAP"}>BiPAP</MenuItem>
              <MenuItem value={"CPAP"}>CPAP</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Oxygen Flow Rate"
              name="oxygen_flow_rate"
              value={formData.oxygen_flow_rate}
              onChange={(e) => {
                handleChange(e);
                handleBlur("oxygen_flow_rate");
              }}
              fullWidth
              required
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              displayEmpty
              label="Sputum Amount"
              name="sputum_amount"
              value={formData.sputum_amount}
              onChange={(e) => {
                handleChange(e);
                handleBlur("sputum_amount");
              }}
              fullWidth
              required
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>Select Sputum Amount</span>
                )
              }
            >
              <MenuItem value={"Scant"}>Scant</MenuItem>
              <MenuItem value={"Moderate"}>Moderate</MenuItem>
              <MenuItem value={"Copius"}>Copius</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              displayEmpty
              label="Sputum Color"
              name="sputum_color"
              value={formData.sputum_color}
              onChange={(e) => {
                handleChange(e);
                handleBlur("sputum_color");
              }}
              fullWidth
              required
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Sputum Color
                  </span>
                )
              }
            >
              <MenuItem value={"White"}>White</MenuItem>
              <MenuItem value={"Clear"}>Clear</MenuItem>
              <MenuItem value={"Yellow"}>Yellow</MenuItem>
              <MenuItem value={"Brown"}>Brown</MenuItem>
              <MenuItem value={"Tan"}>Tan</MenuItem>
              <MenuItem value={"Green"}>Green</MenuItem>
              <MenuItem value={"Blood"}>Blood</MenuItem>
              <MenuItem value={"Frothy"}>Frothy</MenuItem>
              <MenuItem value={"Blood-Tinged"}>Blood-Tinged</MenuItem>
            </Select>
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
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Chest Tube Suction"
              name="chest_tube_suction"
              value={formData.chest_tube_suction}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          {/* Action Buttons */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={!isFormValid()}
            >
              {respiratoryInfo && respiratoryInfo.id ? "Update" : "Save"}
            </Button>
          </Grid>
        </Grid>
      </form>
      {SnackbarComponent}
    </Paper>
  );
};

export default RespiratorySystemComponent;
