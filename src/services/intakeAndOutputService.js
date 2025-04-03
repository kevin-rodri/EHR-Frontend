import { axiosTokenInstance } from "./httpInterceptor";

export async function getPatientIntake(section_patient_id) {
  try {
    const response = await axiosTokenInstance().get(
      `intake-output/${section_patient_id}/intake`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getPatientOutput(section_patient_id) {
  try {
    const response = await axiosTokenInstance().get(
      `intake-output/${section_patient_id}/output`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addPatientInputOutput(section_patient_id, input_output) {
  try {
    const response = await axiosTokenInstance().post(
      `intake-output/${section_patient_id}/`,
      input_output
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updatePatientInputOutput(
  section_patient_id,
  id, 
  input_output
) {
  try {
    const response = await axiosTokenInstance().put(
      `intake-output/${section_patient_id}/${id}`,
      input_output
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deletePatientInputOutput(section_patient_id, id) {
  try {
    const response = await axiosTokenInstance().delete(
      `intake-output/${section_patient_id}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
