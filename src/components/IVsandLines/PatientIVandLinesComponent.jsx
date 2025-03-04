/*
Name: Charlize Aponte
Date: 2/22/25 
Remarks: This is the Iv and Lines component for the Iv and lines page 
*/
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Checkbox,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getSectionPatientById } from "../../services/sectionPatientService";
import {
  getPatientIVLine,
  addPatientIVLine,
  updatePatientIVLine,
  deletePatientIVLine,
} from "../../services/IVandLinesService";

const PatientIVandLinesComponent = ({ sectionId }) => {
  const [rows, setRows] = useState([]);
  const [sectionPatientId, setSectionPatientId] = useState(null);
  const [isEditing, setIsEditing] = useState(null); // Track which row is being edited
  const [newIVLine, setNewIVLine] = useState({
    iv_type: "",
    size: "",
    location: "",
    fluid_or_med_name: "",
    fluid_or_med_rate: "",
    patent: false,
    is_clinical_documentation_improvement: false,
  });
  const [patentChecked, setPatentChecked] = useState([]);
  const [isClinicalChecked, setClinicalChecked] = useState([]);

  // Fetching IV lines data when sectionPatientId changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionPatient = await getSectionPatientById(sectionId);
        const patientId = sectionPatient.id;
        console.log(patientId);
        const data = await getPatientIVLine(patientId);
        setRows(data);
        setPatentChecked(data.patent);
        setClinicalChecked(data.is_clinical_documentation_improvement);
        setSectionPatientId(patientId);
      } catch (error) {
        console.error("Error fetching IV lines:", error);
      }
    };
    fetchData();
  }, []);

  // Deleting an IV line
  const handleDelete = async (id) => {
    try {
      await deletePatientIVLine(sectionPatientId, id);
      setRows(rows.filter((row) => row.id !== id));
    } catch (error) {
      console.error("Error deleting IV line:", error);
    }
  };

  // Updating an IV line
  const handleUpdate = async (id, updatedData) => {
    try {
      const updatedRow = await updatePatientIVLine(sectionPatientId, id, {  
        iv_type: updatedData.iv_type,
        size: updatedData.size,
        location: updatedData.location,
        fluid_or_med_name: updatedData.fluid_or_med_name,
        fluid_or_med_rate: updatedData.fluid_or_med_rate,
        patent: updatedData.patent,
        is_clinical_documentation_improvement: updatedData.is_clinical_documentation_improvement,
      });
      setRows(rows.map((row) => (row.id === id ? updatedRow : row)));
      setIsEditing(null); // Reset editing mode after save
    } catch (error) {
      console.error("Error updating IV line:", error);
    }
  };

  // Adding a new IV line
  const handleAdd = async () => {
    if (!newIVLine.iv_type || !newIVLine.size || !newIVLine.location || !newIVLine.fluid_or_med_name || !newIVLine.fluid_or_med_rate) {
      alert('Please fill in all the required fields!');
      return;
    }
    try {
      console.log("Adding IV Line for Patient ID:", sectionPatientId);  // Log for debugging
      const addedIVLine = await addPatientIVLine(sectionPatientId, newIVLine);
      setRows([...rows, addedIVLine]);
      setNewIVLine({
        iv_type: "",
        size: "",
        location: "",
        fluid_or_med_name: "",
        fluid_or_med_rate: "",
        patent: false,
        is_clinical_documentation_improvement: false,
      });
    } catch (error) {
      console.error("Error adding IV line:", error);
    }
  };

  return (
    <div style={{ padding: "20px", minHeight: "100vh" }}>
      {/* Table for displaying IV lines */}
      <TableContainer component={Paper} style={{ marginBottom: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Size</TableCell>
              <TableCell align="center">Location</TableCell>
              <TableCell align="center">Fluid or Med name</TableCell>
              <TableCell align="center">Fluid or Med and Rate</TableCell>
              <TableCell align="center">Patent</TableCell>
              <TableCell align="center">CDI</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">
                  {isEditing === row.id ? (
                    <TextField
                      fullWidth
                      value={row.iv_type}
                      onChange={(e) => setRows(rows.map(r => r.id === row.id ? { ...r, iv_type: e.target.value } : r))}
                    />
                  ) : row.iv_type}
                </TableCell>
                <TableCell align="center">
                  {isEditing === row.id ? (
                    <TextField
                      fullWidth
                      value={row.size}
                      onChange={(e) => setRows(rows.map(r => r.id === row.id ? { ...r, size: e.target.value } : r))}
                    />
                  ) : row.size}
                </TableCell>
                <TableCell align="center">
                  {isEditing === row.id ? (
                    <TextField
                      fullWidth
                      value={row.location}
                      onChange={(e) => setRows(rows.map(r => r.id === row.id ? { ...r, location: e.target.value } : r))}
                    />
                  ) : row.location}
                </TableCell>
                <TableCell align="center">
                  {isEditing === row.id ? (
                    <TextField
                      fullWidth
                      value={row.fluid_or_med_name}
                      onChange={(e) => setRows(rows.map(r => r.id === row.id ? { ...r, fluid_or_med_name: e.target.value } : r))}
                    />
                  ) : row.fluid_or_med_name}
                </TableCell>
                <TableCell align="center">
                  {isEditing === row.id ? (
                    <TextField
                      fullWidth
                      value={row.fluid_or_med_rate}
                      onChange={(e) => setRows(rows.map(r => r.id === row.id ? { ...r, fluid_or_med_rate: e.target.value } : r))}
                    />
                  ) : row.fluid_or_med_rate}
                </TableCell>
                <TableCell align="center">
                  {isEditing === row.id ? (
                    <Checkbox
                      checked={row.patent}
                      onChange={() => setRows(rows.map(r => r.id === row.id ? { ...r, patent: !r.patent } : r))}
                    />
                  ) : row.patent ? "Yes" : "No"}
                </TableCell>
                <TableCell align="center">
                  {isEditing === row.id ? (
                    <Checkbox
                      checked={row.is_clinical_documentation_improvement}
                      onChange={() => setRows(rows.map(r => r.id === row.id ? { ...r, is_clinical_documentation_improvement: !r.is_clinical_documentation_improvement } : r))}
                    />
                  ) : row.is_clinical_documentation_improvement ? "Yes" : "No"}
                </TableCell>
                <TableCell align="center">
                  {isEditing === row.id ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdate(row.id, row)} // Save button
                    >
                      Save
                    </Button>
                  ) : (
                    <IconButton color="primary" onClick={() => setIsEditing(row.id)}>
                      <EditIcon />
                    </IconButton>
                  )}
                  <IconButton color="error" onClick={() => handleDelete(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {/* Form row for adding a new IV line */}
            <TableRow>
              {/* Same form for adding a new IV line as before */}
              <TableCell align="center">
                <TextField
                  label="Type"
                  fullWidth
                  value={newIVLine.iv_type}
                  onChange={(e) => setNewIVLine({ ...newIVLine, iv_type: e.target.value })}
                />
              </TableCell>
              <TableCell align="center">
                <TextField
                  label="Size"
                  fullWidth
                  value={newIVLine.size}
                  onChange={(e) => setNewIVLine({ ...newIVLine, size: e.target.value })}
                />
              </TableCell>
              <TableCell align="center">
                <TextField
                  label="Location"
                  fullWidth
                  value={newIVLine.location}
                  onChange={(e) => setNewIVLine({ ...newIVLine, location: e.target.value })}
                />
              </TableCell>
              <TableCell align="center">
                <TextField
                  label="Fluid or Med name"
                  fullWidth
                  value={newIVLine.fluid_or_med_name}
                  onChange={(e) => setNewIVLine({ ...newIVLine, fluid_or_med_name: e.target.value })}
                />
              </TableCell>
              <TableCell align="center">
                <TextField
                  label="Fluid or Med and Rate"
                  fullWidth
                  value={newIVLine.fluid_or_med_rate}
                  onChange={(e) => setNewIVLine({ ...newIVLine, fluid_or_med_rate: e.target.value })}
                />
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={newIVLine.patent}
                  onChange={(e) => setNewIVLine({ ...newIVLine, patent: e.target.checked })}
                />
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={newIVLine.is_clinical_documentation_improvement}
                  onChange={(e) => setNewIVLine({ ...newIVLine, is_clinical_documentation_improvement: e.target.checked })}
                />
              </TableCell>
              <TableCell align="center">
                <Button variant="contained" color="primary" onClick={handleAdd}>
                  Add
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PatientIVandLinesComponent;
