/* Name: Charlize Aponte 
   Date: 3/28/25 
   Remarks:  Neurological Info System Component to be displayed throughout the PATIENT ASSIGNMENT PAGE 
*/
import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Checkbox,
  Grid,
  IconButton,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { getSectionPatientById } from "../../../services/sectionPatientService";
import {
  getNeurologicalInfoFromPatient,
  addNeurologicalInfoToPatient,
  updateNeurologicalInfoForPatient,
} from "../../../services/NeurologicalInfoService";
import { useSnackbar } from "../../utils/Snackbar";

const NeurologicalSystemComponent = ({ sectionId }) => {
  const [neurologicalData, setNeurologicalData] = useState({
    id: "",
    section_patient_id: "",
    left_pupil_reaction: "",
    left_pupil_size: "",
    right_pupil_reaction: "",
    right_pupil_size: "",
    is_person_conscious: false,
    is_person_conscious_of_place: false,
    is_person_conscious_of_time: false,
    alertness_description: "",
    strength_left_upper_extremity_grip: "",
    strength_left_upper_extremity_sensation: "",
    strength_right_upper_extremity_grip: "",
    strength_right_upper_extremity_sensation: "",
    left_lower_extremity_strength: "",
    left_lower_extremity_sensation: "",
    right_lower_extremity_strength: "",
    right_lower_extremity_sensation: "",
    neurological_note: "",
  });

  const [sectionPatientId, setSectionPatientId] = useState(null);
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const [touchedFields, setTouchedFields] = useState({
    left_pupil_reaction: false,
    left_pupil_size: false,
    right_pupil_reaction: false,
    right_pupil_size: false,
    alertness_description: false,
    strength_left_upper_extremity_grip: false,
    strength_left_upper_extremity_sensation: false,
    strength_right_upper_extremity_grip: false,
    strength_right_upper_extremity_sensation: false,
    left_lower_extremity_strength: false,
    left_lower_extremity_sensation: false,
    right_lower_extremity_strength: false,
    right_lower_extremity_sensation: false,
  });

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const isFormValid = () => {
    return (
      neurologicalData.left_pupil_reaction &&
      touchedFields.left_pupil_reaction &&
      neurologicalData.left_pupil_size &&
      touchedFields.left_pupil_size &&
      neurologicalData.right_pupil_reaction &&
      touchedFields.right_pupil_reaction &&
      neurologicalData.right_pupil_size &&
      touchedFields.right_pupil_size &&
      neurologicalData.strength_left_upper_extremity_grip &&
      touchedFields.strength_left_upper_extremity_grip &&
      neurologicalData.strength_left_upper_extremity_sensation &&
      touchedFields.strength_left_upper_extremity_sensation &&
      neurologicalData.strength_right_upper_extremity_grip &&
      touchedFields.strength_right_upper_extremity_grip &&
      neurologicalData.strength_right_upper_extremity_sensation &&
      touchedFields.strength_right_upper_extremity_sensation &&
      neurologicalData.left_lower_extremity_strength &&
      touchedFields.left_lower_extremity_strength &&
      neurologicalData.left_lower_extremity_sensation &&
      touchedFields.left_lower_extremity_sensation &&
      neurologicalData.right_lower_extremity_strength &&
      touchedFields.right_lower_extremity_strength &&
      neurologicalData.right_lower_extremity_sensation &&
      touchedFields.right_lower_extremity_sensation
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (sectionId === null) return;

        const sectionPatient = await getSectionPatientById(sectionId);
        const id = sectionPatient.id;
        setSectionPatientId(id);

        const data = await getNeurologicalInfoFromPatient(id);

        setNeurologicalData((prev) => ({
          ...prev,
          ...data,
          section_patient_id: id,
        }));
      } catch (error) {
        console.error("Error fetching neurological data:", error);
      }
    };
    fetchData();
  }, [sectionId]);

  const handleChange = (field, value) => {
    setNeurologicalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      let response;

      if (!sectionPatientId) return;

      // Destructure fields that should NOT be sent to update endpoint
      const {
        created_by,
        created_date,
        modified_by,
        modified_date,
        ...dataToSend
      } = neurologicalData;

      if (
        !dataToSend.neurological_note ||
        dataToSend.neurological_note.trim() === ""
      ) {
        dataToSend.neurological_note = "N/A";
      }

      if (!neurologicalData.id) {
        // Create
        const { id, ...dataWithoutId } = dataToSend;
        response = await addNeurologicalInfoToPatient(sectionPatientId, {
          ...dataWithoutId,
          section_patient_id: sectionPatientId,
        });
      } else {
        // Update
        response = await updateNeurologicalInfoForPatient(
          sectionPatientId,
          neurologicalData.id,
          {
            ...dataToSend,
          }
        );
      }

      if (response) {
        setNeurologicalData((prev) => ({
          ...prev,
          ...response,
        }));
        
        showSnackbar("Neurological information saved successfully!", "success");
      }
    } catch (error) {
      console.error("Error submitting neurological data:", error);
      showSnackbar("Failed to save Neurological information.", "error");
    }
  };

  const handleCheckboxChange = (field) => {
    setNeurologicalData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 1,
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={5}>
          <Typography variant="h6" align="center" color="white">
            Left Pupil
          </Typography>
          <Paper sx={{ p: 2 }}>
            <Select
              displayEmpty
              fullWidth
              required
              label="Left Pupil Reaction"
              size="small"
              type="number"
              value={neurologicalData.left_pupil_reaction}
              onChange={(e) => {
                handleChange("left_pupil_reaction", e.target.value);
                handleBlur("left_pupil_reaction");
              }}
              sx={{ backgroundColor: "white", mb: 1 }}
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Left Pupil Reaction
                  </span>
                )
              }
            >
              <MenuItem value={"Brisk"}>Brisk</MenuItem>
              <MenuItem value={"Fixed"}>Fixed</MenuItem>
              <MenuItem value={"Dilated"}>Dilated</MenuItem>
              <MenuItem value={"Sluggish"}>Sluggish</MenuItem>
            </Select>
            <Select
              displayEmpty
              fullWidth
              required
              label="Left Pupil Size"
              size="small"
              value={neurologicalData.left_pupil_size}
              onChange={(e) => {
                handleChange("left_pupil_size", e.target.value);
                handleBlur("left_pupil_size");
              }}
              sx={{ backgroundColor: "white" }}
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Left Pupil Size
                  </span>
                )
              }
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={10}>10</MenuItem>
            </Select>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={5}>
          <Typography variant="h6" align="center" color="white">
            Right Pupil
          </Typography>
          <Paper sx={{ p: 2 }}>
            <Select
              displayEmpty
              fullWidth
              required
              label="Right Pupil Reaction"
              size="small"
              type="number"
              value={neurologicalData.right_pupil_reaction}
              onChange={(e) => {
                handleChange("right_pupil_reaction", e.target.value);
                handleBlur("right_pupil_reaction");
              }}
              sx={{ backgroundColor: "white", mb: 1 }}
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Right Pupil Reaction
                  </span>
                )
              }
            >
              <MenuItem value={"Brisk"}>Brisk</MenuItem>
              <MenuItem value={"Fixed"}>Fixed</MenuItem>
              <MenuItem value={"Dilated"}>Dilated</MenuItem>
              <MenuItem value={"Sluggish"}>Sluggish</MenuItem>
            </Select>
            <Select
              displayEmpty
              fullWidth
              required
              label="Right Pupil Size"
              size="small"
              value={neurologicalData.right_pupil_size}
              onChange={(e) => {
                handleChange("right_pupil_size", e.target.value);
                handleBlur("right_pupil_size");
              }}
              sx={{ backgroundColor: "white" }}
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Select Right Pupil Size
                  </span>
                )
              }
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={10}>10</MenuItem>
            </Select>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" align="center" color="white">
            Level of Consciousness
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography align="center" variant="h6" color="white">
            Oriented to
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Person</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={neurologicalData.is_person_conscious}
                      onChange={() =>
                        handleCheckboxChange("is_person_conscious")
                      }
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Place</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={neurologicalData.is_person_conscious_of_place}
                      onChange={() =>
                        handleCheckboxChange("is_person_conscious_of_place")
                      }
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={neurologicalData.is_person_conscious_of_time}
                      onChange={() =>
                        handleCheckboxChange("is_person_conscious_of_time")
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography align="center" variant="h6" color="white">
            Alertness
          </Typography>
          <Paper sx={{ p: 1 }}>
            <Select
              displayEmpty
              fullWidth
              required
              label="Alertness Description"
              value={neurologicalData.alertness_description}
              onChange={(e) => {
                handleChange("alertness_description", e.target.value);
                handleBlur("alertness_description");
              }}
              sx={{ backgroundColor: "white" }}
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <span style={{ color: "#757575" }}>
                    Alertness Description
                  </span>
                )
              }
            >
              <MenuItem value={"Alert"}>Alert</MenuItem>
              <MenuItem value={"Lethargic"}>Lethargic</MenuItem>
              <MenuItem value={"Obtunded"}>Obtunded</MenuItem>
              <MenuItem value={"Comatose"}>Comatose</MenuItem>
            </Select>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" align="center" color="white">
            Strength
          </Typography>
        </Grid>

        {/* LUE */}
        <Grid item xs={12} sm={6} md={3}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}>
                    <strong>LUE</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Grip</TableCell>
                  <TableCell>
                    <Select
                      displayEmpty
                      fullWidth
                      size="small"
                      value={
                        neurologicalData.strength_left_upper_extremity_grip
                      }
                      onChange={(e) => {
                        handleChange(
                          "strength_left_upper_extremity_grip",
                          e.target.value
                        );
                        handleBlur("strength_left_upper_extremity_grip");
                      }}
                      sx={{ backgroundColor: "white" }}
                    >
                      <MenuItem value={"Weak"}>Weak</MenuItem>
                      <MenuItem value={"Absent"}>Absent</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sensation</TableCell>
                  <TableCell>
                    <Select
                      displayEmpty
                      fullWidth
                      required
                      size="small"
                      value={
                        neurologicalData.strength_left_upper_extremity_sensation
                      }
                      onChange={(e) => {
                        handleChange(
                          "strength_left_upper_extremity_sensation",
                          e.target.value
                        );
                        handleBlur("strength_left_upper_extremity_sensation");
                      }}
                      sx={{ backgroundColor: "white" }}
                    >
                      <MenuItem value={"Diminished"}>Diminished</MenuItem>
                      <MenuItem value={"Tingling"}>Tingling</MenuItem>
                      <MenuItem value={"Absent"}>Absent</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* RUE */}
        <Grid item xs={12} sm={6} md={3}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}>
                    <strong>RUE</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Grip</TableCell>
                  <TableCell>
                    <Select
                      displayEmpty
                      fullWidth
                      required
                      size="small"
                      value={
                        neurologicalData.strength_right_upper_extremity_grip
                      }
                      onChange={(e) => {
                        handleChange(
                          "strength_right_upper_extremity_grip",
                          e.target.value
                        );
                        handleBlur("strength_right_upper_extremity_grip");
                      }}
                      sx={{ backgroundColor: "white" }}
                    >
                      <MenuItem value={"Weak"}>Weak</MenuItem>
                      <MenuItem value={"Absent"}>Absent</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sensation</TableCell>
                  <TableCell>
                    <Select
                      fullWidth
                      required
                      size="small"
                      value={
                        neurologicalData.strength_right_upper_extremity_sensation
                      }
                      onChange={(e) => {
                        handleChange(
                          "strength_right_upper_extremity_sensation",
                          e.target.value
                        );
                        handleBlur("strength_right_upper_extremity_sensation");
                      }}
                      sx={{ backgroundColor: "white" }}
                    >
                      <MenuItem value={"Diminished"}>Diminished</MenuItem>
                      <MenuItem value={"Tingling"}>Tingling</MenuItem>
                      <MenuItem value={"Absent"}>Absent</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* LLE */}
        <Grid item xs={12} sm={6} md={3}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}>
                    <strong>LLE</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Strength</TableCell>
                  <TableCell>
                    <Select
                      fullWidth
                      required
                      size="small"
                      value={neurologicalData.left_lower_extremity_strength}
                      onChange={(e) => {
                        handleChange(
                          "left_lower_extremity_strength",
                          e.target.value
                        );
                        handleBlur("left_lower_extremity_strength");
                      }}
                      sx={{ backgroundColor: "white" }}
                    >
                      <MenuItem value={"Weak"}>Weak</MenuItem>
                      <MenuItem value={"Absent"}>Absent</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sensation</TableCell>
                  <TableCell>
                    <Select
                      fullWidth
                      required
                      size="small"
                      value={neurologicalData.left_lower_extremity_sensation}
                      onChange={(e) => {
                        handleChange(
                          "left_lower_extremity_sensation",
                          e.target.value
                        );
                        handleBlur("left_lower_extremity_sensation");
                      }}
                      sx={{ backgroundColor: "white" }}
                    >
                      <MenuItem value={"Diminished"}>Diminished</MenuItem>
                      <MenuItem value={"Tingling"}>Tingling</MenuItem>
                      <MenuItem value={"Absent"}>Absent</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* RLE */}
        <Grid item xs={12} sm={6} md={3}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}>
                    <strong>RLE</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Strength</TableCell>
                  <TableCell>
                    <Select
                      fullWidth
                      required
                      size="small"
                      value={neurologicalData.right_lower_extremity_strength}
                      onChange={(e) => {
                        handleChange(
                          "right_lower_extremity_strength",
                          e.target.value
                        );
                        handleBlur("right_lower_extremity_strength");
                      }}
                      sx={{ backgroundColor: "white" }}
                    >
                      <MenuItem value={"Weak"}>Weak</MenuItem>
                      <MenuItem value={"Absent"}>Absent</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sensation</TableCell>
                  <TableCell>
                    <Select
                      fullWidth
                      required
                      size="small"
                      value={neurologicalData.right_lower_extremity_sensation}
                      onChange={(e) => {
                        handleChange(
                          "right_lower_extremity_sensation",
                          e.target.value
                        );
                        handleBlur("right_lower_extremity_sensation");
                      }}
                      sx={{ backgroundColor: "white" }}
                    >
                      <MenuItem value={"Diminished"}>Diminished</MenuItem>
                      <MenuItem value={"Tingling"}>Tingling</MenuItem>
                      <MenuItem value={"Absent"}>Absent</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" color="white">
            Notes (any other abnormalities):
          </Typography>
          <Paper sx={{ p: 1 }}>
            <TextField
              fullWidth
              label="Neurological Note"
              multiline
              rows={3}
              value={neurologicalData.neurological_note}
              onChange={(e) =>
                handleChange("neurological_note", e.target.value)
              }
              sx={{ backgroundColor: "white" }}
            />
          </Paper>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2, padding: 1 }}
        onClick={handleSubmit}
        disabled={isFormValid()}
      >
        Submit
      </Button>
      {SnackbarComponent}
    </Box>
  );
};

export default NeurologicalSystemComponent;
