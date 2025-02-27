// Name: Kevin Rodriguez
// Date: 2/22/25
// Remarks: WALDO Diagram component that involves the logic of the waldo diagrams and notes portion for any WALDO notes.
// https://www.svgviewer.dev/ was my life saver to know where to put the checkboxes
import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormGroup,
  FormLabel,
  TextField,
  Button,
  Checkbox,
  Typography,
  Snackbar,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ReactComponent as WaldoFront } from "../../assets/waldo_front.svg";
import { ReactComponent as WaldoBack } from "../../assets/waldo_back.svg";
import {
  getPatientWaldoInfo,
  updatePatientWaldoInfo,
  addPatientWaldoInfo,
} from "../../services/waldoService";
import { getSectionPatientById } from "../../services/sectionPatientService";
import { useForm } from "react-hook-form";
export default function WaldoDiagramComponent({ sectionId }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [checkedBoxes, setCheckedBoxes] = useState({});
  const [patientId, setPatientId] = useState(null);
  const [waldoInfo, setWaldoInfo] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // let's get the waldo info first (if any)
  useEffect(() => {
    const fetchPatientWaldo = async () => {
      try {
        const sectionPatient = await getSectionPatientById(sectionId);
        const patientId = sectionPatient.id;
        const patientWaldoData = await getPatientWaldoInfo(patientId);

        if (Array.isArray(patientWaldoData) && patientWaldoData.length > 0) {
          const waldoEntry = patientWaldoData[0];
          setWaldoInfo(waldoEntry);
          setCheckedBoxes(waldoEntry.wound_drain_locations || {});

          // Set form values
          setValue("drain_note", waldoEntry.drain_note || "");
          setValue("pressure_sore_note", waldoEntry.pressure_sore_note || "");
          setValue("surgical_wound_note", waldoEntry.surgical_wound_note || "");
          setValue("trauma_wound_note", waldoEntry.trauma_wound_note || "");
        } else {
          setWaldoInfo({});
        }

        setPatientId(patientId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatientWaldo();
  }, [setValue]);

  const handleCheckboxChange = (id) => {
    console.log(id);
    setCheckedBoxes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFieldChange = (field, value) => {
    setWaldoInfo((prev) => ({ ...prev, [field]: value }));
  };

  // TO-DO: Confirm these are the actual names in the diagram.
  const frontRawPoints = [
    { id: "Left Forearm", x: 470.802551, y: 440.544281 },
    { id: "Left Lower Leg", x: 365.5, y: 817.260925 },
    { id: "Right Upper Chest", x: 330.430847, y: 270.328705 },
    { id: "Left Foot", x: 355.92984, y: 930.378174 },
    { id: "Left Hand", x: 508.16684, y: 560.615784 },
    { id: "Left Upper Arm", x: 439.500153, y: 248.085052 },
    { id: "Abdominal", x: 324.125671, y: 375.916077 },
    { id: "Right Hand", x: 128.815369, y: 545.494873 },
    { id: "Left Thigh", x: 370.903351, y: 595.358582 },
    { id: "Right Forearm", x: 180.346039, y: 418.705109 },
    { id: "Right Upper Arm", x: 213.993073, y: 245.910217 },
    { id: "Right Thigh", x: 262.398987, y: 595.358582 },
    { id: "Right Lower Leg", x: 260.408112, y: 817.818604 },
    { id: "Forehead", x: 303.971619, y: 67.386673 },
    { id: "Right Foot", x: 255.653534, y: 930.23822 },
  ];

  // TO-DO: Confirm these are the actual names in the diagram.
  const backRawPoints = [
    { id: "Left Heel", x: 270.026031, y: 940.153748 },
    { id: "Left Thigh (Back Side)", x: 280.489563, y: 620.874084 },
    { id: "Left Calf", x: 280.235962, y: 808.966431 },
    { id: "Upper Left Shoulder", x: 230.2686, y: 260.44368 },
    { id: "Right Heel", x: 380.424042, y: 940.437622 },
    { id: "Upper Right Shoulder", x: 490.225067, y: 260.006683 },
    { id: "Left Forearm", x: 160.088791, y: 440.22171 },
    { id: "Right Glute", x: 401.60968, y: 515.769226 },
    { id: "Left Hand", x: 110.291641, y: 558.97113 },
    { id: "Right Thigh (Back Side)", x: 410.581146, y: 620.705994 },
    { id: "Mid Upper Back", x: 350.177246, y: 435.424561 },
    { id: "Right Calf", x: 400.812012, y: 808.804016 },
    { id: "Back of the Head", x: 350.5, y: 95.14109 },
    { id: "Upper Back", x: 360.499969, y: 275.730865 },
    { id: "Right Forearm", x: 530.177246, y: 440.424561 },
    { id: "Left Glute", x: 280.50148, y: 515.176147 },
    { id: "Right Hand", x: 555.291641, y: 562.97113 },
  ];

  // BASED on the largest svg dimensions
  const NORMALIZED_WIDTH = 576;
  const NORMALIZED_HEIGHT = 1024;

  function scalePoint(
    pt,
    { originalWidth, originalHeight, targetWidth, targetHeight }
  ) {
    return {
      x: pt.x * (targetWidth / originalWidth),
      y: pt.y * (targetHeight / originalHeight),
    };
  }

  // take care of knowing the exact coordinates of the checkboxes.
  const frontCheckboxPositions = frontRawPoints.map((pt) => ({
    ...scalePoint(pt, {
      originalWidth: NORMALIZED_WIDTH,
      originalHeight: NORMALIZED_HEIGHT,
      targetWidth: 100,
      targetHeight: 100,
    }),
    id: pt.id,
  }));

  // take care of knowing the exact coordinates of the checkboxes.
  const backCheckboxPositions = backRawPoints.map((pt) => ({
    ...scalePoint(pt, {
      originalWidth: NORMALIZED_WIDTH,
      originalHeight: NORMALIZED_HEIGHT,
      targetWidth: 100,
      targetHeight: 100,
    }),
    id: pt.id,
  }));

  // Let's either add or update the waldo info
  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const requestData = {
        section_patient_id: patientId,
        wound_drain_locations: checkedBoxes,
        surgical_wound_note: formData.surgical_wound_note,
        pressure_sore_note: formData.pressure_sore_note,
        trauma_wound_note: formData.trauma_wound_note,
        drain_note: formData.drain_note,
      };

      let info;
      if (waldoInfo && waldoInfo.id != null) {
        info = await updatePatientWaldoInfo(
          patientId,
          waldoInfo.id,
          requestData
        );
      } else {
        info = await addPatientWaldoInfo(patientId, requestData);
      }

      setWaldoInfo(info);
    } catch (error) {
      setError(error);
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        gap: 2,
      }}
    >
      <Typography variant="h6" fontFamily={"Roboto"} color="white">
        Check Off the Patient's Corresponding Wound or Drain Locations
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 2,
          justifyContent: "center",
          padding: 2,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "300px",
            height: "auto",
          }}
        >
          <WaldoFront style={{ width: "100%", height: "100%" }} />
          {frontCheckboxPositions.map((pos) => (
            <Checkbox
              key={pos.id}
              checked={checkedBoxes[pos.id] || false}
              onChange={() => handleCheckboxChange(pos.id)}
              sx={{
                position: "absolute",
                top: `${pos.y}%`,
                left: `${pos.x}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </Box>

        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "300px",
            height: "auto",
          }}
        >
          <WaldoBack style={{ width: "100%", height: "100%" }} />
          {backCheckboxPositions.map((pos) => (
            <Checkbox
              key={pos.id}
              checked={checkedBoxes[pos.id] || false}
              onChange={() => handleCheckboxChange(pos.id)}
              sx={{
                position: "absolute",
                top: `${pos.y}%`,
                left: `${pos.x}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </Box>
      </Box>
      <Typography
        variant="h2"
        fontFamily={"Roboto"}
        color="white"
        textAlign={"center"}
      >
        Notes
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          gap: 2,
          padding: 2,
          borderRadius: 2,
          marginBottom: 2,
          flexGrow: 1,
          flexWrap: "wrap",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup sx={{ gap: 2 }}>
            <FormControl fullWidth>
              <FormLabel sx={{ display: "flex", alignItems: "flex-start" }}>
                Drain Notes: Type of drain, location, and drainage
              </FormLabel>
              <TextField
                multiline
                rows={4}
                fullWidth
                value={waldoInfo.drain_note || ""}
                placeholder="Enter note here"
                {...register("drain_note", {
                  required: "Please Enter a Drain Note",
                })}
                onChange={(e) =>
                  handleFieldChange("drain_note", e.target.value)
                }
                error={!!errors.drain_note}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ display: "flex", alignItems: "flex-start" }}>
                Pressure Sore
              </FormLabel>
              <TextField
                multiline
                rows={4}
                fullWidth
                value={waldoInfo.pressure_sore_note || ""}
                placeholder="Enter note here"
                {...register("pressure_sore_note", {
                  required: "Please Enter a Pressure Sore Note",
                })}
                onChange={(e) =>
                  handleFieldChange("pressure_sore_note", e.target.value)
                }
                error={!!errors.pressure_sore_note}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ display: "flex", alignItems: "flex-start" }}>
                Surgical Wound
              </FormLabel>
              <TextField
                multiline
                rows={4}
                fullWidth
                value={waldoInfo.surgical_wound_note || ""}
                placeholder="Enter note here"
                {...register("surgical_wound_note", {
                  required: "Please Enter a Surgical Wound Note",
                })}
                onChange={(e) =>
                  handleFieldChange("surgical_wound_note", e.target.value)
                }
                error={!!errors.surgical_wound_note}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ display: "flex", alignItems: "flex-start" }}>
                Trauma Wound
              </FormLabel>
              <TextField
                multiline
                rows={4}
                fullWidth
                value={waldoInfo.trauma_wound_note || ""}
                placeholder="Enter note here"
                {...register("trauma_wound_note", {
                  required: "Please Enter a Trauma Wound Note",
                })}
                onChange={(e) =>
                  handleFieldChange("trauma_wound_note", e.target.value)
                }
                error={!!errors.trauma_wound_note}
              />
            </FormControl>
          </FormGroup>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              type="submit"
              sx={{
                width: "100%",
                backgroundColor: "#2196F3",
                color: "white",
                marginTop: 2,
                "&:hover": { backgroundColor: "#1976D2" },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          {error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Alert severity="success">Patient Information Saved</Alert>
          )}
        </Snackbar>
      </Box>
    </Box>
  );
}
