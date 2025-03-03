/*
Name: Dylan Bellinger
Date: 3/3/2025
Remarks: Medications Service for medications API backend calls.
*/
import { axiosInstance } from "./httpInterceptor";

export async function getMedications() {
    try {
      const response = await axiosInstance().get(
        `medications/`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

export async function getMedicationById(id) {
  try {
    const response = await axiosInstance().get(
      `medications/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addMedication(medication) {
  try {
    const response = await axiosInstance().post(
      `medications/`,
      medication
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateMedication(id, medication) {
  try {
    const response = await axiosInstance().put(
      `medications/${id}`,
      medication
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteMedication(id, medication) {
  try {
    const response = await axiosInstance().delete(
      `medications/${id}`,
      medication
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}