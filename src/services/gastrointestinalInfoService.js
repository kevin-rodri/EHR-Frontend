/*
Name: Charlize Aponte
Date: 3/14/25 
Remark: Gastrointestinal Info endpoints that are responsible for making API calls to our back end
*/

import { axiosTokenInstance } from "./httpInterceptor";

// Get gastrointestinal information for a patient**
export async function getGastrointestinalInfoFromPatient(sectionPatientId) {
  try {
    const response = await axiosTokenInstance().get(
      `assessments/${sectionPatientId}/gastrointestinal`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Get gastrointestinal information for a patient (Admin only)
export async function getGastrointestinalInfoForStudents(sectionPatientId) {
  try {
    const response = await axiosTokenInstance().get(
      `assessments/${sectionPatientId}/gastrointestinal/students`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Add gastrointestinal information for a patient
export async function addGastrointestinalInfoToPatient(
  sectionPatientId,
  gastrointestinalData
) {
  try {
    const response = await axiosTokenInstance().post(
      `assessments/${sectionPatientId}/gastrointestinal`,
      gastrointestinalData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Update gastrointestinal information for a patient
export async function updateGastrointestinalInfoForPatient(
  sectionPatientId,
  id,
  gastrointestinalData
) {
  try {
    const response = await axiosTokenInstance().put(
      `assessments/${sectionPatientId}/gastrointestinal/${id}`,
      gastrointestinalData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Delete gastrointestinal information for a patient
export async function deleteGastrointestinalInfoForPatient(
  sectionPatientId,
  id
) {
  try {
    const response = await axiosTokenInstance().delete(
      `assessments/${sectionPatientId}/gastrointestinal/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
