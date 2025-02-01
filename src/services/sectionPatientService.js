/*
Name: Kevin Rodriguez
Date: 2/1/25
Remarks: Section Patient Service that's responsible to make API calls to our back end
*/
import { axiosTokenInstance } from "./httpInterceptor";

export async function getSectionPatientById(sectionId) {
  try {
    const response = await axiosTokenInstance().get(`section-patient/${sectionId}/patient`);
    return response.data;
  } catch (error) {
    throw error;
  }
}