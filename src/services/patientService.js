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

export async function updatePatientInfo(id, data) {
  try {
    const response = await axiosTokenInstance().put(`patients/${id}`, data);
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
// add the rest here.
