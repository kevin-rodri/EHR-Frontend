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