/*
Name: TO-DO
Date: TO-DO
Remark: ADL Service that's responsible for making API calls to the backend
*/

import { axiosTokenInstance } from "./httpInterceptor";

// Function to add a new ADL record
export async function addADLRecord(sectionPatientId, adlData) {
  try {
    const response = await axiosTokenInstance().post(
      `/patients/${sectionPatientId}/history`,
      adlData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to update an ADL record
export async function updateADLRecord(sectionPatientId, id, adlData) {
  try {
    const response = await axiosTokenInstance().put(
      `/patients/${sectionPatientId}/adl/${id}`,
      adlData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to fetch ADL records for a patient
export async function getADLRecords(sectionPatientId) {
  try {
    const response = await axiosTokenInstance().get(
      `/patients/${sectionPatientId}/adl`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to delete an ADL record
export async function deleteADLRecord(sectionPatientId, id) {
  try {
    const response = await axiosTokenInstance().delete(
      `/patients/${sectionPatientId}/adl/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
