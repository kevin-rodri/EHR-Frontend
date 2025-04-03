/*
Name: Charlize Aponte
Date: 3/28/25 
Remark: Neurological Info service that's responsible to make API calls to our back end
*/

import { axiosTokenInstance } from "./httpInterceptor";

// Get neurological information for a patient
export async function getNeurologicalInfoFromPatient(sectionPatientId) {
  try {
    const response = await axiosTokenInstance().get(
      `assessments/${sectionPatientId}/neurological`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Get neurological information for a patient (Admin only)
export async function getNeurologicalInfoForStudents(sectionPatientId) {
  try {
    const response = await axiosTokenInstance().get(
      `assessments/${sectionPatientId}/neurological/students`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Add neurological information for a patient
export async function addNeurologicalInfoToPatient(
  sectionPatientId,
  neurologicalData
) {
  try {
    const response = await axiosTokenInstance().post(
      `assessments/${sectionPatientId}/neurological`,
      neurologicalData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Update neurological information for a patient
export async function updateNeurologicalInfoForPatient(
  sectionPatientId,
  id,
  neurologicalData
) {
  try {
    const response = await axiosTokenInstance().put(
      `assessments/${sectionPatientId}/neurological/${id}`,
      neurologicalData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Delete neurological information for a patient
export async function deleteNeurologicalInfoForPatient(sectionPatientId, id) {
  try {
    const response = await axiosTokenInstance().delete(
      `assessments/${sectionPatientId}/neurological/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
