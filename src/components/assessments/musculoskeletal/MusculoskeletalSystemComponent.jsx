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
import { useSnackbar } from "../../utils/Snackbar";

export default function MusculoskeletalSystemComponent({ sectionId }) {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sectionPatientId, setSectionPatientId] = useState("");
  const [wasAdded, setWasAdded] = useState(false);
  const { showSnackbar, SnackbarComponent } = useSnackbar();
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

  const [touchedFields, setTouchedFields] = useState({
    left_upper_extremity: false,
    left_lower_extremity: false,
    right_upper_extremity: false,
    right_lower_extremity: false,
    gait: false,
    adl_id: false,
  });

  const isFormValid =
  formData.left_upper_extremity.trim() !== "" &&
  formData.left_lower_extremity.trim() !== "" &&
  formData.right_upper_extremity.trim() !== "" &&
  formData.right_lower_extremity.trim() !== "" &&
  formData.gait.trim() !== "" &&
  formData.adl_id.trim() !== "";


  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

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
      const abnormalitiesToSend =
        formData.abnormalities && formData.abnormalities.trim() !== ""
          ? formData.abnormalities
          : "N/A";

      const response = await addMusculoskeletalInfo(sectionPatientId, {
        left_upper_extremity: formData.left_upper_extremity,
        left_lower_extremity: formData.left_lower_extremity,
        right_upper_extremity: formData.right_upper_extremity,
        right_lower_extremity: formData.right_lower_extremity,
        gait: formData.gait,
        adl_id: formData.adl_id,
        abnormalities: abnormalitiesToSend,
      });
      setFormData(response);
      setWasAdded(true);
      showSnackbar("Musculoskeletal information saved successfully!", "success");
    } catch (err) {
      showSnackbar("Error saving information.", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const onEdit = async () => {
    setLoading(true);
    try {
      const abnormalitiesToSend =
      formData.abnormalities && formData.abnormalities.trim() !== ""
        ? formData.abnormalities
        : "N/A";

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
          abnormalities: abnormalitiesToSend,
        }
      );
      setFormData(response);
      showSnackbar("Musculoskeletal information saved successfully!", "success");
    } catch (err) {
      showSnackbar("Error saving information.", "error");
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
        {/* LUE */}
        <FormControl
          fullWidth
          error={
            touchedFields.left_upper_extremity &&
            formData.left_upper_extremity.trim() === ""
          }
        >
          <Typography sx={{ fontWeight: 500 }}>LUE</Typography>
          <Select
            value={formData.left_upper_extremity || ""}
            onChange={(event) =>
              setFormData({
                ...formData,
                left_upper_extremity: event.target.value,
              })
            }
            onBlur={() => handleBlur("left_upper_extremity")}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select an option
            </MenuItem>
            <MenuItem value={"Full-ROM"}>Full ROM</MenuItem>
            <MenuItem value={"Limited-ROM"}>Limited ROM</MenuItem>
            <MenuItem value={"Immobile"}>Immobile</MenuItem>
            <MenuItem value={"Flaccid"}>Flaccid</MenuItem>
            <MenuItem value={"Contracted"}>Contracted</MenuItem>
          </Select>
        </FormControl>

        {/* LLE */}
        <FormControl
          fullWidth
          error={
            touchedFields.left_lower_extremity &&
            formData.left_lower_extremity.trim() === ""
          }
        >
          <Typography sx={{ fontWeight: 500 }}>LLE</Typography>
          <Select
            value={formData.left_lower_extremity || ""}
            onChange={(event) =>
              setFormData({
                ...formData,
                left_lower_extremity: event.target.value,
              })
            }
            onBlur={() => handleBlur("left_lower_extremity")}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select an option
            </MenuItem>
            <MenuItem value={"Full-ROM"}>Full ROM</MenuItem>
            <MenuItem value={"Limited-ROM"}>Limited ROM</MenuItem>
            <MenuItem value={"Immobile"}>Immobile</MenuItem>
            <MenuItem value={"Flaccid"}>Flaccid</MenuItem>
            <MenuItem value={"Contracted"}>Contracted</MenuItem>
          </Select>
        </FormControl>

        {/* RUE */}
        <FormControl
          fullWidth
          error={
            touchedFields.right_upper_extremity &&
            formData.right_upper_extremity.trim() === ""
          }
        >
          <Typography sx={{ fontWeight: 500 }}>RUE</Typography>
          <Select
            value={formData.right_upper_extremity || ""}
            onChange={(event) =>
              setFormData({
                ...formData,
                right_upper_extremity: event.target.value,
              })
            }
            onBlur={() => handleBlur("right_upper_extremity")}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select an option
            </MenuItem>
            <MenuItem value={"Full-ROM"}>Full ROM</MenuItem>
            <MenuItem value={"Limited-ROM"}>Limited ROM</MenuItem>
            <MenuItem value={"Immobile"}>Immobile</MenuItem>
            <MenuItem value={"Flaccid"}>Flaccid</MenuItem>
            <MenuItem value={"Contracted"}>Contracted</MenuItem>
          </Select>
        </FormControl>

        {/* RLE */}
        <FormControl
          fullWidth
          error={
            touchedFields.right_lower_extremity &&
            formData.right_lower_extremity.trim() === ""
          }
        >
          <Typography sx={{ fontWeight: 500 }}>RLE</Typography>
          <Select
            value={formData.right_lower_extremity || ""}
            onChange={(event) =>
              setFormData({
                ...formData,
                right_lower_extremity: event.target.value,
              })
            }
            onBlur={() => handleBlur("right_lower_extremity")}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select an option
            </MenuItem>
            <MenuItem value={"Full-ROM"}>Full ROM</MenuItem>
            <MenuItem value={"Limited-ROM"}>Limited ROM</MenuItem>
            <MenuItem value={"Immobile"}>Immobile</MenuItem>
            <MenuItem value={"Flaccid"}>Flaccid</MenuItem>
            <MenuItem value={"Contracted"}>Contracted</MenuItem>
          </Select>
        </FormControl>

        {/* Gait */}
        <FormControl
          fullWidth
          error={touchedFields.gait && formData.gait.trim() === ""}
        >
          <Typography sx={{ fontWeight: 500 }}>Gait</Typography>
          <Select
            value={formData.gait || ""}
            onChange={(event) =>
              setFormData({ ...formData, gait: event.target.value })
            }
            onBlur={() => handleBlur("gait")}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select an option
            </MenuItem>
            <MenuItem value={"Self-Steady"}>Self, Steady</MenuItem>
            <MenuItem value={"Self-Unsteady"}>Self, Unsteady</MenuItem>
            <MenuItem value={"1-assist"}>1 assist</MenuItem>
            <MenuItem value={"2-assist"}>2 assist</MenuItem>
            <MenuItem value={"Wheelchair"}>Wheelchair</MenuItem>
            <MenuItem value={"Bedbound"}>Bedbound</MenuItem>
          </Select>
        </FormControl>

        {/* ADL */}
        <FormControl
          fullWidth
          error={touchedFields.adl_id && formData.adl_id.trim() === ""}
        >
          <Typography sx={{ fontWeight: 500 }}>ADL's</Typography>
          <Select
            value={formData.adl_id || ""}
            onChange={(event) =>
              setFormData({ ...formData, adl_id: event.target.value })
            }
            onBlur={() => handleBlur("adl_id")}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select an option
            </MenuItem>
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
          disabled={!isFormValid}
        >
          {!wasAdded ? "Submit" : "Save"}
        </Button>
      </Box>
      {SnackbarComponent}
    </Box>
  );
}
