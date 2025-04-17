/*
Name: Kevin Rodriguez
Date: 2/1/25
Remarks: Patient Service that's responsible to make API calls to our back end
*/
import { axiosTokenInstance } from "./httpInterceptor";

export async function getPatientById(id) {
  try {
    const response = await axiosTokenInstance().get(`patients/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
// add the rest here.
export async function getAllPatients() {
  try {
    const response = await axiosTokenInstance().get(`patients/`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addPatient(patientData) {
  try {
    const response = await axiosTokenInstance().post(`/patients`, patientData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updatePatient(id, patientData) {
  try {
    const response = await axiosTokenInstance().put(
      `patients/${id}`,
      patientData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function patchPatientInfo(id, value) {
  try {
    const response = await axiosTokenInstance().patch(`patients/${id}`, value);
    return response.data;
  } catch (error) {
    throw error;
  }
}
