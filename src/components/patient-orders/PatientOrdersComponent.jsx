import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { getPatientOrders, deletePatientOrder } from "../../services/patientOrdersService";
import { getSectionPatientById } from "../../services/sectionPatientService";
import { getUserRole } from "../../services/authService"; // Assumes you have a function to get the user role.
import PatientOrdersModalComponent from "./PatientOrdersModalComponent";

const PatientOrdersComponent = ({ sectionId }) => {
  const [orders, setOrders] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [canEdit, setEdit] = useState(false);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const role = getUserRole();
    if (role === "ADMIN" || role === "INSTRUCTOR") {
      setEdit(true);
    }
    fetchOrders();
  }, [sectionId]);

  const fetchOrders = async () => {
    try {
      const sectionPatient = await getSectionPatientById(sectionId);
      const patientID = sectionPatient.patient_id;
      setPatientId(patientID);
      const data = await getPatientOrders(patientID);
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch patient orders:", error);
    }
  };

  const handleOpenModal = () => {
    setEditingOrder(null);
    setOpenModal(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setOpenModal(true);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deletePatientOrder(patientId, orderId);
      fetchOrders();
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  const handleCloseModal = (refreshNeeded = false) => {
    setOpenModal(false);
    setEditingOrder(null);
    if (refreshNeeded) {
      fetchOrders();
    }
  };

  return (
    <Box p={2}>
      <Typography
        variant="h4"
        sx={{ color: "white", textAlign: "center", fontWeight: 300, mb: 2 }}
      >
        Patient Orders
      </Typography>
      {canEdit && (
        <Box mb={2} textAlign="right">
          <IconButton color="primary" onClick={handleOpenModal}>
            <AddIcon />
          </IconButton>
        </Box>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date Created</TableCell>
              {canEdit && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.order_title}</TableCell>
                <TableCell>{order.description}</TableCell>
                <TableCell>{order.created_date}</TableCell>
                {canEdit && (
                  <TableCell>
                    <IconButton onClick={() => handleEditOrder(order)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteOrder(order.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PatientOrdersModalComponent
        open={openModal}
        onClose={handleCloseModal}
        patientId={patientId}
        order={editingOrder}
      />
    </Box>
  );
};

export default PatientOrdersComponent;
