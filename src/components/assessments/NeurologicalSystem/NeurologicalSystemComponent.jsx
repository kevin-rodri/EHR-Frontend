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
        setNeurologicalData(response);
      }
    } catch (error) {
      console.error("Error submitting neurological data:", error);
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
            Left
          </Typography>
          <Paper sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="Left Pupil Reaction"
              size="small"
              value={neurologicalData.left_pupil_reaction}
              onChange={(e) =>
                handleChange("left_pupil_reaction", e.target.value)
              }
              sx={{ backgroundColor: "white", mb: 1 }}
            />
            <TextField
              fullWidth
              label="Left Pupil Size"
              size="small"
              type="number"
              value={neurologicalData.left_pupil_size}
              onChange={(e) => handleChange("left_pupil_size", e.target.value)}
              sx={{ backgroundColor: "white" }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={5}>
          <Typography variant="h6" align="center" color="white">
            Right
          </Typography>
          <Paper sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="Right Pupil Reaction"
              size="small"
              value={neurologicalData.right_pupil_reaction}
              onChange={(e) =>
                handleChange("right_pupil_reaction", e.target.value)
              }
              sx={{ backgroundColor: "white", mb: 1 }}
            />
            <TextField
              fullWidth
              label="Right Pupil Size"
              size="small"
              type="number"
              value={neurologicalData.right_pupil_size}
              onChange={(e) => handleChange("right_pupil_size", e.target.value)}
              sx={{ backgroundColor: "white" }}
            />
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
            <TextField
              fullWidth
              label="Alertness Description"
              multiline
              rows={2}
              value={neurologicalData.alertness_description}
              onChange={(e) =>
                handleChange("alertness_description", e.target.value)
              }
              sx={{ backgroundColor: "white" }}
            />
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
                    <TextField
                      fullWidth
                      size="small"
                      value={
                        neurologicalData.strength_left_upper_extremity_grip
                      }
                      onChange={(e) =>
                        handleChange(
                          "strength_left_upper_extremity_grip",
                          e.target.value
                        )
                      }
                      sx={{ backgroundColor: "white" }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sensation</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={
                        neurologicalData.strength_left_upper_extremity_sensation
                      }
                      onChange={(e) =>
                        handleChange(
                          "strength_left_upper_extremity_sensation",
                          e.target.value
                        )
                      }
                      sx={{ backgroundColor: "white" }}
                    />
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
                    <TextField
                      fullWidth
                      size="small"
                      value={
                        neurologicalData.strength_right_upper_extremity_grip
                      }
                      onChange={(e) =>
                        handleChange(
                          "strength_right_upper_extremity_grip",
                          e.target.value
                        )
                      }
                      sx={{ backgroundColor: "white" }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sensation</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={
                        neurologicalData.strength_right_upper_extremity_sensation
                      }
                      onChange={(e) =>
                        handleChange(
                          "strength_right_upper_extremity_sensation",
                          e.target.value
                        )
                      }
                      sx={{ backgroundColor: "white" }}
                    />
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
                    <TextField
                      fullWidth
                      size="small"
                      value={neurologicalData.left_lower_extremity_strength}
                      onChange={(e) =>
                        handleChange(
                          "left_lower_extremity_strength",
                          e.target.value
                        )
                      }
                      sx={{ backgroundColor: "white" }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sensation</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={neurologicalData.left_lower_extremity_sensation}
                      onChange={(e) =>
                        handleChange(
                          "left_lower_extremity_sensation",
                          e.target.value
                        )
                      }
                      sx={{ backgroundColor: "white" }}
                    />
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
                    <TextField
                      fullWidth
                      size="small"
                      value={neurologicalData.right_lower_extremity_strength}
                      onChange={(e) =>
                        handleChange(
                          "right_lower_extremity_strength",
                          e.target.value
                        )
                      }
                      sx={{ backgroundColor: "white" }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sensation</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={neurologicalData.right_lower_extremity_sensation}
                      onChange={(e) =>
                        handleChange(
                          "right_lower_extremity_sensation",
                          e.target.value
                        )
                      }
                      sx={{ backgroundColor: "white" }}
                    />
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
      >
        Submit
      </Button>
    </Box>

    // <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", padding: 1}}>
    //   <Grid container spacing={4} justifyContent="center">
    //     <Grid item xs={12} sm={5}>
    //       <Typography variant="h6" align="center" color="white">
    //         Left
    //       </Typography>
    //       <Paper sx={{ p: 2 }}>
    //         <Typography>
    //           Left Pupil Reaction:{" "}
    //           {editing.left_pupil_reaction ? (
    //             <TextField
    //               value={neurologicalData.left_pupil_reaction}
    //               onChange={(e) =>
    //                 handleChange("left_pupil_reaction", e.target.value)
    //               }
    //               onBlur={() => handleBlur("left_pupil_reaction")}
    //               autoFocus
    //               size="small"
    //               sx={{ backgroundColor: "white", marginBottom: "8px" }}
    //             />
    //           ) : (
    //             <strong>{neurologicalData.left_pupil_reaction}</strong>
    //           )}
    //           <IconButton onClick={() => handleEdit("left_pupil_reaction")}>
    //             <EditIcon />
    //           </IconButton>
    //         </Typography>
    //         <Typography>
    //           Left Pupil Size:{" "}
    //           {editing.left_pupil_size ? (
    //             <TextField
    //               value={neurologicalData.left_pupil_size}
    //               onChange={(e) =>
    //                 handleChange("left_pupil_size", e.target.value)
    //               }
    //               onBlur={() => handleBlur("left_pupil_size")}
    //               autoFocus
    //               size="small"
    //               sx={{ backgroundColor: "white", marginBottom: "8px" }}
    //             />
    //           ) : (
    //             <strong>{neurologicalData.left_pupil_size}</strong>
    //           )}
    //           <IconButton onClick={() => handleEdit("left_pupil_size")}>
    //             <EditIcon />
    //           </IconButton>
    //         </Typography>
    //       </Paper>
    //     </Grid>

    //     <Grid item xs={12} sm={5}>
    //       <Typography variant="h6" align="center" color="white">
    //         Right
    //       </Typography>
    //       <Paper sx={{ p: 2 }}>
    //         <Typography>
    //           Right Pupil Reaction:{" "}
    //           {editing.right_pupil_reaction ? (
    //             <TextField
    //               value={neurologicalData.right_pupil_reaction}
    //               onChange={(e) =>
    //                 handleChange("right_pupil_reaction", e.target.value)
    //               }
    //               onBlur={() => handleBlur("right_pupil_reaction")}
    //               autoFocus
    //               size="small"
    //               sx={{ backgroundColor: "white", marginBottom: "8px" }}
    //             />
    //           ) : (
    //             <strong>{neurologicalData.right_pupil_reaction}</strong>
    //           )}
    //         </Typography>
    //         <Typography>
    //           Right Pupil Size:{" "}
    //           {editing.right_pupil_size ? (
    //             <TextField
    //               value={neurologicalData.right_pupil_size}
    //               onChange={(e) =>
    //                 handleChange("right_pupil_size", e.target.value)
    //               }
    //               onBlur={() => handleBlur("right_pupil_size")}
    //               autoFocus
    //               size="small"
    //               sx={{ backgroundColor: "white", marginBottom: "8px" }}
    //             />
    //           ) : (
    //             <strong>{neurologicalData.right_pupil_size}</strong>
    //           )}
    //           <IconButton onClick={() => handleEdit("right_pupil_size")}>
    //             <EditIcon />
    //           </IconButton>
    //         </Typography>
    //       </Paper>
    //     </Grid>
    //     <Grid item xs={12}>
    //       <Typography variant="h6" align="center" color="white">
    //         Level of Conciousness
    //       </Typography>
    //     </Grid>

    //     <Grid item xs={12} sm={6}>
    //       <Typography align="center" variant="h6" color="white">
    //         Oriented to
    //       </Typography>
    //       <TableContainer component={Paper}>
    //         <Table size="small">
    //           <TableBody>
    //             <TableRow>
    //               <TableCell>Person</TableCell>
    //               <TableCell>
    //                 <Checkbox
    //                   checked={neurologicalData.is_person_conscious}
    //                   onChange={() =>
    //                     handleCheckboxChange("is_person_conscious")
    //                   }
    //                 />
    //               </TableCell>
    //             </TableRow>
    //             <TableRow>
    //               <TableCell>Place</TableCell>
    //               <TableCell>
    //                 <Checkbox
    //                   checked={neurologicalData.is_person_conscious_of_place}
    //                   onChange={() =>
    //                     handleCheckboxChange("is_person_conscious_of_place")
    //                   }
    //                 />
    //               </TableCell>
    //             </TableRow>
    //             <TableRow>
    //               <TableCell>Time</TableCell>
    //               <TableCell>
    //                 <Checkbox
    //                   checked={neurologicalData.is_person_conscious_of_time}
    //                   onChange={() =>
    //                     handleCheckboxChange("is_person_conscious_of_time")
    //                   }
    //                 />
    //               </TableCell>
    //             </TableRow>
    //           </TableBody>
    //         </Table>
    //       </TableContainer>
    //     </Grid>

    //     <Grid item xs={12} sm={6}>
    //       <Typography align="center" variant="h6" color="white">
    //         Alertness
    //       </Typography>
    //       <Paper sx={{ p: 1 }}>
    //         {editing.alertness_description ? (
    //           <TextField
    //             variant="outlined"
    //             fullWidth
    //             multiline
    //             rows={2}
    //             value={neurologicalData.alertness_description}
    //             onChange={(e) =>
    //               handleChange("alertness_description", e.target.value)
    //             }
    //             onBlur={() => handleBlur("alertness_description")}
    //             autoFocus
    //             sx={{ backgroundColor: "white" }}
    //           />
    //         ) : (
    //           <Typography>
    //             <strong>{neurologicalData.alertness_description}</strong>
    //           </Typography>
    //         )}
    //         <Box display="flex" justifyContent="flex-end">
    //           <IconButton onClick={() => handleEdit("alertness_description")}>
    //             <EditIcon />
    //           </IconButton>
    //         </Box>
    //       </Paper>
    //     </Grid>

    //     <Grid item xs={12}>
    //       <Typography variant="h6" align="center" color="white">
    //         Strength
    //       </Typography>
    //     </Grid>

    //     <Grid item xs={12} sm={6} md={3}>
    //       <TableContainer component={Paper}>
    //         <Table size="small">
    //           <TableHead>
    //             <TableRow>
    //               <TableCell align="center" colSpan={2}>
    //                 <strong>LUE</strong>
    //               </TableCell>
    //             </TableRow>
    //           </TableHead>
    //           <TableBody>
    //             <TableRow>
    //               <TableCell>Grip</TableCell>
    //               <TableCell>
    //                 <TextField
    //                   fullWidth
    //                   variant="outlined"
    //                   size="small"
    //                   value={
    //                     neurologicalData.strength_left_upper_extremity_grip
    //                   }
    //                   onChange={(e) =>
    //                     handleChange(
    //                       "strength_left_upper_extremity_grip",
    //                       e.target.value
    //                     )
    //                   }
    //                   onBlur={() =>
    //                     handleBlur("strength_left_upper_extremity_grip")
    //                   }
    //                   sx={{ backgroundColor: "white" }}
    //                 />
    //               </TableCell>
    //             </TableRow>
    //             <TableRow>
    //               <TableCell>Sensation</TableCell>
    //               <TableCell>
    //                 <TextField
    //                   fullWidth
    //                   variant="outlined"
    //                   size="small"
    //                   value={
    //                     neurologicalData.strength_left_upper_extremity_sensation
    //                   }
    //                   onChange={(e) =>
    //                     handleChange(
    //                       "strength_left_upper_extremity_sensation",
    //                       e.target.value
    //                     )
    //                   }
    //                   onBlur={() =>
    //                     handleBlur("strength_left_upper_extremity_sensation")
    //                   }
    //                   sx={{ backgroundColor: "white" }}
    //                 />
    //               </TableCell>
    //             </TableRow>
    //           </TableBody>
    //         </Table>
    //       </TableContainer>
    //     </Grid>

    //     <Grid item xs={12} sm={6} md={3}>
    //       <TableContainer component={Paper}>
    //         <Table size="small">
    //           <TableHead>
    //             <TableRow>
    //               <TableCell align="center" colSpan={2}>
    //                 <strong>RUE</strong>
    //               </TableCell>
    //             </TableRow>
    //           </TableHead>
    //           <TableBody>
    //             <TableRow>
    //               <TableCell>Grip</TableCell>
    //               <TableCell>
    //                 <TextField
    //                   fullWidth
    //                   variant="outlined"
    //                   size="small"
    //                   value={
    //                     neurologicalData.strength_right_upper_extremity_grip
    //                   }
    //                   onChange={(e) =>
    //                     handleChange(
    //                       "strength_right_upper_extremity_grip",
    //                       e.target.value
    //                     )
    //                   }
    //                   onBlur={() =>
    //                     handleBlur("strength_right_upper_extremity_grip")
    //                   }
    //                   sx={{ backgroundColor: "white" }}
    //                 />
    //               </TableCell>
    //             </TableRow>
    //             <TableRow>
    //               <TableCell>Sensation</TableCell>
    //               <TableCell>
    //                 <TextField
    //                   fullWidth
    //                   variant="outlined"
    //                   size="small"
    //                   value={
    //                     neurologicalData.strength_right_upper_extremity_sensation
    //                   }
    //                   onChange={(e) =>
    //                     handleChange(
    //                       "strength_right_upper_extremity_sensation",
    //                       e.target.value
    //                     )
    //                   }
    //                   onBlur={() =>
    //                     handleBlur("strength_right_upper_extremity_sensation")
    //                   }
    //                   sx={{ backgroundColor: "white" }}
    //                 />
    //               </TableCell>
    //             </TableRow>
    //           </TableBody>
    //         </Table>
    //       </TableContainer>
    //     </Grid>

    //     <Grid item xs={12} sm={6} md={3}>
    //       <TableContainer component={Paper}>
    //         <Table size="small">
    //           <TableHead>
    //             <TableRow>
    //               <TableCell align="center" colSpan={2}>
    //                 <strong>LLE</strong>
    //               </TableCell>
    //             </TableRow>
    //           </TableHead>
    //           <TableBody>
    //             <TableRow>
    //               <TableCell>Strength</TableCell>
    //               <TableCell>
    //                 <TextField
    //                   fullWidth
    //                   variant="outlined"
    //                   size="small"
    //                   value={neurologicalData.left_lower_extremity_strength}
    //                   onChange={(e) =>
    //                     handleChange(
    //                       "left_lower_extremity_strength",
    //                       e.target.value
    //                     )
    //                   }
    //                   onBlur={() => handleBlur("left_lower_extremity_strength")}
    //                   sx={{ backgroundColor: "white" }}
    //                 />
    //               </TableCell>
    //             </TableRow>
    //             <TableRow>
    //               <TableCell>Sensation</TableCell>
    //               <TableCell>
    //                 <TextField
    //                   fullWidth
    //                   variant="outlined"
    //                   size="small"
    //                   value={neurologicalData.left_lower_extremity_sensation}
    //                   onChange={(e) =>
    //                     handleChange(
    //                       "left_lower_extremity_sensation",
    //                       e.target.value
    //                     )
    //                   }
    //                   onBlur={() =>
    //                     handleBlur("left_lower_extremity_sensation")
    //                   }
    //                   sx={{ backgroundColor: "white" }}
    //                 />
    //               </TableCell>
    //             </TableRow>
    //           </TableBody>
    //         </Table>
    //       </TableContainer>
    //     </Grid>

    //     <Grid item xs={12} sm={6} md={3}>
    //       <TableContainer component={Paper}>
    //         <Table size="small">
    //           <TableHead>
    //             <TableRow>
    //               <TableCell align="center" colSpan={2}>
    //                 <strong>RLE</strong>
    //               </TableCell>
    //             </TableRow>
    //           </TableHead>
    //           <TableBody>
    //             <TableRow>
    //               <TableCell>Strength</TableCell>
    //               <TableCell>
    //                 <TextField
    //                   fullWidth
    //                   variant="outlined"
    //                   size="small"
    //                   value={neurologicalData.right_lower_extremity_strength}
    //                   onChange={(e) =>
    //                     handleChange(
    //                       "right_lower_extremity_strength",
    //                       e.target.value
    //                     )
    //                   }
    //                   onBlur={() =>
    //                     handleBlur("right_lower_extremity_strength")
    //                   }
    //                   sx={{ backgroundColor: "white" }}
    //                 />
    //               </TableCell>
    //             </TableRow>
    //             <TableRow>
    //               <TableCell>Sensation</TableCell>
    //               <TableCell>
    //                 <TextField
    //                   fullWidth
    //                   variant="outlined"
    //                   size="small"
    //                   value={neurologicalData.right_lower_extremity_sensation}
    //                   onChange={(e) =>
    //                     handleChange(
    //                       "right_lower_extremity_sensation",
    //                       e.target.value
    //                     )
    //                   }
    //                   onBlur={() =>
    //                     handleBlur("right_lower_extremity_sensation")
    //                   }
    //                   sx={{ backgroundColor: "white" }}
    //                 />
    //               </TableCell>
    //             </TableRow>
    //           </TableBody>
    //         </Table>
    //       </TableContainer>
    //     </Grid>

    //     <Grid item xs={12}>
    //       <Typography variant="subtitle1" color="white">
    //         Notes (any other abnormalities):
    //       </Typography>
    //       <Paper sx={{ p: 1 }}>
    //         {editing.neurological_note ? (
    //           <TextField
    //             variant="outlined"
    //             fullWidth
    //             multiline
    //             rows={3}
    //             value={neurologicalData.neurological_note}
    //             onChange={(e) =>
    //               handleChange("neurological_note", e.target.value)
    //             }
    //             onBlur={() => handleBlur("neurological_note")}
    //             autoFocus
    //             sx={{ backgroundColor: "white" }}
    //           />
    //         ) : (
    //           <Typography>
    //             <strong>{neurologicalData.neurological_note}</strong>
    //           </Typography>
    //         )}
    //         <Box display="flex" justifyContent="flex-end">
    //           <IconButton onClick={() => handleEdit("neurological_note")}>
    //             <EditIcon />
    //           </IconButton>
    //         </Box>
    //       </Paper>
    //     </Grid>
    //   </Grid>
    //   <Button
    //     variant="contained"
    //     color="primary"
    //     fullWidth
    //     sx={{ mt: 2, padding: 1 }}
    //     onClick={handleSubmit}
    //   >
    //     Submit
    //   </Button>
    // </Box>
  );
};

export default NeurologicalSystemComponent;
