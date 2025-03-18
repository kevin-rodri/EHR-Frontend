// services/patientOrdersService.js
import { axiosTokenInstance } from "./httpInterceptor";

// Function to get all orders for a patient
export async function getPatientOrders(patientId) {
  try {
    const response = await axiosTokenInstance().get(`/patients/${patientId}/orders`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to create a new order for a patient
export async function createPatientOrder(patientId, orderData) {
  try {
    const response = await axiosTokenInstance().post(`/patients/${patientId}/orders`, orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to update an existing order
export async function updatePatientOrder(patientId, orderId, orderData) {
  try {
    const response = await axiosTokenInstance().put(`/patients/${patientId}/orders/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to delete an order
export async function deletePatientOrder(patientId, orderId) {
  try {
    const response = await axiosTokenInstance().delete(`/patients/${patientId}/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
