//gabby pierce
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  Tooltip,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  getGenitourinaryInfo,
  addGenitourinaryInfo,
  updateGenitourinaryInfo,
} from "../../../services/GenitourinaryInfoService";
import { getSectionPatientById } from "../../../services/sectionPatientService";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSnackbar } from "../../utils/Snackbar";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function GenitourinaryInfoComponent({ sectionId }) {
  const [sectionPatientId, setSectionPatientId] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const [formData, setFormData] = useState({
    id: "",
    urinary_assessment: "",
    urinary_diversion_notes: "",
    urinary_route: "",
    urine_color: "",
    urine_characteristics: "",
    urine_odor: "",
    has_dialysis: false,
    date_of_last_treatment: dayjs().utc().toISOString(),
    dialysis_access_type: "",
    has_dialysis_access_dressing_cdi: false,
    foley_catheter: "",
    foley_removed: dayjs().utc().toISOString(),
  });

  const [touchedFields, setTouchedFields] = useState({
    urinary_assessment: false,
    urinary_diversion_notes: false,
    urinary_route: false,
    urine_color: false,
    urine_characteristics: false,
    urine_odor: false,
    dialysis_access_type: false,
    foley_catheter: false,
  });

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const isFormValid = () => {
    return (
      formData.urinary_assessment &&
      formData.urinary_route &&
      formData.urine_color &&
      formData.urine_characteristics &&
      formData.urine_odor &&
      formData.dialysis_access_type &&
      formData.foley_catheter
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionPatient = await getSectionPatientById(sectionId);
        setSectionPatientId(sectionPatient.id);

        try {
          const data = await getGenitourinaryInfo(sectionPatient.id);
          setFormData(data);
        } catch (error) {
          console.error("Error fetching genitourinary info:", error);
        }
      } catch (error) {
        console.error("Error fetching section patient data:", error);
      }
    };

    if (sectionId) {
      fetchData();
    }
  }, [sectionId]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let response;

      const payload = {
        section_patient_id: sectionPatientId,
        urinary_assessment: formData.urinary_assessment || "N/A",
        urinary_diversion_notes: formData.urinary_diversion_notes || "N/A",
        urinary_route: formData.urinary_route || "N/A",
        urine_color: formData.urine_color || "N/A",
        urine_characteristics: formData.urine_characteristics || "N/A",
        urine_odor: formData.urine_odor || "N/A",
        has_dialysis: formData.has_dialysis,
        date_of_last_treatment: dayjs(formData.date_of_last_treatment)
          .utc()
          .format("YYYY-MM-DD HH:mm:ss"),
        foley_removed: dayjs(formData.foley_removed)
          .utc()
          .format("YYYY-MM-DD HH:mm:ss"),
        dialysis_access_type: formData.dialysis_access_type || "N/A",
        has_dialysis_access_dressing_cdi:
          formData.has_dialysis_access_dressing_cdi,
        foley_catheter: formData.foley_catheter || "N/A",
      };

      if (formData && formData.id) {
        response = await updateGenitourinaryInfo(
          sectionPatientId,
          formData.id,
          payload
        );
      } else {
        response = await addGenitourinaryInfo(sectionPatientId, payload);
      }

      setFormData(response);
      showSnackbar("Genitourinary information saved successfully!", "success");
    } catch (error) {
      console.error("Error submitting Genitourinary info:", error);
      showSnackbar("Error saving information.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "white", p: 4, borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }} align="center">
        Genitourinary Information
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Select
            displayEmpty
            label="Urinary Assessment"
            fullWidth
            required
            value={formData.urinary_assessment}
            onChange={(e) => {
              setFormData({ ...formData, urinary_assessment: e.target.value });
              handleBlur("urinary_assessment");
            }}
            renderValue={(selected) =>
              selected ? (
                selected
              ) : (
                <span style={{ color: "#757575" }}>
                  Select Urinary Assessment
                </span>
              )
            }
          >
            <MenuItem value={"Continent"}>Continent</MenuItem>
            <MenuItem value={"Incontinent"}>Incontinent</MenuItem>
            <MenuItem value={"Retention"}>Retention</MenuItem>
            <MenuItem value={"Frequent"}>Frequent</MenuItem>
            <MenuItem value={"Painful"}>Painful</MenuItem>
            <MenuItem value={"Hematuria"}>Hematuria</MenuItem>
            <MenuItem value={"Anuric"}>Anuric</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Diversion Notes"
            fullWidth
            value={formData.urinary_diversion_notes}
            onChange={(e) => {
              setFormData({
                ...formData,
                urinary_diversion_notes: e.target.value,
              });
              handleBlur("urinary_diversion_notes");
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Select
            displayEmpty
            label="Urinary Route"
            fullWidth
            required
            value={formData.urinary_route}
            onChange={(e) => {
              setFormData({ ...formData, urinary_route: e.target.value });
              handleBlur("urinary_route");
            }}
            renderValue={(selected) =>
              selected ? (
                selected
              ) : (
                <span style={{ color: "#757575" }}>Select Urinary Route</span>
              )
            }
          >
            <MenuItem value={"Urinal"}>Urinal</MenuItem>
            <MenuItem value={"Foley-Catheter"}>Foley Catheter</MenuItem>
            <MenuItem value={"Urinary-Diversion"}>Urinary Diversion</MenuItem>
            <MenuItem value={"Straight-Catheter"}>Straight Catheter</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Select
            displayEmpty
            label="Urine Color"
            fullWidth
            required
            value={formData.urine_color}
            onChange={(e) => {
              setFormData({ ...formData, urine_color: e.target.value });
              handleBlur("urine_color");
            }}
            renderValue={(selected) =>
              selected ? (
                selected
              ) : (
                <span style={{ color: "#757575" }}>Select Urine Color</span>
              )
            }
          >
            <MenuItem value={"Yellow"}>Yellow</MenuItem>
            <MenuItem value={"Orange"}>Orange</MenuItem>
            <MenuItem value={"Green"}>Green</MenuItem>
            <MenuItem value={"Brown"}>Brown</MenuItem>
            <MenuItem value={"Red-Bloody"}>Red/Bloody</MenuItem>
            <MenuItem value={"Frank-Blood"}>Frank Blood</MenuItem>
            <MenuItem value={"Amber"}>Amber</MenuItem>
            <MenuItem value={"Dark-Yellow"}>Dark Yellow</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Select
            displayEmpty
            label="Urine Characteristics"
            fullWidth
            required
            value={formData.urine_characteristics}
            onChange={(e) => {
              setFormData({
                ...formData,
                urine_characteristics: e.target.value,
              });
              handleBlur("urine_characteristics");
            }}
            renderValue={(selected) =>
              selected ? (
                selected
              ) : (
                <span style={{ color: "#757575" }}>
                  Select Urine Characteristics
                </span>
              )
            }
          >
            <MenuItem value={"Cloudy"}>Cloudy</MenuItem>
            <MenuItem value={"Cloudy-With-Sediment"}>
              Cloudy-With-Sediment
            </MenuItem>
            <MenuItem value={"Sediment"}>Sediment</MenuItem>
            <MenuItem value={"Clots"}>Clots</MenuItem>
            <MenuItem value={"Milky"}>Milky</MenuItem>
            <MenuItem value={"Bloody"}>Bloody</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Select
            displayEmpty
            label="Urine Odor"
            fullWidth
            required
            value={formData.urine_odor}
            onChange={(e) => {
              setFormData({ ...formData, urine_odor: e.target.value })
              handleBlur("urine_odor")
            }
            }
            renderValue={(selected) =>
              selected ? (
                selected
              ) : (
                <span style={{ color: "#757575" }}>
                  Select Urine Oder
                </span>
              )
            }
          >
            <MenuItem value={"Foul"}>Foul</MenuItem>
            <MenuItem value={"Sweet"}>Sweet</MenuItem>
            <MenuItem value={"Ammonia"}>Ammonia</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.has_dialysis}
                onChange={(e) =>
                  setFormData({ ...formData, has_dialysis: e.target.checked })
                }
              />
            }
            label="Dialysis"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
              label="Date of Last Treatment"
              value={
                formData.date_of_last_treatment
                  ? dayjs(formData.date_of_last_treatment)
                  : null
              }
              onChange={(newValue) => {
                setFormData({
                  ...formData,
                  date_of_last_treatment: newValue
                    ? dayjs(newValue).utc().format("YYYY-MM-DD HH:mm:ss")
                    : "",
                });
              }}
              minutesStep={1}
              ampm={true}
              views={["year", "day", "hours", "minutes"]}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Select
          displayEmpty
            label="Dialysis Access Type"
            fullWidth
            required
            value={formData.dialysis_access_type}
            onChange={(e) => {
              setFormData({
                ...formData,
                dialysis_access_type: e.target.value,
              })
              handleBlur("dialysis_access_type")
            }
            }
            renderValue={(selected) =>
              selected ? (
                selected
              ) : (
                <span style={{ color: "#757575" }}>
                  Select Dialysis Access Type
                </span>
              )
            }
          >
            <MenuItem value={"Peritoneal"}>Peritoneal</MenuItem>
            <MenuItem value={"Hemodialysis"}>Hemodialysis</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.has_dialysis_access_dressing_cdi}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    has_dialysis_access_dressing_cdi: e.target.checked,
                  })
                }
              />
            }
            label="Dialysis Access Dressing Change"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Foley Catheter"
            fullWidth
            value={formData.foley_catheter}
            onChange={(e) =>
              setFormData({ ...formData, foley_catheter: e.target.value })
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
              label="Foley Removed"
              value={
                formData.foley_removed ? dayjs(formData.foley_removed) : null
              }
              onChange={(newValue) => {
                setFormData({
                  ...formData,
                  foley_removed: newValue
                    ? dayjs(newValue).utc().format("YYYY-MM-DD HH:mm:ss")
                    : "",
                });
              }}
              minutesStep={1}
              ampm={true}
              views={["year", "day", "hours", "minutes"]}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 4 }}
        onClick={handleSubmit}
        disabled={loading || !isFormValid()}
      >
        {formData.id ? "Update" : "Submit"}
      </Button>
      {SnackbarComponent}
    </Box>
  );
}
