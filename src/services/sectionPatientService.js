/*
Name: Kevin Rodriguez
Date: 2/1/25
Remarks: Section Patient Service that's responsible to make API calls to our back end
*/
import { axiosTokenInstance } from "./httpInterceptor";

export async function getSectionPatientById(sectionId) {
  try {
    const response = await axiosTokenInstance().get(
      `section-patient/${sectionId}/patient`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getSectionPatientBarcode(id, barcode) {
  try {
    const response = await axiosTokenInstance().post(
      `section-patient/${id}/scan`,
      { barcode_value: Number(barcode) }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateSectionPatient(id, data) {
  try {
    const response = await axiosTokenInstance().put(
      `section-patient/section-patient/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addPatientToSection(sectionId, data) {
  try {
    const response = await axiosTokenInstance().post(
      `section-patient/${sectionId}/patient`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
