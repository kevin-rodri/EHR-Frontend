/*
Name: Dylan Bellinger
Date: 3/3/2025
Remarks: The Patient Scheduled component for displaying patient scheduled medication.
*/
import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Fab,
  ButtonGroup
} from "@mui/material";
import { getPatientScheduledMedication } from "../../services/patientMedicationsService";
import { getSectionPatientById } from "../../services/sectionPatientService";
import { getMedications } from "../../services/medicationsService";
import { Add, Delete, Edit } from "@mui/icons-material";
import { getUserRole } from "../../services/authService";
import PatientScheduledDeleteModalComponent from "./PatientScheduledDeleteModalComponent";
import PatientScheduledAddModalComponent from "./PatientScheduledAddModalComponent";
import PatientScheduledEditModalComponent from "./PatientScheduledEditModalComponent";
import { getMedicationById } from "../../services/medicationsService";
import { getPatientById } from "../../services/patientService";

export default function PatientScheduledTableComponent({ sectionId }) {
  const [patientMeds, setPatientMeds] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [sectionPatientId, setSectionPatientId] = useState("");
  const [patient, setPatient] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deletedMed, setDeletedMed] = useState("");
  const [editedMed, setEditedMed] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteButton = (openDelete, ID) => {
    setOpenDeleteModal(openDelete);
    setDeletedMed(ID);
  };

  const handleEditButton = (openEdit, ID) => {
    setOpenEditModal(openEdit);
    setEditedMed(ID);
  };

  const fetchScheduledMedications = async () => {
    try {
      const sectionPatient = await getSectionPatientById(sectionId);
      const sectionPatientId = sectionPatient.id;
      const patientMedData = await getPatientScheduledMedication(
        sectionPatientId
      );
      const patientInfo = await getPatientById(sectionPatient.patient_id);
      const medDetails = await Promise.all(
        patientMedData.map(async (med) => {
          const medication = await getMedicationById(med.medication_id);
          return {
            ...med,
            drugName: medication.drug_name,
            genericName: medication.generic_name,
          };
        })
      );

      setPatientMeds(medDetails);
      setPatient(patientInfo.full_name);
      setSectionPatientId(sectionPatientId);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchScheduledMedications();
  }, [sectionId]);

  return (
    <Box>
      <PatientScheduledDeleteModalComponent
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        sectionPatientID={sectionPatientId}
        patientMed={deletedMed}
        refreshPatientMedication={fetchScheduledMedications}
      />
      <PatientScheduledAddModalComponent
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        sectionPatientID={sectionPatientId}
        refreshPatientMedication={fetchScheduledMedications}
      />
      <PatientScheduledEditModalComponent
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        sectionPatientID={sectionPatientId}
        patientMed={editedMed}
        refreshPatientMedication={fetchScheduledMedications}
      />
      <Box
        sx={{
          display: "flex",
          padding: 1,
          flexDirection: "column",
          alignItems: "flex-start",
          backgroundColor: "white"
        }}
      >
        <Table sx={{}}>
          <TableHead>
            <TableRow>
              <TableCell>Drug Name</TableCell>
              <TableCell align="right">Scheduled Time</TableCell>
              <TableCell align="right">Dose</TableCell>
              <TableCell align="right">Route</TableCell>
              <TableCell align="right">Scanned Med</TableCell>
              <TableCell align="right">Scanned Patient</TableCell>
              <TableCell align="right">
                <Fab onClick={() => setOpenAddModal(true)}>
                  <Add />
                </Fab>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patientMeds.map((patientMed) => (
              <TableRow key={patientMed.id}>
                <TableCell>{patientMed.drugName}</TableCell>
                <TableCell>{patientMed.scheduled_time}</TableCell>
                <TableCell>{patientMed.dose}</TableCell>
                <TableCell>{patientMed.route}</TableCell>
                <TableCell>{patientMed.genericName}</TableCell>
                <TableCell>{patient}</TableCell>
                <TableCell>
                <ButtonGroup sx={{ display: "flex", gap: 2 }}>
                  <Fab onClick={() => handleEditButton(true, patientMed)}>
                    <Edit />
                  </Fab>
                  <Fab onClick={() => handleDeleteButton(true, patientMed.id)}>
                    <Delete />
                  </Fab>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={100}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
}
