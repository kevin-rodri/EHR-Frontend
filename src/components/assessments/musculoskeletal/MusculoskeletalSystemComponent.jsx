import React, { useState, useEffect } from "react";
import {
  FormControl,
  Box,
  Select,
  MenuItem,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import {
  getMusculoskeletalInfo,
  addMusculoskeletalInfo,
  updateMusculoskeletalInfo,
} from "../../../services/musculoskeletalInfoService";
import { getSectionPatientById } from "../../../services/sectionPatientService";

export default function MusculoskeletalSystemComponent({ sectionId }) {
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
    abnormalities: "",
  });

  const fetchMusculoskeletalInfo = async () => {
    try {
      const sectionPatient = await getSectionPatientById(sectionId);
      const sectionPatientId = sectionPatient.id;
      const patientMusculoskeletal = await getMusculoskeletalInfo(
        sectionPatientId
      );
      if (patientMusculoskeletal === null) {
        setWasAdded(false);
      } else {
        setWasAdded(true);
      }
      if (patientMusculoskeletal != null) {
        setFormData(patientMusculoskeletal);
      }
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
        abnormalities: formData.abnormalities,
      });
      setFormData(response);
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
      const response = await updateMusculoskeletalInfo(
        sectionPatientId,
        formData.id,
        {
          left_upper_extremity: formData.left_upper_extremity,
          left_lower_extremity: formData.left_lower_extremity,
          right_upper_extremity: formData.right_upper_extremity,
          right_lower_extremity: formData.right_lower_extremity,
          gait: formData.gait,
          adl_id: formData.adl_id,
          abnormalities: formData.abnormalities,
        }
      );
      setFormData(response);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        padding: 2,
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Range of Motion (ROM)
      </Typography>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}
      >
        {/* LUE */}
        <FormControl fullWidth>
          <Typography sx={{ fontWeight: 500 }}>LUE</Typography>
          <Select
            value={formData.left_upper_extremity || ""}
            onChange={(event) =>
              setFormData({
                ...formData,
                left_upper_extremity: event.target.value,
              })
            }
          >
            <MenuItem value={"Full-ROM"}>Full ROM</MenuItem>
            <MenuItem value={"Limited-ROM"}>Limited ROM</MenuItem>
            <MenuItem value={"Immobile"}>Immobile</MenuItem>
            <MenuItem value={"Flaccid"}>Flaccid</MenuItem>
            <MenuItem value={"Contracted"}>Contracted</MenuItem>
          </Select>
        </FormControl>

        {/* LLE */}
        <FormControl fullWidth>
          <Typography sx={{ fontWeight: 500 }}>LLE</Typography>
          <Select
            value={formData.left_lower_extremity || ""}
            onChange={(event) =>
              setFormData({
                ...formData,
                left_lower_extremity: event.target.value,
              })
            }
          >
            <MenuItem value={"Full-ROM"}>Full ROM</MenuItem>
            <MenuItem value={"Limited-ROM"}>Limited ROM</MenuItem>
            <MenuItem value={"Immobile"}>Immobile</MenuItem>
            <MenuItem value={"Flaccid"}>Flaccid</MenuItem>
            <MenuItem value={"Contracted"}>Contracted</MenuItem>
          </Select>
        </FormControl>

        {/* RUE */}
        <FormControl fullWidth>
          <Typography sx={{ fontWeight: 500 }}>RUE</Typography>
          <Select
            value={formData.right_upper_extremity || ""}
            onChange={(event) =>
              setFormData({
                ...formData,
                right_upper_extremity: event.target.value,
              })
            }
          >
            <MenuItem value={"Full-ROM"}>Full ROM</MenuItem>
            <MenuItem value={"Limited-ROM"}>Limited ROM</MenuItem>
            <MenuItem value={"Immobile"}>Immobile</MenuItem>
            <MenuItem value={"Flaccid"}>Flaccid</MenuItem>
            <MenuItem value={"Contracted"}>Contracted</MenuItem>
          </Select>
        </FormControl>

        {/* RLE */}
        <FormControl fullWidth>
          <Typography sx={{ fontWeight: 500 }}>RLE</Typography>
          <Select
            value={formData.right_lower_extremity || ""}
            onChange={(event) =>
              setFormData({
                ...formData,
                right_lower_extremity: event.target.value,
              })
            }
          >
            <MenuItem value={"Full-ROM"}>Full ROM</MenuItem>
            <MenuItem value={"Limited-ROM"}>Limited ROM</MenuItem>
            <MenuItem value={"Immobile"}>Immobile</MenuItem>
            <MenuItem value={"Flaccid"}>Flaccid</MenuItem>
            <MenuItem value={"Contracted"}>Contracted</MenuItem>
          </Select>
        </FormControl>

        {/* Gait */}
        <FormControl fullWidth>
          <Typography sx={{ fontWeight: 500 }}>Gait</Typography>
          <Select
            value={formData.gait || ""}
            onChange={(event) =>
              setFormData({ ...formData, gait: event.target.value })
            }
          >
            <MenuItem value={"Self-Steady"}>Self, Steady</MenuItem>
            <MenuItem value={"Self-Unsteady"}>Self, Unsteady</MenuItem>
            <MenuItem value={"1-assist"}>1 assist</MenuItem>
            <MenuItem value={"2-assist"}>2 assist</MenuItem>
            <MenuItem value={"Wheelchair"}>Wheelchair</MenuItem>
            <MenuItem value={"Bedbound"}>Bedbound</MenuItem>
          </Select>
        </FormControl>

        {/* ADL */}
        <FormControl fullWidth>
          <Typography sx={{ fontWeight: 500 }}>ADL's</Typography>
          <Select
            value={formData.adl_id || ""}
            onChange={(event) =>
              setFormData({ ...formData, adl_id: event.target.value })
            }
          >
            <MenuItem value={"Self-Care"}>Self Care</MenuItem>
            <MenuItem value={"Facilitated"}>Facilitated</MenuItem>
            <MenuItem value={"Total-Care"}>Total Care</MenuItem>
          </Select>
        </FormControl>

        {/* Notes (Full Width) */}
        <FormControl fullWidth sx={{ gridColumn: "span 3" }}>
          <Typography sx={{ fontWeight: 500 }}>
            Please note any other abnormalities
          </Typography>
          <TextField
            value={formData.abnormalities || ""}
            onChange={(event) =>
              setFormData({ ...formData, abnormalities: event.target.value })
            }
            rows={4}
            multiline
            fullWidth
          />
        </FormControl>

        {/* Submit Button (Full Width) */}
        <Button
          type="submit"
          color="primary"
          variant="contained"
          sx={{ gridColumn: "span 3", mt: 2 }}
          onClick={!wasAdded ? onSubmit : onEdit}
        >
          {!wasAdded ? "Submit" : "Save"}
        </Button>
      </Box>
    </Box>
  );
}
