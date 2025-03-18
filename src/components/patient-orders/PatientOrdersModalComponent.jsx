import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

import { createPatientOrder, updatePatientOrder } from "../../services/patientOrdersService";

const PatientOrdersModalComponent = ({ open, onClose, patientId, order }) => {
  const [title, setTitle] = useState(order ? order.order_title : "");
  const [description, setDescription] = useState(order ? order.description : "");

  // When order prop changes, update state.
  useEffect(() => {
    if (order) {
      setTitle(order.order_title);
      setDescription(order.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [order]);

  const handleSave = async () => {
    try {
      const orderData = { order_title: title, description };
      if (order) {
        // Update existing order and update the time to current.
        orderData.created_date = new Date().toISOString();
        await updatePatientOrder(patientId, order.id, orderData);
      } else {
        // Create new order.
        await createPatientOrder(patientId, orderData);
      }
      setTitle("");
      setDescription("");
      onClose(true); // refresh orders after save
    } catch (error) {
      console.error("Failed to save order:", error.response ? error.response.data : error);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>{order ? "Edit Patient Order" : "Add Patient Order"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          multiline
          rows={4}
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientOrdersModalComponent;
