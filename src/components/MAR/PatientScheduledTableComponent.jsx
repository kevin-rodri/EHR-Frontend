/*
Name: Dylan Bellinger
Remarks: The Patient Scheduled component for displaying patient scheduled medication.
*/
import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, Fab } from "@mui/material";
import { getPatientScheduledMedication } from "../../services/patientMedicationsService";
import { getSectionPatientById } from "../../services/sectionPatientService";
import { Add, Delete, Edit } from "@mui/icons-material";
import { getUserRole } from "../../services/authService";
import PatientScheduledDeleteModalComponent from "./PatientScheduledDeleteModalComponent";
import PatientScheduledAddModalComponent from "./PatientScheduledAddModalComponent";
import PatientScheduledEditModalComponent from "./PatientScheduledEditModalComponent";
import { getMedicationById } from "../../services/medicationsService";

export default function PatientScheduledTableComponent({sectionId}) {
    
    const [patientMeds, setPatientMeds] = useState([]);
    const [patientId, setPatientId] = useState("");
    const [sectionPatientId, setSectionPatientId] = useState("");
    const [patient, setPatient] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [display, setDisplay] = useState(false);
    const [medications, setMedications] = useState([]);
    const [medName, setMedName] = useState("");
    const [drugName, setDrugName] = useState("");
    const [deletedMed, setDeletedMed] = useState("");
    const [editedMed, setEditedMed] = useState("");
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
          const patientId = sectionPatient.patient_id;
          const sectionPatientId = sectionPatient.id;
          const patientData = await getPatientScheduledMedication(sectionPatientId);
          const patientMed = await getMedicationById(patientData.medication_id);
          setPatientMeds(patientData);
          setMedName(patientMed.drug_name);
          setDrugName(patientMed.generic_name);
          setPatientId(patientId);
          setPatient(sectionPatient.full_name);
          setSectionPatientId(sectionPatientId);
        } catch (err) {
          throw err;
        }
    };

        useEffect(() => {
            if (sectionId == null) return;
            const role = getUserRole();
            if (role === "ADMIN" || role === "INSTRUCTOR" || role === "STUDENT") {
              setDisplay(true);
            }
            fetchScheduledMedications();
          }, [sectionId]);
      

    return(
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
        <Box sx={{
            display: "flex",
            padding: 1,
            flexDirection: "column",
            alignItems: "flex-start",
            backgroundColor: "white",
            width: '75%'
          }}>
            <Table sx={{
                
            }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Drug Name</TableCell>
                        <TableCell align="right">Scheduled Time</TableCell>
                        <TableCell align="right">Dose</TableCell>
                        <TableCell align="right">Route</TableCell>
                        <TableCell align="right">Scanned Med</TableCell>
                        <TableCell align="right">Scanned Patient</TableCell>
                        <TableCell align="right">
                            <Fab onClick={() => setOpenAddModal(true)}><Add /></Fab>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                  {patientMeds.map((patientMed) => (
                    <TableRow>
                      <TableCell>{drugName}</TableCell>
                      <TableCell>{patientMed.scheduled_time}</TableCell>
                      <TableCell>{patientMed.dose}</TableCell>
                      <TableCell>{patientMed.route}</TableCell>
                      <TableCell>{medName}</TableCell>
                      <TableCell>{patient}</TableCell>
                      <TableCell>
                        <Fab onClick={() => handleEditButton(true, patientMed.id)}><Edit /></Fab>
                        <Fab onClick={() => handleDeleteButton(true, patientMed.id)}><Delete /></Fab>
                      </TableCell>
                    </TableRow>
                  ))
                  }
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
    )
}