import React, { useState, useEffect } from "react";
import { FormControl, Box, Select, MenuItem, TextField, Typography, Button, IconButton, Divider } from "@mui/material";
import { getMusculoskeletalInfo, addMusculoskeletalInfo, 
  updateMusculoskeletalInfo } from "../../../services/musculoskeletalInfoService";
  import { getSectionPatientById } from "../../../services/sectionPatientService";

export default function MusculoskeletalSystemComponent({sectionId}) {

    const [info, setInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sectionPatientId, setSectionPatientId] = useState("");
    const [wasAdded, setWasAdded] = useState(false);
    const [formData, setFormData] = useState({
      id: "",
      left_upper_extremity: "",
      left_lower_extremity: "",
      right_upper_extremity: "",
      right_lower_extremity: "",
      gait: "",
      adl_id: "",
      abnormalities: ""
    });

    const fetchMusculoskeletalInfo = async () => {
      try {
            const sectionPatient = await getSectionPatientById(sectionId);
            const sectionPatientId = sectionPatient.id;
            const patientMusculoskeletal = await getMusculoskeletalInfo(
              sectionPatientId
            );
            if (patientMusculoskeletal === null) {
              setWasAdded(false)
            } else {
              setWasAdded(true)
            };
            if (patientMusculoskeletal != null){
              setFormData(patientMusculoskeletal);
            };
            setSectionPatientId(sectionPatientId);
          } catch (err) {
            throw err;
          }
    };

    useEffect(() => {
      if (sectionId === null) {
        return;
      }
        fetchMusculoskeletalInfo();
      }, [sectionId]);

    const onSubmit = async () => {
        setLoading(true);
        try {
          const response = await addMusculoskeletalInfo(sectionPatientId, {
            left_upper_extremity: formData.left_upper_extremity,
            left_lower_extremity: formData.left_lower_extremity,
            right_upper_extremity: formData.right_upper_extremity,
            right_lower_extremity: formData.right_lower_extremity,
            gait: formData.gait,
            adl_id: formData.adl_id,
            abnormalities: formData.abnormalities
          });
          setFormData((prevData) => [prevData, response])
          setWasAdded(true);
        } catch (err) {
          throw err;
        } finally {
          setLoading(false);
        }
      };

    const onEdit = async () => {
      setLoading(true);
        try {
          const response = await updateMusculoskeletalInfo(sectionPatientId, formData.id, {
            left_upper_extremity: formData.left_upper_extremity,
            left_lower_extremity: formData.left_lower_extremity,
            right_upper_extremity: formData.right_upper_extremity,
            right_lower_extremity: formData.right_lower_extremity,
            gait: formData.gait,
            adl_id: formData.adl_id,
            abnormalities: formData.abnormalities
          });
          setFormData((prevData) => 
            prevData.map((item) => 
              item.id === response.id ? response : item
            )
          );
        } catch (err) {
          throw err;
        } finally {
          setLoading(false);
        }
    };

    return(
        <Box>
            <Box sx={{
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              padding: 1,
              borderRadius: 2,
            }}>
              <div>
                <Typography>ROM</Typography>
              </div>
            <Divider />
            <div>
              <div>
              <Typography>LUE</Typography>
                <FormControl>
                <Select
                value={formData.left_upper_extremity || ""}
                onChange={(event) => setFormData({...formData, left_upper_extremity: event.target.value})}
                fullWidth
              >
                <MenuItem value={"Full-ROM"}>Full ROM</MenuItem>
                <MenuItem value={"Limited-ROM"}>Limited ROM</MenuItem>
                <MenuItem value={"Immobile"}>Immobile</MenuItem>
                <MenuItem value={"Flaccid"}>Flaccid</MenuItem>
                <MenuItem value={"Contracted"}>Contracted</MenuItem>
              </Select>
                </FormControl>
                </div>
                <div>
                <Typography>LLE</Typography>
                <FormControl>
                <Select
                value={formData.left_lower_extremity || ""}
                onChange={(event) => setFormData({...formData, left_lower_extremity: event.target.value})}
              >
                <MenuItem value={"Full-ROM"}>Full ROM</MenuItem>
                <MenuItem value={"Limited-ROM"}>Limited ROM</MenuItem>
                <MenuItem value={"Immobile"}>Immobile</MenuItem>
                <MenuItem value={"Flaccid"}>Flaccid</MenuItem>
                <MenuItem value={"Contracted"}>Contracted</MenuItem>
              </Select>
                </FormControl>
                </div>
                </div>
                <div>
                <Typography>RUE</Typography>
                <FormControl>
                <Select
                value={formData.right_upper_extremity || ""}
                onChange={(event) => setFormData({...formData, right_upper_extremity: event.target.value})}
              >
                <MenuItem value={"Full-ROM"}>Full ROM</MenuItem>
                <MenuItem value={"Limited-ROM"}>Limited ROM</MenuItem>
                <MenuItem value={"Immobile"}>Immobile</MenuItem>
                <MenuItem value={"Flaccid"}>Flaccid</MenuItem>
                <MenuItem value={"Contracted"}>Contracted</MenuItem>
              </Select>
                </FormControl>
                </div>
                <div>
                <Typography>RLE</Typography>
                <FormControl>
                <Select
                value={formData.right_lower_extremity || ""}
                onChange={(event) => setFormData({...formData, right_lower_extremity: event.target.value})}
              >
                <MenuItem value={"Full-ROM"}>Full ROM</MenuItem>
                <MenuItem value={"Limited-ROM"}>Limited ROM</MenuItem>
                <MenuItem value={"Immobile"}>Immobile</MenuItem>
                <MenuItem value={"Flaccid"}>Flaccid</MenuItem>
                <MenuItem value={"Contracted"}>Contracted</MenuItem>
              </Select>
                </FormControl>
                </div>
                <div>
                <Typography>Gait</Typography>
                <FormControl>
                <Select
                value={formData.gait || ""}
                onChange={(event) => setFormData({...formData, gait: event.target.value})}
              >
                <MenuItem value={"Self-Steady"}>Self, Steady</MenuItem>
                <MenuItem value={"Self-Unsteady"}>Self, Unsteady</MenuItem>
                <MenuItem value={"1-assist"}>1 assist</MenuItem>
                <MenuItem value={"2-assist"}>2 assist</MenuItem>
                <MenuItem value={"Wheelchair"}>Wheelchair</MenuItem>
                <MenuItem value={"Bedbound"}>Bedbound</MenuItem>
              </Select>
                </FormControl>
                </div>
                <div>
                <Typography>ADL's</Typography>
                <FormControl>
                <Select
                value={formData.adl_id || ""}
                onChange={(event) => setFormData({...formData, adl_id: event.target.value})}
              >
                <MenuItem value={"Self-Care"}>Self Care</MenuItem>
                <MenuItem value={"Facilitated"}>Facilitated</MenuItem>
                <MenuItem value={"Total-Care"}>Total Care</MenuItem>
              </Select>
                </FormControl>
                </div>
                <div>
                <Typography>Please note any other abnormalities</Typography>
                <FormControl>
                    <TextField
                        value={formData.abnormalities || ""}
                        onChange={(event) => setFormData({...formData, abnormalities: event.target.value})}
                        rows={4}
                        multiline
                        fullWidth
                    />
                </FormControl>
                </div>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  onClick={!wasAdded ? onSubmit : onEdit}
                 >
                  Save
                  </Button>
            </Box>
        </Box>
    )
}