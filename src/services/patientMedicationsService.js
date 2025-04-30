/*
Name: Dylan Bellinger
Date: 3/3/2025
Remarks: Patient Medications Service for patient medications API backend calls.
*/
import { axiosTokenInstance } from "./httpInterceptor";

export async function getPatientScheduledMedication(section_patient_id) {
  try {
    const response = await axiosTokenInstance().get(
      `patient-medication/${section_patient_id}/scheduled`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getPatientPRNMedication(section_patient_id) {
  try {
    const response = await axiosTokenInstance().get(
      `patient-medication/${section_patient_id}/prn`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getPatientAtHomeMedication(section_patient_id) {
  try {
    const response = await axiosTokenInstance().get(
      `patient-medication/${section_patient_id}/home`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addPatientMedication(section_patient_id, medication) {
  try {
    const response = await axiosTokenInstance().post(
      `patient-medication/${section_patient_id}`,
      medication
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getMedicationBarcode(section_patient_id, medication) {
  try {
    const response = await axiosTokenInstance().post(
      `patient-medication/${section_patient_id}/scan`,
      { barcode_value: Number(medication) }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updatePatientMedication(
  section_patient_id,
  id,
  medication
) {
  try {
    const response = await axiosTokenInstance().put(
      `patient-medication/${section_patient_id}/${id}`,
      medication
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deletePatientMedication(
  section_patient_id,
  id,
  medication
) {
  try {
    const response = await axiosTokenInstance().delete(
      `patient-medication/${section_patient_id}/${id}`,
      medication
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
