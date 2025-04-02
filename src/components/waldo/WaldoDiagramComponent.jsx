// Name: Kevin Rodriguez
// Date: 2/22/25
// Remarks: WALDO Diagram component that involves the logic of the waldo diagrams and notes portion for any WALDO notes.
// https://www.svgviewer.dev/ was my life saver to know where to put the checkboxes
import React, { useState, useEffect, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Checkbox,
  Typography,
} from "@mui/material";
import { ReactComponent as WaldoFront } from "../../assets/waldo_front.svg";
import { ReactComponent as WaldoBack } from "../../assets/waldo_back.svg";
import {
  getPatientWaldoInfo,
  updatePatientWaldoInfo,
  addPatientWaldoInfo,
  deletePatientWaldoInfo,
} from "../../services/waldoService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getSectionPatientById } from "../../services/sectionPatientService";
import DeleteConfirmationModal from "../utils/DeleteModalComponent";

export default function WaldoDiagramComponent({ sectionId }) {
  const [openModal, setOpenModal] = useState(false);
  const [checkedBoxes, setCheckedBoxes] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sectionPatientId, setSectionPatientId] = useState(null);
  const [waldoInfo, setWaldoInfo] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [newWaldoInfo, setNewWaldoInfo] = useState({
    id: "",
    section_patient_id: "",
    wound_drain_locations: "",
    surgical_wound_note: "",
    pressure_sore_note: "",
    drain_notetrauma_wound_note: "",
    drain_note: "",
  });

  // let's get the waldo info first (if any)
  useEffect(() => {
    const fetchPatientWaldo = async () => {
      try {
        const sectionPatient = await getSectionPatientById(sectionId);
        const patientId = sectionPatient.id;
        const patientWaldoData = await getPatientWaldoInfo(patientId);
        setWaldoInfo(patientWaldoData);
        await Promise.all(
          patientWaldoData.map((waldo) => {
            setCheckedBoxes(waldo.wound_drain_locations || {});
          })
        );
        setSectionPatientId(patientId);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPatientWaldo();
  }, [sectionId]);

  const handleCheckboxChange = (id) => {
    setCheckedBoxes((prev) => ({ ...prev, [id]: !prev[id] }));
    setSelectedLocation((prev) => (prev === id ? null : id));

    setNewWaldoInfo({
      id: "",
      section_patient_id: sectionPatientId,
      wound_drain_locations: { [id]: true },
      surgical_wound_note: "",
      pressure_sore_note: "",
      trauma_wound_note: "",
      drain_note: "",
    });

    setEditingRow(null);
    setOpenModal(true);
  };

  const columns = useMemo(() => [
    {
      accessorKey: "wound_drain_locations",
      header: "Wound/Drain Location",
      size: 200,
      Cell: ({ row }) => {
        const locations = row.original.wound_drain_locations;
        return locations
          ? Object.keys(locations).filter((key) => locations[key])
          : "None";
      },
    },
    { accessorKey: "drain_note", header: "Drain Note", size: 150 },
    {
      accessorKey: "pressure_sore_note",
      header: "Pressure Sore Note",
      size: 200,
    },
    {
      accessorKey: "surgical_wound_note",
      header: "Surgical Wound Note",
      size: 200,
    },
    {
      accessorKey: "trauma_wound_note",
      header: "Trauma Wound Note",
      size: 200,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      size: 150,
      enableSorting: false,
      Cell: ({ row }) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleOpenModal(row, "edit")}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => handleOpenModal(row, "delete")}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]);

  const handleOpenModal = (row = null, action = "edit") => {
    if (action === "edit") {
      setEditingRow(row);
      if (row) {
        setNewWaldoInfo({
          id: row.original.id,
          section_patient_id: row.original.section_patient_id,
          wound_drain_locations: row.original.wound_drain_locations,
          surgical_wound_note: row.original.surgical_wound_note,
          pressure_sore_note: row.original.pressure_sore_note,
          trauma_wound_note: row.original.trauma_wound_note,
          drain_note: row.original.drain_note,
        });
      } else {
        setNewWaldoInfo({
          id: "",
          section_patient_id: sectionPatientId,
          wound_drain_locations: "",
          surgical_wound_note: "",
          pressure_sore_note: "",
          trauma_wound_note: "",
          drain_note: "",
        });
      }
      setOpenModal(true);
    } else if (action === "delete") {
      setDeletingRow(row);
      setOpenDeleteModal(true);
    }
  };

  // TO-DO: Confirm these are the actual names in the diagram.
  const frontRawPoints = [
    { id: "Left Forearm (Front)", x: 470.802551, y: 440.544281 },
    { id: "Left Lower Leg", x: 365.5, y: 817.260925 },
    { id: "Right Upper Chest", x: 330.430847, y: 270.328705 },
    { id: "Left Foot", x: 355.92984, y: 930.378174 },
    { id: "Left Hand (Front)", x: 508.16684, y: 560.615784 },
    { id: "Left Upper Arm", x: 439.500153, y: 248.085052 },
    { id: "Abdominal", x: 324.125671, y: 375.916077 },
    { id: "Right Hand (Front)", x: 128.815369, y: 545.494873 },
    { id: "Left Thigh", x: 370.903351, y: 595.358582 },
    { id: "Right Forearm (Front)", x: 180.346039, y: 418.705109 },
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
    { id: "Left Forearm (Back)", x: 160.088791, y: 440.22171 },
    { id: "Right Glute", x: 401.60968, y: 515.769226 },
    { id: "Left Hand (Back)", x: 110.291641, y: 558.97113 },
    { id: "Right Thigh (Back Side)", x: 410.581146, y: 620.705994 },
    { id: "Mid Upper Back", x: 350.177246, y: 435.424561 },
    { id: "Right Calf", x: 400.812012, y: 808.804016 },
    { id: "Back of the Head", x: 350.5, y: 95.14109 },
    { id: "Upper Back", x: 360.499969, y: 275.730865 },
    { id: "Right Forearm (Back)", x: 530.177246, y: 440.424561 },
    { id: "Left Glute", x: 280.50148, y: 515.176147 },
    { id: "Right Hand (Back)", x: 555.291641, y: 562.97113 },
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

  const handleSave = async () => {
    try {
      const updatedLocation = { [selectedLocation]: true };

      const requestData = {
        section_patient_id: sectionPatientId,
        wound_drain_locations: updatedLocation,
        surgical_wound_note: newWaldoInfo.surgical_wound_note,
        pressure_sore_note: newWaldoInfo.pressure_sore_note,
        trauma_wound_note: newWaldoInfo.trauma_wound_note,
        drain_note: newWaldoInfo.drain_note,
      };

      if (editingRow) {
        await updatePatientWaldoInfo(
          sectionPatientId,
          newWaldoInfo.id,
          requestData
        );

        setWaldoInfo((prevData) =>
          prevData.map((item) =>
            item.id === newWaldoInfo.id
              ? {
                  ...item,
                  ...newWaldoInfo,
                  wound_drain_locations: {
                    ...item.wound_drain_locations,
                    ...updatedLocation,
                  },
                }
              : item
          )
        );
      } else {
        const response = await addPatientWaldoInfo(
          sectionPatientId,
          requestData
        );

        if (response && response.id) {
          setWaldoInfo((prevData) => [
            ...prevData,
            {
              id: response.id,
              section_patient_id: sectionPatientId,
              wound_drain_locations: updatedLocation,
              surgical_wound_note: response.surgical_wound_note,
              pressure_sore_note: response.pressure_sore_note,
              trauma_wound_note: response.trauma_wound_note,
              drain_note: response.drain_note,
            },
          ]);
        }
      }

      setSelectedLocation(null);
      setOpenModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    await deletePatientWaldoInfo(sectionPatientId, deletingRow.original.id);
    setWaldoInfo(
      waldoInfo.filter((item) => item.id !== deletingRow.original.id)
    );
    const woundLocation = deletingRow.original.wound_drain_locations;
    setCheckedBoxes((prev) => {
      const updatedBoxes = { ...prev };
      Object.keys(woundLocation).forEach((key) => {
        if (woundLocation[key]) {
          delete updatedBoxes[key];
        }
      });
      return updatedBoxes;
    });
    setOpenDeleteModal(false);
  };

  const table = useMaterialReactTable({
    columns,
    data: waldoInfo,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnFilters: false,
    enableFilterMatchHighlighting: false,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
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
              onChange={() => {
                handleCheckboxChange(pos.id);
              }}
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
              onChange={() => {
                handleCheckboxChange(pos.id);
              }}
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
      <MaterialReactTable table={table} />
      {/* Modal for Create/Edit */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle align="center">
          {editingRow
            ? `Edit ${Object.keys(newWaldoInfo.wound_drain_locations).filter(
                (key) => key
              )} Info`
            : `Add ${
                selectedLocation ||
                Object.keys(newWaldoInfo.wound_drain_locations).filter(
                  (key) => key
                )
              } Info`}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Surgical Wound Note"
            fullWidth
            multiline
            margin="dense"
            value={newWaldoInfo.surgical_wound_note}
            rows={4}
            onChange={(e) =>
              setNewWaldoInfo({
                ...newWaldoInfo,
                surgical_wound_note: e.target.value,
              })
            }
          />
          <TextField
            label="Pressure Sore Note"
            fullWidth
            multiline
            margin="dense"
            value={newWaldoInfo.pressure_sore_note}
            rows={4}
            onChange={(e) =>
              setNewWaldoInfo({
                ...newWaldoInfo,
                pressure_sore_note: e.target.value,
              })
            }
          />
          <TextField
            label="Trauma Wound Note"
            fullWidth
            multiline
            margin="dense"
            value={newWaldoInfo.trauma_wound_note}
            rows={4}
            onChange={(e) =>
              setNewWaldoInfo({
                ...newWaldoInfo,
                trauma_wound_note: e.target.value,
              })
            }
          />
          <TextField
            label="Drain Note"
            fullWidth
            multiline
            margin="dense"
            value={newWaldoInfo.drain_note}
            rows={4}
            onChange={(e) =>
              setNewWaldoInfo({
                ...newWaldoInfo,
                drain_note: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={() => setOpenModal(false)}
            color="error"
            variant="contained"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            {editingRow ? "Save" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
