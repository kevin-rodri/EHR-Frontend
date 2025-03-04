/*
Name: Dylan Bellinger
Date: 3/3/2025
Remarks: Delete modal for Scheduled medication table.
*/
import {
    Button,
    CardActions,
    CardHeader,
    Modal,
    Card,
  } from "@mui/material";
  import React, { useState } from "react";
  import { deletePatientMedication } from "../../services/patientMedicationsService";
  
  export default function PatientScheduledDeleteModalComponent({
    open,
    onClose,
    sectionPatientID,
    patientMed,
    refreshPatientMedication,
  }) {
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleDelete() {
        try {
          await deletePatientMedication(sectionPatientID, patientMed);
          refreshPatientMedication();
        } catch (error) {
          throw error;
        }
      };
  
    const onSubmit = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        handleDelete();
        onClose();
        refreshPatientMedication();
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Modal
        open={open}
        onClose={onClose}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <Card variant="outlined" sx={{ padding: 2 }}>
          <CardHeader
            sx={{
              display: "flex",
              alignItems: "center",
              alignSelf: "stretch",
            }}
            title="Delete Selected Medication?"
          />
          <CardActions
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button color="error" variant="contained" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              onClick={onSubmit}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      </Modal>
    );
  }