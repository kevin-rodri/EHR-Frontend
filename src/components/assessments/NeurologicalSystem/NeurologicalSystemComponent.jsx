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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { getSectionPatientById } from "../../../services/sectionPatientService";
import {
  getNeurologicalInfoFromPatient,
  addNeurologicalInfoToPatient,
  updateNeurologicalInfoForPatient,
} from "../../../services/NeurologicalInfoService";

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
  const [editing, setEditing] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Section ID:", sectionId); 
        const sectionPatient = await getSectionPatientById(sectionId);
        if (sectionPatient && sectionPatient.id) {
          setSectionPatientId(sectionPatient.id);
          console.log("Section Patient ID:", sectionPatient);
          console.log("Section Patient ID:", sectionPatient.id); 
          const data = await getNeurologicalInfoFromPatient(sectionPatient.id);
          setNeurologicalData(data);
          console.log("neurologicalData.id after fetch:", data.id);
        }
      } catch (error) {
        console.error("Error fetching neurological data:", error);
      }
    };
  
    if (sectionId) {
      fetchData();
    }
  }, [sectionId]);

  const handleChange = (field, value) => {
    setNeurologicalData((prev) => ({ ...prev, [field]: value })); 
  };

  const handleBlur = async (field) => {
    try {
      if (neurologicalData.id && sectionPatientId) {
       let update = await updateNeurologicalInfoForPatient(sectionPatientId, neurologicalData.id, {
          ...neurologicalData,
        });
        setNeurologicalData(update);
      } else {
        console.log("handleBlur: ID or sectionPatientId missing.");
      }
    } catch (error) {
      console.error("Error updating neurological info:", error);
    } finally {
      setEditing((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async () => {
  try {
      let response;

      if (sectionPatientId && !neurologicalData.id) {
        const { id, ...dataWithoutId } = neurologicalData;

         response = await addNeurologicalInfoToPatient(sectionPatientId, {
               ...dataWithoutId,
             });
           } else if (sectionPatientId && neurologicalData.id) {
             response = await updateNeurologicalInfoForPatient(
              sectionPatientId,
               neurologicalData.id,
               {
                 ...neurologicalData,
               }
             );
           }
     
           if (response) {
             setNeurologicalData({
               ...response,
             });
             }} catch (error) {
      console.error("Error submitting neurological data:", error);
    }
  };


  const handleCheckboxChange = (field) => {
    setNeurologicalData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    handleBlur(field);
  };

  const handleEdit = (field) => {
    setEditing((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <Box sx={{ minHeight: "100vh", p: 4, color: "white" }}>
      <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={5}>
          <Typography variant="h6" align="center">Left</Typography>
          <Paper sx={{ p: 2 }}>
            <Typography>
              Left Pupil Reaction:{" "}
              {editing.left_pupil_reaction ? (
                <TextField
                  value={neurologicalData.left_pupil_reaction}
                  onChange={(e) => handleChange("left_pupil_reaction", e.target.value)}
                  onBlur={() => handleBlur("left_pupil_reaction")}
                  autoFocus
                  size="small"
                  sx={{ backgroundColor: "white", marginBottom: "8px" }}
                />
              ) : (
                <strong>{neurologicalData.left_pupil_reaction}</strong>
              )}
              <IconButton onClick={() => handleEdit("left_pupil_reaction")}>
                <EditIcon />
              </IconButton>
            </Typography>
            <Typography>
              Left Pupil Size:{" "}
              {editing.left_pupil_size ? (
                <TextField
                  value={neurologicalData.left_pupil_size}
                  onChange={(e) => handleChange("left_pupil_size", e.target.value)}
                  onBlur={() => handleBlur("left_pupil_size")}
                  autoFocus
                  size="small"
                  sx={{ backgroundColor: "white", marginBottom: "8px" }}
                />
              ) : (
                <strong>{neurologicalData.left_pupil_size}</strong>
              )}
              <IconButton onClick={() => handleEdit("left_pupil_size")}>
                <EditIcon />
              </IconButton>
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={5}>
          <Typography variant="h6" align="center">Right</Typography>
          <Paper sx={{ p: 2 }}>
            <Typography>
              Right Pupil Reaction:{" "}
              {editing.right_pupil_reaction ? (
                <TextField
                  value={neurologicalData.right_pupil_reaction}
                  onChange={(e) => handleChange("right_pupil_reaction", e.target.value)}
                  onBlur={() => handleBlur("right_pupil_reaction")}
                  autoFocus
                  size="small"
                  sx={{ backgroundColor: "white", marginBottom: "8px" }}
                />
              ) : (
                <strong>{neurologicalData.right_pupil_reaction}</strong>
              )}
              <IconButton onClick={() => handleEdit("right_pupil_reaction")}>
                <EditIcon />
              </IconButton>
            </Typography>
            <Typography>
              Right Pupil Size:{" "}
              {editing.right_pupil_size ? (
                <TextField
                  value={neurologicalData.right_pupil_size}
                  onChange={(e) => handleChange("right_pupil_size", e.target.value)}
                  onBlur={() => handleBlur("right_pupil_size")}
                  autoFocus
                  size="small"
                  sx={{ backgroundColor: "white", marginBottom: "8px" }}
                />
              ) : (
                <strong>{neurologicalData.right_pupil_size}</strong>
              )}
              <IconButton onClick={() => handleEdit("right_pupil_size")}>
                <EditIcon />
              </IconButton>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" align="center">Level of Conciousness</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography align="center" variant="h6">Oriented to</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Person</TableCell>
                  <TableCell>
                    <Checkbox checked={neurologicalData.is_person_conscious} onChange={() => handleCheckboxChange("is_person_conscious")} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Place</TableCell>
                  <TableCell>
                    <Checkbox checked={neurologicalData.is_person_conscious_of_place} onChange={() => handleCheckboxChange("is_person_conscious_of_place")} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>
                    <Checkbox checked={neurologicalData.is_person_conscious_of_time} onChange={() => handleCheckboxChange("is_person_conscious_of_time")} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography align="center" variant="h6">Alertness</Typography>
          <Paper sx={{ p: 1 }}>
            {editing.alertness_description ? (
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                value={neurologicalData.alertness_description}
                onChange={(e) => handleChange("alertness_description", e.target.value)}
                onBlur={() => handleBlur("alertness_description")}
                autoFocus
                sx={{ backgroundColor: "white" }}
              />
            ) : (
              <Typography>
                <strong>{neurologicalData.alertness_description}</strong>
              </Typography>
            )}
            <Box display="flex" justifyContent="flex-end">
              <IconButton onClick={() => handleEdit("alertness_description")}>
                <EditIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" align="center">Strength</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}><strong>LUE</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Grip</TableCell>
                  <TableCell>
                    <TextField fullWidth variant="outlined" size="small" value={neurologicalData.strength_left_upper_extremity_grip} onChange={(e) => handleChange("strength_left_upper_extremity_grip", e.target.value)} onBlur={()=> handleBlur("strength_left_upper_extremity_grip")} sx={{ backgroundColor: "white" }} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sensation</TableCell>
                  <TableCell>
                    <TextField fullWidth variant="outlined" size="small" value={neurologicalData.strength_left_upper_extremity_sensation} onChange={(e) => handleChange("strength_left_upper_extremity_sensation", e.target.value)} onBlur={()=> handleBlur("strength_left_upper_extremity_sensation")} sx={{ backgroundColor: "white" }} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}><strong>RUE</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Grip</TableCell>
                  <TableCell>
                    <TextField fullWidth variant="outlined" size="small" value={neurologicalData.strength_right_upper_extremity_grip} onChange={(e) => handleChange("strength_right_upper_extremity_grip", e.target.value)} onBlur={()=> handleBlur("strength_right_upper_extremity_grip")} sx={{ backgroundColor: "white" }} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sensation</TableCell>
                  <TableCell>
                    <TextField fullWidth variant="outlined" size="small" value={neurologicalData.strength_right_upper_extremity_sensation} onChange={(e) => handleChange("strength_right_upper_extremity_sensation", e.target.value)} onBlur={()=> handleBlur("strength_right_upper_extremity_sensation")} sx={{ backgroundColor: "white" }} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}><strong>LLE</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Strength</TableCell>
                  <TableCell>
                    <TextField fullWidth variant="outlined" size="small" value={neurologicalData.left_lower_extremity_strength} onChange={(e) => handleChange("left_lower_extremity_strength", e.target.value)} onBlur={()=> handleBlur("left_lower_extremity_strength")} sx={{ backgroundColor: "white" }} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sensation</TableCell>
                  <TableCell>
                    <TextField fullWidth variant="outlined" size="small" value={neurologicalData.left_lower_extremity_sensation} onChange={(e) => handleChange("left_lower_extremity_sensation", e.target.value)} onBlur={()=> handleBlur("left_lower_extremity_sensation")} sx={{ backgroundColor: "white" }} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}><strong>RLE</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Strength</TableCell>
                  <TableCell>
                    <TextField fullWidth variant="outlined" size="small" value={neurologicalData.right_lower_extremity_strength} onChange={(e) => handleChange("right_lower_extremity_strength", e.target.value)} onBlur={()=> handleBlur("right_lower_extremity_strength")} sx={{ backgroundColor: "white" }} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sensation</TableCell>
                  <TableCell>
                    <TextField fullWidth variant="outlined" size="small" value={neurologicalData.right_lower_extremity_sensation} onChange={(e) => handleChange("right_lower_extremity_sensation", e.target.value)} onBlur={()=> handleBlur("right_lower_extremity_sensation")} sx={{ backgroundColor: "white" }} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1">Notes (any other abnormalities):</Typography>
          <Paper sx={{ p: 1 }}>
            {editing.neurological_note ? (
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={neurologicalData.neurological_note}
                onChange={(e) => handleChange("neurological_note", e.target.value)}
                onBlur={() => handleBlur("neurological_note")}
                autoFocus
                sx={{ backgroundColor: "white" }}
              />
            ) : (
              <Typography>
                <strong>{neurologicalData.neurological_note}</strong>
              </Typography>
            )}
            <Box display="flex" justifyContent="flex-end">
              <IconButton onClick={() => handleEdit("neurological_note")}>
                <EditIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleSubmit}>Submit</Button>
    </Box>
  );
};

export default NeurologicalSystemComponent;