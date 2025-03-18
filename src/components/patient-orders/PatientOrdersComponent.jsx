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
import PatientOrdersModalComponent from "./PatientOrdersModalComponent";

const PatientOrdersComponent = ({ patientId, userRole }) => {
  const [orders, setOrders] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // Fetch orders for the specific patient (orders are separated by patientId)
  useEffect(() => {
    fetchOrders();
  }, [patientId]);

  const fetchOrders = async () => {
    try {
      const data = await getPatientOrders(patientId);
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch patient orders:", error);
    }
  };

  // Only instructors and administrators can add/edit orders.
  const canEdit = userRole === "INSTRUCTOR" || userRole === "ADMINISTRATOR";

  const handleOpenModal = () => {
    setEditingOrder(null); // Clear editing state when adding a new order.
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
